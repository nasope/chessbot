//functions ----------------------------------------------------------------------------------------------------------------------
const fs = require('fs')
let file = fs.readFileSync('./database.json')
let database = JSON.parse(file)

const bcrypt = require('bcrypt')
const crypto = require('crypto')

//adds userinfo into the database stored in json
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
//find username in database, if it exists return index(ID), if not, -1
function findUser(username) {

  for (let i = 0; i < database.length; i++) {

    if (database[i].username.toUpperCase() == username.toUpperCase()) {
      return i;
    }
  }
  return -1;
}
//checks and validates the username-,sessionid, and id-token
function checkValid(req) {
  const username = req.username
  const ID = req.userID
  const session = req.sessiontoken

  if (username === '') {return false}
  if (ID === '') {return false}
  if (session === '') {return false}

  //console.log(username+" "+ID+" "+session);
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

//checks if form is correct with database
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
//updates the sessiontoken in database
function updateSession(sessiontoken, ID) {
  database[ID].session = sessiontoken
}

//routing ----------------------------------------------------------------------------------------------------------------------

const express = require('express')
const bodyparser = require('body-parser')
const cookieParser = require('cookie-parser')
const port = 3000

const app = express()
app.use(cookieParser('secretKey'))
const path = require('path')


app.use(bodyparser.urlencoded({ extended: false }));
app.use(bodyparser.json())

app.set('view engine', 'ejs')

app.get('/', (req, res) => {
  if (checkValid(req.cookies)) {res.redirect('/home')} else {
  res.render('pages/index')}
})
app.get('/login', (req, res) => {
  if (checkValid(req.cookies)) {res.redirect('/home')} else {
  res.render('pages/login',{error: ""})}
})
app.get('/signup', (req, res) => {
  if (checkValid(req.cookies)) {res.redirect('/home')} else {
  res.render('pages/signup',{error: ""})}
})

app.post('/signup', (req, res) => {
  if (checkValid(req)) {res.redirect('/home')}

  if (findUser(req.body.username) > -1) {
    //console.log("wrong username")
    res.render('pages/signup',{error: "username already taken!"})

  } else if (req.body.password1 != req.body.password2) {
    res.render('pages/signup',{error: "password wrong!"})

  } else {
    //console.log("username not taken ", findUser(req.body.username))
    const sessiontoken = crypto.randomUUID()
    const ID = addUser(req.body.username, req.body.password1, sessiontoken)
    res.cookie('userID', ID)
    res.cookie('sessiontoken', sessiontoken)
    res.cookie('username', req.body.username)
    res.redirect('/home')
  }
})

app.post('/login', (req, res) => {
  if (checkValid(req.cookies)) {res.redirect('/home')}

  const check = validateUser(req.body.username, req.body.password) 
  
  if (check) {
    const sessiontoken = crypto.randomUUID()
    const ID = findUser(req.body.username)
    res.cookie('userID', ID)
    updateSession(sessiontoken, ID);
    res.cookie('sessiontoken',sessiontoken)
    res.cookie('username',req.body.username)
    res.redirect('/home')
  } else {
    res.render('pages/login',{error:"username or password wrong"})
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
  if (!checkValid(req.cookies)) {
    console.log('going to signout')
    res.redirect('/signout')
  } else {
    next()
  }
})

app.get('/home', (req, res) => {
  res.render('pages/home',{name: req.cookies.username})
})
app.use(express.static(path.join(__dirname,'public')))

//web socket ----------------------------------------------------------------------------------------------------------------------

const http = require('http');
const websocket = require('ws');
const server = http.createServer(app);
const wss = new websocket.Server({ server });

wss.on('connection', function connection(ws) {
  ws.on('message', function message(data) {
    console.log('received: %s', data);
  });

  ws.send('something');
});

server.listen(port, () => {
  console.log(`App listening at port ${port}`)
})
