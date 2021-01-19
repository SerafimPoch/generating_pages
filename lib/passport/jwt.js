const JwtStrategy = require('passport-jwt').Strategy;
const passport = require('passport');
const { ExtractJwt } = require('passport-jwt');
const { User } = require('../../app/models');

const opts = {};
opts.jwtFromRequest = ExtractJwt.fromAuthHeaderAsBearerToken();
opts.secretOrKey = process.env.SECRET;

module.exports = passport.use(new JwtStrategy(opts, async (jwtPayload, done) => {
  try {
    const user = await User.findOne({ id: jwtPayload.id });

    if (!user) {
      return done(null, false);
    }
  } catch (error) {
    console.log(error);
  }

  return done(null, true);
}));
