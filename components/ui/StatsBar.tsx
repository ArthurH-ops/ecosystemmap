'use client';

import type { EcosystemStats } from '@/lib/types';
import { formatFunding } from '@/lib/data';

interface StatsBarProps {
  stats: EcosystemStats;
}

export default function StatsBar({ stats }: StatsBarProps) {
  const statItems = [
    { label: 'Startups', value: stats.startups, color: '#10b981' },
    { label: 'VCs', value: stats.vcs, color: '#3b82f6' },
    { label: 'Inkubatoren', value: stats.incubators, color: '#f59e0b' },
    { label: 'Universitäten', value: stats.universities, color: '#8b5cf6' },
    { label: 'Coworking', value: stats.coworking, color: '#f97316' },
    { label: 'Total Funding', value: formatFunding(stats.totalFunding), color: '#10b981' },
    { label: 'Connections', value: stats.totalConnections, color: '#14b8a6' },
  ];

  return (
    <div className="flex items-center justify-center gap-6 py-3 px-6 glass border-b border-[#2a2a3a]">
      {statItems.map((item) => (
        <div key={item.label} className="stat-item">
          <span className="stat-value" style={{ color: item.color }}>
            {item.value}
          </span>
          <span className="stat-label">{item.label}</span>
        </div>
      ))}
    </div>
  );
}
