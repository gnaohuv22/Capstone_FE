'use client';

import { useTheme } from "next-themes";
import { Moon, Sun } from "lucide-react";
import { useEffect, useState } from "react";

export function ThemeToggle() {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return null;
  }

  return (
    <div className="relative h-8 w-16 rounded-full bg-zinc-100 p-1 dark:bg-zinc-800">
      {/* Knob/Thumb */}
      <div
        className={`absolute top-1 left-1 flex h-6 w-6 items-center justify-center rounded-full bg-white shadow-md transition-transform ${
          theme === 'dark' ? 'translate-x-8' : 'translate-x-0'
        }`}
      >
        {theme === 'dark' ? (
          <Moon className="h-3.5 w-3.5 text-blue-500" />
        ) : (
          <Sun className="h-3.5 w-3.5 text-yellow-500" />
        )}
      </div>
      
      {/* Background Icons */}
      <div className="pointer-events-none flex h-full w-full items-center justify-between px-2">
        <Sun className={`h-4 w-4 ${theme === 'dark' ? 'text-zinc-500/50' : 'invisible'}`} />
        <Moon className={`h-4 w-4 ${theme === 'dark' ? 'invisible' : 'text-zinc-500/50'}`} />
      </div>
      
      <button
        className="absolute inset-0 cursor-pointer opacity-0"
        onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
        aria-label="Chuyển đổi giao diện sáng/tối"
      />
    </div>
  );
} 