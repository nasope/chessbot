<script>
    import InputField from './forms/InputField.svelte';
    import SubmitButton from './forms/SubmitButton.svelte';

    function handleSubmit(event) {
        event.preventDefault();

        const formData = {
            username: event.target.username.value,
            password: event.target.password.value,
            passwordConfirm: event.target.passwordConfirm.value,
        };

        // validate form data

        fetch('/sign-up', {
            method: 'post',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(formData),
        }).then((res) => {
            window.location = '/home';
        });
    }
</script>

<div class="wrapper">
    <h1>Sign Up</h1>
    <p>Already have an account?<br />Log in <a href="/login">here</a></p>
    <form on:submit={handleSubmit}>
        <InputField type="text" label="Username" name="username" placeholder="username" />
        <InputField type="password" label="Password" name="password" placeholder="password" />
        <InputField type="password" label="Confirm Password" name="passwordConfirm" placeholder="password" />
        <SubmitButton text="Sign Up" />
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
