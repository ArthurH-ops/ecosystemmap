'use client';

import { useState, useMemo, useCallback } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import type { Entity, FilterState, ViewMode } from '@/lib/types';
import {
  getAllEntities,
  filterEntities,
  calculateStats,
  getAllTags,
  getAllDistricts,
  defaultFilterState,
} from '@/lib/data';

import Header from '@/components/layout/Header';
import FilterPanel from '@/components/ui/FilterPanel';
import StatsBar from '@/components/ui/StatsBar';
import EntityDetail from '@/components/ui/EntityDetail';
import dynamic from 'next/dynamic';

// Loading skeleton component
function LoadingSkeleton() {
  return (
    <div className="w-full h-full flex items-center justify-center bg-background">
      <div className="flex flex-col items-center gap-4">
        <div className="relative w-16 h-16">
          <div className="absolute inset-0 border-4 border-accent/20 rounded-full" />
          <div className="absolute inset-0 border-4 border-accent border-t-transparent rounded-full animate-spin" />
        </div>
        <div className="text-foreground-muted animate-pulse font-medium">Wird geladen...</div>
      </div>
    </div>
  );
}

// Dynamic imports to avoid SSR issues
const EcosystemMap = dynamic(() => import('@/components/map/EcosystemMap'), {
  ssr: false,
  loading: () => <LoadingSkeleton />,
});

const NetworkGraph = dynamic(() => import('@/components/graph/NetworkGraph'), {
  ssr: false,
  loading: () => <LoadingSkeleton />,
});

export default function Home() {
  const [viewMode, setViewMode] = useState<ViewMode>('map');
  const [filters, setFilters] = useState<FilterState>(defaultFilterState);
  const [selectedEntity, setSelectedEntity] = useState<Entity | null>(null);
  const [sidebarOpen, setSidebarOpen] = useState(true);

  // Get all entities
  const allEntities = useMemo(() => getAllEntities(), []);

  // Filter entities based on current filters
  const filteredEntities = useMemo(
    () => filterEntities(allEntities, filters),
    [allEntities, filters]
  );

  // Calculate stats
  const stats = useMemo(
    () => calculateStats(filteredEntities),
    [filteredEntities]
  );

  // Get all unique tags and districts for filter options
  const allTags = useMemo(() => getAllTags(allEntities), [allEntities]);
  const allDistricts = useMemo(() => getAllDistricts(allEntities), [allEntities]);

  // Handle entity selection
  const handleEntitySelect = useCallback((entity: Entity) => {
    setSelectedEntity(entity);
  }, []);

  // Handle closing entity detail
  const handleCloseDetail = useCallback(() => {
    setSelectedEntity(null);
  }, []);

  return (
    <div className="h-screen flex flex-col overflow-hidden bg-background">
      {/* Header */}
      <Header viewMode={viewMode} onViewModeChange={setViewMode} />

      {/* Stats Bar */}
      <StatsBar stats={stats} />

      {/* Main Content */}
      <div className="flex-1 flex overflow-hidden">
        {/* Sidebar Toggle (Mobile) */}
        <button
          onClick={() => setSidebarOpen(!sidebarOpen)}
          className="lg:hidden fixed bottom-4 left-4 z-40 p-3 rounded-full bg-accent text-white shadow-lg shadow-accent/30 hover:shadow-accent/40 transition-shadow"
          aria-label={sidebarOpen ? 'Filter schließen' : 'Filter öffnen'}
        >
          <svg
            className="w-6 h-6"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            {sidebarOpen ? (
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            ) : (
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z"
              />
            )}
          </svg>
        </button>

        {/* Filter Sidebar */}
        <AnimatePresence>
          {sidebarOpen && (
            <motion.aside
              initial={{ x: -320, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              exit={{ x: -320, opacity: 0 }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              className="w-80 bg-background-secondary border-r border-border shrink-0 overflow-hidden flex flex-col shadow-lg"
            >
              <FilterPanel
                filters={filters}
                onFiltersChange={setFilters}
                totalCount={allEntities.length}
                filteredCount={filteredEntities.length}
                allTags={allTags}
                allDistricts={allDistricts}
              />
            </motion.aside>
          )}
        </AnimatePresence>

        {/* Map / Graph View */}
        <main className="flex-1 relative overflow-hidden">
          <AnimatePresence mode="wait">
            {viewMode === 'map' ? (
              <motion.div
                key="map"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.3 }}
                className="absolute inset-0"
              >
                <EcosystemMap
                  entities={filteredEntities}
                  onEntitySelect={handleEntitySelect}
                  selectedEntityId={selectedEntity?.id}
                />
              </motion.div>
            ) : (
              <motion.div
                key="graph"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.3 }}
                className="absolute inset-0"
              >
                <NetworkGraph
                  entities={filteredEntities}
                  onEntitySelect={handleEntitySelect}
                  selectedEntityId={selectedEntity?.id}
                />
              </motion.div>
            )}
          </AnimatePresence>

          {/* Empty state */}
          {filteredEntities.length === 0 && (
            <div className="absolute inset-0 flex items-center justify-center bg-background">
              <div className="text-center p-8">
                <div className="w-20 h-20 mx-auto mb-6 bg-background-tertiary rounded-full flex items-center justify-center">
                  <svg
                    className="w-10 h-10 text-foreground-muted"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={1.5}
                      d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                    />
                  </svg>
                </div>
                <h3 className="text-xl font-bold text-foreground mb-2">
                  Keine Ergebnisse
                </h3>
                <p className="text-foreground-muted mb-6 max-w-sm">
                  Versuche die Filter anzupassen oder nutze andere Suchbegriffe.
                </p>
                <button
                  onClick={() => setFilters(defaultFilterState)}
                  className="btn btn-primary"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                  </svg>
                  Filter zurücksetzen
                </button>
              </div>
            </div>
          )}
        </main>

        {/* Entity Detail Panel */}
        <EntityDetail
          entity={selectedEntity}
          onClose={handleCloseDetail}
          onEntitySelect={handleEntitySelect}
        />
      </div>
    </div>
  );
}
