import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import {
  Button,
  FormControl,
  IconButton,
  InputLabel,
  MenuItem,
  Select,
  TextField,
} from '@mui/material';
import { TabPanel } from '@mui/lab';
import DeleteIcon from '@mui/icons-material/Delete';
import { ASSOCIATIONS } from '../../../../../constants';
import { getUrl, getReq } from '../../../../../Utils';
import './PlayerManagePanel.scss';

const PlayerManagePanel = ({ authHeader, setAlert }) => {
  const [player, setPlayer] = useState({});
  const [players, setPlayers] = useState([]);
  const [text, setText] = useState();

  useEffect(() => {
    const getPlayers = () => {
      getReq(`${getUrl()}/players`)
        .then((res) => {
          if (res.status !== 200) {
            setAlert({
              message: 'Could not get players from backend',
              severity: 'error',
            });
          } else {
            res.json().then((r) => {
              setPlayers(r);
            });
          }
        }).catch(() => {
          setAlert({
            message: 'Could not get players from backend',
            severity: 'error',
          });
        });
    };

    getPlayers();
  }, []);

  const createPlayers = (newPlayers) => {
    fetch(`${getUrl()}/players`, {
      method: 'POST',
      headers: {
        Authorization: authHeader,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(newPlayers),
    })
      .then((res) => {
        if (res.status !== 200) {
          setAlert({
            message: 'Could not create players',
            severity: 'error',
          });
        } else {
          res.json().then((r) => {
            setAlert({
              message: 'Successfully Created player(s)',
              severity: 'success',
            });
            setPlayers([...players, ...r.newPlayers]);
          });
        }
      }).catch(() => {
        setAlert({
          message: 'Could not create players',
          severity: 'error',
        });
      });
  };

  const deletePlayer = (usn) => {
    fetch(`${getUrl()}/players/${usn}`, {
      method: 'DELETE',
      headers: {
        Authorization: authHeader,
        'Content-Type': 'application/json',
      },
    })
      .then((res) => {
        if (res.status !== 200) {
          setAlert({
            message: 'Could not delete player',
            severity: 'error',
          });
        } else {
          setAlert({
            message: 'Successfully Deleted player',
            severity: 'success',
          });
          setPlayers(players.filter((p) => p.username !== usn));
        }
      }).catch(() => {
        setAlert({
          message: 'Could not delete player',
          severity: 'error',
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

            if (currentProp === 'association' && ASSOCIATIONS.includes(val)) {
              newP[currentProp] = val;
            } else if (currentProp !== 'association') {
              newP[currentProp] = val;
            } else if (currentProp !== 'twitchChannel') {
              newP[currentProp] = val.toLowerCase();
            } else {
              setAlert({
                message: 'Player association is not right',
                severity: 'error',
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
    <TabPanel className="player-manage" value="players">
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
              }}
            >
              {ASSOCIATIONS.map((a) => (
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
              setAlert();
            }}
          />
          <Button
            fullWidth
            className="create-single-button"
            type="submit"
            variant="contained"
            color="secondary"
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
            maxRows={8}
            minRows={7}
            value={text}
            onChange={(e) => {
              setText(e.target.value);
            }}
          />
          <Button
            fullWidth
            className="create-bulk-button"
            type="submit"
            variant="contained"
            color="secondary"
            onClick={generatePlayers}
          >
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
  );
};

PlayerManagePanel.propTypes = {
  authHeader: PropTypes.string.isRequired,
  setAlert: PropTypes.func.isRequired,
};

export default PlayerManagePanel;
