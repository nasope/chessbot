<script>
	import '../../styles/chessboard.css'
    import HoverSquare from './HoverSquare.svelte';
    import MarkedSquare from './MarkedSquare.svelte';
    import Piece from './Piece.svelte';

    export let position;
    let boardRef;
    let markedSquares = [];
    let markingStartSquare;
    let showHoverSquare = false;
    let hoverSquareSquare = { x: 0, y: 0 };

    function isSquareInBounds(square) {
        return square.x >= 0 && square.x < 8 && square.y >= 0 && square.y < 8;
    }

    function coordsToSquare(pointerPos) {
        const boardRect = boardRef.getBoundingClientRect();
        return {
            x: Math.floor((pointerPos.x - boardRect.x) / (boardRect.width / 8)),
            y: Math.floor((pointerPos.y - boardRect.y) / (boardRect.height / 8)),
        };
    }

    function coordsToTranslate(pointerPos) {
        const boardRect = boardRef.getBoundingClientRect();
        const squareWidth = boardRect.width / 8;
        return {
            x: ((pointerPos.x - boardRect.x - squareWidth / 2) / squareWidth) * 100,
            y: ((pointerPos.y - boardRect.y - squareWidth / 2) / squareWidth) * 100,
        };
    }

    function move(prevSquare, newSquare) {
        // validate
        if (!isSquareInBounds(newSquare)) return;

        const newPosition = [];
        for (const prevPiece of position) {
            if (prevPiece.square.x === prevSquare.x && prevPiece.square.y === prevSquare.y) {
                newPosition.push({ ...prevPiece, square: newSquare });
            } else if (!(prevPiece.square.x === newSquare.x && prevPiece.square.y === newSquare.y)) {
                newPosition.push(prevPiece);
            }
        }

        position = newPosition;
    }

    function handleContextMenu(event) {
        event.preventDefault();
    }

    function createMarking(startSquare, endSquare) {
        if (endSquare.x === startSquare.x && endSquare.y === startSquare.y) {
            const newMarkedSquares = [];
            let addNew = true;
            for (const prevMarkedSquare of markedSquares) {
                if (prevMarkedSquare.x === endSquare.x && prevMarkedSquare.y === endSquare.y) {
                    addNew = false;
                } else {
                    newMarkedSquares.push(prevMarkedSquare);
                }
            }
            if (addNew) {
                newMarkedSquares.push(endSquare);
            }
            markedSquares = newMarkedSquares;
            return;
        }
        console.log('create arrow');
    }

    function handlePointerUp(event) {
        window.removeEventListener('pointerup', handlePointerUp);
        const square = coordsToSquare({ x: event.clientX, y: event.clientY });
        createMarking(markingStartSquare, square);
    }

    function handlePointerDown(event) {
        if (event.button === 2) {
            markingStartSquare = coordsToSquare({ x: event.clientX, y: event.clientY });
            window.addEventListener('pointerup', handlePointerUp);
            return;
        }
        markedSquares = [];
    }
</script>

<div class="board" bind:this={boardRef} on:contextmenu={handleContextMenu} on:pointerdown={handlePointerDown}>
    {#each position as piece}
        <Piece
            {...piece}
            move={(newSquare) => {
                move(piece.square, newSquare);
            }}
            {isSquareInBounds}
            {coordsToTranslate}
            {coordsToSquare}
            bind:showHoverSquare
            bind:hoverSquareSquare
        />
    {/each}
    {#each markedSquares as square}
        <MarkedSquare {square} />
    {/each}
    {#if showHoverSquare}
        {#key hoverSquareSquare}
            <HoverSquare square={hoverSquareSquare} />
        {/key}
    {/if}
</div>

<style lang="scss">
    $chessboard-path: '/';

    .board {
        position: relative;
        width: 600px;
        height: 600px;
        background-image: url($chessboard-path + 'chessboard.svg');
        // box-shadow: 0px 0px 40px rgb(129, 120, 254);
        border-radius: 10px;
    }
</style>
