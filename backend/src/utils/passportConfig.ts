import { PassportStatic } from 'passport';
import { Strategy as JwtStrategy, ExtractJwt } from 'passport-jwt';

export interface JWTUser {
  id: string
  service: string
}

export default function passportConfig (passport: PassportStatic): void {
  passport.use(
    new JwtStrategy(
      {
        jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
        secretOrKey: process.env.JWT_SECRET_KEY
      },
      (jwtPayload: JWTUser, done) => {
        try {
          const { id, service } = jwtPayload;

          done(null, { id, service });
        } catch (error) {
          done(error, false);
        }
      }
    )
  );
}
