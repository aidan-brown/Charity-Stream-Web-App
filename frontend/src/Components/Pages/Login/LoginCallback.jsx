import { CircularProgress } from '@mui/material';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import React, { useEffect, useState } from 'react';
import {
  useLocation, useNavigate,
} from 'react-router-dom';
import { postToken } from '../../../api';
import './Login.scss';

// TODO: Address react memory leak in here
const LoginCallback = () => {
  const { hash } = useLocation();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [loading, setLoading] = useState(true);

  const { mutate: sendToken } = useMutation(async () => {
    const urlParams = {};
    hash.split('&').forEach((param) => {
      const [key, value] = param.split('=');
      urlParams[key] = value;
    });

    const { access_token: accessToken } = urlParams;

    if (accessToken) {
      const { account, expires } = await postToken(accessToken);

      // Save email for reauth and when the token expires
      localStorage.setItem('mcs-auth-email', account.email);
      localStorage.setItem('mcs-auth-expires', expires);

      queryClient.invalidateQueries(['account']);
      setLoading(false);
    }
  });

  useEffect(() => {
    sendToken();
  }, []);

  useEffect(() => {
    if (!loading) {
      navigate('/store', { replace: true });
    }
  }, [loading]);

  return (
    <div className="login">
      <CircularProgress size={100} />
      <h1>Logging You In...</h1>
    </div>
  );
};

export default LoginCallback;
