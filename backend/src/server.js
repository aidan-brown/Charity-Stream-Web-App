require('dotenv').config();
const express = require('express');
const cors = require('cors');
const cron = require('node-cron');
const passport = require('passport');
const session = require('express-session');
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
  google,
  tokenRefresh,
  getAccount,
} = require('./handlers');
const { getImages } = require('./images');
const { testConnection } = require('./sql');
const { createTables } = require('./sql/models');
const {
  rcon, logger, setLogTable, setCommandTable,
} = require('./utils');
const { dynmapGetData } = require('./handlers/dynmap');
const {
  verifyRole, Roles, setAccountTable,
} = require('./utils/auth');

require('./utils/passportConfig')(passport);

const app = express()
  .use(cors({
    origin: 'http://localhost:3000',
    methods: ['GET', 'PUT', 'POST', 'DELETE'],
    optionsSuccessStatus: 204,
    credentials: true,
  }))
  .use(express.json())
  .use(cookieParser())
  .use(
    session({
      secret: 'secret', // TODO: Make this a real secret (or possibly remove it)
      resave: false,
      saveUninitialized: true,
      cookie: {
        secure: process.env.DEPLOYMENT_ENV === 'production',
        httpOnly: true,
      },
    }),
  );

// ***** Routes to handle Authentication *****
app.post('/google/auth', google);
app.get('/token/refresh', tokenRefresh);

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
  verifyRole(Roles.ADMIN),
  getAnalytics,
);

app.get(
  '/quick-commands',
  passport.authenticate('jwt', { session: false }),
  verifyRole(Roles.ADMIN),
  getQuickCommands,
);

app.put(
  '/quick-commands',
  passport.authenticate('jwt', { session: false }),
  verifyRole(Roles.ADMIN),
  createOrUpdateQuickCommand,
);

app.delete(
  '/quick-commands/:commandId',
  passport.authenticate('jwt', { session: false }),
  verifyRole(Roles.ADMIN),
  deleteQuickCommand,
);

app.put(
  '/price-overrides',
  passport.authenticate('jwt', { session: false }),
  verifyRole(Roles.ADMIN),
  createPriceOverrides,
);

app.put(
  '/disable',
  passport.authenticate('jwt', { session: false }),
  verifyRole(Roles.ADMIN),
  disableElements,
);

app.put(
  '/disable/checkout',
  passport.authenticate('jwt', { session: false }),
  verifyRole(Roles.ADMIN),
  disableCheckout,
);

app.post(
  '/players',
  passport.authenticate('jwt', { session: false }),
  verifyRole(Roles.ADMIN),
  createPlayers,
);

app.delete(
  '/players/:username',
  passport.authenticate('jwt', { session: false }),
  verifyRole(Roles.ADMIN),
  deletePlayer,
);

app.post(
  '/run-commands',
  passport.authenticate('jwt', { session: false }),
  verifyRole(Roles.ADMIN),
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
