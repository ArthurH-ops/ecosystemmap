'use client';

import { motion, AnimatePresence } from 'framer-motion';
import type { Entity } from '@/lib/types';
import { CATEGORY_COLORS_MAP, formatFunding, getConnectedEntities } from '@/lib/data';
import EntityCard from './EntityCard';

interface EntityDetailProps {
  entity: Entity | null;
  onClose: () => void;
  onEntitySelect: (entity: Entity) => void;
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

export default function EntityDetail({
  entity,
  onClose,
  onEntitySelect,
}: EntityDetailProps) {
  if (!entity) return null;

  const color = CATEGORY_COLORS_MAP[entity.category];
  const connectedEntities = getConnectedEntities(entity.id);

  return (
    <AnimatePresence>
      <motion.div
        initial={{ x: '100%' }}
        animate={{ x: 0 }}
        exit={{ x: '100%' }}
        transition={{ type: 'spring', damping: 25, stiffness: 200 }}
        className="fixed right-0 top-0 h-full w-full max-w-md bg-background-secondary border-l border-border z-50 overflow-y-auto shadow-xl"
      >
        {/* Header */}
        <div className="sticky top-0 bg-background-secondary/95 backdrop-blur-sm border-b border-border p-4 z-10">
          <div className="flex items-start justify-between gap-4">
            <div className="flex items-start gap-3">
              <div
                className="w-14 h-14 rounded-xl flex items-center justify-center text-white font-bold text-lg shrink-0 shadow-lg"
                style={{ background: `linear-gradient(135deg, ${color} 0%, ${color}dd 100%)` }}
              >
                {entity.name.substring(0, 2).toUpperCase()}
              </div>
              <div>
                <h2 className="text-xl font-bold text-foreground">{entity.name}</h2>
                <p className="text-sm text-foreground-muted">
                  {CATEGORY_LABELS[entity.category] || entity.category}
                </p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="p-2 rounded-lg hover:bg-background-tertiary transition-colors"
            >
              <svg
                className="w-5 h-5 text-foreground-muted"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="p-4 space-y-6">
          {/* Description */}
          <div>
            <p className="text-foreground-muted leading-relaxed">{entity.description}</p>
          </div>

          {/* Tags */}
          <div className="flex flex-wrap gap-2">
            {entity.tags.map((tag) => (
              <span
                key={tag}
                className="px-3 py-1.5 text-sm bg-background-tertiary rounded-full text-foreground-muted font-medium"
              >
                {tag}
              </span>
            ))}
          </div>

          {/* Key Info */}
          <div className="grid grid-cols-2 gap-3">
            {entity.founded_year && (
              <div className="p-4 bg-background-tertiary rounded-xl border border-border">
                <p className="text-xs text-foreground-muted uppercase tracking-wider font-medium">
                  Gegründet
                </p>
                <p className="text-xl font-bold text-foreground mt-1">
                  {entity.founded_year}
                </p>
              </div>
            )}
            {entity.total_funding_eur && (
              <div className="p-4 bg-background-tertiary rounded-xl border border-border">
                <p className="text-xs text-foreground-muted uppercase tracking-wider font-medium">
                  Funding
                </p>
                <p className="text-xl font-bold text-accent mt-1">
                  {formatFunding(entity.total_funding_eur)}
                </p>
              </div>
            )}
            {entity.team_size && (
              <div className="p-4 bg-background-tertiary rounded-xl border border-border">
                <p className="text-xs text-foreground-muted uppercase tracking-wider font-medium">
                  Team
                </p>
                <p className="text-xl font-bold text-foreground mt-1">{entity.team_size}</p>
              </div>
            )}
            {entity.funding_stage && (
              <div className="p-4 bg-background-tertiary rounded-xl border border-border">
                <p className="text-xs text-foreground-muted uppercase tracking-wider font-medium">
                  Stage
                </p>
                <p className="text-xl font-bold text-foreground capitalize mt-1">
                  {entity.funding_stage}
                </p>
              </div>
            )}
          </div>

          {/* Location */}
          <div>
            <h3 className="text-xs font-semibold text-foreground-muted uppercase tracking-wider mb-3">
              Standort
            </h3>
            <div className="p-4 bg-background-tertiary rounded-xl border border-border flex items-start gap-3">
              <div className="w-10 h-10 rounded-lg bg-accent/10 flex items-center justify-center shrink-0">
                <svg
                  className="w-5 h-5 text-accent"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                  />
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                  />
                </svg>
              </div>
              <div>
                <p className="text-foreground font-medium">{entity.location.address}</p>
                {entity.location.district && (
                  <p className="text-sm text-foreground-muted mt-0.5">
                    {entity.location.district}. Bezirk, Wien
                  </p>
                )}
              </div>
            </div>
          </div>

          {/* Links */}
          <div>
            <h3 className="text-xs font-semibold text-foreground-muted uppercase tracking-wider mb-3">
              Links
            </h3>
            <div className="flex flex-wrap gap-2">
              {entity.website && (
                <a
                  href={entity.website}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn btn-primary"
                >
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
                      d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9"
                    />
                  </svg>
                  Website
                </a>
              )}
              {entity.social?.linkedin && (
                <a
                  href={entity.social.linkedin}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn btn-secondary"
                >
                  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
                  </svg>
                  LinkedIn
                </a>
              )}
              {entity.social?.twitter && (
                <a
                  href={entity.social.twitter}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn btn-secondary"
                >
                  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
                  </svg>
                  Twitter/X
                </a>
              )}
            </div>
          </div>

          {/* Connections */}
          {connectedEntities.length > 0 && (
            <div>
              <h3 className="text-xs font-semibold text-foreground-muted uppercase tracking-wider mb-3 flex items-center gap-2">
                Verbindungen
                <span className="px-2 py-0.5 bg-accent/10 text-accent rounded-full text-xs font-bold">
                  {connectedEntities.length}
                </span>
              </h3>
              <div className="space-y-2">
                {connectedEntities.slice(0, 6).map((connected) => (
                  <EntityCard
                    key={connected.id}
                    entity={connected}
                    compact
                    onClick={() => onEntitySelect(connected)}
                  />
                ))}
                {connectedEntities.length > 6 && (
                  <p className="text-sm text-foreground-muted text-center py-2 bg-background-tertiary rounded-lg">
                    +{connectedEntities.length - 6} weitere Verbindungen
                  </p>
                )}
              </div>
            </div>
          )}

          {/* Meta Info */}
          <div className="pt-4 border-t border-border">
            <p className="text-xs text-foreground-muted">
              Zuletzt aktualisiert: {entity.last_updated}
            </p>
            <p className="text-xs text-foreground-muted">Quelle: {entity.data_source}</p>
          </div>
        </div>
      </motion.div>
    </AnimatePresence>
  );
}
