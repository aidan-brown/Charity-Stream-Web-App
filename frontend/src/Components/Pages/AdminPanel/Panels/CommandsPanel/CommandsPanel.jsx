import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import {
  IconButton,
  Switch,
  TextField,
  Button,
  Chip,
  Stack,
} from '@mui/material';
import {
  Add, ArrowBack, ArrowForward, Delete,
} from '@mui/icons-material';
import { TabPanel } from '@mui/lab';
import defaultCommands from './defaultCommands';
import { getUrl } from '../../../../../Utils';
import './CommandsPanel.scss';

const CommandsPanel = ({ authHeader, setAlert }) => {
  const [commands, setCommands] = useState([{
    name: '',
    commands: [{ command: '', shouldWait: false }],
  },
  ...defaultCommands,
  ]);
  const [current, setCurrent] = useState(0);
  const [variables, setVariables] = useState({});

  useEffect(() => {
    const savedCommands = localStorage.getItem('mcs-admin-commands');

    if (savedCommands) {
      setCommands(JSON.parse(savedCommands));
    }
  }, []);

  const variablesUsed = (() => {
    const vars = JSON.stringify(commands[current].commands).match(/<%[^<%%>]*%>/g);

    if (vars) {
      return [...new Set(vars.map((variable) => variable.replace('%>', '').replace('<%', '')))];
    }

    return [];
  })();

  const saveCommands = (newCommands) => {
    localStorage.setItem('mcs-admin-commands', JSON.stringify(newCommands));
  };

  const createCommand = () => {
    const newCommands = [
      {
        name: '',
        commands: [{ command: '', shouldWait: false }],
      },
      ...commands.filter((_, i) => i !== 0),
      {
        ...commands[0],
        variables: variablesUsed,
      },
    ];

    saveCommands(newCommands);
    setCommands(newCommands);
  };

  const injectVariables = (index, command) => {
    let newCommand = command;
    Object.keys(variables).forEach((key) => {
      const [i, variable] = key.split('#@#');

      if (Number(i) === index) {
        newCommand = newCommand.replaceAll(`<%${variable}%>`, variables[key]);
      }
    });

    return newCommand;
  };

  const runCommand = (index) => {
    const commandsToRun = injectVariables(index, JSON.stringify(commands[index].commands));

    fetch(`${getUrl()}/run-commands`, {
      method: 'POST',
      headers: {
        Authorization: authHeader,
        'Content-Type': 'application/json',
      },
      body: commandsToRun,
    })
      .then((res) => {
        if (res.status !== 200) {
          setAlert({
            message: 'Failed to run command',
            severity: 'error',
          });
        } else {
          setAlert({
            message: 'Commands are scheduled to run!',
            severity: 'success',
          });
        }
      })
      .catch(() => {
        setAlert({
          message: 'Failed to run command',
          severity: 'error',
        });
      });
  };

  return (
    <TabPanel className="commands-panel" value="quick-commands">
      <div className="panel-wrapper">
        <div className="panel-background">
          <h1>Your Quick Commands</h1>
          <div className="quick-commands">
            {commands
              .filter((_, i) => i !== 0)
              .map((command, i) => {
                const { name, variables: vars } = command;

                return (
                  <div key={name} className="command">
                    <div className="variables">
                      {vars.map((variable) => (
                        <TextField
                          key={`${name}-${variable}`}
                          className="variable"
                          label={variable}
                          variant="filled"
                          value={variables[`${i + 1}#@#${variable}`]}
                          onChange={(e) => {
                            setVariables({
                              ...variables,
                              [`${i + 1}#@#${variable}`]: e.target.value,
                            });
                          }}
                        />
                      ))}
                    </div>
                    <Button
                      fullWidth
                      variant="contained"
                      color="secondary"
                      className="run-command"
                      onClick={() => runCommand(i + 1)}
                      disabled={(() => {
                        if (commands[i + 1].variables && commands[i + 1].variables.length !== 0) {
                          return [false, ...commands[i + 1].variables]
                            .reduce((a, b) => a || !variables[`${i + 1}#@#${b}`]);
                        }
                        return false;
                      })()}
                    >
                      Run
                      {' '}
                      {name}
                    </Button>
                  </div>
                );
              })}
          </div>
        </div>
      </div>
      <div className="panel-wrapper">
        <div className="panel-background">
          <div className="modify-command">
            <div className="modify-command-top-bar">
              <IconButton
                disabled={current === 0}
                onClick={() => {
                  setCurrent(current - 1);
                }}
                aria-label="delete"
                size="large"
              >
                <ArrowBack fontSize="inherit" />
              </IconButton>
              <h1>{current === 0 ? 'Create New Command' : `Edit ${commands[current].name}`}</h1>
              {current !== 0 && (
                <IconButton
                  onClick={() => {
                    const newCommands = commands.filter((_, i) => i !== current);

                    setCommands(newCommands);
                    saveCommands(newCommands);
                    setCurrent(current - 1);
                  }}
                  aria-label="delete"
                  size="large"
                >
                  <Delete fontSize="inherit" />
                </IconButton>
              )}
              <IconButton
                disabled={current === commands.length - 1}
                onClick={() => {
                  setCurrent(current + 1);
                }}
                aria-label="delete"
                size="large"
              >
                <ArrowForward fontSize="inherit" />
              </IconButton>
            </div>
            <div className="modify-command-content">
              {current === 0 && (
                <div className="new-command-notes">
                  <h2>Some General Notes: </h2>
                  <ul>
                    <li>
                      Toggle button causes every command from that point
                      down, until there is another toggle, to be run at the
                      same time.
                    </li>
                    <li>
                      You can add variables by using
                      {' '}
                      <b>&lt;%variable-name%&gt;</b>
                      ,
                      which if done right, will show up at the bottom of the
                      container.
                    </li>
                  </ul>
                </div>
              )}
              <div className="modify-command-title">
                <h2>{current === 0 ? 'Give Your Command a Name' : 'Command Name'}</h2>
                <TextField
                  className="modify-command-name"
                  label="Command Name"
                  variant="filled"
                  value={commands[current].name}
                  onChange={(e) => {
                    setCommands(commands.map((c, i) => {
                      if (i === current) {
                        return {
                          ...commands[current],
                          name: e.target.value,
                        };
                      }
                      return c;
                    }));
                  }}
                />
              </div>
              <div className="new-commands">
                <h2>{current === 0 ? 'Add Commands to Run' : 'Commands that Run'}</h2>
                {commands[current].commands.map(({ command, shouldWait }, i) => (
                // eslint-disable-next-line react/no-array-index-key
                  <div key={i} className="new-command">
                    <TextField
                      label="Command"
                      variant="filled"
                      sx={{ m: 1, width: '100%' }}
                      value={command}
                      onChange={(e) => {
                        setCommands(commands.map((c, j) => {
                          if (j === current) {
                            return {
                              ...commands[current],
                              commands: commands[current].commands.map((co, k) => (
                                i === k
                                  ? { ...co, command: e.target.value }
                                  : co
                              )),
                            };
                          }
                          return c;
                        }));
                      }}
                    />
                    <Switch
                      checked={shouldWait}
                      onChange={(e) => {
                        setCommands(commands.map((c, j) => {
                          if (j === current) {
                            return {
                              ...commands[current],
                              commands: commands[current].commands.map((co, k) => (
                                i === k
                                  ? { ...co, shouldWait: e.target.checked }
                                  : co
                              )),
                            };
                          }
                          return c;
                        }));
                      }}
                    />

                    {i !== 0 && (
                    <IconButton
                      onClick={() => {
                        setCommands(commands.map((c, j) => {
                          if (j === current) {
                            return {
                              ...commands[current],
                              commands: commands[current].commands.filter((_, k) => i !== k),
                            };
                          }
                          return c;
                        }));
                      }}
                      aria-label="delete"
                      size="large"
                    >
                      <Delete fontSize="inherit" />
                    </IconButton>
                    )}
                  </div>
                ))}
              </div>
              <IconButton
                sx={{
                  m: 1,
                  width: '100%',
                  borderRadius: '7.55px',
                }}
                onClick={() => {
                  setCommands(commands.map((c, i) => {
                    if (i === current) {
                      return {
                        ...commands[current],
                        commands: [...commands[current].commands, { command: '', shouldWait: false }],
                      };
                    }
                    return c;
                  }));
                }}
                variant="contained"
                color="secondary"
                aria-label="add"
              >
                <Add />
              </IconButton>
              {variablesUsed.length !== 0 && (
              <div className="new-command-variables">
                <h2>Variables You Used</h2>
                <Stack className="new-variable" direction="row" spacing={1}>
                  {variablesUsed.map((variable, i) => (
                    // eslint-disable-next-line react/no-array-index-key
                    <Chip key={`${variable}-${i}`} className="variable-chip" label={variable} color="secondary" />
                  ))}
                </Stack>
              </div>
              )}
              <Button
                fullWidth
                variant="contained"
                disabled={(() => {
                  if (commands[current].name === '') return true;
                  return [false, ...commands[current].commands].reduce((a, b) => a || b.command === '');
                })()}
                color="secondary"
                onClick={current === 0 ? createCommand : () => saveCommands(commands)}
              >
                {current === 0 ? 'Create Command' : 'Save Edits'}
              </Button>
            </div>
          </div>
        </div>
      </div>
    </TabPanel>
  );
};

CommandsPanel.propTypes = {
  authHeader: PropTypes.string.isRequired,
  setAlert: PropTypes.func.isRequired,
};

export default CommandsPanel;
