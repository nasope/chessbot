const cookie = document.cookie.split('; ').reduce((prev, current) => {
    const [name, ...value] = current.split('=');
    prev[name] = value.join('=');
    return prev;
  }, {});

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

function redirect(url) {
    window.location.href = url;
}

//uncomment to enable function (input)
ws.onmessage = function (meta) {
    const data = JSON.parse(meta.data);

    // if (data.type == "message") {createMSG(data.username, data.message)} 
    // if (data.type == "playercount") {updateCounter(data.count)} 
    // if (data.type == "create") {create(data.message,Event)} 
    //if (data.type == "start") {startGame(data.board, data.time, data.opponent)} 
    //if (data.type == "end") {endGame(data.result)} 
    //if (data.type == "move") {move(data.move, data.time)} 
    // if (data.type == "rooms") {rooms(data.rooms)} 

    if (data.type == "status") {console.log(data.message)} 
    if (data.type == "redirect") {redirect(data.message)}
}

