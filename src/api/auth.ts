import { NextApiRequest, NextApiResponse } from 'next';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';
import { prisma } from '@/lib/prisma';

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    if (req.method === 'POST') {
        // Handle login
        if (req.url === '/api/auth/login') {
            const { email, password } = req.body;

            try {
                const user = await prisma.user.findUnique({
                    where: { email },
                });

                if (!user) {
                    return res.status(401).json({ error: 'Invalid email or password' });
                }

                const passwordValid = await bcrypt.compare(password, user.password);

                if (!passwordValid) {
                    return res.status(401).json({ error: 'Invalid email or password' });
                }

                const token = jwt.sign(
                    { userId: user.id, email: user.email, name: user.name },
                    JWT_SECRET,
                    { expiresIn: '24h' }
                );

                return res.status(200).json({
                    token,
                    user: {
                        id: user.id,
                        name: user.name,
                        email: user.email,
                    },
                });
            } catch (error) {
                console.error('Login error:', error);
                return res.status(500).json({ error: 'Internal server error' });
            }
        }

        // Handle signup
        if (req.url === '/api/auth/signup') {
            const { name, email, password } = req.body;

            try {
                const existingUser = await prisma.user.findUnique({
                    where: { email },
                });

                if (existingUser) {
                    return res.status(400).json({ error: 'Email already in use' });
                }

                const hashedPassword = await bcrypt.hash(password, 10);

                const user = await prisma.user.create({
                    data: {
                        name,
                        email,
                        password: hashedPassword,
                    },
                });

                const token = jwt.sign(
                    { userId: user.id, email: user.email, name: user.name },
                    JWT_SECRET,
                    { expiresIn: '24h' }
                );

                return res.status(201).json({
                    token,
                    user: {
                        id: user.id,
                        name: user.name,
                        email: user.email,
                    },
                });
            } catch (error) {
                console.error('Signup error:', error);
                return res.status(500).json({ error: 'Internal server error' });
            }
        }
    }

    return res.status(405).json({ error: 'Method not allowed' });
}
