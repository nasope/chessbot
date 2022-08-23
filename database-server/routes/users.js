import express from 'express';
const router = express.Router();

import {
    user_list,
    user_detail,
    user_create,
    user_delete,
    user_update,
} from '../controllers/usersController.js';

router.route('/').get(user_list).post(user_create);
router.route('/:id').get(user_detail).delete(user_delete).patch(user_update);

export default router;
