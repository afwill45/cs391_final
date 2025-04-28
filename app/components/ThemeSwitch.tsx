'use client';

import { useState, useEffect } from 'react';
import { useTheme } from 'next-themes';
import { FiSun, FiMoon } from 'react-icons/fi';

export default function ThemeSwitch() {
  const [mounted, setMounted] = useState(false);
  const { setTheme, resolvedTheme } = useTheme();

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return null;
  }

  if (resolvedTheme === 'dark') {
    return <FiSun onClick={() => setTheme('light')} className="text-2xl cursor-pointer" />;
  }

  if (resolvedTheme === 'light') {
    return <FiMoon onClick={() => setTheme('dark')} className="text-2xl cursor-pointer" />;
  }

  return null;
}
