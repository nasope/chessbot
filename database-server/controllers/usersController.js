import Users from '../models/users.js';

export async function user_list(req, res, next) {
    const list = await Users.user_list();
    res.send(list);
}

export async function user_detail(req, res, next) {
    const user = await Users.user_detail(req.params.id);
    res.send(user);
}

export async function user_create(req, res, next) {
    const userInfo = req.body;
    const user = await Users.user_create(userInfo);
    res.send(user);
}

export async function user_delete(req, res, next) {
    const success = await Users.user_delete(req.params.id);
    res.send(success);
}

export async function user_update(req, res, next) {}

export default {
    user_list: user_list,
    user_detail: user_detail,
    user_create: user_create,
    user_delete: user_delete,
    user_update: user_update,
};
