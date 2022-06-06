function createMSG(name, message) {
    if (name == "server") {
        if (message == "") { return; }

        let msg = message.replace(/</g, "&lt;").replace(/>/g, "&gt;")
        let h1 = document.createElement("h1")
        let parentdiv = document.getElementById('messages')
        h1.innerHTML = msg
        parentdiv.appendChild(h1);
    }
}

const ws = new WebSocket(`ws://${window.document.location.host}`);

const cookie = document.cookie.split('; ').reduce((prev, current) => {
    const [name, ...value] = current.split('=');
    prev[name] = value.join('=');
    return prev;
  }, {});


ws.binaryType = "blob";
// Log socket opening and closing
ws.addEventListener("open", event => {
    ws.send(JSON.stringify(cookie));
    console.log("Websocket connection opened");
    createMSG("server", "Websocket connection opened")
});
ws.addEventListener("close", event => {
    console.log("Websocket connection closed");
    createMSG("server", "Server disconnected")
});

ws.onmessage = function (meta) {
    const data = JSON.parse(meta.data);
    createMSG(data.username, data.message);
}

create = document.getElementById("create").addEventListener("click", createRoom);
function createRoom(e) {
    console.log("creating room");
    e.preventDefault();
    ws.send(JSON.stringify({
        "type": "create"
    }));
}



//send msg
// send = document.getElementById("send").addEventListener("click", sendMessage);
// function sendMessage(e) {
//     e.preventDefault();
//     const message = document.getElementById("message").value;
//     if (message == "") { return; }
//     ws.send(JSON.stringify({
//         "type": "message",
//         "message": message
//     }));
//     document.getElementById("message").value = "";
//     createMSG(cookie.username, message)
// }


