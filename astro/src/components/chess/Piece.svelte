<script>
    export let type;
    export let square;
    export let move;
    export let isSquareInBounds;
    export let coordsToTranslate;
    export let coordsToSquare;
    export let showHoverSquare;
    export let hoverSquareSquare;

    let isDragging = false;
    let translate = { x: 0, y: 0 };

    function translatePiece(event) {
        translate = coordsToTranslate({ x: event.clientX, y: event.clientY });
        const square = coordsToSquare({ x: event.clientX, y: event.clientY });
        hoverSquareSquare = square;
        showHoverSquare = isSquareInBounds(square);
    }

    function handlePointerUp(event) {
        isDragging = false;
        window.removeEventListener('pointerup', handlePointerUp);
        window.removeEventListener('pointermove', translatePiece);
        move(coordsToSquare({ x: event.clientX, y: event.clientY }));
        showHoverSquare = false;
    }

    function handlePointerDown(event) {
        if (event.button !== 0) return;
        isDragging = true;
        window.addEventListener('pointerup', handlePointerUp);
        window.addEventListener('pointermove', translatePiece);
        translatePiece(event);
    }

    $: style = isDragging
        ? `transform: translate(${translate.x}%, ${translate.y}%)`
        : `transform: translate(${square.x * 100}%, ${square.y * 100}%)`;
</script>

<div
    class={`board-element piece ${type} ${isDragging ? 'dragging' : ''}`}
    {style}
    on:pointerdown={handlePointerDown}
/>

<style lang="scss">
    $chesspiece-path: '/chess-pieces/';

    .piece {
        background-size: cover;
        will-change: transform;
        cursor: grab;
        z-index: 1;
    }

    .dragging {
        cursor: grabbing;
        z-index: 2;
    }

    .wp {
        background-image: url($chesspiece-path + 'wp.png');
    }
    .wk {
        background-image: url($chesspiece-path + 'wk.png');
    }
    .wq {
        background-image: url($chesspiece-path + 'wq.png');
    }
    .wn {
        background-image: url($chesspiece-path + 'wn.png');
    }
    .wb {
        background-image: url($chesspiece-path + 'wb.png');
    }
    .wr {
        background-image: url($chesspiece-path + 'wr.png');
    }
    .bp {
        background-image: url($chesspiece-path + 'bp.png');
    }
    .bk {
        background-image: url($chesspiece-path + 'bk.png');
    }
    .bq {
        background-image: url($chesspiece-path + 'bq.png');
    }
    .bn {
        background-image: url($chesspiece-path + 'bn.png');
    }
    .bb {
        background-image: url($chesspiece-path + 'bb.png');
    }
    .br {
        background-image: url($chesspiece-path + 'br.png');
    }
</style>
