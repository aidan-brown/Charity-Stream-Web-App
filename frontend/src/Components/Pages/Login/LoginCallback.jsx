import { CircularProgress } from '@mui/material';
import React, { useEffect } from 'react';
import {
  useLocation, useNavigate,
} from 'react-router-dom';
import { postToken } from './login.api';
import './Login.scss';

const LoginCallback = () => {
  const { hash } = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    const sendToken = async () => {
      const urlParams = {};
      hash.split('&').forEach((param) => {
        const [key, value] = param.split('=');
        urlParams[key] = value;
      });

      const { access_token: accessToken } = urlParams;

      if (accessToken) {
        await postToken(accessToken);
        navigate('/store', { replace: true });
      }
    };

    sendToken();
  }, [hash]);

  return (
    <div className="login">
      <CircularProgress size={100} />
      <h1>Logging You In...</h1>
    </div>
  );
};

export default LoginCallback;
