'use client';

import { useEffect, useRef, useState, useCallback } from 'react';
import type { Entity, GraphData } from '@/lib/types';
import { generateGraphData, CATEGORY_COLORS_MAP } from '@/lib/data';
import dynamic from 'next/dynamic';

// Dynamic import to avoid SSR issues
const ForceGraph2D = dynamic(() => import('react-force-graph-2d'), {
  ssr: false,
});

interface NetworkGraphProps {
  entities: Entity[];
  onEntitySelect: (entity: Entity) => void;
  selectedEntityId?: string;
}

const CATEGORY_LABELS: Record<string, string> = {
  startup: 'Startups',
  incubator: 'Inkubatoren',
  vc: 'VCs & Angels',
  university: 'Universitäten',
  coworking: 'Coworking',
  funding: 'Förderungen',
  community: 'Communities',
};

export default function NetworkGraph({
  entities,
  onEntitySelect,
  selectedEntityId,
}: NetworkGraphProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [dimensions, setDimensions] = useState({ width: 800, height: 600 });
  const [graphData, setGraphData] = useState<GraphData>({ nodes: [], links: [] });
  const [hoveredNode, setHoveredNode] = useState<string | null>(null);
  const [isMounted, setIsMounted] = useState(false);

  // Update dimensions on resize
  useEffect(() => {
    setIsMounted(true);

    const updateDimensions = () => {
      if (containerRef.current) {
        setDimensions({
          width: containerRef.current.offsetWidth,
          height: containerRef.current.offsetHeight,
        });
      }
    };

    updateDimensions();
    window.addEventListener('resize', updateDimensions);
    return () => window.removeEventListener('resize', updateDimensions);
  }, []);

  // Generate graph data when entities change
  useEffect(() => {
    const data = generateGraphData(entities);
    setGraphData(data);
  }, [entities]);

  // Handle node click
  const handleNodeClick = useCallback(
    (node: any) => {
      const entity = entities.find((e) => e.id === node.id);
      if (entity) {
        onEntitySelect(entity);
      }
    },
    [entities, onEntitySelect]
  );

  // Custom node rendering
  const nodeCanvasObject = useCallback(
    (node: any, ctx: CanvasRenderingContext2D, globalScale: number) => {
      const size = node.size || 8;
      const isSelected = node.id === selectedEntityId;
      const isHovered = node.id === hoveredNode;
      const isConnected =
        hoveredNode &&
        graphData.links.some(
          (link: any) =>
            (link.source.id === hoveredNode && link.target.id === node.id) ||
            (link.target.id === hoveredNode && link.source.id === node.id) ||
            node.id === hoveredNode
        );

      // Dim unconnected nodes when hovering
      const alpha = hoveredNode ? (isConnected ? 1 : 0.15) : 1;

      // Draw outer glow for selected/hovered
      if (isSelected || isHovered) {
        ctx.beginPath();
        ctx.arc(node.x, node.y, size + 6, 0, 2 * Math.PI);
        const gradient = ctx.createRadialGradient(
          node.x, node.y, size,
          node.x, node.y, size + 6
        );
        gradient.addColorStop(0, `${node.color}66`);
        gradient.addColorStop(1, 'transparent');
        ctx.fillStyle = gradient;
        ctx.fill();
      }

      // Draw node shadow
      ctx.beginPath();
      ctx.arc(node.x + 1, node.y + 1, size, 0, 2 * Math.PI);
      ctx.fillStyle = 'rgba(0, 0, 0, 0.1)';
      ctx.globalAlpha = alpha;
      ctx.fill();
      ctx.globalAlpha = 1;

      // Draw node
      ctx.beginPath();
      ctx.arc(node.x, node.y, size, 0, 2 * Math.PI);

      // Create gradient for node
      const nodeGradient = ctx.createRadialGradient(
        node.x - size / 3, node.y - size / 3, 0,
        node.x, node.y, size
      );
      nodeGradient.addColorStop(0, node.color);
      nodeGradient.addColorStop(1, `${node.color}cc`);

      ctx.fillStyle = nodeGradient;
      ctx.globalAlpha = alpha;
      ctx.fill();
      ctx.globalAlpha = 1;

      // Draw border
      ctx.strokeStyle = isSelected ? '#0f172a' : 'rgba(255, 255, 255, 0.9)';
      ctx.lineWidth = isSelected ? 3 : 1.5;
      ctx.globalAlpha = alpha;
      ctx.stroke();
      ctx.globalAlpha = 1;

      // Draw label for larger nodes or when zoomed in
      if (size > 10 || globalScale > 1.5 || isSelected || isHovered) {
        const label = node.name;
        const fontSize = Math.max(11, size / 2);
        ctx.font = `600 ${fontSize}px system-ui, -apple-system, sans-serif`;
        ctx.textAlign = 'center';
        ctx.textBaseline = 'top';

        // Text shadow for better readability
        ctx.fillStyle = 'rgba(255, 255, 255, 0.9)';
        ctx.globalAlpha = alpha;

        // Background for label
        const textMetrics = ctx.measureText(label);
        const textWidth = textMetrics.width;
        const textHeight = fontSize;
        const padding = 4;

        ctx.fillStyle = 'rgba(255, 255, 255, 0.95)';
        ctx.fillRect(
          node.x - textWidth / 2 - padding,
          node.y + size + 4,
          textWidth + padding * 2,
          textHeight + padding
        );

        // Draw text
        ctx.fillStyle = '#0f172a';
        ctx.fillText(label, node.x, node.y + size + 6);
        ctx.globalAlpha = 1;
      }
    },
    [selectedEntityId, hoveredNode, graphData.links]
  );

  // Custom link rendering
  const linkCanvasObject = useCallback(
    (link: any, ctx: CanvasRenderingContext2D) => {
      const isConnectedToHovered =
        hoveredNode &&
        (link.source.id === hoveredNode || link.target.id === hoveredNode);

      const alpha = hoveredNode ? (isConnectedToHovered ? 0.8 : 0.05) : 0.25;
      const width = isConnectedToHovered ? 2.5 : 1;

      ctx.beginPath();
      ctx.moveTo(link.source.x, link.source.y);
      ctx.lineTo(link.target.x, link.target.y);

      if (isConnectedToHovered) {
        ctx.strokeStyle = `rgba(16, 185, 129, ${alpha})`;
      } else {
        ctx.strokeStyle = `rgba(100, 116, 139, ${alpha})`;
      }

      ctx.lineWidth = width;
      ctx.stroke();
    },
    [hoveredNode]
  );

  if (!isMounted) {
    return (
      <div className="w-full h-full flex items-center justify-center bg-background">
        <div className="flex flex-col items-center gap-3">
          <div className="w-8 h-8 border-2 border-accent border-t-transparent rounded-full animate-spin" />
          <div className="text-foreground-muted">Graph wird geladen...</div>
        </div>
      </div>
    );
  }

  return (
    <div ref={containerRef} className="w-full h-full bg-background relative">
      {graphData.nodes.length > 0 && (
        <ForceGraph2D
          width={dimensions.width}
          height={dimensions.height}
          graphData={graphData}
          nodeId="id"
          nodeLabel={(node: any) => `${node.name} (${CATEGORY_LABELS[node.category] || node.category})`}
          nodeCanvasObject={nodeCanvasObject}
          linkCanvasObject={linkCanvasObject}
          onNodeClick={handleNodeClick}
          onNodeHover={(node: any) => setHoveredNode(node?.id || null)}
          backgroundColor="#f8fafc"
          linkDirectionalArrowLength={0}
          linkDirectionalArrowRelPos={1}
          cooldownTicks={100}
          d3AlphaDecay={0.02}
          d3VelocityDecay={0.3}
          warmupTicks={50}
          enableNodeDrag={true}
          enableZoomInteraction={true}
          enablePanInteraction={true}
        />
      )}

      {/* Legend */}
      <div className="absolute bottom-4 right-4 p-4 bg-background-secondary/95 backdrop-blur-sm rounded-xl border border-border shadow-lg">
        <h4 className="text-xs font-semibold text-foreground-muted mb-3 uppercase tracking-wider">
          Kategorien
        </h4>
        <div className="space-y-2">
          {Object.entries(CATEGORY_COLORS_MAP).map(([category, color]) => (
            <div key={category} className="flex items-center gap-2.5">
              <div
                className="w-3.5 h-3.5 rounded-full shadow-sm"
                style={{ background: color }}
              />
              <span className="text-xs text-foreground font-medium">
                {CATEGORY_LABELS[category] || category}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Instructions */}
      <div className="absolute top-4 left-4 p-3 bg-background-secondary/95 backdrop-blur-sm rounded-xl border border-border shadow-lg max-w-xs">
        <p className="text-xs text-foreground-muted">
          <span className="font-semibold text-foreground">Tipp:</span> Klicke auf einen Knoten für Details. Ziehe zum Verschieben, scrolle zum Zoomen.
        </p>
      </div>
    </div>
  );
}
