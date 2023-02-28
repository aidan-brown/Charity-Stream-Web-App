import React from 'react';
import { Button, Divider, Typography } from '@mui/material';
import GoogleLogo from '../../../assets/images/google-logo.png';
// import TwitchLogo from '../../../assets/images/twitch-logo.webp';
import MicrosoftLogo from '../../../assets/images/microsoft-logo.png';
import './Login.scss';

const SERVICES = [
  {
    name: 'Google',
    logo: GoogleLogo,
  },
  {
    name: 'Microsoft',
    logo: MicrosoftLogo,
  },
];

const Login = () => (
  <div className="login">
    <Typography className="heading" variant="h1" component="h1">
      Login
    </Typography>
    <Divider className="divider" variant="middle" />
    {SERVICES.map(({ name, logo }) => (
      <Button key={name} className={name} variant="contained" href={`/api/auth/${name.toLowerCase()}`}>
        <img src={logo} alt={`${name} Sign in`} />
        <span className="text">
          Sign in with
          {' '}
          {name}
        </span>
      </Button>
    ))}
  </div>
);

export default Login;
