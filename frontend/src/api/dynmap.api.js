import { Get } from './api';

const getDynmapData = async () => {
  const { players } = await Get({ route: '/dynmap/data' });

  const playerData = {};
  players.forEach(({ account, health, armor }) => {
    playerData[account] = {
      health,
      armor,
    };
  });

  return playerData;
};

export default getDynmapData;
