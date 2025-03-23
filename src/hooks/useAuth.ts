import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import axios from 'axios';

export function useAuth() {
    const [user, setUser] = useState(null);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState(null);
    const router = useRouter();

    useEffect(() => {
        // Check if user is already logged in
        const token = localStorage.getItem('token');
        const userData = localStorage.getItem('user');

        if (token && userData) {
            setUser(JSON.parse(userData));
        }
    }, []);

    const login = async (email, password) => {
        setIsLoading(true);
        setError(null);

        try {
            const response = await axios.post('/api/auth/login', { email, password });
            const { token, user } = response.data;

            localStorage.setItem('token', token);
            localStorage.setItem('user', JSON.stringify(user));

            setUser(user);
            router.push('/dashboard');
        } catch (err) {
            setError(err.response?.data?.error || 'Failed to login');
        } finally {
            setIsLoading(false);
        }
    };

    const signup = async (name, email, password) => {
        setIsLoading(true);
        setError(null);

        try {
            const response = await axios.post('/api/auth/signup', { name, email, password });
            const { token, user } = response.data;

            localStorage.setItem('token', token);
            localStorage.setItem('user', JSON.stringify(user));

            setUser(user);
            router.push('/dashboard');
        } catch (err) {
            setError(err.response?.data?.error || 'Failed to create account');
        } finally {
            setIsLoading(false);
        }
    };

    const logout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        setUser(null);
        router.push('/login');
    };

    return {
        user,
        isLoading,
        error,
        login,
        signup,
        logout,
        isAuthenticated: !!user,
    };
}
