var board = null
var game = null
var whiteSquareGrey = '#a9a9a9'
var blackSquareGrey = '#696969'

let side = null;

function move(move) {
    game.move(move);
    board.move(move.from+"-"+move.to)
}

function init(team, data) {
    side = team;
    game = new Chess(data);
    board = ChessBoard('myBoard', {
        draggable: true,
        position: data,
        onDragStart: onDragStart,
        onDrop: onDrop,
        onMouseoutSquare: onMouseoutSquare,
        onMouseoverSquare: onMouseoverSquare,
        onSnapEnd: onSnapEnd
    })
    if (team === "b") {
        board.orientation('black')
    }
}


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
    ws.send(JSON.stringify({type: "start"}));
    console.log("Websocket connection opened");

});
ws.addEventListener("close", event => {
    console.log("Websocket connection closed");
    location.reload();
});

function redirect(url) {
    window.location.href = url;
}

function startGame(data) {
    console.log("side:"+data.side);
    console.log("player1:"+data.player1);
    console.log("player2:"+data.player2);
    console.log("FEN:"+data.message );


    init(data.side, data.message);

    if (data.side == "b") {
        document.getElementById("opponent").innerHTML = data.player1;
        document.getElementById("you").innerHTML = data.player2;
    } else {
        document.getElementById("opponent").innerHTML = data.player2;
        document.getElementById("you").innerHTML = data.player1;
    }


}

//uncomment to enable function (input)
ws.onmessage = function (meta) {
    const data = JSON.parse(meta.data);

    // if (data.type == "message") {createMSG(data.username, data.message)} 
    // if (data.type == "playercount") {updateCounter(data.count)} 
    // if (data.type == "create") {create(data.message,Event)} 
    if (data.type == "start") {startGame(data)} 
    // if (data.type == "end") {endGame(data.result)} 
    if (data.type == "move") {move(data.move)} 
    // if (data.type == "rooms") {rooms(data.rooms)} 

    if (data.type == "status") {console.log(data.message)} 
    if (data.type == "redirect") {redirect(data.message)}
}


function removeGreySquares() {
    $('#myBoard .square-55d63').css('background', '')
}

function greySquare(square) {
    var $square = $('#myBoard .square-' + square)

    var background = whiteSquareGrey
    if ($square.hasClass('black-3c85d')) {
        background = blackSquareGrey
    }

    $square.css('background', background)
}

function onDragStart(source, piece) {
    // do not pick up pieces if the game is over
    if (game.game_over()) return false

    let opponent;

    if (side === "w") {
        opponent = "b"
    }
    else if (side === "b") {
        opponent = "w"
    }

    // only pick up pieces for the side to move
    if (piece.search(opponent) !== -1) {
        return false
    }

    // or if it's not that side's turn
    //   if ((game.turn() === 'w' && piece.search(/^b/) !== -1) ||
    //       (game.turn() === 'b' && piece.search(/^w/) !== -1)) {
    //     return false
    //   }
}


function onDrop(source, target) {
    removeGreySquares()

    // see if the move is legal
    var move = game.move({
        from: source,
        to: target,
        promotion: 'q' // NOTE: always promote to a queen for example simplicity
    })

    // illegal move
    if (move === null) return 'snapback'
    console.log(source + " " + target)

    ws.send(JSON.stringify({"type":"move", "move":move}))
}

function onMouseoverSquare(square, piece) {

    // get list of possible moves for this square
    var moves = game.moves({
        square: square,
        verbose: true
    })

    if (game.get(square) === null) {
        return
    }
    
    if (game.get(square).color !== side) {
        return
    }

    // exit if there are no moves available for this square
    if (moves.length === 0) return

    // highlight the square they moused over
    greySquare(square)

    // highlight the possible squares for this piece
    for (var i = 0; i < moves.length; i++) {
        greySquare(moves[i].to)
    }
}

function onMouseoutSquare(square, piece) {
    removeGreySquares()
}

function onSnapEnd() {
    board.position(game.fen())
}
