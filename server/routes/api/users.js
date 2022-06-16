const express = require('express');
const router = express.Router();
const path = require('path');

const users_controller = require(path.resolve(__dirname, '..', '..', 'controllers', 'api', 'usersController.js'));

router
    .route('/')
    .get(users_controller.user_list)
    .post(users_controller.user_create);

router
    .route('/:username')
    .get(users_controller.user_detail)
    .put(users_controller.user_update)
    .delete(users_controller.user_delete)
    .head(users_controller.user_exist);

module.exports = router;
