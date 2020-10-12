/* eslint-disable no-console */
const express = require('express');
const cors = require('cors');
const {
  createItems, createPlayer, getItems, getPlayers,
} = require('./handlers');

const app = express();
const port = 8000;

app.use(express.json());
app.use(cors());

app.post('/create/items', createItems);
app.post('/create/players', createPlayer);
app.get('/items', getItems);
app.get('/players', getPlayers);

app.listen(port, console.log(`Listening on port at http://localhost:${port}`));
