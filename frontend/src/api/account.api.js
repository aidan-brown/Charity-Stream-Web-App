import { Get } from './api';

const getAccount = async () => Get('/account', true);

export default getAccount;
