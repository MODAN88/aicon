import { NextApiRequest, NextApiResponse } from 'next';
import { prisma } from '@/lib/prisma';
import { authMiddleware } from '@/lib/auth-middleware';

async function handler(req: NextApiRequest, res: NextApiResponse) {
    // Get all posts for the user
    if (req.method === 'GET' && req.url === '/api/posts/user') {
        try {
            const userId = req.user.userId;

            const posts = await prisma.post.findMany({
                where: { userId },
                orderBy: { createdAt: 'desc' },
            });

            return res.status(200).json(posts);
        } catch (error) {
            console.error('Error fetching posts:', error);
            return res.status(500).json({ error: 'Failed to fetch posts' });
        }
    }

    // Get a single post by ID
    if (req.method === 'GET' && req.url?.startsWith('/api/posts/')) {
        try {
            const postId = req.query.id as string;

            const post = await prisma.post.findUnique({
                where: { id: postId },
            });

            if (!post) {
                return res.status(404).json({ error: 'Post not found' });
            }

            return res.status(200).json(post);
        } catch (error) {
            console.error('Error fetching post:', error);
            return res.status(500).json({ error: 'Failed to fetch post' });
        }
    }

    // Save a post
    if (req.method === 'POST' && req.url === '/api/posts/save') {
        try {
            const userId = req.user.userId;
            const { id, title, content } = req.body;

            // If post ID is provided, update the existing post
            if (id) {
                const post = await prisma.post.findUnique({
                    where: { id },
                });

                if (!post) {
                    return res.status(404).json({ error: 'Post not found' });
                }

                if (post.userId !== userId) {
                    return res.status(403).json({ error: 'Not authorized to update this post' });
                }

                const updatedPost = await prisma.post.update({
                    where: { id },
                    data: { title, content },
                });

                return res.status(200).json(updatedPost);
            }

            // Otherwise, create a new post
            const newPost = await prisma.post.create({
                data: {
                    title,
                    content,
                    userId,
                },
            });

            return res.status(201).json(newPost);
        } catch (error) {
            console.error('Error saving post:', error);
            return res.status(500).json({ error: 'Failed to save post' });
        }
    }

    return res.status(405).json({ error: 'Method not allowed' });
}

export default authMiddleware(handler);