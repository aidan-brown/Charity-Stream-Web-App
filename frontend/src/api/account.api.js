import { Get } from './api';

const getAccount = async () => Get({ route: '/account', shouldAuth: true });

export default getAccount;
