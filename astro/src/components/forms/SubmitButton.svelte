<script>
    export let text;
</script>

<input type="submit" value={text} />

<style>
    input {
        display: block;
        margin: 10px 0px;
        padding: 10px 20px;
        border-radius: 9999px;
        border: none;
        background-color: rgb(70, 129, 255);
    }

    input:hover,
    input:focus {
        background-color: rgb(54, 98, 255);
    }

    input:focus {
        outline: none;
    }

    input:active {
        background-color: rgb(40, 76, 206);
    }
</style>
