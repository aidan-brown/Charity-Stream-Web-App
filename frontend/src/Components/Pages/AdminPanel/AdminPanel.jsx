import {
  Alert, AlertTitle, Button, TextField,
} from '@mui/material';
import React, { useEffect, useState } from 'react';
import { BACKENDURL } from '../../App/constants';
import StoreItem from '../Store/StoreContent/StoreItem';
import './AdminPanel.scss';

const AdminPanel = () => {
  const [loggedIn, setLoggedIn] = useState(false);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [authHeader, setAuthHeader] = useState();
  const [error, setError] = useState();
  const [toDisable, setToDisable] = useState([]);
  const [items, setItems] = useState([]);

  useEffect(() => {
    const header = localStorage.getItem('mcs-authHeader');
    if (header) {
      setAuthHeader(header);
      // setLoggedIn(true);
    }

    const getElements = () => {
      fetch(`${BACKENDURL}/minecraft/all`)
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

  const login = () => {
    const Authorization = `Basic ${window.btoa(`${username}:${password}`)}`;
    fetch(`${BACKENDURL}`, {
      headers: {
        Authorization,
      },
    })
      .then(({ status }) => {
        console.log(status);
        if (status === 200) {
          setLoggedIn(true);
          setAuthHeader(Authorization);
          localStorage.setItem('mcs-authHeader', Authorization);
        } else {
          console.log('Hello there');
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

  return (
    <div className="admin-panel">
      {!loggedIn && (
        <div className="login">
          {error && (
          <Alert variant="filled" severity="error">
            <AlertTitle>Error</AlertTitle>
            {error.message}
          </Alert>
          )}
          <div className="inputs">
            <TextField
              label="Username"
              variant="filled"
              type="username"
              required
              value={username}
              onChange={(e) => setUsername(e.target.value)}
            />
            <TextField
              label="Password"
              variant="filled"
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            <Button className="signin" type="submit" variant="contained" onClick={login}>
              SIGN IN
            </Button>
          </div>
        </div>
      )}
      {loggedIn && (
        <>
          {items.map((item) => <StoreItem item={item} addItemToCart={() => {}} />)}
        </>
      )}
    </div>
  );
};

export default AdminPanel;
