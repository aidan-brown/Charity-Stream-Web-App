import { CircularProgress } from '@mui/material';
import { useQueryClient } from '@tanstack/react-query';
import Cookies from 'js-cookie';
import React, { useEffect } from 'react';
import {
  useLocation, useNavigate, useParams,
} from 'react-router-dom';
import { postToken } from '../../../api';
import './Login.scss';

const LoginCallback = () => {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const { hash } = useLocation();
  const { service } = useParams();

  useEffect(() => {
    const sendToken = async () => {
      try {
        const urlParams = {};
        hash.split('&').forEach((param) => {
          const [key, value] = param.replace('#', '').split('=');
          urlParams[key] = value;
        });

        const { access_token: token } = urlParams;

        if (token) {
          const { account, accessToken } = await postToken({ token, service });

          // Add access token to the cookies
          Cookies.set('accessToken', accessToken);

          // Save email for re-auth
          if (account.email) {
            localStorage.setItem('mcs-auth-email', account.email);
          }

          queryClient.removeQueries(['account']);
          navigate('/store', { replace: true });
        }
      } catch (err) {
        // TODO: Handle an error here
      }
    };

    sendToken();
  }, []);

  return (
    <div className="login">
      <CircularProgress size={100} />
      <h1>Logging You In...</h1>
    </div>
  );
};

export default LoginCallback;
