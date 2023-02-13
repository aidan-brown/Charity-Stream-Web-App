import { Get } from './api';

const BASE = '/data/minecraft';

export const getAllMinecraftItems = async () => Get({ route: `${BASE}/all` });

export const getMinecraftItems = async () => Get({ route: `${BASE}/items` });

export const getMinecraftMobs = async () => Get({ route: `${BASE}/mobs` });

export const getMinecraftEffects = async () => Get({ route: `${BASE}/effects` });
