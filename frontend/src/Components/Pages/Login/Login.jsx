import { Button, Divider, Typography } from '@mui/material';
import React from 'react';
import GoogleLogo from '../../../assets/images/google-logo.png';
import './Login.scss';

const google = {
  client_id: '357881516625-bbiafmdb5m5of50jlrsp92611qnftuvo.apps.googleusercontent.com',
  redirect_uri: 'http://localhost:3000/login/callback',
  response_type: 'token',
  scope: 'https://www.googleapis.com/auth/userinfo.profile',
  include_granted_scopes: true,
  state: 'state_parameter_passthrough_value',
  login_hint: '', // TODO: Store the email in localstorage to re auth
};

const GOOGLE_AUTH_URI = 'https://accounts.google.com/o/oauth2/v2/auth';
const GOOGLE_AUTH_URL = `${GOOGLE_AUTH_URI}?${Object.keys(google).map((key) => `${key}=${google[key]}`).join('&')}`;

const Login = () => (
  <div className="login">
    <Typography className="heading" variant="h1" component="h1">
      Login
    </Typography>
    <Divider className="divider" variant="middle" />
    <Button className="google" variant="contained" href={GOOGLE_AUTH_URL}>
      <img src={GoogleLogo} alt="Google Sign in" />
      <span className="text">Sign in with Google</span>
    </Button>
  </div>
);

export default Login;
