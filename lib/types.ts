// Entity Categories
export type EntityCategory =
  | 'startup'
  | 'incubator'
  | 'vc'
  | 'university'
  | 'coworking'
  | 'funding'
  | 'community';

// Subcategories / Tags
export type EntitySubcategory =
  | 'deeptech'
  | 'biotech'
  | 'fintech'
  | 'climate'
  | 'healthtech'
  | 'edtech'
  | 'proptech'
  | 'mobility'
  | 'saas'
  | 'ai'
  | 'hardware'
  | 'marketplace'
  | 'b2b'
  | 'b2c'
  | 'enterprise'
  | 'sustainability'
  | 'energy'
  | 'foodtech'
  | 'legaltech'
  | 'insurtech'
  | 'cybersecurity'
  | 'blockchain'
  | 'iot'
  | 'robotics'
  | 'space'
  | 'quantum'
  | 'other';

// Funding Stages
export type FundingStage =
  | 'pre-seed'
  | 'seed'
  | 'series-a'
  | 'series-b'
  | 'series-c'
  | 'growth'
  | 'exit'
  | null;

// Team Size Ranges
export type TeamSize = '1-10' | '11-50' | '51-200' | '200+' | null;

// Relationship Types
export type RelationshipType =
  | 'invested_in'
  | 'incubated_by'
  | 'accelerated_by'
  | 'partnered_with'
  | 'founded_at'
  | 'member_of'
  | 'funded_by'
  | 'spinoff_from'
  | 'acquired_by'
  | 'mentored_by';

// Location
export interface Location {
  address: string;
  district: string; // 1.-23. Bezirk
  lat: number;
  lng: number;
}

// Social Links
export interface SocialLinks {
  linkedin?: string;
  twitter?: string;
  github?: string;
  instagram?: string;
}

// Connection between entities
export interface Connection {
  target_id: string;
  relationship: RelationshipType;
}

// Main Entity Interface
export interface Entity {
  id: string;
  name: string;
  category: EntityCategory;
  subcategory?: EntitySubcategory;
  description: string;
  website?: string;
  logo_url?: string;
  location: Location;
  founded_year?: number;
  tags: string[];
  funding_stage?: FundingStage;
  total_funding_eur?: number;
  team_size?: TeamSize;
  connections: Connection[];
  social?: SocialLinks;
  last_updated: string;
  data_source: string;
}

// Category Colors for consistent styling
export const CATEGORY_COLORS: Record<EntityCategory, string> = {
  startup: '#10b981',    // Emerald
  incubator: '#f59e0b',  // Amber
  vc: '#3b82f6',         // Blue
  university: '#8b5cf6', // Purple
  coworking: '#f97316',  // Orange
  funding: '#ef4444',    // Red
  community: '#14b8a6',  // Teal
};

// Category Labels
export const CATEGORY_LABELS: Record<EntityCategory, string> = {
  startup: 'Startups',
  incubator: 'Inkubatoren & Acceleratoren',
  vc: 'VCs & Angels',
  university: 'Universitäten & Forschung',
  coworking: 'Coworking Spaces',
  funding: 'Öffentliche Förderungen',
  community: 'Communities & Events',
};

// Filter State
export interface FilterState {
  search: string;
  categories: EntityCategory[];
  subcategories: string[];
  districts: string[];
  fundingStages: FundingStage[];
  teamSizes: TeamSize[];
}

// View Mode
export type ViewMode = 'map' | 'graph';

// Graph Node (for D3/Force Graph)
export interface GraphNode {
  id: string;
  name: string;
  category: EntityCategory;
  color: string;
  size: number;
  x?: number;
  y?: number;
  fx?: number;
  fy?: number;
}

// Graph Link (for D3/Force Graph)
export interface GraphLink {
  source: string;
  target: string;
  relationship: RelationshipType;
}

// Graph Data
export interface GraphData {
  nodes: GraphNode[];
  links: GraphLink[];
}

// Stats
export interface EcosystemStats {
  totalEntities: number;
  startups: number;
  incubators: number;
  vcs: number;
  universities: number;
  coworking: number;
  funding: number;
  communities: number;
  totalFunding: number;
  totalConnections: number;
}
