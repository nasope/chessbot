const express = require('express')
const port = 3000
const bodyparser = require('body-parser')
const cookieParser = require('cookie-parser')

const app = express()
app.use(cookieParser('secretKey'))

const fs = require('fs')
let file = fs.readFileSync('./database.json')
let database = JSON.parse(file)

const bcrypt = require('bcrypt')
const crypto = require('crypto')

function addUser(username, password, cookie) {

  const user = {
    "username": "",
    "password": "",
    "session": ""
  };
user.username = username
user.session = cookie
user.password = bcrypt.hashSync(password,10);

database.push(user);
const jsoned = JSON.stringify(database);

fs.writeFileSync('database.json', jsoned);
return (database.length - 1)

};

function findUser(username) {

  for (let i = 0; i < database.length; i++) {

    if (database[i].username.toUpperCase() == username.toUpperCase()) {
      return i;
    }
  }
  return -1;
}

function checkValid(ID, session) {
  if (ID >= database.length) {
    return false;
  }

  if (database[ID].session == session) {
    return true;
  }
  return false;
}

function validateUser(username, password) {
  const index = findUser(username);

  if (index == -1) {
    return false;
  }
  console.log(index)
  const pass = database[index].password;
  const match = bcryptSync.compare(password, pass)
  if (!match) {
    return false;
  }

  return true;
}

app.use(bodyparser.urlencoded({ extended: false }));
app.use(bodyparser.json())

app.set('view engine', 'ejs')

app.get('/', (req, res) => {
  res.render('pages/index')
})

app.get('/login', (req, res) => {
  res.render('pages/login')
})

app.get('/signup', (req, res) => {
  res.render('pages/signup')
})




app.post('/signup', (req, res) => {

  if (findUser(req.body.username) == -1 || req.body.password1 != req.body.password2) {
    res.redirect('/')
  } else {
    const sessiontoken = crypto.randomUUID()
    //resolve promimse

    const ID = addUser(req.body.username, req.body.password1, sessiontoken)

    res.cookie('userID', ID)
    res.cookie('sessiontoken', sessiontoken, { signed: true })
    res.cookie('username', req.body.username)


    res.redirect('/home')
  }
})

app.post('/login', (req, res) => {

  console.log(database)

  const check = validateUser(req.body.username, req.body.password) 

  if (check) {
    res.redirect('/home')
  } else {
    res.redirect('/')
  }

})


app.listen(port, () => {
  console.log(`App listening at port ${port}`)
})


