import { useState } from 'react';
import axios from 'axios';
import { useRouter } from 'next/router';

export function useContentGenerator() {
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState(null);
    const router = useRouter();

    const generateContent = async (topic, style) => {
        setIsLoading(true);
        setError(null);

        try {
            const token = localStorage.getItem('token');

            if (!token) {
                throw new Error('Authentication required');
            }

            const response = await axios.post(
                '/api/generate',
                { topic, style },
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            );

            const { title, content } = response.data;

            // Save the generated post draft
            const saveResponse = await axios.post(
                '/api/posts/save',
                { title, content },
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            );

            // Redirect to the post editor
            router.push(`/posts/${saveResponse.data.id}/edit`);

            return saveResponse.data;
        } catch (err) {
            setError(err.response?.data?.error || 'Failed to generate content');
            return null;
        } finally {
            setIsLoading(false);
        }
    };

    return {
        generateContent,
        isLoading,
        error,
    };
}
