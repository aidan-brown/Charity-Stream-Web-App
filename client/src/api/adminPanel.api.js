import {
  Delete, Get, Post, Put,
} from './api';

export const getAnalytics = async (filter) => Get({
  route: `/analytics?${filter}`,
  shouldAuth: true,
});

export const getQuickCommands = async () => {
  const commandJson = await Get({
    route: '/quick-commands',
    shouldAuth: true,
  });

  return commandJson.map((command) => ({
    ...command,
    commands: JSON.parse(command.commands),
    variables: JSON.parse(command.variables),
  }));
};

export const saveQuickCommands = async (quickCommands) => Put({
  route: '/quick-commands',
  body: quickCommands,
  shouldAuth: true,
});

export const deleteQuickCommand = async (id) => Delete({
  route: `/quick-commands/${id}`,
  shouldAuth: true,
});

export const runCommands = async (commandsToRun) => Post({
  route: '/run-commands',
  body: commandsToRun,
  shouldAuth: true,
});

export const pricesOverride = async (prices) => Put({
  route: '/price-overrides',
  body: prices,
  shouldAuth: true,
});

export const disableItem = async (items) => Put({
  route: '/disable',
  body: items,
  shouldAuth: true,
});
