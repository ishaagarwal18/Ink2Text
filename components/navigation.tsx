'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { ThemeToggle } from './theme-toggle';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/lib/auth-context';
import { Zap, LogOut } from 'lucide-react';
import { useEffect, useState } from 'react';
import { useToast } from '@/hooks/use-toast';

export default function Navigation() {
  const { user, logout, isLoading } = useAuth();
  const router = useRouter();
  const { toast } = useToast();
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  const handleLogout = () => {
    logout();
    toast({
      title: 'Logged out',
      description: 'You have been successfully logged out',
    });
    router.push('/');
  };

  if (!isMounted) {
    return (
      <nav className="sticky top-0 z-50 bg-background/80 backdrop-blur-md border-b border-border">
        <div className="max-w-6xl mx-auto px-4 h-16 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2 font-bold text-xl text-foreground hover:text-primary transition-colors group">
            <div className="flex items-center justify-center w-10 h-10 rounded-lg bg-gradient-to-br from-primary to-accent">
              <Zap className="w-6 h-6 text-white" />
            </div>
            <span className="hidden sm:inline">Ink2Text</span>
          </Link>
          <div className="flex items-center gap-3">
            <ThemeToggle />
          </div>
        </div>
      </nav>
    );
  }

  return (
    <nav className="sticky top-0 z-50 bg-background/80 backdrop-blur-md border-b border-border">
      <div className="max-w-6xl mx-auto px-4 h-16 flex items-center justify-between">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2 font-bold text-xl text-foreground hover:text-primary transition-colors group">
          <div className="flex items-center justify-center w-10 h-10 rounded-lg bg-gradient-to-br from-primary to-accent">
            <Zap className="w-6 h-6 text-white" />
          </div>
          <span className="hidden sm:inline">Ink2Text</span>
        </Link>

        {/* Links */}
        <div className="hidden md:flex items-center gap-8">
          <Link href="/" className="text-muted-foreground hover:text-foreground transition-colors text-sm">
            Home
          </Link>
          <Link href="/#features" className="text-muted-foreground hover:text-foreground transition-colors text-sm">
            Features
          </Link>
          <Link href="/converter" className="text-muted-foreground hover:text-foreground transition-colors text-sm">
            Converter
          </Link>
          <Link href="/about" className="text-muted-foreground hover:text-foreground transition-colors text-sm">
            About
          </Link>
        </div>

        {/* Actions */}
        <div className="flex items-center gap-3">
          {user ? (
            <Button
              variant="outline"
              size="sm"
              onClick={handleLogout}
              className="hidden sm:block text-foreground hover:text-destructive gap-2 bg-transparent"
            >
              <LogOut className="w-4 h-4" />
              Logout
            </Button>
          ) : (
            <>
              <Link href="/login">
                <Button variant="ghost" size="sm" className="hidden sm:block text-muted-foreground hover:text-foreground">
                  Login
                </Button>
              </Link>
              <Link href="/signup">
                <Button size="sm" className="hidden sm:block bg-primary hover:bg-primary/90 text-primary-foreground">
                  Sign Up
                </Button>
              </Link>
            </>
          )}
          <ThemeToggle />
        </div>
      </div>
    </nav>
  );
}
