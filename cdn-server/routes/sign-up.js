import express from 'express';
const router = express.Router();

import { sign_up } from '../controllers/signUpController.js';

router.post('/', sign_up);

export default router;
