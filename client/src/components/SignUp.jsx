import React, { useEffect, useState } from 'react';

function SignUp() {
    const [errorMessages, setErrorMessages] = useState({});

    function renderErrorMessage(name) {
        // console.log(errorMessages.name);
        return name === errorMessages.name && <div className="error">{errorMessages.message}</div>;
    }

    const handleSubmit = (event) => {
        event.preventDefault();
        const { usernameInput, passwordInput } = document.forms[0];

        fetch('http://localhost:3001/api/users/' + usernameInput.value, { method: 'GET' })
            .then((res) => {
                return res.json();
            })
            .then((data) => {
                console.log(data)
                if (Object.keys(data).length !== 0) {
                    setErrorMessages({
                        name: 'username-input',
                        message: 'Username already taken',
                    });
                    return;
                }
                const requestOptions = {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ username: usernameInput.value, password: passwordInput.value }),
                };
                fetch('http://localhost:3001/api/users', requestOptions)
                    .then((res) => {
                        return res.json();
                    })
                    .then((info) => {});
            });
    };

    return (
        <div>
            <h1>Sign-up</h1>
            <a href="/">Home</a>
            <br />
            <br />
            <div className="form">
                <form onSubmit={handleSubmit}>
                    <div className="input-container">
                        <label>Username</label>
                        <br />
                        <input type="text" name="usernameInput" required />
                        {renderErrorMessage('username-input')}
                    </div>
                    <br />
                    <div className="input-container">
                        <label>Password</label>
                        <br />
                        <input type="password" name="passwordInput" required />
                        {renderErrorMessage('password-input')}
                    </div>
                    <br />
                    <div className="input-container">
                        <label>Confirm password</label>
                        <br />
                        <input type="password" name="confirm-password-input" required />
                        {renderErrorMessage('confirm-password-input')}
                    </div>
                    <br />
                    <div className="button-container">
                        <input type="submit" value="Sign up" />
                    </div>
                </form>
            </div>
        </div>
    );
}

export default SignUp;
