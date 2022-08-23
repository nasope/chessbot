import express from 'express';
import cookieParser from 'cookie-parser';
import 'dotenv/config'

import { handler as ssrHandler } from '../astro/dist/server/entry.mjs';

const app = express();
const port = 3000;

app.use(express.static('../astro/dist/client'));
app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

import signUpRouter from './routes/sign-up.js';

app.use('/sign-up', signUpRouter);

app.use(ssrHandler);

app.listen(port, () => {
    console.log(`Listening on http://localhost:${port}`);
});
