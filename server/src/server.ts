import express, { RequestHandler } from 'express';
import cors from 'cors';
import cron from 'node-cron';
import passport from 'passport';
import cookieParser from 'cookie-parser';
import cookieSession from 'cookie-session';
import path from 'path';
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
  getMinecraftData,
  jwtMiddleware
} from './handlers';
import {
  logger,
  rcon,
  getUrl,
  verifyRole
} from './utils';
import { Role } from './db/models/account';
import dbInit from './db/init';
import { testConnection } from './db/testConnection';
import './config/passportSetup';

dotenv.config();

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

app.use(
  cookieSession({
    name: 'session',
    keys: [process.env.COOKIE_KEY ?? 'cookieKey'],
    maxAge: 24 * 60 * 60 * 7
  })
);

// Allow json to be sent to the app
app.use(express.json());

// Add cookie parser for handling token auth
app.use(cookieParser());

// Add passport
app.use(passport.initialize());
app.use(passport.session());

// ***** Routes to handle Authentication *****
app.post('/api/logout', logout as RequestHandler);

// Google auth routes
app.get(
  '/api/auth/google',
  passport.authenticate('google', { scope: ['email', 'profile'] })
);
app.get(
  '/api/auth/google/callback',
  passport.authenticate('google', { session: false }),
  jwtMiddleware as RequestHandler
);

// Microsoft auth routes
app.get(
  '/api/auth/microsoft',
  passport.authenticate('microsoft')
);
app.get(
  '/api/auth/microsoft/callback',
  passport.authenticate('microsoft', { session: false }),
  jwtMiddleware as RequestHandler
);

// ***** Basic routes for data retrieval *****
app.get('/api/checkout/status', (_, res) => res.status(200));
app.get('/api/data/dynmap/icons/:playerName', dynmapGetPlayerIcon as RequestHandler);
app.get('/api/data/dynmap', dynmapGetData as RequestHandler);
app.get('/api/data/minecraft', getMinecraftData as RequestHandler);
app.get('/api/players', getPlayers as RequestHandler);
app.get('/api/items', getItems as RequestHandler);

// ***** Routes that require an account
app.get(
  '/api/account',
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
  '/api/analytics',
  passport.authenticate('jwt', { session: false }),
  verifyRole(Role.ADMIN) as RequestHandler,
  getAnalytics as RequestHandler
);

app.get(
  '/api/quick-commands',
  passport.authenticate('jwt', { session: false }),
  verifyRole(Role.ADMIN) as RequestHandler,
  getQuickCommands as RequestHandler
);

app.put(
  '/api/quick-commands',
  passport.authenticate('jwt', { session: false }),
  verifyRole(Role.ADMIN) as RequestHandler,
  createOrUpdateQuickCommand as RequestHandler
);

app.delete(
  '/api/quick-commands/:commandId',
  passport.authenticate('jwt', { session: false }),
  verifyRole(Role.ADMIN) as RequestHandler,
  deleteQuickCommand as RequestHandler
);

app.put(
  '/api/items',
  passport.authenticate('jwt', { session: false }),
  verifyRole(Role.ADMIN) as RequestHandler,
  updateItems as RequestHandler
);

// app.put(
//   '/api/disable/checkout',
//   passport.authenticate('jwt', { session: false }),
//   verifyRole(Role.ADMIN),
//   disableCheckout
// );

app.post(
  '/api/players',
  passport.authenticate('jwt', { session: false }),
  verifyRole(Role.ADMIN) as RequestHandler,
  createPlayers as RequestHandler
);

app.delete(
  '/api/players/:username',
  passport.authenticate('jwt', { session: false }),
  verifyRole(Role.ADMIN) as RequestHandler,
  deletePlayer as RequestHandler
);

app.post(
  '/api/run-commands',
  passport.authenticate('jwt', { session: false }),
  verifyRole(Role.ADMIN) as RequestHandler,
  runRconCommands as RequestHandler
);

// Catchall for all other not found api routes
app.use('/api*', (_, res) => {
  res.status(404).send('Requested route does not exist');
});

// Serving the client in non-local environments
if (process.env.NODE_ENV === 'production' || process.env.NODE_ENV === 'develop') {
  app.use(express.static(path.join(__dirname, '..', '..', 'client', 'dist')));
  app.use(express.static(path.join(__dirname, '..', '..', 'client', 'public')));
  app.use('*', (_, res) => {
    res.sendFile(
      path.join(__dirname, '..', '..', 'client', 'dist', 'index.html')
    );
  });
}

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
        (now: (Date | 'init' | 'manual')) => {
          if (now instanceof Date) {
            void rcon(now);
          }
        }
      );

      // Log the start of the server
      void logger.log('START', `Listening on port ${PORT}`);
    } catch (error) {
      void logger.log('FAILED_TO_START', 'Failed to start server', { error });
    }
  })();
});
