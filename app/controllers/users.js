/* eslint-disable new-cap */
const express = require('express');
const createError = require('http-errors');
const jwt = require('jsonwebtoken');

const router = express.Router();
const passportAuth = require('../../lib/passport/auth');

router.post('/login', passportAuth.authenticate('local', { session: false }), async (req, res, next) => {
  try {
    const opts = {};
    opts.expiresIn = 60 * 60 * 24 * 14; // token expires in 2weeks
    const secret = process.env.SECRET;
    const token = jwt.sign({ id: req.user.id }, secret, opts);
    res.append('token', token);
    res.end();
  } catch (error) {
    return next(createError(error));
  }
});

/* GET */
router.get('/', async (req, res, next) => {
  try {
    res.end();
  } catch (error) {
    return next(createError(error));
  }
});

module.exports = router;
