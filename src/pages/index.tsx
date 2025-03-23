import { useEffect } from 'react';
import { useRouter } from 'next/router';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useAuth } from '@/hooks/useAuth';

export default function HomePage() {
  const router = useRouter();
  const { isAuthenticated } = useAuth();

  useEffect(() => {
    if (isAuthenticated) {
      router.push('/dashboard');
    }
  }, [isAuthenticated, router]);

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col justify-center items-center p-4">
      <Card className="w-full max-w-lg mx-auto text-center">
        <CardHeader>
          <CardTitle className="text-3xl font-bold">AI Content Generator</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <p className="text-gray-600">
            Generate high-quality blog posts with AI. Create, edit, and share your content easily.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" onClick={() => router.push('/login')}>
              Login
            </Button>
            <Button size="lg" variant="outline" onClick={() => router.push('/signup')}>
              Sign Up
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
