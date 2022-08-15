import { Get } from './api';

export const getAllMinecraftItems = async () => Get({ route: '/minecraft/all' });

export const getMinecraftItems = async () => Get({ route: '/minecraft/items' });

export const getMinecraftMobs = async () => Get({ route: '/minecraft/mobs' });

export const getMinecraftEffects = async () => Get({ route: '/minecraft/effects' });
