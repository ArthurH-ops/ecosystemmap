'use client';

import type { Entity } from '@/lib/types';
import { CATEGORY_COLORS_MAP, formatFunding } from '@/lib/data';

interface EntityCardProps {
  entity: Entity;
  onClick?: () => void;
  compact?: boolean;
}

const CATEGORY_LABELS: Record<string, string> = {
  startup: 'Startup',
  incubator: 'Inkubator',
  vc: 'VC & Angels',
  university: 'Universität',
  coworking: 'Coworking',
  funding: 'Förderung',
  community: 'Community',
};

export default function EntityCard({ entity, onClick, compact = false }: EntityCardProps) {
  const color = CATEGORY_COLORS_MAP[entity.category];

  if (compact) {
    return (
      <button
        onClick={onClick}
        className="w-full p-3 card card-interactive text-left group"
      >
        <div className="flex items-center gap-3">
          <div
            className="w-9 h-9 rounded-lg flex items-center justify-center text-white font-bold text-xs shrink-0 shadow-sm group-hover:shadow-md transition-shadow"
            style={{ background: `linear-gradient(135deg, ${color} 0%, ${color}dd 100%)` }}
          >
            {entity.name.substring(0, 2).toUpperCase()}
          </div>
          <div className="flex-1 min-w-0">
            <h3 className="font-medium text-foreground text-sm truncate group-hover:text-accent transition-colors">
              {entity.name}
            </h3>
            <p className="text-xs text-foreground-muted">
              {CATEGORY_LABELS[entity.category] || entity.category}
            </p>
          </div>
          <svg
            className="w-4 h-4 text-foreground-muted opacity-0 group-hover:opacity-100 transition-opacity"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
        </div>
      </button>
    );
  }

  return (
    <button
      onClick={onClick}
      className="w-full p-4 card card-interactive text-left group"
    >
      <div className="flex items-start gap-3">
        <div
          className="w-12 h-12 rounded-xl flex items-center justify-center text-white font-bold text-sm shrink-0 shadow-md group-hover:shadow-lg transition-shadow"
          style={{ background: `linear-gradient(135deg, ${color} 0%, ${color}dd 100%)` }}
        >
          {entity.name.substring(0, 2).toUpperCase()}
        </div>
        <div className="flex-1 min-w-0">
          <h3 className="font-semibold text-foreground truncate group-hover:text-accent transition-colors">
            {entity.name}
          </h3>
          <p className="text-xs text-foreground-muted mb-2">
            {CATEGORY_LABELS[entity.category] || entity.category}
            {entity.location.district && ` · ${entity.location.district}. Bezirk`}
          </p>
          <p className="text-sm text-foreground-muted line-clamp-2 leading-relaxed">
            {entity.description}
          </p>
        </div>
      </div>

      {/* Tags */}
      <div className="mt-3 flex flex-wrap gap-1.5">
        {entity.tags.slice(0, 4).map((tag) => (
          <span
            key={tag}
            className="px-2 py-0.5 text-[11px] bg-background-tertiary rounded-full text-foreground-muted font-medium"
          >
            {tag}
          </span>
        ))}
        {entity.tags.length > 4 && (
          <span className="px-2 py-0.5 text-[11px] text-foreground-muted font-medium">
            +{entity.tags.length - 4}
          </span>
        )}
      </div>

      {/* Stats row */}
      <div className="mt-3 flex items-center gap-4 text-xs">
        {entity.founded_year && (
          <span className="text-foreground-muted flex items-center gap-1">
            <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
            {entity.founded_year}
          </span>
        )}
        {entity.total_funding_eur && (
          <span className="text-accent font-semibold flex items-center gap-1">
            <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            {formatFunding(entity.total_funding_eur)}
          </span>
        )}
        {entity.team_size && (
          <span className="text-foreground-muted flex items-center gap-1">
            <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
            </svg>
            {entity.team_size}
          </span>
        )}
      </div>
    </button>
  );
}
