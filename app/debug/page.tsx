'use client';

import { useTheme } from 'next-themes';
import { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

export default function DebugTheme() {
  const { theme, setTheme, resolvedTheme, systemTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    console.log('[v0] Debug page mounted');
  }, []);

  if (!mounted) {
    return <div className="min-h-screen bg-background">Loading...</div>;
  }

  return (
    <div className="min-h-screen bg-background text-foreground py-12 px-4">
      <div className="max-w-2xl mx-auto">
        <h1 className="text-3xl font-bold mb-8">Theme Debug</h1>

        <Card className="mb-6">
          <CardHeader>
            <CardTitle>Current Theme State</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <p className="text-sm text-muted-foreground">Theme:</p>
              <p className="font-mono bg-muted p-2 rounded">{theme}</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Resolved Theme:</p>
              <p className="font-mono bg-muted p-2 rounded">{resolvedTheme}</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">System Theme:</p>
              <p className="font-mono bg-muted p-2 rounded">{systemTheme}</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">HTML Dark Class:</p>
              <p className="font-mono bg-muted p-2 rounded">
                {typeof document !== 'undefined' && document.documentElement.classList.contains('dark') ? 'true' : 'false'}
              </p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Test Buttons</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <Button onClick={() => {
              console.log('[v0] Setting to light');
              setTheme('light');
            }} className="w-full">
              Set Light
            </Button>
            <Button onClick={() => {
              console.log('[v0] Setting to dark');
              setTheme('dark');
            }} className="w-full">
              Set Dark
            </Button>
            <Button onClick={() => {
              console.log('[v0] Current HTML classes:', document.documentElement.className);
              console.log('[v0] Current theme:', theme);
            }} variant="outline" className="w-full">
              Check Console
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
