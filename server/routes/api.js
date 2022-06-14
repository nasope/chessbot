const express = require('express');
const router = express.Router();
const path = require('path');
const users = require('../models/users');

router
    .route('/users')
    .get((req, res, next) => {
        res.json(users.getUsers());
    })
    .post((req, res, next) => {
        const user = {
            username: req.body.username,
            password: req.body.password,
        };
        users.addUser(user);
    });

router.route('/users/:username').get((req, res, next) => {
    res.json(users.getUser(req.params.username))
});

module.exports = router;
