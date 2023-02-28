import {
  Delete, Get, Post, Put,
} from './api';

export const getAnalytics = async (filter) => Get({
  route: `/analytics?${filter}`,
});

export const getQuickCommands = async () => {
  const commandJson = await Get({
    route: '/quick-commands',
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
});

export const deleteQuickCommand = async (id) => Delete({
  route: `/quick-commands/${id}`,
});

export const runCommands = async (commandsToRun) => Post({
  route: '/run-commands',
  body: commandsToRun,
});

export const pricesOverride = async (prices) => Put({
  route: '/price-overrides',
  body: prices,
});

export const disableItem = async (items) => Put({
  route: '/disable',
  body: items,
});
