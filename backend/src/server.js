require('dotenv').config();
const express = require('express');
const cors = require('cors');
const {
  createCheckout,
  createPlayer,
  disableCheckout,
  disableElement,
  dataCallback,
  getData,
  getMinecraftData,
  getPlayers,
  hook,
} = require('./handlers');
const { getImages } = require('./images');
const { basicAuth } = require('./handlers/authentication');

const app = express();
const port = 8080;

app.post('/hook', express.raw({ type: 'application/json' }), hook);
app.use(cors());
app.use(express.json());

// Routes that do not require auth
app.get('/minecraft/:type', getMinecraftData);
app.get('/players', getPlayers);
app.get('/data', getData);
app.get('/images/:type/:image', getImages);
app.get('/checkout/status', (_, res) => res.status(200).send(false));
app.post('/checkout', createCheckout);

// This tells node to use auth for the routes below here
app.use(basicAuth);

// Everything below this point should require auth
app.put('/disable/:type/:id', disableElement);
app.put('/disable', disableCheckout);
app.post('/players', createPlayer);
app.post('/data-callback', dataCallback);

// eslint-disable-next-line no-console
app.listen(port, console.log(`Listening on port at http://localhost:${port}`));
