<script>
    export let square;

    const style = `transform: translate(${square.x * 100}%, ${square.y * 100}%)`;
</script>

<div class="board-element hover-square" {style} />

<style>
    .hover-square {
        border: 3px solid rgba(255, 255, 255, 0.8);
        box-sizing: border-box;
    }
</style>
