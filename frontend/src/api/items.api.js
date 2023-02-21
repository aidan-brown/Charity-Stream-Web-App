import { Get } from './api';

const BASE = '/data/minecraft';

const getMinecraftData = async (filterTag) => Get({ route: `${BASE}?filterTag=${filterTag}` });

export default getMinecraftData;
