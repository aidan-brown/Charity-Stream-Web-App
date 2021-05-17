/* eslint-disable no-console */
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
  disableCheckout,
  disableElement,
} = require('./handlers');
const { getImages } = require('./images');

const app = express();
const port = 8000;

app.use(express.json());
app.use(cors());

app.put('/disable/:type/:id', disableElement);
app.put('/disable', disableCheckout);
app.post('/create/items', createItems);
app.post('/create/players', createPlayer);
app.post('/create/effects', createEffects);
app.post('/create/mobs', createMobs);
app.get('/items', getItems);
app.get('/players', getPlayers);
app.get('/effects', getEffects);
app.get('/mobs', getMobs);
app.get('/images/:type/:image', getImages);

app.listen(port, console.log(`Listening on port at http://localhost:${port}`));
