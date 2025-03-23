import { useState } from 'react';
import { useRouter } from 'next/router';
import { Button } from "@/components/ui/button";
import { useAuth } from '@/hooks/useAuth';

export default function DashboardLayout({ children }) {
  const router = useRouter();
  const { user, logout } = useAuth();
  
  const handleLogout = async () => {
    await logout();
    router.push('/login');
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <h1 className="text-xl font-bold">AI Content Generator</h1>
          <div className="flex items-center gap-4">
            {user && (
              <>
                <span>Welcome, {user.name}</span>
                <Button variant="outline" onClick={handleLogout}>Logout</Button>
              </>
            )}
          </div>
        </div>
      </header>
      <main className="container mx-auto px-4 py-8">
        {children}
      </main>
    </div>
  );
}