import express from 'express';
import cookieParser from 'cookie-parser';
import cors from 'cors';
import 'dotenv/config';

import { handler as ssrHandler } from '../astro/dist/server/entry.mjs';

const app = express();
const port = 4000;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(
    cors({
        origin: '*',
        // credentials: true,
    })
);
app.use((req, res, next) => {
	res.setHeader('Access-Control-Allow-Origin', 'http://127.0.0.1:5500');
})

import indexRouter from './routes/users.js';

app.use('/users', indexRouter);

app.use(ssrHandler);

app.listen(port, () => {
    console.log(`Listening on http://localhost:${port}`);
});
