import { useState, useEffect } from 'react';
import axios from 'axios';

export function usePosts() {
    const [posts, setPosts] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchPosts = async () => {
            setIsLoading(true);

            try {
                const token = localStorage.getItem('token');

                if (!token) {
                    throw new Error('Authentication required');
                }

                const response = await axios.get('/api/posts/user', {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                });

                setPosts(response.data);
            } catch (err) {
                setError(err.response?.data?.error || 'Failed to fetch posts');
            } finally {
                setIsLoading(false);
            }
        };

        fetchPosts();
    }, []);

    return {
        posts,
        isLoading,
        error,
        refetch: () => {
            setIsLoading(true);
            setPosts([]);
            setError(null);
        },
    };
}