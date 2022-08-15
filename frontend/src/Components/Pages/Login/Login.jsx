import React, { useEffect, useState } from 'react';
import { Button, Divider, Typography } from '@mui/material';
import { getUrl } from '../../../Utils';
import GoogleLogo from '../../../assets/images/google-logo.png';
import TwitchLogo from '../../../assets/images/twitch-logo.webp';
import MicrosoftLogo from '../../../assets/images/microsoft-logo.png';
import './Login.scss';

const Login = () => {
  const [email, setEmail] = useState();

  const services = {
    Google: {
      logo: GoogleLogo,
      uri: 'https://accounts.google.com/o/oauth2/v2/auth',
      params: {
        client_id: '357881516625-bbiafmdb5m5of50jlrsp92611qnftuvo.apps.googleusercontent.com',
        redirect_uri: `${getUrl()}/login/callback/google`,
        response_type: 'token',
        scope: 'https://www.googleapis.com/auth/userinfo.profile',
        ...(email && { login_hint: email }),
      },
    },
    Twitch: {
      logo: TwitchLogo,
      uri: 'https://id.twitch.tv/oauth2/authorize',
      params: {
        client_id: 'q2typr9nmx5nl2uz4snd8tce7mtj0f',
        redirect_uri: `${getUrl()}/login/callback/twitch`,
        response_type: 'token',
        scope: 'user%3Aread%3Aemail',
      },
    },
    Microsoft: {
      logo: MicrosoftLogo,
      uri: 'https://login.microsoftonline.com/7507ed45-3e6b-4ed4-828c-ed073ddfb682/oauth2/v2.0/authorize',
      params: {
        client_id: 'd44f6e87-3f99-4faa-803c-dc87ab123967',
        redirect_uri: `${getUrl()}/login/callback/microsoft`,
        response_type: 'token',
        scope: 'user.read%20mail.read',
        // ...(email && { login_hint: email }),
      },
    },
  };

  const buildAuthUrl = (service) => {
    const { uri, params } = services[service];
    const query = Object.keys(params)
      .map((key) => `${key}=${params[key]}`)
      .join('&');

    return `${uri}?${query}`;
  };

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
      {Object.keys(services).map((service) => (
        <Button key={service} className={service} variant="contained" href={buildAuthUrl(service)}>
          <img src={services[service].logo} alt={`${service} Sign in`} />
          <span className="text">
            Sign in with
            {' '}
            {service}
          </span>
        </Button>
      ))}
    </div>
  );
};

export default Login;
