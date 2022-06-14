const path = require('path');
const Users = require(path.resolve(__dirname, '..', '..', 'models', 'users'));

exports.user_list = (req, res, next) => {
    // get all users
};

exports.user_create = (req, res, next) => {
    // create user
};

exports.user_info = (req, res, next) => {
    // get user
};

exports.user_update = (req, res, next) => {
    // change user
};

exports.user_delete = (req, res, next) => {
    // delete user
};

exports.user_exist = (req, ers, next) => {
    // check if user exists?
};
