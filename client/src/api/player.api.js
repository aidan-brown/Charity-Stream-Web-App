import {
  Delete, Get, Post,
} from './api';

export const getPlayers = async () => Get({ route: '/players' });

export const createNewPlayers = async (players) => {
  const { errors, newPlayers: nps } = await Post({
    route: '/players',
    body: players,
    shouldAuth: true,
  });

  return {
    errors,
    nps,
  };
};

export const deletePlayer = async (username) => Delete({
  route: `/players/${username}`,
  shouldAuth: true,
});
