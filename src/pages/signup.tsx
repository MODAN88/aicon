import { useEffect } from 'react';
import { useRouter } from 'next/router';
import SignupForm from '@/components/auth/SignupForm';
import { useAuth } from '@/hooks/useAuth';

export default function SignupPage() {
  const router = useRouter();
  const { isAuthenticated } = useAuth();

  useEffect(() => {
    if (isAuthenticated) {
      router.push('/dashboard');
    }
  }, [isAuthenticated, router]);

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col justify-center items-center p-4">
      <h1 className="text-3xl font-bold mb-8">AI Content Generator</h1>
      <SignupForm />
    </div>
  );
}
