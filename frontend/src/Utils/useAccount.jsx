import { useQuery } from '@tanstack/react-query';
import getAccount from '../api/account.api';

const useAccount = () => {
  const { data: account, isLoading } = useQuery(
    ['account'],
    getAccount,
    {
      onSuccess: () => {
      },
      onError: () => {
      },
    },
  );

  return { account, isLoading };
};
export default useAccount;
