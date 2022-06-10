const cookie = document.cookie.split('; ').reduce((prev, current) => {
    const [name, ...value] = current.split('=');
    prev[name] = value.join('=');
    return prev;
  }, {});

function createMSG(name, message) {
    if (message == "") { return; }

    let msg = message.replace(/</g, "&lt;").replace(/>/g, "&gt;")
    let p1 = document.createElement("p")
    let p2 = document.createElement("p")
    let p3 = document.createElement("p")
    let div = document.createElement("div")

    let parentdiv = document.getElementById('messages')
    let d = new Date();

    div.setAttribute("style", "border:1px; border-style:solid; border-color:#FF0000;padding:10px")

    p1.innerHTML = name
    p2.innerHTML = d.getHours() + ":" + d.getMinutes() + ":" + d.getSeconds()
    p3.innerHTML = msg
    div.setAttribute("style", "border:1px; border-style:solid; border-color:#000000;padding:10px")

    div.appendChild(p1)
    div.appendChild(p2)
    div.appendChild(p3)
    parentdiv.appendChild(div);
}
function updateCounter(count) {
    document.getElementById("playerCount").innerHTML = count;
}

function create(code) {
    if (code == "") { return; }
    console.log("Creating game with code: " + code)
    document.getElementById("gameCode").innerHTML = code;

    let form = document.getElementById("copyable");

    let button = document.createElement("button");
    button.innerHTML = "Copy";
    form.appendChild(button);

    const _copy = button.addEventListener("click", copy);
}


const ws = new WebSocket(`ws://${window.document.location.host}`);



ws.binaryType = "blob";
// Log socket opening and closing
ws.addEventListener("open", event => {
    ws.send(JSON.stringify(cookie));
    console.log("Websocket connection opened");
});
ws.addEventListener("close", event => {
    console.log("Websocket connection closed");
    location.reload();
});

ws.onmessage = function (meta) {
    const data = JSON.parse(meta.data);

    if (data.type == "message") {
        createMSG(data.username, data.message)
    } else if (data.type == "playercount") {
        updateCounter(data.count)
    } else if (data.type == "create") {
        create(data.message,Event)
    } else if (data.type == "start") {
        startGame(data.board, data.time, data.opponent)
    } else if (data.type == "end") {
        endGame(data.result)
    } else if (data.type == "move") {
        move(data.move, data.time)
    } else if (data.type == "rooms") {
        rooms(data.rooms)
    } else if (data.type == "status") {
        console.log(data.message)
    } else if (data.type == "redirect") {
        window.location.href = data.message 
    }
}

//send msg
//const _send = document.getElementById("send").addEventListener("click", sendMessage);
const _create = document.getElementById("create").addEventListener("click", sendCreateGame);
const _join = document.getElementById("join").addEventListener("click", joinGame);

function joinGame(e) {
    e.preventDefault();
    const code = document.getElementById("room").value;
    if (code == "") { return; }
    ws.send(JSON.stringify({
        type: "join",
        message: code
    }));
    console.log("Joining game with code: " + code)
}

function copy(e) {
    e.preventDefault();
    const code = document.getElementById("gameCode");
    navigator.clipboard.writeText(code.innerHTML);
    console.log("Copied to clipboard")
}

function sendCreateGame(e) {
    e.preventDefault();

    ws.send(JSON.stringify({
        "type": "create",
        "public": false,
        "spectate": false
    }));
}

function sendMessage(e) {
    e.preventDefault();
    const message = document.getElementById("message").value;
    if (message == "") { return; }
    ws.send(JSON.stringify({
        "type": "message",
        "message": message
    }));
    document.getElementById("message").value = "";
    createMSG(cookie.username, message)
}


