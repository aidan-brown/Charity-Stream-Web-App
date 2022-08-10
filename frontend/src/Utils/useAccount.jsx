import { useQuery } from '@tanstack/react-query';
import getAccount from '../api/account.api';
import { refreshToken } from '../api/token.api';

const useAccount = () => {
  const { data: account, isLoading } = useQuery(
    ['account'],
    async () => {
      if (await refreshToken()) {
        return getAccount();
      }
      return null;
    },
  );

  return { account, isLoading };
};
export default useAccount;
