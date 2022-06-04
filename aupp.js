
const fs = require('fs')

let user1 = {
  "username": "lol",
  "password": "lol",
  "session": "lol"
};
let user2 = {
  "username": "2",
  "password": "3",
  "session": "5"
};
let user3 = {
  "username": "lol3",
  "password": "lol3",
  "session": "lol1"
};

let database = [];
database.push(user1)
database.push(user2)
database.push(user3)


console.log(database);

const jsoned = JSON.stringify(database);
console.log(jsoned)

fs.writeFileSync('database.json',jsoned);

