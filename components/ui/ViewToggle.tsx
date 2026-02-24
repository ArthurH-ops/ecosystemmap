'use client';

import { motion } from 'framer-motion';
import type { ViewMode } from '@/lib/types';

interface ViewToggleProps {
  mode: ViewMode;
  onChange: (mode: ViewMode) => void;
}

export default function ViewToggle({ mode, onChange }: ViewToggleProps) {
  return (
    <div className="toggle-switch">
      <button
        onClick={() => onChange('map')}
        className={`toggle-option relative ${mode === 'map' ? 'active' : ''}`}
      >
        {mode === 'map' && (
          <motion.div
            layoutId="toggle-bg"
            className="absolute inset-0 bg-[#10b981] rounded-full"
            initial={false}
            transition={{ type: 'spring', bounce: 0.2, duration: 0.4 }}
          />
        )}
        <span className="relative z-10 flex items-center gap-1.5">
          <svg
            className="w-4 h-4"
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
          Map
        </span>
      </button>
      <button
        onClick={() => onChange('graph')}
        className={`toggle-option relative ${mode === 'graph' ? 'active' : ''}`}
      >
        {mode === 'graph' && (
          <motion.div
            layoutId="toggle-bg"
            className="absolute inset-0 bg-[#10b981] rounded-full"
            initial={false}
            transition={{ type: 'spring', bounce: 0.2, duration: 0.4 }}
          />
        )}
        <span className="relative z-10 flex items-center gap-1.5">
          <svg
            className="w-4 h-4"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1"
            />
          </svg>
          Network
        </span>
      </button>
    </div>
  );
}
