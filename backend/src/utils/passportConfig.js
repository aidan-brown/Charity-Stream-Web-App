const { Strategy: JwtStrategy, ExtractJwt } = require('passport-jwt');

module.exports = (passport) => {
  passport.use(
    new JwtStrategy(
      {
        jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
        secretOrKey: process.env.JWT_SECRET_KEY,
      },
      async (jwtPayload, done) => {
        try {
          const { id, service } = jwtPayload;

          done(null, { id, service });
        } catch (error) {
          done(error, false);
        }
      },
    ),
  );
};
