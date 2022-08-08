import {
  getReq, getUrl, putReq, deleteReq,
} from '../../../Utils';

export const getAnalytics = async (filter) => {
  const response = await getReq(`${getUrl()}/analytics?${filter}`);

  if (response.status < 300) {
    return response.json();
  }

  return null;
};

export const getPlayers = async () => {
  const response = await getReq(`${getUrl()}/players`);

  if (response.status < 300) {
    return response.json();
  }
  return [];
};

export const getQuickCommands = async () => {
  const response = await getReq(`${getUrl()}/quick-commands`);

  if (response.status < 300) {
    const commandJson = await response.json();

    return commandJson.map((command) => ({
      ...command,
      commands: JSON.parse(command.commands),
      variables: JSON.parse(command.variables),
    }));
  }

  return null;
};

export const saveQuickCommands = async (body) => {
  const response = await putReq(`${getUrl()}/quick-commands`, JSON.stringify(body));

  if (response.status < 300) {
    return response.json();
  }

  return null;
};

export const deleteQuickCommand = async (id) => {
  const response = await deleteReq(`${getUrl()}/quick-commands/${id}`);

  if (response.status < 300) {
    return true;
  }

  return false;
};

export const runCommands = async (commandsToRun) => {
  const response = await getReq(`${getUrl()}/run-commands`, commandsToRun);

  if (response.status < 300) {
    return true;
  }
  return false;
};
