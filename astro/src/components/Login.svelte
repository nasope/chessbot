<script>
    import InputField from './forms/InputField.svelte';
    import SubmitButton from './forms/SubmitButton.svelte';

    function handleSubmit(event) {
        event.preventDefault();

        const formData = {
            username: event.target.username.value,
            password: event.target.password.value,
        };

        // check info against api
		// has yet to be implemented

        fetch('/login', {
            headers: {
                'Content-Type': 'application/json',
            },
            method: 'post',
            body: JSON.stringify(formData),
        }).then((res) => {
			
		});
    }
</script>

<div class="wrapper">
    <h1>Log In</h1>
    <p>Don't have an account?<br />Sign up <a href="/sign-up">here</a></p>
    <form on:submit={handleSubmit}>
        <InputField type="text" label="Username" name="username" placeholder="username" />
        <InputField type="password" label="Password" name="password" placeholder="password" />
        <SubmitButton text="Log In" />
    </form>
</div>

<style>
    a {
        color: rgb(162, 186, 255);
    }

    p {
        margin-top: 40px;
    }

    form {
        margin-top: 40px;
    }
</style>
