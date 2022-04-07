require('dotenv').config();
const express = require('express');
const cors = require('cors');
const cron = require('node-cron');
const {
  createPlayers,
  deletePlayer,
  disableElements,
  dynmapGetPlayerIcon,
  getCheckoutStatus,
  getMinecraftData,
  getPlayers,
  getPriceOverrides,
  runRconCommands,
  verifyCart,
  verifyDonation,
  disableCheckout,
  createPriceOverrides,
} = require('./handlers');
const { getImages } = require('./images');
const { basicAuth } = require('./handlers/authentication');
const { testConnection } = require('./sql');
const { createTables } = require('./sql/models');
const { rcon, logger } = require('./utils');
const { dynmapGetData } = require('./handlers/dynmap');

const app = express();
const port = 8080;

app.use(cors());
app.use(express.json());

// Routes that do not require auth
app.get('/minecraft/:type', getMinecraftData);
app.get('/players', getPlayers);
app.get('/images/:type/:image', getImages);
app.get('/checkout/status', getCheckoutStatus);
app.get('/price-overrides', getPriceOverrides);
app.post('/verify-checkout', verifyCart);
app.post('/verify-donation', verifyDonation);
app.get('/dynmap/icons/:playerName', dynmapGetPlayerIcon);
app.get('/dynmap/data', dynmapGetData);

// This tells node to use auth for the routes below here
app.use(basicAuth);

// Everything below this point requires auth
app.put('/price-overrides', createPriceOverrides);
app.put('/disable', disableElements);
app.put('/disable/checkout', disableCheckout);
app.post('/players', createPlayers);
app.delete('/players/:username', deletePlayer);
app.post('/run-commands', runRconCommands);
app.get('/', (_, res) => res.status(200).send('Success'));

app.listen(port, async () => {
  // Test SQL connection, we can't run if this fails
  await testConnection();
  const { Log, Command } = await createTables();

  // Schedule cron job to process rcon commands every 2 seconds
  cron.schedule(`*/${process.env.CRON_TIME || 2} * * * * *`, rcon(Command));

  logger.setLogTable(Log);
  logger.log('START', `Listening on port ${port}`);
});
