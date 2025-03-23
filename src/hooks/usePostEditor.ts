import { useState, useEffect } from 'react';
import axios from 'axios';
import { useRouter } from 'next/router';

export function usePostEditor(postId) {
    const [post, setPost] = useState(null);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState(null);
    const router = useRouter();

    useEffect(() => {
        const fetchPost = async () => {
            if (!postId) return;

            setIsLoading(true);

            try {
                const token = localStorage.getItem('token');

                if (!token) {
                    throw new Error('Authentication required');
                }

                const response = await axios.get(`/api/posts/${postId}`, {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                });

                setPost(response.data);
            } catch (err) {
                setError(err.response?.data?.error || 'Failed to fetch post');
            } finally {
                setIsLoading(false);
            }
        };

        fetchPost();
    }, [postId]);

    const savePost = async (data) => {
        setIsLoading(true);
        setError(null);

        try {
            const token = localStorage.getItem('token');

            if (!token) {
                throw new Error('Authentication required');
            }

            const response = await axios.post(
                '/api/posts/save',
                { ...data, id: postId },
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            );

            setPost(response.data);
            router.push('/dashboard');

            return response.data;
        } catch (err) {
            setError(err.response?.data?.error || 'Failed to save post');
            return null;
        } finally {
            setIsLoading(false);
        }
    };

    return {
        post,
        isLoading,
        error,
        savePost,
    };
}