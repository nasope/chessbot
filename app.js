const express = require('express')
const bodyparser = require('body-parser')
const cookieParser = require('cookie-parser')
const port = 3000

const app = express()
app.use(cookieParser('secretKey'))

const http = require('http');
const socketio = require('socket.io')
const server = http.createServer(app);
const io = socketio(server);
const path = require('path')

const fs = require('fs')
let file = fs.readFileSync('./database.json')
let database = JSON.parse(file)

const bcrypt = require('bcrypt')
const crypto = require('crypto')
const { emit } = require('process')

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
  const username = req.cookies.username
  const ID = req.cookies.userID
  const session = req.cookies.sessiontoken
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
function socketValid(cookie) {
  const username = cookie.USERNAME
  const ID = cookie.USERID
  const session = cookie.SESSIONTOKEN

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

app.use(bodyparser.urlencoded({ extended: false }));
app.use(bodyparser.json())

app.set('view engine', 'ejs')

app.get('/', (req, res) => {
  if (checkValid(req)) {res.redirect('/home')} else {
  res.render('pages/index')}
})
app.get('/login', (req, res) => {
  if (checkValid(req)) {res.redirect('/home')} else {
  res.render('pages/login',{error: ""})}
})
app.get('/signup', (req, res) => {
  if (checkValid(req)) {res.redirect('/home')} else {
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
  if (checkValid(req)) {res.redirect('/home')}

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
  if (!checkValid(req)) {
    console.log('going to signout')
    res.redirect('/signout')
  } else {
    next()
  }
})

app.get('/home', (req, res) => {
  res.render('pages/home',{name: req.cookies.username})
})

app.get('/matchMaking', (req, res) => {
  res.render('pages/matchMaking')
})


app.use(express.static(path.join(__dirname,'public')))

players = {}

function addtomatch(playername) {
  for (let i = 0; i < players.length; i++) {
    if (players[i] == playername) {
      return;
    }
  }
  players.push(playername);
}


io.on('connection', socket => {
  console.log('a player has connected')
  socket.emit('connection', io.engine.clientsCount)
  socket.broadcast.emit('connection', io.engine.clientsCount)

  socket.on('server', (form) => {
    try {
      if(!socketValid(form)) {
        console.log("valid")
        socket.broadcast.emit('connection', io.engine.clientsCount)
        socket.emit('redirect', '/')
        socket.disconnect()
      }
    } catch (error) {
      console.log(error)
      socket.broadcast.emit('connection', online)
      socket.emit('redirect', '/')
      socket.disconnect();
    }

    if(form.TYPE == 'C') {
      const newForm = {
        "USERNAME":"",
        "MSG":""
      }
  
      newForm.USERNAME = form.USERNAME
      newForm.MSG = form.MSG
  
      socket.broadcast.emit(form.ID,newForm)
  
      console.log(form.MSG)


    }

    if (form.TYPE == 'M') {
      //MSG.ID - join - matching - Create

      if (form.ID == 'matching') {
        //coming soon lmao
      }
      if (form.ID == 'create') {
        const rng = crypto.randomUUID()

        socket.emit('M',rng)

        socket.on(rng, (message) => {
          let user1, user2; 
          let U1start = false
          let U2start = false
          let canstart = false;
          let start = false
          let white;
          let time1;
          let time2;

          if (!start) {
            if (user1 == "") {
              user1 = message.USERNAME
              
            } else if (user2 == "" && user1 != message.USERNAME) {
              user2 = message.USERNAME
              canstart = true
            }
  
            if (canstart && !start) {
              if (user1 == message.USERNAME) {
                if (message.START == true) {
                  U1start = true;
                }
                if (user2 == message.USERNAME) {
                  if (message.START == true) {
                    U2start = true;
                  }
                }
              }
            }
            if (user1 && user2) {
              start = true;
            }

          } else {
            if (user1 == message.USERNAME || user2 == message.USERNAME) {

            }
          }

        })
      }

    }
  })


  //emit - client
  //broadcat.emit - everyone except client

  //calls when player disconnect
  socket.on('disconnect', () => {
    socket.broadcast.emit('connection', io.engine.clientsCount)
    socket.disconnect()
  })
});

server.listen(port, () => {
  console.log(`App listening at port ${port}`)
})
