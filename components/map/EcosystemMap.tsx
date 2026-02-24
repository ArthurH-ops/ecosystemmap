'use client';

import { useEffect, useState, useMemo } from 'react';
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
const ZoomControl = dynamic(
  () => import('react-leaflet').then((mod) => mod.ZoomControl),
  { ssr: false }
);

interface EcosystemMapProps {
  entities: Entity[];
  onEntitySelect: (entity: Entity) => void;
  selectedEntityId?: string;
}

// Category icons as SVG
const CATEGORY_ICONS: Record<string, string> = {
  startup: `<svg viewBox="0 0 24 24" fill="currentColor"><path d="M13.13 22.19L11.5 18.36C13.07 17.78 14.54 17 15.9 16.09L13.13 22.19M5.64 12.5L1.81 10.87L7.91 8.1C7 9.46 6.22 10.93 5.64 12.5M21.61 2.39C21.61 2.39 16.66 .269 11 5.93C8.81 8.12 7.5 10.53 6.65 12.64C6.37 13.39 6.56 14.21 7.11 14.77L9.24 16.89C9.79 17.45 10.61 17.63 11.36 17.35C13.5 16.53 15.88 15.19 18.07 13C23.73 7.34 21.61 2.39 21.61 2.39M14.54 9.46C13.76 8.68 13.76 7.41 14.54 6.63S16.59 5.85 17.37 6.63C18.14 7.41 18.15 8.68 17.37 9.46C16.59 10.24 15.32 10.24 14.54 9.46M8.88 16.53L7.47 15.12L8.88 16.53M6.24 22L9.88 18.36C9.54 18.27 9.21 18.12 8.91 17.91L4.83 22H6.24M2 22H3.41L8.18 17.24L6.76 15.83L2 20.59V22M2 19.17L6.09 15.09C5.88 14.79 5.73 14.47 5.64 14.12L2 17.76V19.17Z"/></svg>`,
  incubator: `<svg viewBox="0 0 24 24" fill="currentColor"><path d="M12,3L2,12H5V20H19V12H22L12,3M12,8.75A2.25,2.25 0 0,1 14.25,11A2.25,2.25 0 0,1 12,13.25A2.25,2.25 0 0,1 9.75,11A2.25,2.25 0 0,1 12,8.75M12,15C13.5,15 16.5,15.75 16.5,17.25V18H7.5V17.25C7.5,15.75 10.5,15 12,15Z"/></svg>`,
  vc: `<svg viewBox="0 0 24 24" fill="currentColor"><path d="M12,2A10,10 0 0,1 22,12A10,10 0 0,1 12,22A10,10 0 0,1 2,12A10,10 0 0,1 12,2M12,4A8,8 0 0,0 4,12A8,8 0 0,0 12,20A8,8 0 0,0 20,12A8,8 0 0,0 12,4M11,17V16H9V14H13V13H10A1,1 0 0,1 9,12V9A1,1 0 0,1 10,8H11V7H13V8H15V10H11V11H14A1,1 0 0,1 15,12V15A1,1 0 0,1 14,16H13V17H11Z"/></svg>`,
  university: `<svg viewBox="0 0 24 24" fill="currentColor"><path d="M12,3L1,9L12,15L21,10.09V17H23V9M5,13.18V17.18L12,21L19,17.18V13.18L12,17L5,13.18Z"/></svg>`,
  coworking: `<svg viewBox="0 0 24 24" fill="currentColor"><path d="M19,19H5V8H19M16,1V3H8V1H6V3H5C3.89,3 3,3.89 3,5V19A2,2 0 0,0 5,21H19A2,2 0 0,0 21,19V5C21,3.89 20.1,3 19,3H18V1M17,12H12V17H17V12Z"/></svg>`,
  funding: `<svg viewBox="0 0 24 24" fill="currentColor"><path d="M5,6H23V18H5V6M14,9A3,3 0 0,1 17,12A3,3 0 0,1 14,15A3,3 0 0,1 11,12A3,3 0 0,1 14,9M9,8A2,2 0 0,1 7,10V14A2,2 0 0,1 9,16H19A2,2 0 0,1 21,14V10A2,2 0 0,1 19,8H9M1,10H3V20H19V22H1V10Z"/></svg>`,
  community: `<svg viewBox="0 0 24 24" fill="currentColor"><path d="M16,13C15.71,13 15.38,13 15.03,13.05C16.19,13.89 17,15 17,16.5V19H23V16.5C23,14.17 18.33,13 16,13M8,13C5.67,13 1,14.17 1,16.5V19H15V16.5C15,14.17 10.33,13 8,13M8,11A3,3 0 0,0 11,8A3,3 0 0,0 8,5A3,3 0 0,0 5,8A3,3 0 0,0 8,11M16,11A3,3 0 0,0 19,8A3,3 0 0,0 16,5A3,3 0 0,0 13,8A3,3 0 0,0 16,11Z"/></svg>`,
};

export default function EcosystemMap({
  entities,
  onEntitySelect,
  selectedEntityId,
}: EcosystemMapProps) {
  const [isMounted, setIsMounted] = useState(false);
  const [L, setL] = useState<typeof import('leaflet') | null>(null);

  useEffect(() => {
    setIsMounted(true);
    import('leaflet').then((leaflet) => {
      setL(leaflet.default);
    });
  }, []);

  // Vienna center coordinates
  const viennaCenter: [number, number] = [48.2082, 16.3738];
  const defaultZoom = 12;

  // Memoize icon creation
  const createCustomIcon = useMemo(() => {
    if (!L) return null;

    return (category: string, isSelected: boolean = false) => {
      const color = CATEGORY_COLORS_MAP[category] || '#888888';
      const size = isSelected ? 44 : 36;
      const iconSize = isSelected ? 20 : 16;

      return L.divIcon({
        className: 'custom-marker-wrapper',
        html: `
          <div class="marker-container ${isSelected ? 'selected' : ''}" style="
            width: ${size}px;
            height: ${size}px;
            position: relative;
          ">
            ${isSelected ? `
              <div style="
                position: absolute;
                inset: 0;
                background: ${color};
                border-radius: 50%;
                opacity: 0.2;
                animation: pulse-ring 1.5s ease-out infinite;
              "></div>
            ` : ''}
            <div style="
              position: absolute;
              top: 50%;
              left: 50%;
              transform: translate(-50%, -50%);
              width: ${size - 8}px;
              height: ${size - 8}px;
              background: linear-gradient(135deg, ${color} 0%, ${adjustColor(color, -20)} 100%);
              border-radius: 50%;
              border: 3px solid white;
              box-shadow: 0 4px 12px rgba(0,0,0,0.3), 0 2px 4px rgba(0,0,0,0.2);
              display: flex;
              align-items: center;
              justify-content: center;
              transition: transform 0.2s ease, box-shadow 0.2s ease;
            ">
              <div style="
                width: ${iconSize}px;
                height: ${iconSize}px;
                color: white;
                opacity: 0.95;
              ">
                ${CATEGORY_ICONS[category] || CATEGORY_ICONS.startup}
              </div>
            </div>
          </div>
        `,
        iconSize: [size, size],
        iconAnchor: [size / 2, size / 2],
        popupAnchor: [0, -size / 2],
      });
    };
  }, [L]);

  if (!isMounted || !L || !createCustomIcon) {
    return (
      <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-slate-100 to-slate-200">
        <div className="flex flex-col items-center gap-4">
          <div className="relative">
            <div className="w-16 h-16 border-4 border-emerald-200 rounded-full"></div>
            <div className="absolute top-0 left-0 w-16 h-16 border-4 border-emerald-500 rounded-full border-t-transparent animate-spin"></div>
          </div>
          <p className="text-slate-600 font-medium">Karte wird geladen...</p>
        </div>
      </div>
    );
  }

  return (
    <MapContainer
      center={viennaCenter}
      zoom={defaultZoom}
      className="w-full h-full"
      zoomControl={false}
      style={{ background: '#f1f5f9' }}
    >
      {/* Light, clean map tiles - Positron (light) */}
      <TileLayer
        url="https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png"
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> &copy; <a href="https://carto.com/attributions">CARTO</a>'
      />

      {/* Custom zoom control position */}
      <ZoomControl position="bottomright" />

      {/* Entity markers */}
      {entities.map((entity) => (
        <Marker
          key={entity.id}
          position={[entity.location.lat, entity.location.lng]}
          icon={createCustomIcon(entity.category, entity.id === selectedEntityId)}
          eventHandlers={{
            click: () => onEntitySelect(entity),
          }}
        >
          <Popup className="custom-popup">
            <div className="min-w-[280px] max-w-[320px]">
              {/* Header */}
              <div className="flex items-start gap-3 p-4 border-b border-slate-100">
                <div
                  className="w-12 h-12 rounded-xl flex items-center justify-center text-white shadow-lg shrink-0"
                  style={{
                    background: `linear-gradient(135deg, ${CATEGORY_COLORS_MAP[entity.category]} 0%, ${adjustColor(CATEGORY_COLORS_MAP[entity.category], -20)} 100%)`
                  }}
                >
                  <div
                    className="w-6 h-6"
                    dangerouslySetInnerHTML={{ __html: CATEGORY_ICONS[entity.category] || CATEGORY_ICONS.startup }}
                  />
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="font-bold text-slate-800 text-base leading-tight">
                    {entity.name}
                  </h3>
                  <div className="flex items-center gap-2 mt-1">
                    <span
                      className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium text-white"
                      style={{ background: CATEGORY_COLORS_MAP[entity.category] }}
                    >
                      {entity.category === 'vc' ? 'VC & Angels' : entity.category.charAt(0).toUpperCase() + entity.category.slice(1)}
                    </span>
                    {entity.location.district && (
                      <span className="text-xs text-slate-500">
                        {entity.location.district}. Bezirk
                      </span>
                    )}
                  </div>
                </div>
              </div>

              {/* Body */}
              <div className="p-4 space-y-3">
                <p className="text-sm text-slate-600 leading-relaxed line-clamp-3">
                  {entity.description}
                </p>

                {/* Tags */}
                <div className="flex flex-wrap gap-1.5">
                  {entity.tags.slice(0, 4).map((tag) => (
                    <span
                      key={tag}
                      className="px-2 py-1 text-xs bg-slate-100 text-slate-600 rounded-md font-medium"
                    >
                      {tag}
                    </span>
                  ))}
                  {entity.tags.length > 4 && (
                    <span className="px-2 py-1 text-xs text-slate-400">
                      +{entity.tags.length - 4}
                    </span>
                  )}
                </div>

                {/* Meta info */}
                <div className="flex items-center gap-3 text-xs text-slate-500 pt-1">
                  {entity.founded_year && (
                    <span className="flex items-center gap-1">
                      <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                      </svg>
                      {entity.founded_year}
                    </span>
                  )}
                  {entity.team_size && (
                    <span className="flex items-center gap-1">
                      <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                      </svg>
                      {entity.team_size}
                    </span>
                  )}
                </div>
              </div>

              {/* Footer */}
              <div className="p-4 pt-0">
                <button
                  onClick={() => onEntitySelect(entity)}
                  className="w-full py-2.5 text-sm font-semibold text-white rounded-lg transition-all hover:opacity-90 hover:shadow-lg active:scale-[0.98]"
                  style={{
                    background: `linear-gradient(135deg, ${CATEGORY_COLORS_MAP[entity.category]} 0%, ${adjustColor(CATEGORY_COLORS_MAP[entity.category], -15)} 100%)`
                  }}
                >
                  Details anzeigen
                </button>
              </div>
            </div>
          </Popup>
        </Marker>
      ))}

      {/* Map Legend */}
      <div className="absolute bottom-24 right-4 z-[1000] bg-white/95 backdrop-blur-sm rounded-xl shadow-lg border border-slate-200 p-4">
        <h4 className="text-xs font-bold text-slate-700 mb-3 uppercase tracking-wider">
          Legende
        </h4>
        <div className="space-y-2">
          {Object.entries(CATEGORY_COLORS_MAP).map(([category, color]) => (
            <div key={category} className="flex items-center gap-2.5">
              <div
                className="w-4 h-4 rounded-full shadow-sm"
                style={{ background: color }}
              />
              <span className="text-xs text-slate-600 font-medium capitalize">
                {category === 'vc' ? 'VCs & Angels' : category}
              </span>
            </div>
          ))}
        </div>
      </div>
    </MapContainer>
  );
}

// Helper function to adjust color brightness
function adjustColor(color: string, amount: number): string {
  const hex = color.replace('#', '');
  const num = parseInt(hex, 16);
  const r = Math.min(255, Math.max(0, (num >> 16) + amount));
  const g = Math.min(255, Math.max(0, ((num >> 8) & 0x00ff) + amount));
  const b = Math.min(255, Math.max(0, (num & 0x0000ff) + amount));
  return `#${((r << 16) | (g << 8) | b).toString(16).padStart(6, '0')}`;
}
