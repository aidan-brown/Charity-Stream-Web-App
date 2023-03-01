import { Request } from 'express';
import passport from 'passport';
import { Strategy as GoogleStrategy } from 'passport-google-oauth2';
import { Strategy as MicrosoftStrategy } from 'passport-microsoft';
import { Strategy as JwtStrategy } from 'passport-jwt';
import { Account } from '../db/models';
import { AccountInput, Service } from '../db/models/account';

export interface JWTUser {
  id: string
  service: string
}

// Helper function to find or create the given user
const findOrCreateUser = (newAccount: AccountInput, done: any): void => {
  // Find or create user
  void Account.findOrCreate({
    where: {
      id: newAccount.id
    },
    defaults: newAccount
  }).then(([account]) => {
    done(null, account);
  }).catch(err => {
    done(err, null);
  });
};

passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_AUTH_CLIENT_ID ?? '',
      clientSecret: process.env.GOOGLE_AUTH_SECRET ?? '',
      callbackURL: process.env.GOOGLE_AUTH_CALLBACK_URL ?? '',
      passReqToCallback: true
    },
    (_req: any, _accessToken: any, _refreshToken: any, profile: any, done: any) => {
      const { _json: googleUser } = profile;

      findOrCreateUser(
        {
          id: `${Service.GOOGLE}::${String(googleUser.email)}`,
          email: googleUser.email,
          name: googleUser.name,
          service: Service.GOOGLE,
          picture: googleUser.picture,
          locale: googleUser.locale
        },
        done
      );
    }
  )
);

passport.use(
  new MicrosoftStrategy(
    {
      clientID: process.env.MICROSOFT_AUTH_CLIENT_ID ?? '',
      clientSecret: process.env.MICROSOFT_AUTH_SECRET ?? '',
      callbackURL: process.env.MICROSOFT_AUTH_CALLBACK_URL ?? '',
      scope: ['user.read'],
      tenant: 'common'
    },
    function (_accessToken: string, _refreshToken: string, profile: any, done: any) {
      const { emails, _json: microsoftUser } = profile;
      const [{ value }] = emails;

      const email = (value as string) !== '' ? value : microsoftUser.userPrincipalName;

      findOrCreateUser(
        {
          id: `${Service.MICROSOFT}::${String(email)}`,
          email,
          name: microsoftUser.displayName,
          service: Service.MICROSOFT
        },
        done
      );
    }
  )
);

// Decoding jwt from authenticating with one of the above applications
passport.use(
  new JwtStrategy(
    {
      jwtFromRequest: (req: Request) => req.cookies.token,
      secretOrKey: process.env.JWT_SECRET_KEY
    },
    (jwtPayload, done) => {
      const { user = {} } = jwtPayload;
      const { id, service } = user as JWTUser;

      Account.findOne({ where: { id, service } }).then(account => {
        done(null, account ?? false);
      }).catch(err => {
        done(err, false);
      });
    }
  )
);
