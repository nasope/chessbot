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

function checkValid(req) {
  const username = req.cookies.username
  const ID = req.cookies.userID
  const session = req.signedCookies.sessiontoken

  if (isNaN(ID)) {return false;}
  if (ID >= database.length) {return false;}
  //console.log("valid ID")
  if (typeof session === 'undefined') {return false}
  if (database[ID].session != session) {return false;}
  //console.log("valid sessionID")
  if (database[ID].username != username) {return false;}
  //console.log("valid username")
  return true;
}

function validateUser(username, password) {
  const index = findUser(username);

  if (index == -1) {
    return false;
  }
  const pass = database[index].password;
  const match = bcrypt.compareSync(password, pass)
  if (!match) {
    return false;
  }

  return true;
}

function updateSession(sessiontoken, ID) {
  database[ID].session = sessiontoken
}

app.use(bodyparser.urlencoded({ extended: false }));
app.use(bodyparser.json())

app.set('view engine', 'ejs')

app.get('/', (req, res) => {
  if (checkValid(req)) {res.redirect('/home')} else {
  res.render('pages/index')}
})
app.get('/login', (req, res) => {
  if (checkValid(req)) {res.redirect('/home')} else {
  res.render('pages/login')}
})
app.get('/signup', (req, res) => {
  if (checkValid(req)) {res.redirect('/home')} else {
  res.render('pages/signup')}
})

app.post('/signup', (req, res) => {
  if (checkValid(req)) {res.redirect('/home')}

  if (findUser(req.body.username) > -1 || req.body.password1 != req.body.password2) {
    res.redirect('/signup')
  } else {
    console.log("username not taken ", findUser(req.body.username))
    const sessiontoken = crypto.randomUUID()
    const ID = addUser(req.body.username, req.body.password1, sessiontoken)
    res.cookie('userID', ID)
    res.cookie('sessiontoken', sessiontoken, { signed: true })
    res.cookie('username', req.body.username)
    res.redirect('/home')
  }
})

app.post('/login', (req, res) => {
  if (checkValid(req)) {res.redirect('/home')}

  const check = validateUser(req.body.username, req.body.password) 

  if (check) {
    const sessiontoken = crypto.randomUUID()
    const ID = findUser(req.body.username)
    res.cookie('userID', ID)
    res.cookie('sessiontoken', sessiontoken, { signed: true })
    res.cookie('username', req.body.username)
    updateSession(sessiontoken, ID)
    res.redirect('/home')

  } else {
    res.redirect('/login')
  }

})

app.get('/signout', (req, res) => {
  console.log("logging out")
  res.cookie('userID', "", { signed: true })
  res.cookie('sessiontoken', "")
  res.cookie('username', "")
  res.redirect('/')
})


app.use((req,res,next) => {
  if (!checkValid(req)) {
    console.log('going to signout')
    res.redirect('/signout')
  } else {
    next()
  }
})

app.get('/home', (req, res) => {
  res.render('pages/home')
})

app.listen(port, () => {
  console.log(`App listening at port ${port}`)
})


