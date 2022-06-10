//database ----------------------------------------------------------------------------------------------------------------------
const fs = require('fs')
let file = fs.readFileSync('./database.json')
let database = JSON.parse(file)

const bcrypt = require('bcrypt')
const crypto = require('crypto')

//adds userinfo into the database stored in json
function addUser(username, password, cookie) {

  const user = {
    "username": username,
    "session": cookie,
    "password": bcrypt.hashSync(password, 10),
    "wins": 0,
    "losses": 0,
    "ties": 0,
    "rating": 1000
  };

  database.push(user);
  const jsoned = JSON.stringify(database);

  fs.writeFileSync('database.json', jsoned);
  return (database.length - 1)

};

//change the rating of a player in the database
//win = 1 win, loss = -1 loss, tie = 0
function changeRating(ID, rating, win) {
  database[ID].rating += rating;

  if (win == 1) {
    database[ID].wins++;
  } else if (win == -1) {
    database[ID].losses++;
  } else if (win == 0) {
    database[ID].ties++;
  }

  const jsoned = JSON.stringify(database);
  fs.writeFileSync('database.json', jsoned);
}

//find username in database, if it exists return index(ID), if not, -1
function findUser(username) {

  for (let i = 0; i < database.length; i++) {

    if (database[i].username.toUpperCase() == username.toUpperCase()) {
      return i;
    }
  }
  return -1;
}
//checks and validates the username, sessionid, and id
function checkValid(req) {
  const username = req.username
  const ID = req.userID
  const session = req.sessiontoken

  try {
    if (ID >= database.length) { return false; }
    if (database[ID].session != session) { return false; }
    if (database[ID].username != username) { return false; }
    return true;
  } catch (error) {
    return false;
  }
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
  const jsoned = JSON.stringify(database);
  fs.writeFileSync('database.json', jsoned);
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
  if (checkValid(req.cookies)) { res.redirect('/home') } else {
    res.render('pages/index')
  }
})
app.get('/login', (req, res) => {
  if (checkValid(req.cookies)) { res.redirect('/home') } else {
    res.render('pages/login', { error: "" })
  }
})
app.get('/signup', (req, res) => {
  if (checkValid(req.cookies)) { res.redirect('/home') } else {
    res.render('pages/signup', { error: "" })
  }
})
app.post('/signup', (req, res) => {
  if (checkValid(req)) { res.redirect('/home') }

  if (findUser(req.body.username) > -1) {
    //console.log("wrong username")
    res.render('pages/signup', { error: "username already taken!" })

  } else if (req.body.password1 != req.body.password2) {
    res.render('pages/signup', { error: "password wrong!" })

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
  if (checkValid(req.cookies)) { res.redirect('/home') }

  const check = validateUser(req.body.username, req.body.password)

  if (check) {
    const sessiontoken = crypto.randomUUID()
    const ID = findUser(req.body.username)
    res.cookie('userID', ID)
    updateSession(sessiontoken, ID);
    res.cookie('sessiontoken', sessiontoken)
    res.cookie('username', req.body.username)
    res.redirect('/home')
  } else {
    res.render('pages/login', { error: "username or password wrong" })
  }

})
app.get('/signout', (req, res) => {
  //console.log("logging out")
  res.cookie('userID', "")
  res.cookie('sessiontoken', "")
  res.cookie('username', "")
  res.redirect('/')
})
app.use((req, res, next) => {
  if (!checkValid(req.cookies)) {

    //console.log('going to signout')
    res.redirect('/signout')
  } else {
    next()
  }
})
app.get('/home', (req, res) => {
  res.render('pages/home', { name: req.cookies.username })
})
app.get('/matchMaking', (req, res) => {
  res.render('pages/matchMaking', { name: req.cookies.username })
})

app.get('/chess', (req, res) => {
  if (!checkInRoom(parseInt(req.cookies.userID))) {
    res.redirect('/matchMaking')
  } else {
    res.render('pages/chess')
  }
})

app.use(express.static(path.join(__dirname, 'public')))

//web socket ----------------------------------------------------------------------------------------------------------------------

const WS_MODULE = require("ws");
const http = require("http");


//games[gameID] = {id1, id2, spectators, time1, time2, starttime, chessboard}
let games = new Map();
//clients[id] = WS
let clients = new Map();

//currentlyPlaying[id] = gameID
let currentlyPlaying = new Map();

getRoom = gameID => {
  return games.get(gameID);
}

createRoom = (ID, spectate, public) => {
  const gameID = crypto.randomUUID()

  games.set(gameID, {
    "spectate": spectate,
    "public": public,
    "id1": ID,
    "id2": null,
    "spectators": [],
    "time1": 0,
    "time2": 0,
    "starttime": 0,
    "chessboard": null
  })
  return gameID;
}

checkRoomStarted = (gameID) => {

  if (games.get(gameID).id2 != null) {
    return true;
  }
  return false;
}

joinRoomAsPlayer = (ID, gameID) => {

  if (!games.has(gameID)) { return false; }
  if (games.get(gameID).id2 == null) {
    games.get(gameID).id2 = ID

    return true
  }
  return false
}

joinRoomAsSpectator = (ID, gameID) => {
  games.get(gameID).spectators.push(ID)
}

addClient = (ID, WS) => { clients.set(ID, WS) }
removeClient = ID => { clients.delete(ID) }
getClient = ID => { return clients.get(ID) }
hasClient = ID => { return clients.has(ID) }

checkInRoom = (ID) => {

  //console.log(ID)

  if (currentlyPlaying.has(ID)) {
    if (currentlyPlaying[ID] != "") {
      return true
    }
  }
  return false;
}

changeInRoom = (ID, gameID) => {
  currentlyPlaying.set(ID, gameID)
}

getInRoom = (ID) => {
  return currentlyPlaying.get(ID)
}

const server = http.createServer(app);
let wss = new WS_MODULE.Server({ server });

wss.on('connection', function connection(ws) {

  //console.log('Client connected');
  let hasdata = false;
  let userdata = {};

  //when a client sends 
  //trycatch to prevent crashing the server from invalid data
  ws.on('message', function message(str) {
    try {
      //validate the connection
      if (!hasdata) {
        const _data = JSON.parse(str);
        if (!checkValid(_data)) {
          ws.close();
        } else {

          userdata = _data;
          userdata.userID = parseInt(userdata.userID);

          hasdata = true;
          addClient(userdata.userID, ws);

          const meta = {
            "type": "status",
            "message": userdata.username + " has joined the chat"
          }
          wss.clients.forEach(function each(client) {
            if (client !== ws && client.readyState === WS_MODULE.OPEN) {
              client.send(JSON.stringify(meta));
            }
          });

          //if the user is in a room, send them the room info
          if (checkInRoom(userdata.userID)) {

            if (!checkRoomStarted(getInRoom(userdata.userID))) {
              ws.send(JSON.stringify({
                "type": "create",
                "message": getInRoom(userdata.userID)
              }))
            } else {
              //console.log("redirect to chessboard")
              ws.send(JSON.stringify({
                "type": "redirect",
                "message":"chess"
              }))
            }
          }
          return
        }
      }
      const data = JSON.parse(str);

      //if the client want to send a message
      if (data.type == "message") {

        const meta = {
          "type": "message",
          "username": userdata.username,
          "message": data.message
        }
        wss.clients.forEach(function each(client) {
          if (client !== ws && client.readyState === WS_MODULE.OPEN) {
            client.send(JSON.stringify(meta));
          }
        });
      }
      //if the client want to create a room
      else if (data.type == "create") {
        if (checkInRoom(userdata.userID)) {
          const meta = {
            "type": "status",
            "message": "You are already in a room " + getInRoom(userdata.ID)
          }
          ws.send(JSON.stringify(meta));
        } else {
          const meta = {
            "type": "create",
            "message": createRoom(userdata.userID, data.spectate, data.public)
          }
          changeInRoom(userdata.userID, meta.message)
          ws.send(JSON.stringify(meta));
        }
      }
      else if (data.type = "join") {
        if (checkInRoom(userdata.userID)) {
          const meta = {
            "type": "status",
            "message": "You are already in a room " + getInRoom(userdata.userID)
          }
          ws.send(JSON.stringify(meta));
        } else {

          if (joinRoomAsPlayer(userdata.userID, data.message)) {
            const meta = {
              "type": "redirect",
              "message": "chess"
            }
            //console.log("redirecting")
            changeInRoom(userdata.userID, data.message)
            ws.send(JSON.stringify(meta));

            console.log("redirecting")

            const opponent = getRoom(getInRoom(userdata.userID)).id1
            getClient(opponent).send(JSON.stringify({
              "type": "redirect",
              "message": "chess"
            }))

          } else {
            //console.log("failed redirecting")
            const meta = {
              "type": "status",
              "message": "Room does not exist or is full"
            }
            ws.send(JSON.stringify(meta));
          }
        }
      }

      //when the client sends invalid data
    } catch (error) {
      ws.send(JSON.stringify({ "type": "status", "message": "fatal error" }));
      //console.log(error)
      ws.close();
    }
  });

  ws.on('close', function close() {
    //console.log('Client disconnected');
    removeClient(userdata.userID);
    const meta = {
      "type": "status",
      "message": userdata.username + " has left the chat"
    }
    wss.clients.forEach(function each(client) {
      if (client !== ws && client.readyState === WS_MODULE.OPEN) {
        client.send(JSON.stringify(meta));
      }
    });
  });
});

server.listen(port, () => {
  console.log(`App listening at port ${port}`)
})
