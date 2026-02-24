import type { Entity, GraphData, GraphNode, GraphLink, EcosystemStats, FilterState, CATEGORY_COLORS } from './types';

// Import JSON data
import startupsData from '@/data/entities/startups.json';
import vcsData from '@/data/entities/vcs.json';
import incubatorsData from '@/data/entities/incubators.json';
import universitiesData from '@/data/entities/universities.json';
import coworkingData from '@/data/entities/coworking.json';
import fundingData from '@/data/entities/funding.json';
import communitiesData from '@/data/entities/communities.json';

// Category colors for consistent styling
export const CATEGORY_COLORS_MAP: Record<string, string> = {
  startup: '#10b981',
  incubator: '#f59e0b',
  vc: '#3b82f6',
  university: '#8b5cf6',
  coworking: '#f97316',
  funding: '#ef4444',
  community: '#14b8a6',
};

// Helper function to convert JSON data to Entity type
function normalizeEntities(data: unknown[]): Entity[] {
  return (data as any[]).map(item => ({
    ...item,
    // Convert null to undefined for optional fields
    total_funding_eur: item.total_funding_eur ?? undefined,
    funding_stage: item.funding_stage ?? undefined,
    team_size: item.team_size ?? undefined,
    founded_year: item.founded_year ?? undefined,
    website: item.website ?? undefined,
    logo_url: item.logo_url ?? undefined,
    subcategory: item.subcategory ?? undefined,
    social: item.social ?? undefined,
  }));
}

// Load all entities
export function getAllEntities(): Entity[] {
  return [
    ...normalizeEntities(startupsData),
    ...normalizeEntities(vcsData),
    ...normalizeEntities(incubatorsData),
    ...normalizeEntities(universitiesData),
    ...normalizeEntities(coworkingData),
    ...normalizeEntities(fundingData),
    ...normalizeEntities(communitiesData),
  ];
}

// Get entity by ID
export function getEntityById(id: string): Entity | undefined {
  const allEntities = getAllEntities();
  return allEntities.find(entity => entity.id === id);
}

// Get entities by category
export function getEntitiesByCategory(category: string): Entity[] {
  const allEntities = getAllEntities();
  return allEntities.filter(entity => entity.category === category);
}

// Filter entities based on filter state
export function filterEntities(entities: Entity[], filters: FilterState): Entity[] {
  return entities.filter(entity => {
    // Search filter
    if (filters.search) {
      const searchLower = filters.search.toLowerCase();
      const matchesSearch =
        entity.name.toLowerCase().includes(searchLower) ||
        entity.description.toLowerCase().includes(searchLower) ||
        entity.tags.some(tag => tag.toLowerCase().includes(searchLower));
      if (!matchesSearch) return false;
    }

    // Category filter
    if (filters.categories.length > 0 && !filters.categories.includes(entity.category)) {
      return false;
    }

    // Subcategory/tag filter
    if (filters.subcategories.length > 0) {
      const hasMatchingTag = entity.tags.some(tag =>
        filters.subcategories.includes(tag)
      );
      if (!hasMatchingTag && entity.subcategory && !filters.subcategories.includes(entity.subcategory)) {
        return false;
      }
    }

    // District filter
    if (filters.districts.length > 0 && !filters.districts.includes(entity.location.district)) {
      return false;
    }

    // Funding stage filter (only for startups)
    if (filters.fundingStages.length > 0 && entity.category === 'startup') {
      if (!entity.funding_stage || !filters.fundingStages.includes(entity.funding_stage)) {
        return false;
      }
    }

    // Team size filter
    if (filters.teamSizes.length > 0 && entity.team_size) {
      if (!filters.teamSizes.includes(entity.team_size)) {
        return false;
      }
    }

    return true;
  });
}

// Generate graph data from entities
export function generateGraphData(entities: Entity[]): GraphData {
  const entityIds = new Set(entities.map(e => e.id));

  const nodes: GraphNode[] = entities.map(entity => ({
    id: entity.id,
    name: entity.name,
    category: entity.category,
    color: CATEGORY_COLORS_MAP[entity.category] || '#888888',
    size: calculateNodeSize(entity),
  }));

  const links: GraphLink[] = [];

  entities.forEach(entity => {
    entity.connections.forEach(conn => {
      // Only include links where both source and target exist in filtered entities
      if (entityIds.has(conn.target_id)) {
        links.push({
          source: entity.id,
          target: conn.target_id,
          relationship: conn.relationship,
        });
      }
    });
  });

  return { nodes, links };
}

// Calculate node size based on entity properties
function calculateNodeSize(entity: Entity): number {
  let size = 8; // Base size

  // Increase size based on funding
  if (entity.total_funding_eur) {
    if (entity.total_funding_eur > 100000000) size += 12;
    else if (entity.total_funding_eur > 50000000) size += 8;
    else if (entity.total_funding_eur > 10000000) size += 5;
    else if (entity.total_funding_eur > 1000000) size += 3;
  }

  // Increase size based on team size
  if (entity.team_size === '200+') size += 4;
  else if (entity.team_size === '51-200') size += 3;
  else if (entity.team_size === '11-50') size += 2;

  // Increase size based on connections
  size += Math.min(entity.connections.length, 5);

  // Category-specific adjustments
  if (entity.category === 'university' || entity.category === 'funding') {
    size += 4; // Make institutions more prominent
  }

  return size;
}

// Calculate ecosystem stats
export function calculateStats(entities: Entity[]): EcosystemStats {
  const allEntities = getAllEntities();

  return {
    totalEntities: entities.length,
    startups: entities.filter(e => e.category === 'startup').length,
    incubators: entities.filter(e => e.category === 'incubator').length,
    vcs: entities.filter(e => e.category === 'vc').length,
    universities: entities.filter(e => e.category === 'university').length,
    coworking: entities.filter(e => e.category === 'coworking').length,
    funding: entities.filter(e => e.category === 'funding').length,
    communities: entities.filter(e => e.category === 'community').length,
    totalFunding: entities
      .filter(e => e.total_funding_eur)
      .reduce((sum, e) => sum + (e.total_funding_eur || 0), 0),
    totalConnections: entities
      .reduce((sum, e) => sum + e.connections.length, 0),
  };
}

// Get all unique tags from entities
export function getAllTags(entities: Entity[]): string[] {
  const tagSet = new Set<string>();
  entities.forEach(entity => {
    entity.tags.forEach(tag => tagSet.add(tag));
  });
  return Array.from(tagSet).sort();
}

// Get all unique districts from entities
export function getAllDistricts(entities: Entity[]): string[] {
  const districtSet = new Set<string>();
  entities.forEach(entity => {
    if (entity.location.district) {
      districtSet.add(entity.location.district);
    }
  });
  return Array.from(districtSet).sort((a, b) => {
    const numA = parseInt(a) || 999;
    const numB = parseInt(b) || 999;
    return numA - numB;
  });
}

// Format funding amount
export function formatFunding(amount: number): string {
  if (amount >= 1000000000) {
    return `€${(amount / 1000000000).toFixed(1)}B`;
  }
  if (amount >= 1000000) {
    return `€${(amount / 1000000).toFixed(1)}M`;
  }
  if (amount >= 1000) {
    return `€${(amount / 1000).toFixed(0)}K`;
  }
  return `€${amount}`;
}

// Get connected entities
export function getConnectedEntities(entityId: string): Entity[] {
  const allEntities = getAllEntities();
  const entity = getEntityById(entityId);

  if (!entity) return [];

  const connectedIds = new Set(entity.connections.map(c => c.target_id));

  // Also find entities that connect to this entity
  allEntities.forEach(e => {
    e.connections.forEach(conn => {
      if (conn.target_id === entityId) {
        connectedIds.add(e.id);
      }
    });
  });

  return allEntities.filter(e => connectedIds.has(e.id));
}

// Default filter state
export const defaultFilterState: FilterState = {
  search: '',
  categories: [],
  subcategories: [],
  districts: [],
  fundingStages: [],
  teamSizes: [],
};
