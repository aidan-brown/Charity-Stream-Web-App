const { Strategy: JwtStrategy } = require('passport-jwt');

module.exports = (passport) => {
  passport.use(
    new JwtStrategy(
      {
        jwtFromRequest: (req) => {
          const { tokens = {} } = req.cookies;

          return tokens.accessToken;
        },
        secretOrKey: process.env.JWT_SECRET_KEY,
      },
      async (jwtPayload, done) => {
        try {
          const { id } = jwtPayload;

          done(null, { id });
        } catch (error) {
          done(error, false);
        }
      },
    ),
  );
};
