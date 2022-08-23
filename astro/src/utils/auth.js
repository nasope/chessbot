import jwt from 'jsonwebtoken';
import 'dotenv/config';

export function verifyToken(token) {
    return jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, user) => {
        if (err || !user) return { valid: false };
		
        return { valid: true, user: user };
    });
}
