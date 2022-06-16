const path = require('path');
const fs = require('fs');

const databasePath = path.resolve(__dirname, '..', 'database.json');

/*
    IN GENERAL:
    This section handles requests to the database.
    Controllers use these functions for interacting with the database.
    A simple json file (database.json) is used as the database for now.
    All the functions returns promises.
*/

function user_list() {
    return fs.promises
        .readFile(databasePath)
        .then((rawData) => {
            return JSON.parse(rawData);
        })
        .catch((err) => {
            console.log(err);
        });
}

function user_create(user) {
    return user_list().then((users) => {
        users.push(user);

        return fs.promises.writeFile(databasePath, JSON.stringify(users)).catch((err) => {
            console.log(err);
        });
    });
}

function user_detail(username) {
    return user_list().then((users) => {
        return users.filter((user) => {
            return user.username === username;
        });
    });
}

function user_update(username, detail) {
    // update user
}

function user_delete(username) {
    // delete user
}

function user_exist(username) {
    // user exist
}

exports.user_list = user_list;
exports.user_create = user_create;
exports.user_detail = user_detail;
exports.user_update = user_update;
exports.user_delete = user_delete;
exports.user_exist = user_exist;
