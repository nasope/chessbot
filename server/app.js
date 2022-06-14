const express = require('express');
const path = require('path');
const cors = require('cors');

const app = express();

console.log();

app.use(express.static(path.join(__dirname, '..', 'client', 'build')));
app.use(express.static('public'));

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(
    cors({
        origin: 'http://localhost:3000',
    })
);

const apiRouter = require('./routes/api');
const indexRouter = require('./routes/index');

app.use('/api', apiRouter);
app.use('*', indexRouter);

module.exports = app;
