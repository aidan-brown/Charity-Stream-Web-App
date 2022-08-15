import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { postToken } from '../api';

const useLogin = () => {
  const { hash } = useLocation();
  const queryClient = useQueryClient();

  const { mutate: sendToken, isLoading, isError } = useMutation(async () => {
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
    }
  });

  useEffect(() => {
    sendToken();
  }, []);

  return { isLoading, isError };
};
export default useLogin;
