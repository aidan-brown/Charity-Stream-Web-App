import { useQuery } from '@tanstack/react-query';
import { getAccount } from '../api';

const useAccount = () => {
  const { data: account, isLoading } = useQuery(
    ['account'],
    getAccount,
    {
      staleTime: Infinity,
    },
  );

  return { account, isLoading };
};
export default useAccount;
