import { useEffect } from 'react';
import { useRouter } from 'next/router';
import DashboardLayout from '@/components/layout/DashboardLayout';
import PostEditor from '@/components/dashboard/PostEditor';
import { useAuth } from '@/hooks/useAuth';

export default function EditPostPage() {
  const router = useRouter();
  const { id } = router.query;
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
      <PostEditor postId={id as string} />
    </DashboardLayout>
  );
}
