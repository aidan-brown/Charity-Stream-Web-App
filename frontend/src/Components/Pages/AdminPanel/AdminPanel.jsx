import {
  Alert,
  Box,
  Button,
  Tab,
  TextField,
} from '@mui/material';
import { TabContext, TabList } from '@mui/lab';
import React, { useEffect, useState } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { getUrl } from '../../../Utils';
import { CommandsPanel, ItemDisablePanel, PlayerManagePanel } from './Panels';
import './AdminPanel.scss';

const AdminPanel = () => {
  const [loggedIn, setLoggedIn] = useState(false);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [authHeader, setAuthHeader] = useState();
  const [alert, setAlert] = useState({
    severity: 'success',
    message: 'so Head?',
  });
  const [tab, setTab] = useState('quick-commands');
  const navigate = useNavigate();

  useEffect(() => navigate(`/admin-panel?tab=${tab}`), [tab]);

  useEffect(() => {
    const header = localStorage.getItem('mcs-authHeader');
    if (header) {
      setAuthHeader(header);
      setLoggedIn(true);
    }
  }, []);

  const login = () => {
    const Authorization = `Basic ${window.btoa(`${username}:${password}`)}`;
    fetch(`${getUrl()}`, {
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
          setAlert({
            message: 'Incorrect Username or Password',
            severity: 'error',
          });
        }
      });
  };

  return (
    <Box className="admin-panel" sx={{ width: '100%', typography: 'body1' }}>
      {!loggedIn && (
        <div className="login-wrapper">
          <div className="login">
            {alert && (
            <Alert
              onClose={() => setAlert()}
              variant="filled"
              severity={alert.severity}
            >
              {alert.message}
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
                  if (alert) setAlert();
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
                  if (alert) setAlert();
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
        <TabContext value={tab}>
          <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
            <TabList
              textColor="secondary"
              indicatorColor="secondary"
              onChange={(_, newValue) => setTab(newValue)}
              aria-label="Admin Panel Tabs"
            >
              <Tab label="Quick Commands" value="quick-commands" />
              <Tab label="Disable Items" value="disabling-items" />
              <Tab label="Players" value="players" />
            </TabList>
          </Box>
          {alert && (
            <Alert
              className="admin-alert"
              onClose={() => setAlert()}
              variant="filled"
              severity={alert.severity}
            >
              {alert.message}
            </Alert>
          )}
          <CommandsPanel authHeader={authHeader} setAlert={setAlert} />
          <ItemDisablePanel authHeader={authHeader} setAlert={setAlert} />
          <PlayerManagePanel authHeader={authHeader} setAlert={setAlert} />
        </TabContext>
      )}
    </Box>
  );
};

export default AdminPanel;
