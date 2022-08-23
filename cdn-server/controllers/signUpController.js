import jwt from 'jsonwebtoken';

export function sign_up(req, res, next) {
    const formData = {
        username: req.body.username,
        password: req.body.password,
    };

    const user = {
        username: formData.username,
        password: formData.password,
    };

    const token = jwt.sign(user, process.env.ACCESS_TOKEN_SECRET);

    res.cookie('token', token);
    res.redirect(303, '/home');
}
