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
          const { id, exp } = jwtPayload;

          if (((exp * 1000) - Date.now()) <= 0) {
            throw new Error('Access Token is expired');
          }

          done(null, { id });
        } catch (error) {
          done(error, false);
        }
      },
    ),
  );
};
