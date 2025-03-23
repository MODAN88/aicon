import { NextApiRequest, NextApiResponse } from 'next';
import { Configuration, OpenAIApi } from 'openai';
import { authMiddleware } from '@/lib/auth-middleware';

const configuration = new Configuration({
    apiKey: process.env.OPENAI_API_KEY,
});

const openai = new OpenAIApi(configuration);

async function handler(req: NextApiRequest, res: NextApiResponse) {
    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Method not allowed' });
    }

    const { topic, style } = req.body;

    if (!topic || !style) {
        return res.status(400).json({ error: 'Topic and style are required' });
    }

    try {
        const prompt = `Write a blog post about ${topic} in a ${style} style. The post should be informative, engaging, and well-structured.`;

        const completion = await openai.createCompletion({
            model: "gpt-3.5-turbo",
            prompt,
            max_tokens: 1500,
            temperature: 0.7,
        });

        const generatedContent = completion.data.choices[0].text?.trim();

        // Generate a title based on the content
        const titlePrompt = `Create a catchy title for this blog post about ${topic}:`;
        const titleCompletion = await openai.createCompletion({
            model: "gpt-3.5-turbo",
            prompt: titlePrompt,
            max_tokens: 50,
            temperature: 0.7,
        });

        const generatedTitle = titleCompletion.data.choices[0].text?.trim();

        return res.status(200).json({
            title: generatedTitle || `Blog Post about ${topic}`,
            content: generatedContent || 'Failed to generate content',
        });
    } catch (error) {
        console.error('Error generating content:', error);
        return res.status(500).json({ error: 'Failed to generate content' });
    }
}

export default authMiddleware(handler);
