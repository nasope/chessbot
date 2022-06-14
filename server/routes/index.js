const express = require('express');
const router = express.Router();
const path = require('path');

const index_controller = require(path.resolve(__dirname, '..', 'controllers', 'indexController'));

router.get('*', index_controller.index);

module.exports = router;
