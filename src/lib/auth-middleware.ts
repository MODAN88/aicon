import { NextApiRequest, NextApiResponse } from 'next';
import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key';

export function authMiddleware(handler) {
    return async (req: NextApiRequest, res: NextApiResponse) => {
        try {
            const authHeader = req.headers.authorization;

            if (!authHeader || !authHeader.startsWith('Bearer ')) {
                return res.status(401).json({ error: 'Authentication required' });
            }

            const token = authHeader.split(' ')[1];

            try {
                const decoded = jwt.verify(token, JWT_SECRET);
                req.user = decoded;
            } catch (error) {
                return res.status(401).json({ error: 'Invalid token' });
            }

            return handler(req, res);
        } catch (error) {
            console.error('Auth middleware error:', error);
            return res.status(500).json({ error: 'Internal server error' });
        }
    };
}