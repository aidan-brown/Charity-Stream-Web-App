import { useQuery } from '@tanstack/react-query';
import { getAccount } from '../api';

const useAccount = () => {
  const { data: account, isLoading, isError } = useQuery({
    queryKey: ['account'],
    queryFn: () => getAccount(),
  });

  return { account, isLoading, isError };
};
export default useAccount;
