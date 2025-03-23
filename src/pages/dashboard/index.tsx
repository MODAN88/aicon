import { useEffect } from 'react';
import { useRouter } from 'next/router';
import DashboardLayout from '@/components/layout/DashboardLayout';
import ContentGenerator from '@/components/dashboard/ContentGenerator';
import PostsList from '@/components/dashboard/PostsList';
import { useAuth } from '@/hooks/useAuth';

export default function DashboardPage() {
  const router = useRouter();
  const { isAuthenticated, isLoading } = useAuth();

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      router.push('/login');
    }
  }, [isAuthenticated, isLoading, router]);

  if (isLoading) {
    return <div>Loading...</div>;
  }

  return (
    <DashboardLayout>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <ContentGenerator />
        <PostsList />
      </div>
    </DashboardLayout>
  );
}