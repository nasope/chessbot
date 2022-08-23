<script>
    export let type, label, name, placeholder = '';
    const id = name + 'Field';
</script>

<label for={id}>{label}</label>
<input id={id} name={name} type={type} {placeholder} />

<style>
    * {
        display: block;
    }

    input {
        margin: 10px 0px;
        padding: 10px 20px;
        border-radius: 9999px;
        border: none;
        color: rgb(88, 88, 88);
    }

    input::placeholder {
        color: rgb(156, 156, 156);
    }

    input:focus {
        outline: 4px solid rgb(70, 129, 255);
    }
</style>
