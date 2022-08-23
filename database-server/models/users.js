import { promises as fs } from 'fs';
import path from 'path';
import URL from 'url';

const __dirname = path.dirname(URL.fileURLToPath(import.meta.url));
const databasePath = path.join(__dirname, 'database.json');

export async function user_list() {
    const data = await fs.readFile(databasePath, 'utf-8');
    const users = JSON.parse(data).users;
    return users;
}

export async function user_detail(id) {
    const users = await user_list();
    const user = users.find((user) => {
        return user.id === id;
    });
    return user;
}

export async function user_create(userInfo) {
    const data = await fs.readFile(databasePath, 'utf-8');
    const database = JSON.parse(data);

    // also create id
    const id = userInfo.username.replace(/ /g, '-').trim().toLowerCase();
    const user = { id: id, ...userInfo };

    database.users.push(user);
    await fs.writeFile(databasePath, JSON.stringify(database, null, 4));
    return user;
}

export async function user_delete(id) {
    const data = await fs.readFile(databasePath, 'utf-8');
    const database = JSON.parse(data);

    const index = database.users.findIndex((user) => {
        return user.id === id;
    });

    if (index === -1) {
        return { success: false };
    }

    database.users.splice(index, 1);
    await fs.writeFile(databasePath, JSON.stringify(database, null, 4));
    return { success: true };
}

export async function user_update(userInfo) {}

export default {
    user_list: user_list,
    user_detail: user_detail,
    user_create: user_create,
    user_delete: user_delete,
    user_update: user_update,
};
