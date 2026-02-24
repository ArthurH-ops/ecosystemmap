'use client';

import { useEffect, useState } from 'react';
import type { Entity } from '@/lib/types';
import { CATEGORY_COLORS_MAP } from '@/lib/data';
import dynamic from 'next/dynamic';

// Dynamic import to avoid SSR issues with Leaflet
const MapContainer = dynamic(
  () => import('react-leaflet').then((mod) => mod.MapContainer),
  { ssr: false }
);
const TileLayer = dynamic(
  () => import('react-leaflet').then((mod) => mod.TileLayer),
  { ssr: false }
);
const Marker = dynamic(
  () => import('react-leaflet').then((mod) => mod.Marker),
  { ssr: false }
);
const Popup = dynamic(
  () => import('react-leaflet').then((mod) => mod.Popup),
  { ssr: false }
);

interface EcosystemMapProps {
  entities: Entity[];
  onEntitySelect: (entity: Entity) => void;
  selectedEntityId?: string;
}

export default function EcosystemMap({
  entities,
  onEntitySelect,
  selectedEntityId,
}: EcosystemMapProps) {
  const [isMounted, setIsMounted] = useState(false);
  const [L, setL] = useState<typeof import('leaflet') | null>(null);

  useEffect(() => {
    setIsMounted(true);
    // Import Leaflet on client side
    import('leaflet').then((leaflet) => {
      setL(leaflet.default);
    });
  }, []);

  // Vienna center coordinates
  const viennaCenter: [number, number] = [48.2082, 16.3738];
  const defaultZoom = 12;

  if (!isMounted || !L) {
    return (
      <div className="w-full h-full flex items-center justify-center bg-[#0a0a0f]">
        <div className="text-[#888899]">Loading map...</div>
      </div>
    );
  }

  // Create custom icon for each category
  const createCustomIcon = (category: string) => {
    const color = CATEGORY_COLORS_MAP[category] || '#888888';
    return L.divIcon({
      className: 'custom-marker',
      html: `<div style="
        width: 16px;
        height: 16px;
        background: ${color};
        border-radius: 50%;
        border: 2px solid white;
        box-shadow: 0 2px 8px rgba(0,0,0,0.3);
      "></div>`,
      iconSize: [16, 16],
      iconAnchor: [8, 8],
      popupAnchor: [0, -10],
    });
  };

  return (
    <MapContainer
      center={viennaCenter}
      zoom={defaultZoom}
      className="w-full h-full"
      style={{ background: '#0a0a0f' }}
    >
      {/* Dark map tiles */}
      <TileLayer
        url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> &copy; <a href="https://carto.com/attributions">CARTO</a>'
      />

      {/* Entity markers */}
      {entities.map((entity) => (
        <Marker
          key={entity.id}
          position={[entity.location.lat, entity.location.lng]}
          icon={createCustomIcon(entity.category)}
          eventHandlers={{
            click: () => onEntitySelect(entity),
          }}
        >
          <Popup>
            <div className="min-w-[200px] p-2">
              <div className="flex items-start gap-3">
                <div
                  className="w-10 h-10 rounded-lg flex items-center justify-center text-white font-bold text-sm shrink-0"
                  style={{ background: CATEGORY_COLORS_MAP[entity.category] }}
                >
                  {entity.name.substring(0, 2).toUpperCase()}
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="font-semibold text-white text-sm truncate">
                    {entity.name}
                  </h3>
                  <p className="text-xs text-[#888899] capitalize">
                    {entity.category}
                  </p>
                </div>
              </div>
              <p className="mt-2 text-xs text-[#888899] line-clamp-2">
                {entity.description}
              </p>
              <div className="mt-2 flex flex-wrap gap-1">
                {entity.tags.slice(0, 3).map((tag) => (
                  <span
                    key={tag}
                    className="px-2 py-0.5 text-[10px] bg-[#1a1a24] rounded-full text-[#888899]"
                  >
                    {tag}
                  </span>
                ))}
              </div>
              <button
                onClick={() => onEntitySelect(entity)}
                className="mt-3 w-full py-1.5 text-xs font-medium bg-[#10b981] text-[#0a0a0f] rounded-md hover:opacity-90 transition-opacity"
              >
                View Details
              </button>
            </div>
          </Popup>
        </Marker>
      ))}
    </MapContainer>
  );
}
