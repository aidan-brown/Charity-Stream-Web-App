import { useState, useEffect } from 'react';
import getAccount from '../api/account.api';
import refreshToken from '../api/token.api';

const useAccount = () => {
  const [account, setAccount] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const getUserAccount = async () => {
      if (await refreshToken()) {
        const userAccount = await getAccount();

        if (userAccount) {
          setAccount(userAccount);
        }

        setIsLoading(false);
      } else {
        setIsLoading(false);
      }
    };

    getUserAccount();
  }, []);

  return { account, isLoading };
};
export default useAccount;
