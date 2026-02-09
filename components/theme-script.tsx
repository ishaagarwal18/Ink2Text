'use client';

import { useEffect, useState } from 'react';
import { useTheme } from 'next-themes';

export function ThemeScript() {
  const { theme, resolvedTheme } = useTheme();
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  useEffect(() => {
    if (!isMounted) return;
    
    console.log('[v0] Theme changed - theme:', theme, 'resolvedTheme:', resolvedTheme);
    
    // Force apply theme to HTML element
    if (resolvedTheme === 'dark') {
      document.documentElement.classList.add('dark');
      console.log('[v0] Added dark class to html element');
    } else if (resolvedTheme === 'light') {
      document.documentElement.classList.remove('dark');
      console.log('[v0] Removed dark class from html element');
    }
  }, [resolvedTheme, isMounted]);

  return null;
}
