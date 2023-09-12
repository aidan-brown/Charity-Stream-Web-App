import express, { RequestHandler } from 'express';
import cors from 'cors';
import cron from 'node-cron';
import passport from 'passport';
import cookieParser from 'cookie-parser';
import dotenv from 'dotenv';
import {
  getAccount,
  getAnalytics,
  // getCheckoutStatus,
  // disableCheckout,
  dynmapGetData,
  dynmapGetPlayerIcon,
  getItems,
  updateItems,
  getPlayers,
  createPlayers,
  deletePlayer,
  getQuickCommands,
  createOrUpdateQuickCommand,
  deleteQuickCommand,
  runRconCommands,
  logout,
  oauth,
  tokenRefresh,
  getMinecraftData
} from './handlers';
import {
  logger,
  rcon,
  passportConfig,
  verifyRole
} from './utils';
import { Role } from './db/models/account';
import dbInit from './db/init';
import { testConnection } from './db/testConnection';
import getImages from './images';

// Inject env vars
dotenv.config();

// Setup token authentication
passportConfig(passport);

// Create the express application
const app = express();

// Add CORS to the app for allowing credentials
app.use(
  cors({
    origin: [
      'amphitvw.azurewebsites.net',
      'https://develop-charitystream.cs.house',
      'http://localhost:3000'
    ],
    methods: ['GET', 'PUT', 'POST', 'DELETE'],
    optionsSuccessStatus: 204,
    credentials: true
  })
);

// Allow json to be sent to the app
app.use(express.json());

// Add cookie parser for handling token auth
app.use(cookieParser());

// ***** Routes to handle Authentication *****
app.post('/:oauthService/auth', oauth as RequestHandler);
app.post('/token/refresh', tokenRefresh as RequestHandler);
app.post('/logout', logout as RequestHandler);

// ***** Basic routes for data retrieval *****
app.get('/checkout/status', (_, res) => res.status(200));
app.get('/data/dynmap/icons/:playerName', dynmapGetPlayerIcon as RequestHandler);
app.get('/data/dynmap', dynmapGetData as RequestHandler);
app.get('/data/minecraft', getMinecraftData as RequestHandler);
app.get('/images/:type/:image', getImages as RequestHandler);
app.get('/players', getPlayers as RequestHandler);
app.get('/items', getItems as RequestHandler);

// ***** Routes that require an account
app.get(
  '/account',
  passport.authenticate('jwt', { session: false }),
  getAccount as RequestHandler
);

// app.post(
//   '/verify-checkout',
//   passport.authenticate('jwt', { session: false }),
//   verifyCheckout as RequestHandler
// )
// app.post(
//   '/verify-donation',
//   passport.authenticate('jwt', { session: false }),
//   verifyDonation as RequestHandler
// )

// ***** Routes that require an ADMIN account
app.get(
  '/analytics',
  passport.authenticate('jwt', { session: false }),
  verifyRole(Role.ADMIN),
  getAnalytics as RequestHandler
);

app.get(
  '/quick-commands',
  passport.authenticate('jwt', { session: false }),
  verifyRole(Role.ADMIN),
  getQuickCommands as RequestHandler
);

app.put(
  '/quick-commands',
  passport.authenticate('jwt', { session: false }),
  verifyRole(Role.ADMIN),
  createOrUpdateQuickCommand
);

app.delete(
  '/quick-commands/:commandId',
  passport.authenticate('jwt', { session: false }),
  verifyRole(Role.ADMIN),
  deleteQuickCommand
);

app.put(
  '/items',
  passport.authenticate('jwt', { session: false }),
  verifyRole(Role.ADMIN),
  updateItems
);

// app.put(
//   '/disable/checkout',
//   passport.authenticate('jwt', { session: false }),
//   verifyRole(Role.ADMIN),
//   disableCheckout
// );

app.post(
  '/players',
  passport.authenticate('jwt', { session: false }),
  verifyRole(Role.ADMIN),
  createPlayers
);

app.delete(
  '/players/:username',
  passport.authenticate('jwt', { session: false }),
  verifyRole(Role.ADMIN),
  deletePlayer
);

app.post(
  '/run-commands',
  passport.authenticate('jwt', { session: false }),
  verifyRole(Role.ADMIN),
  runRconCommands
);

// The port that the webserver will be listening on (default 8080)
const PORT = process.env.APP_PORT ?? 8080;

// Start the app
app.listen(PORT, () => {
  void (async () => {
    try {
      // Test SQL connection, we can't run if this fails
      await testConnection();

      // Init all the tables in the db
      await dbInit();

      // Schedule cron job to process rcon commands every 2 seconds
      cron.schedule(
        `*/${process.env.CRON_TIME ?? 2} * * * * *`,
        (now: Date) => {
          void rcon(now);
        }
      );

      // Log the start of the server
      void logger.log('START', `Listening on port ${PORT}`);
    } catch (error) {
      void logger.log('FAILED_TO_START', 'Failed to start server', { error });
    }
  })();
});
