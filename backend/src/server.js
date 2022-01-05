require('dotenv').config();
const express = require('express');
const cors = require('cors');
const {
  createItems,
  createPlayer,
  createEffects,
  createMobs,
  getItems,
  getPlayers,
  getEffects,
  getMobs,
  getCheckoutStatus,
  disableCheckout,
  disableElement,
  dataCallback,
  getData,
} = require('./handlers');
const { getImages } = require('./images');
const { basicAuth } = require('./handlers/authentication');

const app = express();
const port = 8000;

app.use(express.json());
app.use(cors());

// Routes that do not require auth
app.get('/items', getItems);
app.get('/players', getPlayers);
app.get('/effects', getEffects);
app.get('/data', getData);
app.get('/mobs', getMobs);
app.get('/images/:type/:image', getImages);
app.get('/checkout/status', getCheckoutStatus);

// This tells node to use auth for the routes below here
app.use(basicAuth);

// Everything below this point should require auth
app.put('/disable/:type/:id', disableElement);
app.put('/disable', disableCheckout);
app.post('/create/items', createItems);
app.post('/create/players', createPlayer);
app.post('/create/effects', createEffects);
app.post('/create/mobs', createMobs);
app.post('/data-callback', dataCallback);

// eslint-disable-next-line no-console
app.listen(port, console.log(`Listening on port at http://localhost:${port}`));
