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

    div.appendChild(p1)
    div.appendChild(p2)
    div.appendChild(p3)
    parentdiv.appendChild(div);
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
    createMSG("Server", "Websocket connection opened")
});
ws.addEventListener("close", event => {
    console.log("Websocket connection closed");
    createMSG("Server", "Server disconnected")
});

ws.onmessage = function (meta) {
    const data = JSON.parse(meta.data);
    createMSG(data.username, data.message);
}

addEventListener('submit', (event) => {
    event.preventDefault();
    const message = document.getElementById('message').value;

    const data = {
        "type": "message",
        "message": message
    }
    
    ws.send(JSON.stringify(data));
    document.getElementById('message').value = ''
    createMSG(cookie.username, message)
})

