/* eslint-disable new-cap */
const express = require('express');

const router = express.Router();

router.use('/users', require('./users'));
router.use('/pages', require('./pages'));

module.exports = router;
