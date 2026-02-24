'use client';

import { useState } from 'react';
import type { FilterState, EntityCategory } from '@/lib/types';
import { CATEGORY_COLORS_MAP } from '@/lib/data';

interface FilterPanelProps {
  filters: FilterState;
  onFiltersChange: (filters: FilterState) => void;
  totalCount: number;
  filteredCount: number;
  allTags: string[];
  allDistricts: string[];
}

const CATEGORIES: EntityCategory[] = [
  'startup',
  'incubator',
  'vc',
  'university',
  'coworking',
  'funding',
  'community',
];

const CATEGORY_LABELS: Record<EntityCategory, string> = {
  startup: 'Startups',
  incubator: 'Inkubatoren',
  vc: 'VCs & Angels',
  university: 'Universitäten',
  coworking: 'Coworking',
  funding: 'Förderungen',
  community: 'Communities',
};

const FUNDING_STAGES = [
  { value: 'pre-seed', label: 'Pre-Seed' },
  { value: 'seed', label: 'Seed' },
  { value: 'series-a', label: 'Series A' },
  { value: 'series-b', label: 'Series B' },
  { value: 'series-c', label: 'Series C' },
  { value: 'growth', label: 'Growth' },
  { value: 'exit', label: 'Exit' },
];

const TEAM_SIZES = ['1-10', '11-50', '51-200', '200+'];

export default function FilterPanel({
  filters,
  onFiltersChange,
  totalCount,
  filteredCount,
  allTags,
  allDistricts,
}: FilterPanelProps) {
  const [showAllTags, setShowAllTags] = useState(false);
  const [showAllDistricts, setShowAllDistricts] = useState(false);

  const toggleCategory = (category: EntityCategory) => {
    const newCategories = filters.categories.includes(category)
      ? filters.categories.filter((c) => c !== category)
      : [...filters.categories, category];
    onFiltersChange({ ...filters, categories: newCategories });
  };

  const toggleSubcategory = (tag: string) => {
    const newSubcategories = filters.subcategories.includes(tag)
      ? filters.subcategories.filter((t) => t !== tag)
      : [...filters.subcategories, tag];
    onFiltersChange({ ...filters, subcategories: newSubcategories });
  };

  const toggleDistrict = (district: string) => {
    const newDistricts = filters.districts.includes(district)
      ? filters.districts.filter((d) => d !== district)
      : [...filters.districts, district];
    onFiltersChange({ ...filters, districts: newDistricts });
  };

  const toggleFundingStage = (stage: any) => {
    const newStages = filters.fundingStages.includes(stage)
      ? filters.fundingStages.filter((s) => s !== stage)
      : [...filters.fundingStages, stage];
    onFiltersChange({ ...filters, fundingStages: newStages });
  };

  const toggleTeamSize = (size: any) => {
    const newSizes = filters.teamSizes.includes(size)
      ? filters.teamSizes.filter((s) => s !== size)
      : [...filters.teamSizes, size];
    onFiltersChange({ ...filters, teamSizes: newSizes });
  };

  const clearAllFilters = () => {
    onFiltersChange({
      search: '',
      categories: [],
      subcategories: [],
      districts: [],
      fundingStages: [],
      teamSizes: [],
    });
  };

  const hasActiveFilters =
    filters.search ||
    filters.categories.length > 0 ||
    filters.subcategories.length > 0 ||
    filters.districts.length > 0 ||
    filters.fundingStages.length > 0 ||
    filters.teamSizes.length > 0;

  const displayTags = showAllTags ? allTags : allTags.slice(0, 10);
  const displayDistricts = showAllDistricts ? allDistricts : allDistricts.slice(0, 8);

  return (
    <div className="h-full overflow-y-auto p-4 space-y-6">
      {/* Results count */}
      <div className="flex items-center justify-between">
        <span className="text-sm text-[#888899]">
          <span className="text-white font-semibold">{filteredCount}</span> von{' '}
          {totalCount} Organisationen
        </span>
        {hasActiveFilters && (
          <button
            onClick={clearAllFilters}
            className="text-xs text-[#10b981] hover:underline"
          >
            Filter zurücksetzen
          </button>
        )}
      </div>

      {/* Search */}
      <div>
        <label className="block text-xs font-semibold text-[#888899] uppercase tracking-wider mb-2">
          Suche
        </label>
        <input
          type="search"
          placeholder="Name, Tags, Beschreibung..."
          value={filters.search}
          onChange={(e) => onFiltersChange({ ...filters, search: e.target.value })}
          className="w-full"
        />
      </div>

      {/* Categories */}
      <div>
        <label className="block text-xs font-semibold text-[#888899] uppercase tracking-wider mb-2">
          Kategorien
        </label>
        <div className="space-y-1">
          {CATEGORIES.map((category) => (
            <label key={category} className="filter-checkbox">
              <input
                type="checkbox"
                checked={filters.categories.includes(category)}
                onChange={() => toggleCategory(category)}
              />
              <div
                className="w-3 h-3 rounded-full"
                style={{ background: CATEGORY_COLORS_MAP[category] }}
              />
              <span className="text-sm text-white">
                {CATEGORY_LABELS[category]}
              </span>
            </label>
          ))}
        </div>
      </div>

      {/* Tags/Subcategories */}
      <div>
        <label className="block text-xs font-semibold text-[#888899] uppercase tracking-wider mb-2">
          Tags
        </label>
        <div className="flex flex-wrap gap-1.5">
          {displayTags.map((tag) => (
            <button
              key={tag}
              onClick={() => toggleSubcategory(tag)}
              className={`px-2.5 py-1 text-xs rounded-full transition-colors ${
                filters.subcategories.includes(tag)
                  ? 'bg-[#10b981] text-[#0a0a0f]'
                  : 'bg-[#1a1a24] text-[#888899] hover:bg-[#2a2a3a]'
              }`}
            >
              {tag}
            </button>
          ))}
          {allTags.length > 10 && (
            <button
              onClick={() => setShowAllTags(!showAllTags)}
              className="px-2.5 py-1 text-xs text-[#10b981] hover:underline"
            >
              {showAllTags ? 'Weniger anzeigen' : `+${allTags.length - 10} mehr`}
            </button>
          )}
        </div>
      </div>

      {/* Districts */}
      <div>
        <label className="block text-xs font-semibold text-[#888899] uppercase tracking-wider mb-2">
          Bezirke
        </label>
        <div className="flex flex-wrap gap-1.5">
          {displayDistricts.map((district) => (
            <button
              key={district}
              onClick={() => toggleDistrict(district)}
              className={`px-2.5 py-1 text-xs rounded-full transition-colors ${
                filters.districts.includes(district)
                  ? 'bg-[#10b981] text-[#0a0a0f]'
                  : 'bg-[#1a1a24] text-[#888899] hover:bg-[#2a2a3a]'
              }`}
            >
              {district}
            </button>
          ))}
          {allDistricts.length > 8 && (
            <button
              onClick={() => setShowAllDistricts(!showAllDistricts)}
              className="px-2.5 py-1 text-xs text-[#10b981] hover:underline"
            >
              {showAllDistricts ? 'Weniger' : `+${allDistricts.length - 8}`}
            </button>
          )}
        </div>
      </div>

      {/* Funding Stage */}
      <div>
        <label className="block text-xs font-semibold text-[#888899] uppercase tracking-wider mb-2">
          Funding Stage
        </label>
        <div className="flex flex-wrap gap-1.5">
          {FUNDING_STAGES.map((stage) => (
            <button
              key={stage.value}
              onClick={() => toggleFundingStage(stage.value)}
              className={`px-2.5 py-1 text-xs rounded-full transition-colors ${
                filters.fundingStages.includes(stage.value as any)
                  ? 'bg-[#10b981] text-[#0a0a0f]'
                  : 'bg-[#1a1a24] text-[#888899] hover:bg-[#2a2a3a]'
              }`}
            >
              {stage.label}
            </button>
          ))}
        </div>
      </div>

      {/* Team Size */}
      <div>
        <label className="block text-xs font-semibold text-[#888899] uppercase tracking-wider mb-2">
          Team-Größe
        </label>
        <div className="flex flex-wrap gap-1.5">
          {TEAM_SIZES.map((size) => (
            <button
              key={size}
              onClick={() => toggleTeamSize(size)}
              className={`px-2.5 py-1 text-xs rounded-full transition-colors ${
                filters.teamSizes.includes(size as any)
                  ? 'bg-[#10b981] text-[#0a0a0f]'
                  : 'bg-[#1a1a24] text-[#888899] hover:bg-[#2a2a3a]'
              }`}
            >
              {size}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
