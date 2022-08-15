import {
  Delete, Get, Post, Put,
} from './api';

export const getAnalytics = async (filter) => Get(`/analytics?${filter}`, true);

export const getQuickCommands = async () => {
  const commandJson = await Get('/quick-commands', true);

  return commandJson.map((command) => ({
    ...command,
    commands: JSON.parse(command.commands),
    variables: JSON.parse(command.variables),
  }));
};

export const saveQuickCommands = async (quickCommands) => Put('/quick-commands', true, quickCommands);

export const deleteQuickCommand = async (id) => Delete(`/quick-commands/${id}`, true);

export const runCommands = async (commandsToRun) => Post('/run-commands', commandsToRun, true);

export const pricesOverride = async (prices) => Put('/price-overrides', true, prices);

export const disableItem = async (items) => Put('/disable', true, items);

export const checkoutDisable = async (status) => Put('/disable/checkout', true, { status });

export const getPlayers = async () => Get('/players');

export const createNewPlayers = async (players) => {
  const { errors, newPlayers: nps } = await Post('/players', true, players);

  return {
    errors,
    nps,
  };
};

export const deletePlayer = async (username) => Delete(`/players/${username}`, true);
