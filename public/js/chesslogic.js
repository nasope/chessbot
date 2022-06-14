var board = null
var game = new Chess()
var whiteSquareGrey = '#a9a9a9'
var blackSquareGrey = '#696969'

let side;

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
    move(move)
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

function init(team, data) {
    side = team;
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
