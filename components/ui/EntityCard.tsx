'use client';

import type { Entity } from '@/lib/types';
import { CATEGORY_COLORS_MAP, formatFunding } from '@/lib/data';

interface EntityCardProps {
  entity: Entity;
  onClick?: () => void;
  compact?: boolean;
}

export default function EntityCard({ entity, onClick, compact = false }: EntityCardProps) {
  const color = CATEGORY_COLORS_MAP[entity.category];

  if (compact) {
    return (
      <button
        onClick={onClick}
        className="w-full p-3 card text-left hover:border-[#888899] transition-colors"
      >
        <div className="flex items-center gap-3">
          <div
            className="w-8 h-8 rounded-lg flex items-center justify-center text-white font-bold text-xs shrink-0"
            style={{ background: color }}
          >
            {entity.name.substring(0, 2).toUpperCase()}
          </div>
          <div className="flex-1 min-w-0">
            <h3 className="font-medium text-white text-sm truncate">
              {entity.name}
            </h3>
            <p className="text-xs text-[#888899] capitalize">{entity.category}</p>
          </div>
        </div>
      </button>
    );
  }

  return (
    <button
      onClick={onClick}
      className="w-full p-4 card text-left hover:border-[#888899] transition-colors"
    >
      <div className="flex items-start gap-3">
        <div
          className="w-12 h-12 rounded-lg flex items-center justify-center text-white font-bold text-sm shrink-0"
          style={{ background: color }}
        >
          {entity.name.substring(0, 2).toUpperCase()}
        </div>
        <div className="flex-1 min-w-0">
          <h3 className="font-semibold text-white truncate">{entity.name}</h3>
          <p className="text-xs text-[#888899] capitalize mb-2">
            {entity.category === 'vc' ? 'VC & Angels' : entity.category}
            {entity.location.district && ` • ${entity.location.district}. Bezirk`}
          </p>
          <p className="text-sm text-[#888899] line-clamp-2">{entity.description}</p>
        </div>
      </div>

      {/* Tags */}
      <div className="mt-3 flex flex-wrap gap-1">
        {entity.tags.slice(0, 4).map((tag) => (
          <span
            key={tag}
            className="px-2 py-0.5 text-[10px] bg-[#1a1a24] rounded-full text-[#888899]"
          >
            {tag}
          </span>
        ))}
        {entity.tags.length > 4 && (
          <span className="px-2 py-0.5 text-[10px] text-[#888899]">
            +{entity.tags.length - 4}
          </span>
        )}
      </div>

      {/* Stats row */}
      <div className="mt-3 flex items-center gap-4 text-xs text-[#888899]">
        {entity.founded_year && <span>Est. {entity.founded_year}</span>}
        {entity.total_funding_eur && (
          <span className="text-[#10b981] font-medium">
            {formatFunding(entity.total_funding_eur)}
          </span>
        )}
        {entity.team_size && <span>{entity.team_size} team</span>}
      </div>
    </button>
  );
}
