import express, { RequestHandler } from 'express';
import cors from 'cors';
import cron from 'node-cron';
import passport from 'passport';
import cookieParser from 'cookie-parser';
import dotenv from 'dotenv';
import {
  getAccount,
  getAnalytics,
  getCheckoutStatus,
  disableCheckout,
  disableElements,
  dynmapGetData,
  dynmapGetPlayerIcon,
  getPriceOverrides,
  createPriceOverrides,
  getPlayers,
  createPlayers,
  deletePlayer,
  getQuickCommands,
  createOrUpdateQuickCommand,
  deleteQuickCommand,
  runRconCommands,
  logout,
  oauth,
  tokenRefresh
} from './handlers';
import {
  logger,
  rcon,
  getUrl,
  passportConfig,
  verifyRole
} from './utils';
import { Role } from './db/models/account';
import dbInit from './db/init';
import { testConnection } from './db/testConnection';

// Inject env vars
dotenv.config();

// Setup token authentication
passportConfig(passport);

// Create the express application
const app = express();

// Add CORS to the app for allowing credentials
app.use(
  cors({
    origin: getUrl(),
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
app.get('/checkout/status', getCheckoutStatus as RequestHandler);
app.get('/dynmap/icons/:playerName', dynmapGetPlayerIcon as RequestHandler);
app.get('/dynmap/data', dynmapGetData as RequestHandler);
// app.get('/images/:type/:image', getImages as RequestHandler)
// app.get('/minecraft/:type', getMinecraftData as RequestHandler)
app.get('/players', getPlayers as RequestHandler);
app.get('/price-overrides', getPriceOverrides as RequestHandler);

// ***** Routes that require an account
app.get(
  '/account',
  passport.authenticate('jwt'),
  getAccount as RequestHandler
);

// app.post(
//   '/verify-checkout',
//   passport.authenticate('jwt'),
//   verifyCheckout as RequestHandler
// )
// app.post(
//   '/verify-donation',
//   passport.authenticate('jwt'),
//   verifyDonation as RequestHandler
// )

// ***** Routes that require an ADMIN account
app.get(
  '/analytics',
  passport.authenticate('jwt'),
  verifyRole(Role.ADMIN),
  getAnalytics as RequestHandler
);

app.get(
  '/quick-commands',
  passport.authenticate('jwt'),
  verifyRole(Role.ADMIN),
  getQuickCommands as RequestHandler
);

app.put(
  '/quick-commands',
  passport.authenticate('jwt'),
  verifyRole(Role.ADMIN),
  createOrUpdateQuickCommand
);

app.delete(
  '/quick-commands/:commandId',
  passport.authenticate('jwt'),
  verifyRole(Role.ADMIN),
  deleteQuickCommand
);

app.put(
  '/price-overrides',
  passport.authenticate('jwt'),
  verifyRole(Role.ADMIN),
  createPriceOverrides
);

app.put(
  '/disable',
  passport.authenticate('jwt'),
  verifyRole(Role.ADMIN),
  disableElements
);

app.put(
  '/disable/checkout',
  passport.authenticate('jwt'),
  verifyRole(Role.ADMIN),
  disableCheckout
);

app.post(
  '/players',
  passport.authenticate('jwt'),
  verifyRole(Role.ADMIN),
  createPlayers
);

app.delete(
  '/players/:username',
  passport.authenticate('jwt'),
  verifyRole(Role.ADMIN),
  deletePlayer
);

app.post(
  '/run-commands',
  passport.authenticate('jwt'),
  verifyRole(Role.ADMIN),
  runRconCommands
);

// The port that the webserver will be listening on (default 8080)
const PORT = process.env.APP_PORT ?? 8080;

// Start the app
app.listen(PORT, () => {
  // Test SQL connection, we can't run if this fails
  testConnection()
    .then(() => {
      dbInit()
        .then(() => {
          // Schedule cron job to process rcon commands every 2 seconds
          cron.schedule(
            `*/${process.env.CRON_TIME ?? 2} * * * * *`,
            (now: Date) => {
              void rcon(now);
            }
          );

          // Log the start of the server
          void logger.log('START', `Listening on port ${PORT}`);
        })
        .catch(err => {
          // eslint-disable-next-line no-console
          console.log('Error creating tables', err);
        });
    })
    .catch(err => {
      // eslint-disable-next-line no-console
      console.log('Could not connect to the db to test connection', err);
    });
});
