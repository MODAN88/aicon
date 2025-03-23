import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import axios from 'axios';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import DashboardLayout from '@/components/layout/DashboardLayout';
import { useAuth } from '@/hooks/useAuth';

export default function SharePostPage() {
  const router = useRouter();
  const { id } = router.query;
  const { isAuthenticated, isLoading } = useAuth();
  const [post, setPost] = useState(null);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      router.push('/login');
    }
  }, [isAuthenticated, isLoading, router]);

  useEffect(() => {
    if (!id || !isAuthenticated) return;

    const fetchPost = async () => {
      try {
        const token = localStorage.getItem('token');
        
        if (!token) {
          throw new Error('Authentication required');
        }
        
        const response = await axios.get(`/api/posts/${id}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        
        setPost(response.data);
      } catch (error) {
        console.error('Error fetching post:', error);
      }
    };

    fetchPost();
  }, [id, isAuthenticated]);

  const shareUrl = `${window.location.origin}/posts/${id}`;

  const copyToClipboard = () => {
    navigator.clipboard.writeText(shareUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  if (isLoading) {
    return <div>Loading...</div>;
  }

  return (
    <DashboardLayout>
      <Card className="w-full max-w-3xl mx-auto">
        <CardHeader>
          <CardTitle>Share Your Post</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {post && (
            <div className="mb-6">
              <h3 className="text-xl font-medium">{post.title}</h3>
            </div>
          )}
          
          <div className="space-y-2">
            <label htmlFor="share-url">Share URL</label>
            <div className="flex gap-2">
              <Input
                id="share-url"
                value={shareUrl}
                readOnly
                className="flex-1"
              />
              <Button onClick={copyToClipboard}>
                {copied ? 'Copied!' : 'Copy'}
              </Button>
            </div>
          </div>
          
          <div className="pt-4">
            <h3 className="font-medium mb-2">Share on social media</h3>
            <div className="flex gap-2">
              <Button variant="outline" onClick={() => window.open(`https://twitter.com/intent/tweet?url=${encodeURIComponent(shareUrl)}&text=${encodeURIComponent(post ? post.title : 'Check out my blog post!')}`, '_blank')}>
                Twitter
              </Button>
              <Button variant="outline" onClick={() => window.open(`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareUrl)}`, '_blank')}>
                Facebook
              </Button>
              <Button variant="outline" onClick={() => window.open(`https://www.linkedin.com/shareArticle?mini=true&url=${encodeURIComponent(shareUrl)}&title=${encodeURIComponent(post ? post.title : 'Check out my blog post!')}`, '_blank')}>
                LinkedIn
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </DashboardLayout>
  );
}
