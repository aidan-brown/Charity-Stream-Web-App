import {
  Alert,
  AlertTitle,
  Box,
  Button,
  FormControl,
  IconButton,
  InputLabel,
  MenuItem,
  Select,
  Tab,
  TextField,
} from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import { TabContext, TabList, TabPanel } from '@mui/lab';
import React, { useEffect, useState } from 'react';
import { NavLink } from 'react-router-dom';
import './AdminPanel.scss';
import StoreEffect from '../Store/StoreContent/StoreEffect';
import StoreMob from '../Store/StoreContent/StoreMob';
import StoreItem from '../Store/StoreContent/StoreItem';
import { BACKENDURL } from '../../App/constants';
import { getReq } from '../../../Utils';

const associations = ['csh', 'blackbaud', 'hogs', 'ehouse', 'sse', 'arthouse', 'rit', 'streamer', 'other'];

const AdminPanel = () => {
  const [loggedIn, setLoggedIn] = useState(false);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [authHeader, setAuthHeader] = useState();
  const [error, setError] = useState();
  const [toDisable, setToDisable] = useState([]);
  const [items, setItems] = useState([]);
  const [value, setValue] = useState('quick-commands');
  const [filter, setFilter] = useState('');
  const [player, setPlayer] = useState({});
  const [players, setPlayers] = useState([]);
  const [text, setText] = useState();

  const handleChange = (_, newValue) => {
    setValue(newValue);
  };

  useEffect(() => {
    const header = localStorage.getItem('mcs-authHeader');
    if (header) {
      setAuthHeader(header);
      setLoggedIn(true);
    }

    const getElements = () => {
      getReq(`${BACKENDURL}/minecraft/all`)
        .then((res) => res.json())
        .then((res) => {
          setItems(res);
        }).catch(() => {
          setError({
            message: 'Could not get items from backend',
          });
        });
    };

    getElements();
  }, []);

  useEffect(() => {
    const getPlayers = () => {
      getReq(`${BACKENDURL}/players`)
        .then((res) => res.json())
        .then((res) => {
          setPlayers(res);
        }).catch(() => {
          setError({
            message: 'Could not get players from backend',
          });
        });
    };

    getPlayers();
  }, []);

  const login = () => {
    const Authorization = `Basic ${window.btoa(`${username}:${password}`)}`;
    fetch(`${BACKENDURL}`, {
      headers: {
        Authorization,
      },
    })
      .then(({ status }) => {
        if (status === 200) {
          setLoggedIn(true);
          setAuthHeader(Authorization);
          localStorage.setItem('mcs-authHeader', Authorization);
        } else {
          setError({
            message: 'Incorrect Username or Password',
          });
        }
      });
  };

  const disableItems = () => {
    fetch(`${BACKENDURL}/disable`, {
      method: 'PUT',
      headers: {
        Authorization: authHeader,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(toDisable),
    }).then(() => {
      setToDisable([]);
    }).catch(() => {
      setError({
        message: 'Could not disabled those items',
      });
    });
  };

  const toggleDisabled = (item) => {
    setItems(items.map((el) => {
      if (el.id === item.id) {
        if (toDisable.find((i) => i.id === item.id)) {
          setToDisable(toDisable.filter((i) => i.id !== item.id));
        } else {
          setToDisable([...toDisable, {
            id: item.id,
            disabled: !item.disabled,
          }]);
        }
        return {
          ...el,
          disabled: !item.disabled,
        };
      }
      return el;
    }));
  };

  const createPlayers = (newPlayers) => {
    fetch(`${BACKENDURL}/players`, {
      method: 'POST',
      headers: {
        Authorization: authHeader,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(newPlayers),
    })
      .then((res) => res.json())
      .then((res) => {
        setPlayers([...players, ...res.newPlayers]);
      }).catch(() => {
        setError({
          message: 'Could not Create those players',
        });
      });
  };

  const deletePlayer = (usn) => {
    fetch(`${BACKENDURL}/players/${usn}`, {
      method: 'DELETE',
      headers: {
        Authorization: authHeader,
        'Content-Type': 'application/json',
      },
    })
      .then(() => {
        setPlayers(players.filter((p) => p.username !== usn));
      }).catch(() => {
        setError({
          message: 'Could not delete player',
        });
      });
  };

  const generatePlayers = () => {
    try {
      const lines = text.split('\n');
      const newPlayers = [];

      lines.forEach((line) => {
        const data = line.split('\t');
        const newP = {
          name: '',
          username: '',
          association: '',
          twitchChannel: '',
        };

        if (data.length >= 3) {
          data.forEach((val, i) => {
            const currentProp = Object.keys(newP)[i];

            if (currentProp === 'association' && associations.includes(val)) {
              newP[currentProp] = val;
            } else if (currentProp !== 'association') {
              newP[currentProp] = val;
            } else if (currentProp !== 'twitchChannel') {
              newP[currentProp] = val.toLowerCase();
            } else {
              setError({
                message: 'Player association is not right',
              });
            }
          });

          newPlayers.push(newP);
        }
      });

      createPlayers(newPlayers);
    } catch (err) {
      // No errors here
    }
  };

  return (
    <Box className="admin-panel" sx={{ width: '100%', typography: 'body1' }}>
      {!loggedIn && (
        <div className="login-wrapper">
          <div className="login">
            {error && (
            <Alert variant="filled" severity="error">
              <AlertTitle>Error</AlertTitle>
              {error.message}
            </Alert>
            )}
            <div className="inputs">
              <h1>Login</h1>
              <NavLink to={{ pathname: '/' }}>Not Corey?</NavLink>
              <TextField
                label="Username"
                variant="filled"
                sx={{ m: 1, width: '100%' }}
                type="username"
                required
                value={username}
                onChange={(e) => {
                  setUsername(e.target.value);
                  if (error) setError();
                }}
              />
              <TextField
                label="Password"
                variant="filled"
                sx={{ m: 1, width: '100%' }}
                type="password"
                required
                value={password}
                onChange={(e) => {
                  setPassword(e.target.value);
                  if (error) setError();
                }}
              />
              <Button className="signin" type="submit" variant="contained" onClick={login}>
                SIGN IN
              </Button>
            </div>
          </div>
        </div>
      )}
      {loggedIn && (
        <TabContext value={value}>
          <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
            <TabList onChange={handleChange} aria-label="Admin Panel Tabs">
              <Tab label="Quick Commands" value="quick-commands" />
              <Tab label="Disable Items" value="disabling-items" />
              <Tab label="Players" value="players" />
            </TabList>
          </Box>
          <TabPanel value="quick-commands">
            <div />
          </TabPanel>
          <TabPanel value="disabling-items">
            <div className="disabled-items">
              <div className="search-bar">
                <TextField
                  variant="filled"
                  placeholder="Search Items...."
                  sx={{ width: '30%' }}
                  onChange={(e) => {
                    setFilter(e.target.value);
                  }}
                />
              </div>
              <div className="StoreContent">
                {items
                  .filter((i) => (JSON.stringify(Object.values(i)).includes(filter)))
                  .filter(({ type }) => type !== 'mob' && type !== 'effect')
                  .map((item) => (
                    <StoreItem
                      className={toDisable.find((d) => d.id === item.id) ? 'selected' : null}
                      isStore={false}
                      item={item}
                      addItemToCart={() => toggleDisabled(item)}
                      key={item.id}
                    />
                  ))}
                {items
                  .filter((i) => (JSON.stringify(Object.values(i)).includes(filter)))
                  .filter(({ type }) => type === 'mob')
                  .map((mob) => (
                    <StoreMob
                      isStore={false}
                      mob={mob}
                      addItemToCart={() => toggleDisabled(mob)}
                      key={mob.id}
                    />
                  ))}
                {items
                  .filter((i) => (JSON.stringify(Object.values(i)).includes(filter)))
                  .filter(({ type }) => type === 'effect')
                  .map((effect) => (
                    <StoreEffect
                      isStore={false}
                      effect={effect}
                      addItemToCart={() => toggleDisabled(effect)}
                      key={effect.id}
                    />
                  ))}
              </div>
              <Button
                className="toggle-button"
                disabled={toDisable.length === 0}
                variant="contained"
                onClick={disableItems}
              >
                Toggle Selected
              </Button>
            </div>
          </TabPanel>
          <TabPanel className="players" value="players">
            <div className="create-player">
              <FormControl className="create-player-form">
                <h1>Create Player</h1>
                <TextField
                  required
                  label="Name"
                  variant="filled"
                  sx={{ m: 1, width: '100%' }}
                  value={player.name}
                  onChange={(e) => {
                    setPlayer({ ...player, name: e.target.value });
                    if (error) setError();
                  }}
                />
                <TextField
                  required
                  label="Username"
                  variant="filled"
                  sx={{ m: 1, width: '100%' }}
                  value={player.username}
                  onChange={(e) => {
                    setPlayer({ ...player, username: e.target.value });
                    if (error) setError();
                  }}
                />
                <FormControl fullWidth>
                  <InputLabel id="select-label">Association</InputLabel>
                  <Select
                    required
                    labelId="select-label"
                    value={player.association}
                    label="Association"
                    onChange={(e) => {
                      setPlayer({ ...player, association: e.target.value });
                      if (error) setError();
                    }}
                  >
                    {associations.map((a) => (
                      <MenuItem key={a} value={a}>
                        {a.toUpperCase()}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
                <TextField
                  label="Twitch Channel"
                  variant="filled"
                  sx={{ m: 1, width: '100%' }}
                  value={player.twitchChannel}
                  onChange={(e) => {
                    setPlayer({ ...player, twitchChannel: e.target.value });
                    if (error) setError();
                  }}
                />
                <Button
                  fullWidth
                  className="create-single-button"
                  type="submit"
                  variant="contained"
                  onClick={() => {
                    createPlayers([player]);
                  }}
                >
                  Create Player
                </Button>
              </FormControl>
              <div className="create-bulk">
                <h1>Bulk Create Players</h1>
                <p>
                  Format:
                  {' '}
                  <b>playerName</b>
                  {'<tab>'}
                  <b>username</b>
                  {'<tab>'}
                  <b>associations</b>
                  {'<tab>'}
                  <b>twitchChannel</b>
                  {'<newline>'}
                </p>
                <TextField
                  placeholder="Corey Rigney\tyakman3\tcsh\n"
                  fullWidth
                  className="create-bulk-field"
                  label="Player Paste Area"
                  multiline
                  maxRows={10}
                  minRows={5}
                  value={text}
                  onChange={(e) => {
                    setText(e.target.value);
                  }}
                />
                <Button fullWidth className="create-bulk-button" type="submit" variant="contained" onClick={generatePlayers}>
                  Create Players
                </Button>
              </div>
            </div>
            <div className="player-display">
              <div className="player-background">
                <h1>Current Players</h1>
                <div className="players">
                  {players
                    .map(({ username: un, name }) => (
                      <div key={un} className="player">
                        <p>{`${name} [${un}]`}</p>
                        <IconButton
                          className="delete-button"
                          aria-label="delete"
                          size="large"
                          onClick={() => {
                            deletePlayer(un);
                          }}
                        >
                          <DeleteIcon />
                        </IconButton>
                      </div>
                    ))}
                </div>
              </div>
            </div>
          </TabPanel>
        </TabContext>
      )}
    </Box>
  );
};

export default AdminPanel;
