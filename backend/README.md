# Minecraft Charity Stream Backend

The Minecraft Charity Stream backend is written in ES5 javascript (typescript coming soon) using NodeJS as the engine and Express as the API framework. The API connects to a MySQL DB to store data.

## Setup

This project uses nvm for node version management and nodemon to keep the local server running when code changes are made. This means, that once you run `npm start`, you do not have to keep re-running it when changes are made :)

The tools that are used are `NodeJS`, `NVM`, and `MySQL`. The setups for these can be found here:

- [`NodeJS`](https://nodejs.org)
- [`NVM`](https://github.com/nvm-sh/nvm#installing-and-updating)
- [`MySQL`](https://dev.mysql.com/doc/mysql-getting-started/en)

### Use correct version of node

```sh
nvm use
```

### Install all dependencies

```sh
npm install
```

### Environment Variables (check out the `.env-example` file)

Before running the project, you will need a MySQL DB to connect to with the following values in your `.env` file:

#### Database

You may need to get DB credentials from your friendly neighborhood RTP or install and setup MySQL locally.

```txt
DB_HOST=<%db-host%>      // This is the url of your DB. Ex: localhost
DB_NAME=<%db-name%>        // This is the name of the DB. Ex: mcsdb
DB_USERNAME=<%db-username%>  // This is the username of your DB. Ex: root
DB_PASSWORD=<%db-password%>  // This is the password of your DB. Ex: password
DB_DROP_TABLES=true        // This is an optional value to drop all tables when starting the server
```

#### Basic Auth

The basic auth credentials can be any username and password you will use to authenticate endpoints behind auth

```txt
AUTH_USERNAME=<%auth-username%>
AUTH_PASSWORD=<%auth-password%>
```

#### Minecraft Server

The minecraft server commands are run using RCON, and will need a Minecraft server to be able to run end points associated with RCON. You can also add a dynmap URL which is used for the frontend to display current user health, armor, and picture.

```txt
MC_SERVER_HOST=<%minecraft-server-hostname%>
MC_SERVER_RCON_PORT=<%server rcon port%>
MC_SERVER_RCON_PASSWORD=<%minecraft-server-rcon-password%>
MC_SERVER_DYNMAP=<%minecraft-server-dynmap-url%>
```

#### Just Giving API Credentials

To support donations and verify that they have gone through, we use [Just Giving](https://www.justgiving.com/). To acquire an auth key and app id, you can make a developer account [here](https://developer.justgiving.com/) to get that information.

```txt
JG_AUTH=<%just-giving-auth-token%>
JG_APPID=<%just-giving-app-id%>
```

#### RCON (optional)

This is an optional env var that controls how often the command table is queried to run commands against the minecraft server. This is a value in seconds and is defaulted to 2.

```txt
CRON_TIME=<%time in seconds%>
```

#### Current ENV (optional)

This is an optional env var that allows you to simulate what environment you are in. The options for it are: local, development, and production.

```txt
DEPLOYMENT_ENV=local
```

### Running the application

To start the application, all you need to do is run:

```sh
npm start
```

This will start the application at [http://localhost:8080](http://localhost:8080)

## Design Practices and Choices

Several practices have been developed and utilized throughout the history of this project, with the most notable talked about below.

### RCON Cron Job

One of the limiting factors with RCON is that it can only support so many concurrent connections. To solve this bottleneck, a cron job that runs every two seconds is utilized to grab and run the top 20 commands against the Minecraft server. This helps alleviate RCON crashing while someone is trying to checkout. There are several fail-safes in place that cause the commands to be stored in case of failure. These failed commands will be picked up and run by another cron instance.

### Sequelize

Sequelize is a handy MySQL framework that allows for auto creation and management of tables. It is currently setup to auto deleted and re-create all tables on local environment, which can sometimes make things a pain. To turn this off use the `DB_DROP_TABLES=true` env variable.

#### Adding a New Table

To add a new table, you will add a model file to the `src/sql/models` folder with the name of the table in camelCase

Example Table File: `example.js`

```js
const { DataTypes } = require('sequelize');
const { getConnection } = require('..');

const sequelize = getConnection();

const Example = sequelize.define('Example', {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },
});

module.exports = Example;
```

Then after this files is squared away, you add the table creation to the `src/sql/models/index.js` file.

```js
// Placed with the other imports
const Example = require('./example');

const createTables = async () => {
  // Placed anywhere the other syncs are
  await Example.sync({ alter, force });
}
```

Now the table will be created on app start up and can be used like so:

```js
const { Example } = require('../sql/models');

const examples = await Example.findAll();
```

If you want to do anything else with Sequelize, checkout the documentation [here](https://sequelize.org/)

### Handlers

To keep the `server.js` (the main entry point) file lean, a `handlers` directory holds all the functionality of the endpoints. The general structure for one of these files is like the following:

```js
const newEndpoint = (request, response) => {
  response.status(200).send('Hello World')
}
```

The two function parameters `(request, response)`are directly from Express's route definition.

## Future Work

- [x] Package Cleanup
- [ ] OAuth using Google or Custom system
  - [ ] Let Users make big donations and save that amount for future spending
  - [ ] Allowing multiple admin accounts, moving away from Basic Auth
- [ ] Checkout logic cleanup
- [ ] Typescript adoption / use ES6
