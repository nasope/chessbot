const express = require('express');
const path = require('path');
const cors = require('cors')

const app = express();

app.use(express.static(path.join(__dirname, '..', 'client', 'build')));
app.use(express.static('public'));

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(
    cors({
        origin: 'http://localhost:3000',
    })
);

// const indexRouter = require('./routes/index');
const apiRouter = require('./routes/api');

// app.use('/', indexRouter);
app.use('/api', apiRouter);

module.exports = app;
