const express = require('express');
const router = express.Router();
const path = require('path');

const usersRouter = require(path.resolve(__dirname, 'api', 'users.js'));

router.use('/users', usersRouter);

module.exports = router;
