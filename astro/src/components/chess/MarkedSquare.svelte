<script>
    export let square;

    const style = `transform: translate(${square.x * 100}%, ${square.y * 100}%)`;
</script>

<div class="board-element marked-square" {style} />

<style>
    .marked-square {
        background-color: rgba(235, 97, 80, 0.8);
    }
</style>
