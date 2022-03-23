import {
  Button, Checkbox, Input, Grid, Box,
} from '@mui/material';
import React, { useEffect, useState } from 'react';
import { BACKENDURL } from '../../App/constants';
import './AdminPanel.scss';

const TYPES = ['armor', 'food', 'material', 'misc', 'tool', 'weapon'];

const AdminPanel = () => {
  const [elements, setElements] = useState([]);
  const [toDisable, setToDisable] = useState([]);
  const [authHeader, setAuthHeader] = useState();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [loggedIn, setLoggedIn] = useState(false);
  const [error, setError] = useState();

  useEffect(() => {
    const header = localStorage.getItem('mcs-authHeader');
    if (header) {
      setAuthHeader(header);
      setLoggedIn(true);
    }

    const getElements = () => {
      fetch(`${BACKENDURL}/minecraft/all`)
        .then((res) => res.json())
        .then((res) => {
          setElements(res);
        }).catch(() => {
          setError({
            message: 'Could not get items from backend',
          });
        });
    };

    getElements();
  }, []);

  const login = () => {
    const Authorization = `Basic ${window.btoa(`${username}:${password}`)}`;
    fetch(`${BACKENDURL}`, {
      headers: {
        Authorization,
      },
    })
      .then(() => {
        setLoggedIn(true);
        setAuthHeader(Authorization);
        localStorage.setItem('mcs-authHeader', Authorization);
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

  return (
    <Box sx={{ flexGrow: 1 }} className="admin-panel">
      {!loggedIn && (
        <div className="login">
          <h1>Login</h1>
          <div className="login-inputs">
            <Input
              className="login-input"
              required
              placeholder="Username"
              type="username"
              onChange={(e) => {
                setUsername(e.target.value);
              }}
            />
            <Input
              className="login-input"
              required
              placeholder="Password"
              type="password"
              autoComplete="password"
              onChange={(e) => {
                setPassword(e.target.value);
              }}
            />
          </div>
          <Button
            color="primary"
            variant="contained"
            disabled={username.length === 0 || password.length === 0}
            onClick={login}
          >
            Login
          </Button>
        </div>
      )}
      {loggedIn && (
        <>
          <div>
            {TYPES.map((t) => (
              <div key={t}>
                <h1>{`${t[0].toUpperCase()}${t.slice(1, t.length)}`}</h1>
                {elements.filter((el) => el.type === t).map((element) => {
                  const {
                    id, displayName, disabled, type,
                  } = element;

                  return (
                    <div key={`${id}-${type}`}>
                      <div className="element" key={id}>
                        <img
                          className="image"
                          src={`${BACKENDURL}/assets/${
                            type === 'mob' || type === 'effect'
                              ? `${type}s` : 'items'}/${id}.png`}
                          alt={`${id} disable`}
                        />
                        <p>{displayName}</p>
                        <Checkbox
                          checked={disabled}
                          onClick={(e) => {
                            setElements(elements.map((el) => {
                              const { checked } = e.target;

                              if (el.id === id) {
                                if (toDisable.includes(id)) {
                                  setToDisable([...toDisable.filter((item) => item.id !== id)]);
                                } else {
                                  setToDisable([...toDisable, {
                                    id,
                                    disabled: checked,
                                  }]);
                                }

                                return {
                                  ...el,
                                  disabled: checked,
                                };
                              }
                              return el;
                            }));
                          }}
                        />
                      </div>
                    </div>
                  );
                })}
              </div>
            ))}
          </div>
          <div className="button-group">
            <Button
              className="disabled-button-left"
              color="primary"
              variant="contained"
              disabled={toDisable.length === 0}
              onClick={() => {
                setToDisable([]);
              }}
            >
              Clear Current Selection
            </Button>
            <Button
              color="primary"
              variant="contained"
              disabled={toDisable.length === 0}
              onClick={disableItems}
            >
              Disable Current Selection
            </Button>
          </div>
        </>
      )}
    </Box>
  );
};

export default AdminPanel;
