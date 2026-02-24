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

// Dynamic imports to avoid SSR issues
const EcosystemMap = dynamic(() => import('@/components/map/EcosystemMap'), {
  ssr: false,
  loading: () => (
    <div className="w-full h-full flex items-center justify-center bg-[#0a0a0f]">
      <div className="text-[#888899] animate-pulse">Karte wird geladen...</div>
    </div>
  ),
});

const NetworkGraph = dynamic(() => import('@/components/graph/NetworkGraph'), {
  ssr: false,
  loading: () => (
    <div className="w-full h-full flex items-center justify-center bg-[#0a0a0f]">
      <div className="text-[#888899] animate-pulse">Graph wird geladen...</div>
    </div>
  ),
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
    <div className="h-screen flex flex-col overflow-hidden">
      {/* Header */}
      <Header viewMode={viewMode} onViewModeChange={setViewMode} />

      {/* Stats Bar */}
      <StatsBar stats={stats} />

      {/* Main Content */}
      <div className="flex-1 flex overflow-hidden">
        {/* Sidebar Toggle (Mobile) */}
        <button
          onClick={() => setSidebarOpen(!sidebarOpen)}
          className="lg:hidden fixed bottom-4 left-4 z-40 p-3 rounded-full bg-[#10b981] text-[#0a0a0f] shadow-lg"
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
              className="w-80 bg-[#111118] border-r border-[#2a2a3a] shrink-0 overflow-hidden flex flex-col"
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
            <div className="absolute inset-0 flex items-center justify-center bg-[#0a0a0f]">
              <div className="text-center">
                <svg
                  className="w-16 h-16 mx-auto text-[#888899] mb-4"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={1.5}
                    d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
                <h3 className="text-lg font-semibold text-white mb-2">
                  Keine Ergebnisse
                </h3>
                <p className="text-[#888899] mb-4">
                  Versuche die Filter anzupassen
                </p>
                <button
                  onClick={() => setFilters(defaultFilterState)}
                  className="btn btn-primary"
                >
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
