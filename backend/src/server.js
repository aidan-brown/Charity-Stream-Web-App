require('dotenv').config();
const express = require('express');
const cors = require('cors');
const cron = require('node-cron');
const passport = require('passport');
const cookieParser = require('cookie-parser');
const {
  createPlayers,
  deletePlayer,
  disableElements,
  dynmapGetPlayerIcon,
  getAnalytics,
  getCheckoutStatus,
  getMinecraftData,
  getPlayers,
  getPriceOverrides,
  runRconCommands,
  verifyCheckout,
  verifyDonation,
  disableCheckout,
  createPriceOverrides,
  getQuickCommands,
  createOrUpdateQuickCommand,
  deleteQuickCommand,
  oauth,
  tokenRefresh,
  getAccount,
  logout,
} = require('./handlers');
const { getImages } = require('./images');
const { testConnection } = require('./sql');
const { createTables } = require('./sql/models');
const {
  logger,
  rcon,
  setLogTable,
  setCommandTable,
  getUrl,
} = require('./utils');
const { dynmapGetData } = require('./handlers/dynmap');
const {
  verifyRole,
  setAccountTable,
} = require('./utils/verifyRole');
const { ROLES } = require('./constants');

require('./utils/passportConfig')(passport);

const app = express()
  .use(cors({
    origin: getUrl(),
    methods: ['GET', 'PUT', 'POST', 'DELETE'],
    optionsSuccessStatus: 204,
    credentials: true,
  }))
  .use(express.json())
  .use(cookieParser());

// ***** Routes to handle Authentication *****
app.post('/:oauthService/auth', oauth);
app.post('/token/refresh', tokenRefresh);
app.post('/logout', logout);

// ***** Basic routes for data retrieval *****
app.get('/checkout/status', getCheckoutStatus);
app.get('/dynmap/icons/:playerName', dynmapGetPlayerIcon);
app.get('/dynmap/data', dynmapGetData);
app.get('/images/:type/:image', getImages);
app.get('/minecraft/:type', getMinecraftData);
app.get('/players', getPlayers);
app.get('/price-overrides', getPriceOverrides);

// ***** Routes that require an account
app.get(
  '/account',
  passport.authenticate('jwt', { session: false }),
  getAccount,
);

app.post(
  '/verify-checkout',
  passport.authenticate('jwt', { session: false }),
  verifyCheckout,
);
app.post(
  '/verify-donation',
  passport.authenticate('jwt', { session: false }),
  verifyDonation,
);

// ***** Routes that require an ADMIN account
app.get(
  '/analytics',
  passport.authenticate('jwt', { session: false }),
  verifyRole(ROLES.ADMIN),
  getAnalytics,
);

app.get(
  '/quick-commands',
  passport.authenticate('jwt', { session: false }),
  verifyRole(ROLES.ADMIN),
  getQuickCommands,
);

app.put(
  '/quick-commands',
  passport.authenticate('jwt', { session: false }),
  verifyRole(ROLES.ADMIN),
  createOrUpdateQuickCommand,
);

app.delete(
  '/quick-commands/:commandId',
  passport.authenticate('jwt', { session: false }),
  verifyRole(ROLES.ADMIN),
  deleteQuickCommand,
);

app.put(
  '/price-overrides',
  passport.authenticate('jwt', { session: false }),
  verifyRole(ROLES.ADMIN),
  createPriceOverrides,
);

app.put(
  '/disable',
  passport.authenticate('jwt', { session: false }),
  verifyRole(ROLES.ADMIN),
  disableElements,
);

app.put(
  '/disable/checkout',
  passport.authenticate('jwt', { session: false }),
  verifyRole(ROLES.ADMIN),
  disableCheckout,
);

app.post(
  '/players',
  passport.authenticate('jwt', { session: false }),
  verifyRole(ROLES.ADMIN),
  createPlayers,
);

app.delete(
  '/players/:username',
  passport.authenticate('jwt', { session: false }),
  verifyRole(ROLES.ADMIN),
  deletePlayer,
);

app.post(
  '/run-commands',
  passport.authenticate('jwt', { session: false }),
  verifyRole(ROLES.ADMIN),
  runRconCommands,
);

// The port that the webserver will be listening on (default 8080)
const PORT = process.env.APP_PORT || 8080;

// Start the app
app.listen(PORT, async () => {
  // Test SQL connection, we can't run if this fails
  await testConnection();
  const { Log, Command, Account } = await createTables();

  // Dependency Inject tables that are required on launch
  setLogTable(Log);
  setCommandTable(Command);
  setAccountTable(Account);

  // Schedule cron job to process rcon commands every 2 seconds
  cron.schedule(`*/${process.env.CRON_TIME || 2} * * * * *`, rcon);

  // Log the start of the server
  logger.log('START', `Listening on port ${PORT}`);
});
