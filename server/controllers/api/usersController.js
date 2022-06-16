const path = require('path');
const Users = require(path.resolve(__dirname, '..', '..', 'models', 'users.js'));

/*
    IN GENERAL:
    This section provides middleware for the different routes.
    It also interacts with the database via the model files.
    Appropriate responses to the corresponding routes are made here as well.
*/

exports.user_list = (req, res) => {
    Users.user_list().then((users) => {
        res.send(users);
    });
};

exports.user_create = (req, res) => {
    Users.user_create(req.body).then(() => {
        res.end()
    });
};

exports.user_detail = (req, res) => {
    Users.user_detail(req.params.username).then((user) => {
        res.send(user);
    });
};

exports.user_update = (req, res) => {
    // change user
};

exports.user_delete = (req, res) => {
    // delete user
};

exports.user_exist = (req, ers) => {
    // user exists
};
