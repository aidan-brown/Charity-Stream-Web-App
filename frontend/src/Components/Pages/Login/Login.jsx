import { Button, Divider, Typography } from '@mui/material';
import React, { useEffect, useState } from 'react';
import GoogleLogo from '../../../assets/images/google-logo.png';
import './Login.scss';

const GOOGLE_AUTH_URI = 'https://accounts.google.com/o/oauth2/v2/auth';

const Login = () => {
  const [email, setEmail] = useState();

  const params = {
    google: {
      client_id: '357881516625-bbiafmdb5m5of50jlrsp92611qnftuvo.apps.googleusercontent.com',
      redirect_uri: 'http://localhost:3000/login/callback',
      response_type: 'token',
      scope: 'https://www.googleapis.com/auth/userinfo.profile',
      include_granted_scopes: true,
      state: 'state_parameter_passthrough_value',
      ...(email && { login_hint: email }),
    },
  };

  const buildAuthUrl = (service, url) => `${url}?${Object.keys(params[service]).map((key) => `${key}=${params[service][key]}`).join('&')}`;

  useEffect(() => {
    const returningEmail = localStorage.getItem('mcs-auth-email');

    if (returningEmail) {
      setEmail(returningEmail);
    }
  }, [email, setEmail]);

  return (
    <div className="login">
      <Typography className="heading" variant="h1" component="h1">
        Login
      </Typography>
      <Divider className="divider" variant="middle" />
      <Button className="google" variant="contained" href={buildAuthUrl('google', GOOGLE_AUTH_URI)}>
        <img src={GoogleLogo} alt="Google Sign in" />
        <span className="text">Sign in with Google</span>
      </Button>
    </div>
  );
};

export default Login;
