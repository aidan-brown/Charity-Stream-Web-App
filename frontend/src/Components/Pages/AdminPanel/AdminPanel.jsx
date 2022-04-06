import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import {
  Alert,
  Box,
  Button,
  Tab,
  TextField,
} from '@mui/material';
import { TabContext, TabList } from '@mui/lab';
import { NavLink, useNavigate, useSearchParams } from 'react-router-dom';
import { getUrl } from '../../../Utils';
import { CommandsPanel, ItemUpdatePanel, PlayerManagePanel } from './Panels';
import './AdminPanel.scss';

const AdminPanel = ({ setIsAdmin }) => {
  const [searchParams] = useSearchParams();

  const [loading, setLoading] = useState(true);
  const [loggedIn, setLoggedIn] = useState(false);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [authHeader, setAuthHeader] = useState();
  const [alert, setAlert] = useState();
  const [tab, setTab] = useState(searchParams.get('tab') || 'quick-commands');
  const navigate = useNavigate();

  const login = () => {
    const header = localStorage.getItem('mcs-authHeader');
    if (header || (username && password)) {
      if (header) setAuthHeader(header);
      const Authorization = `Basic ${window.btoa(`${username}:${password}`)}`;

      fetch(`${getUrl()}`, {
        headers: {
          Authorization: header || Authorization,
        },
      })
        .then(({ status }) => {
          if (status === 200) {
            setIsAdmin(true);
            if (!header) {
              setAuthHeader(Authorization);
              localStorage.setItem('mcs-authHeader', Authorization);
            }
            setLoggedIn(true);
          } else {
            setAuthHeader();
            localStorage.removeItem('mcs-authHeader');
            setAlert({
              message: 'Incorrect Username or Password',
              severity: 'error',
            });
          }

          setLoading(false);
        });
    } else setLoading(false);
  };

  useEffect(() => login(), []);
  useEffect(() => navigate(`/admin-panel?tab=${tab}`), [tab]);

  if (loading) return <div className="admin-panel" />;

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
          <ItemUpdatePanel authHeader={authHeader} setAlert={setAlert} />
          <PlayerManagePanel authHeader={authHeader} setAlert={setAlert} />
        </TabContext>
      )}
    </Box>
  );
};

AdminPanel.propTypes = {
  setIsAdmin: PropTypes.func.isRequired,
};

export default AdminPanel;
