const users = [
    {
        username: 'Alex',
        password: '123',
    },
    {
        username: 'Mew',
        password: 'abc',
    },
];

function getUsers() {
    return users;
}

function getUser(username) {
    return users.filter((user) => {
        return user.username === username;
    });
}

function addUser(user) {
    users.push(user);
}

function removeUser(username) {
    const index = users.indexOf(username);
    if (index !== -1) {
        users.splice(index, 1);
    }
}

exports.getUsers = getUsers;
exports.getUser = getUser;
exports.addUser = addUser;
exports.removeUser = removeUser;
