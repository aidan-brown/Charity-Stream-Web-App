import React, { useState } from 'react';
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
import { useQuery } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import { ASSOCIATIONS, CHANNEL_TYPES } from '../../../../../constants';
import './PlayerManagePanel.scss';
import {
  createNewPlayers,
  deletePlayer,
  getPlayers,
} from '../../../../../api';

const PlayerManagePanel = ({ setAlert }) => {
  const navigate = useNavigate();

  const [player, setPlayer] = useState({});
  const [players, setPlayers] = useState([]);
  const [text, setText] = useState('');

  useQuery(
    ['players'],
    () => getPlayers(),
    {
      onSuccess: (newPlayers) => {
        setPlayers(newPlayers);
      },
    },
  );

  const createPlayers = async (newPlayers) => {
    try {
      const { errors, nps } = await createNewPlayers(newPlayers);

      if (nps) {
        setPlayers([...players, ...nps]);
      }

      if (errors) {
        setAlert({
          message: `Errors: ${JSON.stringify(errors)}`,
          severity: 'error',
        });
      } else {
        setAlert({
          message: 'Successfully Created player(s)',
          severity: 'success',
        });
      }
    } catch (err) {
      if (err === 'REDIRECT_TO_LOGIN') {
        navigate('/login');
      }
    }
  };

  const removePlayer = async (usn) => {
    try {
      if (await deletePlayer(usn)) {
        setAlert({
          message: `Successfully Deleted ${usn}`,
          severity: 'success',
        });
        setPlayers(players.filter((p) => p.username !== usn));
      } else {
        setAlert({
          message: 'Could not delete player',
          severity: 'error',
        });
      }
    } catch (err) {
      if (err === 'REDIRECT_TO_LOGIN') {
        navigate('/login');
      }
    }
  };

  const generatePlayers = () => {
    try {
      const lines = text.split('\n');
      const newPlayers = [];

      lines.forEach((line, lineNum) => {
        const data = line.split(/  +|\t/g);
        const newP = {
          name: null,
          username: null,
          association: null,
          channel: null,
          channelType: null,
          teamSkyways: null,
          teamBedsWars: null,
        };

        if (data.length >= 3) {
          data.forEach((val, i) => {
            const currentProp = Object.keys(newP)[i];

            if (currentProp === 'channel') {
              newP[currentProp] = val.trim().toLowerCase();
            } else if (val) {
              newP[currentProp] = val.trim();
            }
          });

          newPlayers.push(newP);
        } else {
          setAlert({
            message: `There is an error on line ${lineNum + 1}`,
            severity: 'error',
          });
        }
      });

      return newPlayers;
    } catch (err) {
      return [];
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
            value={player.name || ''}
            onChange={(e) => {
              setPlayer({ ...player, name: e.target.value });
            }}
          />
          <TextField
            required
            label="Username"
            variant="filled"
            sx={{ m: 1, width: '100%' }}
            value={player.username || ''}
            onChange={(e) => {
              setPlayer({ ...player, username: e.target.value });
            }}
          />
          <FormControl fullWidth>
            <InputLabel required id="select-label">Association</InputLabel>
            <Select
              required
              labelId="select-label"
              value={player.association || ''}
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
          <div className="channel">
            <TextField
              className="channel-name"
              fullWidth
              label="Channel"
              variant="filled"
              sx={{ m: 1, width: '100%' }}
              value={player.channel || ''}
              onChange={(e) => {
                setPlayer({ ...player, channel: e.target.value });
                setAlert();
              }}
            />
            <FormControl fullWidth>
              <InputLabel id="select-label">Channel Type</InputLabel>
              <Select
                required
                labelId="select-label"
                value={player.channelType || ''}
                label="Channel Type"
                onChange={(e) => {
                  setPlayer({ ...player, channelType: e.target.value });
                }}
              >
                {CHANNEL_TYPES.map((a) => (
                  <MenuItem key={a} value={a}>
                    {a}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </div>
          <Button
            fullWidth
            disabled={!player.name || !player.association || !player.username}
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
            <b>channel</b>
            {'<tab>'}
            <b>channelType</b>
            {'<tab>'}
            <b>teamSkywars</b>
            {'<tab>'}
            <b>teamBedsWars</b>
            {'<newline>'}
          </p>
          <TextField
            placeholder="Corey Rigney\tyakman3\tcsh\t\t6\t7\n"
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
            disabled={text.length === 0}
            className="create-bulk-button"
            type="submit"
            variant="contained"
            color="secondary"
            onClick={() => {
              const newPlayers = generatePlayers();
              if (newPlayers.length > 0) {
                createPlayers(newPlayers);
                setText('');
              }
            }}
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
                      removePlayer(un);
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
  setAlert: PropTypes.func.isRequired,
};

export default PlayerManagePanel;
