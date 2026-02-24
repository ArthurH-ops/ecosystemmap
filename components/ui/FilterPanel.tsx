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
  const [expandedSections, setExpandedSections] = useState({
    categories: true,
    tags: true,
    districts: false,
    fundingStage: false,
    teamSize: false,
  });

  const toggleSection = (section: keyof typeof expandedSections) => {
    setExpandedSections(prev => ({ ...prev, [section]: !prev[section] }));
  };

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

  const SectionHeader = ({ title, section, count }: { title: string; section: keyof typeof expandedSections; count?: number }) => (
    <button
      onClick={() => toggleSection(section)}
      className="w-full flex items-center justify-between text-xs font-semibold text-foreground-muted uppercase tracking-wider mb-2 hover:text-foreground transition-colors"
    >
      <span className="flex items-center gap-2">
        {title}
        {count !== undefined && count > 0 && (
          <span className="px-1.5 py-0.5 text-[10px] bg-accent text-white rounded-full font-medium">
            {count}
          </span>
        )}
      </span>
      <svg
        className={`w-4 h-4 transition-transform ${expandedSections[section] ? 'rotate-180' : ''}`}
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
      >
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
      </svg>
    </button>
  );

  return (
    <div className="h-full overflow-y-auto p-4 space-y-5 bg-background-secondary">
      {/* Results count */}
      <div className="flex items-center justify-between p-3 bg-background-tertiary rounded-xl">
        <span className="text-sm text-foreground-muted">
          <span className="text-foreground font-bold text-lg">{filteredCount}</span>
          <span className="text-foreground-muted"> / {totalCount}</span>
        </span>
        {hasActiveFilters && (
          <button
            onClick={clearAllFilters}
            className="text-xs font-medium text-accent hover:text-accent/80 transition-colors flex items-center gap-1"
          >
            <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
            Zurücksetzen
          </button>
        )}
      </div>

      {/* Search */}
      <div>
        <label className="block text-xs font-semibold text-foreground-muted uppercase tracking-wider mb-2">
          Suche
        </label>
        <div className="relative">
          <svg
            className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-foreground-muted"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
          <input
            type="search"
            placeholder="Name, Tags, Beschreibung..."
            value={filters.search}
            onChange={(e) => onFiltersChange({ ...filters, search: e.target.value })}
            className="w-full pl-10"
          />
        </div>
      </div>

      {/* Categories */}
      <div>
        <SectionHeader title="Kategorien" section="categories" count={filters.categories.length} />
        {expandedSections.categories && (
          <div className="space-y-1 animate-fadeIn">
            {CATEGORIES.map((category) => (
              <label key={category} className="filter-checkbox">
                <input
                  type="checkbox"
                  checked={filters.categories.includes(category)}
                  onChange={() => toggleCategory(category)}
                />
                <div
                  className="w-3 h-3 rounded-full shadow-sm"
                  style={{ background: CATEGORY_COLORS_MAP[category] }}
                />
                <span className="text-sm text-foreground">
                  {CATEGORY_LABELS[category]}
                </span>
              </label>
            ))}
          </div>
        )}
      </div>

      {/* Tags/Subcategories */}
      <div>
        <SectionHeader title="Tags" section="tags" count={filters.subcategories.length} />
        {expandedSections.tags && (
          <div className="flex flex-wrap gap-1.5 animate-fadeIn">
            {displayTags.map((tag) => (
              <button
                key={tag}
                onClick={() => toggleSubcategory(tag)}
                className={`tag-pill ${filters.subcategories.includes(tag) ? 'active' : ''}`}
              >
                {tag}
              </button>
            ))}
            {allTags.length > 10 && (
              <button
                onClick={() => setShowAllTags(!showAllTags)}
                className="px-2.5 py-1 text-xs text-accent hover:underline font-medium"
              >
                {showAllTags ? 'Weniger' : `+${allTags.length - 10}`}
              </button>
            )}
          </div>
        )}
      </div>

      {/* Districts */}
      <div>
        <SectionHeader title="Bezirke" section="districts" count={filters.districts.length} />
        {expandedSections.districts && (
          <div className="flex flex-wrap gap-1.5 animate-fadeIn">
            {displayDistricts.map((district) => (
              <button
                key={district}
                onClick={() => toggleDistrict(district)}
                className={`tag-pill ${filters.districts.includes(district) ? 'active' : ''}`}
              >
                {district}
              </button>
            ))}
            {allDistricts.length > 8 && (
              <button
                onClick={() => setShowAllDistricts(!showAllDistricts)}
                className="px-2.5 py-1 text-xs text-accent hover:underline font-medium"
              >
                {showAllDistricts ? 'Weniger' : `+${allDistricts.length - 8}`}
              </button>
            )}
          </div>
        )}
      </div>

      {/* Funding Stage */}
      <div>
        <SectionHeader title="Funding Stage" section="fundingStage" count={filters.fundingStages.length} />
        {expandedSections.fundingStage && (
          <div className="flex flex-wrap gap-1.5 animate-fadeIn">
            {FUNDING_STAGES.map((stage) => (
              <button
                key={stage.value}
                onClick={() => toggleFundingStage(stage.value)}
                className={`tag-pill ${filters.fundingStages.includes(stage.value as any) ? 'active' : ''}`}
              >
                {stage.label}
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Team Size */}
      <div>
        <SectionHeader title="Team-Größe" section="teamSize" count={filters.teamSizes.length} />
        {expandedSections.teamSize && (
          <div className="flex flex-wrap gap-1.5 animate-fadeIn">
            {TEAM_SIZES.map((size) => (
              <button
                key={size}
                onClick={() => toggleTeamSize(size)}
                className={`tag-pill ${filters.teamSizes.includes(size as any) ? 'active' : ''}`}
              >
                {size}
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
