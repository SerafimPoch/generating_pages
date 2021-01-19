const passport = require('passport');
const LocalStrategy = require('passport-local/lib');
const bcrypt = require('bcryptjs');
const createError = require('http-errors');
const { User } = require('../../app/models');

passport.use(
  new LocalStrategy(
    {
      usernameField: 'email',
      passwordField: 'password',
      passReqToCallback: true,
    },
    async (req, email, password, done) => {
      const user = await User.findOne({
        where: { email },
      });

      if (!user || !user.passwordHash) {
        return done(createError(400, {
          errors: {
            email: 'Sorry we couldn’t find an account with that email',
          },
        }));
      }

      if (!bcrypt.compareSync(password, `$2a${user.passwordHash.substring(3)}`)) {
        return done(createError(400, {
          errors: {
            password: 'Invalid password. Please try again',
          },
        }));
      }

      if (user.role !== 'admin') {
        return done(createError(403, {
          errors: {
            email: 'Forbidden',
          },
        }));
      }

      return done(null, user);
    },
  ),
);

module.exports = passport;
