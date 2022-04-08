import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import {
  IconButton,
  Switch,
  TextField,
  Button,
  Chip,
  Stack,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
} from '@mui/material';
import {
  Add, ArrowBack, ArrowForward, Delete,
} from '@mui/icons-material';
import { TabPanel } from '@mui/lab';
import { getReq, getUrl } from '../../../../../Utils';
import './CommandsPanel.scss';

const CommandsPanel = ({ authHeader, setAlert }) => {
  const [commands, setCommands] = useState([{
    name: '',
    commands: [{ command: '', shouldWait: false }],
  },
  ]);
  const [current, setCurrent] = useState(0);
  const [variables, setVariables] = useState({});
  const dataSources = {
    players: {
      get: async () => {
        const res = await getReq(`${getUrl()}/players`);

        if (res.status === 200) return res.json();
        return [];
      },
      variables: [
        'players:username',
        'players:name',
        'players:association',
        'players:teamSkyways',
        'players:teamBedsWars',
      ],
    },
  };

  useEffect(() => {
    const getCommands = async () => {
      try {
        const response = await fetch(`${getUrl()}/quick-commands`, {
          headers: {
            Authorization: authHeader,
            'Content-Type': 'application/json',
          },
        });

        if (response.status !== 200) {
          setAlert({
            message: 'Failed to get quick Commands (check the logs for why using code=GET_QUICK_COMMANDS)',
            severity: 'error',
          });
        } else {
          const json = await response.json();
          setCommands([
            ...commands,
            ...json.map((command) => ({
              ...command,
              commands: JSON.parse(command.commands),
              variables: JSON.parse(command.variables),
            })),
          ]);
        }
      } catch (_) {
        setAlert({
          message: 'Failed to get quick Commands (check the logs for why using code=GET_QUICK_COMMANDS)',
          severity: 'error',
        });
      }
    };

    getCommands();
  }, []);

  const variablesUsed = (() => {
    let vars = JSON.stringify(commands[current].commands).match(/<%[^<%%>]*%>/g);
    const { dataSource } = commands[current];

    if (vars && dataSource) {
      vars = vars.filter((v) => !dataSources[dataSource].variables.includes(
        v.replace('%>', '').replace('<%', ''),
      ));
    }

    if (vars) {
      return [
        ...new Set(vars.map((variable) => variable.replace('%>', '').replace('<%', ''))),
      ];
    }

    return [];
  })();

  const saveCommands = async (newCommands, index = current) => {
    try {
      const response = await fetch(`${getUrl()}/quick-commands`, {
        method: 'PUT',
        headers: {
          Authorization: authHeader,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...newCommands[index],
          commands: JSON.stringify(newCommands[index].commands),
          variables: JSON.stringify(newCommands[index].variables),
        }),
      });

      if (response.status !== 200) {
        setAlert({
          message: 'Failed to crete quick Command (check the logs for why using code=CREATE_QUICK_COMMANDS_ERROR)',
          severity: 'error',
        });
        return null;
      }
      setAlert({
        message: 'Created command!',
        severity: 'success',
      });
      return response.json();
    } catch (_) {
      setAlert({
        message: 'Failed to create quick Command (check the logs for why using code=CREATE_QUICK_COMMANDS_ERROR)',
        severity: 'error',
      });
      return null;
    }
  };

  const deleteCommand = async (id) => {
    try {
      const response = await fetch(`${getUrl()}/quick-commands/${id}`, {
        method: 'DELETE',
        headers: {
          Authorization: authHeader,
          'Content-Type': 'application/json',
        },
      });

      if (response.status !== 200) {
        setAlert({
          message: 'Failed to delete quick Commands (check the logs for why using code=DELETE_QUICK_COMMANDS_ERROR)',
          severity: 'error',
        });
      } else {
        setAlert({
          message: 'Deleted command!',
          severity: 'success',
        });
      }
    } catch (_) {
      setAlert({
        message: 'Failed to delete quick Commands (check the logs for why using code=DELETE_QUICK_COMMANDS_ERROR)',
        severity: 'error',
      });
    }
  };

  const createCommand = async () => {
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

    const { newId } = await saveCommands(newCommands, newCommands.length - 1);
    setCommands(newCommands.map((c, i) => (i === newCommands.length - 1
      ? { ...c, id: newId } : c)));
  };

  const injectVariables = async (index, command, commandDataSource) => {
    if (commandDataSource) {
      const newCommands = [];
      const data = await dataSources[commandDataSource].get();

      await Promise.all(data.map((d) => {
        let newCommand = command;

        dataSources[commandDataSource].variables.forEach((v) => {
          newCommand = newCommand.replaceAll(`<%${v}%>`, d[v.replace(`${commandDataSource}:`, '')]);
        });
        newCommands.push(newCommand);
        return null;
      }));

      let commandsToBeRun = [];
      newCommands.forEach((c) => {
        commandsToBeRun = [
          ...commandsToBeRun,
          ...JSON.parse(c),
        ];
      });

      return JSON.stringify(commandsToBeRun);
    }
    let newCommand = command;

    Object.keys(variables).forEach((key) => {
      const [i, variable] = key.split('#@#');

      if (Number(i) === index) {
        newCommand = newCommand.replaceAll(`<%${variable}%>`, variables[key]);
      }
    });

    return newCommand;
  };

  const runCommand = async (index) => {
    const { dataSource } = commands[index];
    const commandsToRun = await injectVariables(
      index,
      JSON.stringify(commands[index].commands),
      dataSource,
      [...commands[index].variables, ...(dataSource ? dataSources[dataSource].variables : [])],
    );

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
                          value={variables[`${i + 1}#@#${variable}`] || ''}
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
                aria-label="back-button"
                size="large"
              >
                <ArrowBack fontSize="inherit" />
              </IconButton>
              <h1>{current === 0 ? 'Create New Command' : `Edit ${commands[current].name}`}</h1>
              {current !== 0 && (
                <IconButton
                  onClick={() => {
                    deleteCommand(commands[current].id);
                    const newCommands = commands.filter((_, i) => i !== current);

                    setCommands(newCommands);
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
                aria-label="forward-button"
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
                    <li>
                      You can also add a data source by selecting one below.
                      This will allow you to add commands like:
                      {' '}
                      <b>&lt;%datadource:variable-name%&gt;</b>
                      .
                    </li>
                  </ul>
                </div>
              )}
              <div className="modify-command-title">
                <h2>{current === 0 ? 'Command a Name and Data Source (Optional)' : 'Command Name'}</h2>
                <div className="command-meta">
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
                  <FormControl className="modify-data-source">
                    <InputLabel id="select-label">Data Source</InputLabel>
                    <Select
                      labelId="select-label"
                      value={commands[current].dataSource || ''}
                      label="Data Source"
                      onChange={(e) => {
                        const { value } = e.target;

                        setCommands(commands.map((c, j) => {
                          if (j === current) {
                            return {
                              ...commands[current],
                              dataSource: value === 'none' ? null : value,
                            };
                          }
                          return c;
                        }));
                      }}
                    >
                      <MenuItem value="none">None</MenuItem>
                      <MenuItem value="players">Players</MenuItem>
                    </Select>
                  </FormControl>
                </div>
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
              {(variablesUsed.length !== 0 || commands[current].dataSource) && (
              <div className="new-command-variables">
                <h2>Variables You Used</h2>
                <Stack className="new-variable" direction="row" spacing={1}>
                  {[...variablesUsed, ...(commands[current].dataSource
                    ? dataSources[commands[current].dataSource].variables
                    : [])].map((variable, i) => (
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
