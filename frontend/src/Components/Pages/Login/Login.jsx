import { Button } from '@mui/material';
import React from 'react';
import './Login.scss';

const google = {
  client_id: '357881516625-bbiafmdb5m5of50jlrsp92611qnftuvo.apps.googleusercontent.com',
  redirect_uri: 'http://localhost:3000/login/callback',
  response_type: 'token',
  scope: 'https://www.googleapis.com/auth/userinfo.email',
  include_granted_scopes: true,
  state: 'state_parameter_passthrough_value',
};

const GOOGLE_AUTH_URI = 'https://accounts.google.com/o/oauth2/v2/auth';
const GOOGLE_AUTH_URL = `${GOOGLE_AUTH_URI}?${Object.keys(google).map((key) => `${key}=${google[key]}`).join('&')}`;

const Login = () => (
  <div className="login">
    <Button variant="contained" href={GOOGLE_AUTH_URL}>
      Login with Google
    </Button>
    <div
      id="g_id_onload"
      data-client_id={google.client_id}
      data-auto_select="true"
      data-login_uri="http://localhost:8080/login"
    />
  </div>
);

export default Login;
