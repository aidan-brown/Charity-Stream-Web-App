require('dotenv').config();
const express = require('express');
const cors = require('cors');
const cron = require('node-cron');
const {
  createPlayer,
  disableElements,
  dataCallback,
  getData,
  getMinecraftData,
  getPlayers,
  verifyCart,
  verifyDonation,
} = require('./handlers');
const { getImages } = require('./images');
const { basicAuth } = require('./handlers/authentication');
const { testConnection } = require('./sql');
const { createTables } = require('./sql/models');
const rcon = require('./utils/rcon');

const app = express();
const port = 8080;

app.use(cors());
app.use(express.json());

// Routes that do not require auth
app.get('/minecraft/:type', getMinecraftData);
app.get('/players', getPlayers);
app.get('/data', getData);
app.get('/images/:type/:image', getImages);
app.get('/checkout/status', (_, res) => res.status(200).send(false));
app.post('/verify-checkout', verifyCart);
app.post('/verify-donation', verifyDonation);

// This tells node to use auth for the routes below here
app.use(basicAuth);

// Everything below this point should require auth
app.put('/disable', disableElements);
app.post('/players', createPlayer);
app.post('/data-callback', dataCallback);
app.get('/', (_, res) => res.send('Success').status(200));

// eslint-disable-next-line no-console
app.listen(port, async () => {
  // Test SQL connection, we can't run if this fails
  await testConnection();
  createTables();

  // Schedule cron job to process rcon commands every 5 seconds
  cron.schedule(`*/${process.env.CRON_TIME || 2} * * * * *`, rcon);

  // eslint-disable-next-line no-console
  console.log(`Listening on port ${port}`);
});
