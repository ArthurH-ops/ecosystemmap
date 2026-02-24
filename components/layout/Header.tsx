'use client';

import ViewToggle from '../ui/ViewToggle';
import type { ViewMode } from '@/lib/types';

interface HeaderProps {
  viewMode: ViewMode;
  onViewModeChange: (mode: ViewMode) => void;
}

export default function Header({ viewMode, onViewModeChange }: HeaderProps) {
  return (
    <header className="flex items-center justify-between px-6 py-4 bg-background-secondary border-b border-border shadow-sm">
      {/* Logo & Title */}
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-accent to-[#3b82f6] flex items-center justify-center shadow-md">
          <svg
            className="w-6 h-6 text-white"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7"
            />
          </svg>
        </div>
        <div>
          <h1 className="text-lg font-bold text-foreground">Vienna Startup Ecosystem</h1>
          <p className="text-xs text-foreground-muted">Interaktive Karte & Netzwerk</p>
        </div>
      </div>

      {/* View Toggle */}
      <div className="flex items-center gap-4">
        <ViewToggle mode={viewMode} onChange={onViewModeChange} />

        {/* GitHub Link */}
        <a
          href="https://github.com/ArthurH-ops/ecosystemmap"
          target="_blank"
          rel="noopener noreferrer"
          className="p-2 rounded-lg hover:bg-background-tertiary transition-colors"
          title="View on GitHub"
        >
          <svg
            className="w-5 h-5 text-foreground-muted hover:text-foreground transition-colors"
            fill="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              fillRule="evenodd"
              clipRule="evenodd"
              d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z"
            />
          </svg>
        </a>
      </div>
    </header>
  );
}
