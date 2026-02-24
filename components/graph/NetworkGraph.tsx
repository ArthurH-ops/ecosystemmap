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
      const alpha = hoveredNode ? (isConnected ? 1 : 0.2) : 1;

      // Draw outer glow for selected/hovered
      if (isSelected || isHovered) {
        ctx.beginPath();
        ctx.arc(node.x, node.y, size + 4, 0, 2 * Math.PI);
        ctx.fillStyle = `rgba(255, 255, 255, 0.3)`;
        ctx.fill();
      }

      // Draw node
      ctx.beginPath();
      ctx.arc(node.x, node.y, size, 0, 2 * Math.PI);
      ctx.fillStyle = node.color;
      ctx.globalAlpha = alpha;
      ctx.fill();
      ctx.globalAlpha = 1;

      // Draw border
      ctx.strokeStyle = 'rgba(255, 255, 255, 0.8)';
      ctx.lineWidth = isSelected ? 2 : 1;
      ctx.stroke();

      // Draw label for larger nodes or when zoomed in
      if (size > 10 || globalScale > 1.5) {
        const label = node.name;
        const fontSize = Math.max(10, size / 2);
        ctx.font = `${fontSize}px sans-serif`;
        ctx.textAlign = 'center';
        ctx.textBaseline = 'top';
        ctx.fillStyle = 'rgba(255, 255, 255, 0.9)';
        ctx.globalAlpha = alpha;
        ctx.fillText(label, node.x, node.y + size + 4);
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

      const alpha = hoveredNode ? (isConnectedToHovered ? 0.8 : 0.1) : 0.3;
      const width = isConnectedToHovered ? 2 : 1;

      ctx.beginPath();
      ctx.moveTo(link.source.x, link.source.y);
      ctx.lineTo(link.target.x, link.target.y);
      ctx.strokeStyle = `rgba(136, 136, 153, ${alpha})`;
      ctx.lineWidth = width;
      ctx.stroke();
    },
    [hoveredNode]
  );

  if (!isMounted) {
    return (
      <div className="w-full h-full flex items-center justify-center bg-[#0a0a0f]">
        <div className="text-[#888899]">Loading graph...</div>
      </div>
    );
  }

  return (
    <div ref={containerRef} className="w-full h-full bg-[#0a0a0f]">
      {graphData.nodes.length > 0 && (
        <ForceGraph2D
          width={dimensions.width}
          height={dimensions.height}
          graphData={graphData}
          nodeId="id"
          nodeLabel={(node: any) => `${node.name} (${node.category})`}
          nodeCanvasObject={nodeCanvasObject}
          linkCanvasObject={linkCanvasObject}
          onNodeClick={handleNodeClick}
          onNodeHover={(node: any) => setHoveredNode(node?.id || null)}
          backgroundColor="#0a0a0f"
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
      <div className="absolute bottom-4 right-4 p-4 glass rounded-lg border border-[#2a2a3a]">
        <h4 className="text-xs font-semibold text-[#888899] mb-2 uppercase tracking-wider">
          Categories
        </h4>
        <div className="space-y-1.5">
          {Object.entries(CATEGORY_COLORS_MAP).map(([category, color]) => (
            <div key={category} className="flex items-center gap-2">
              <div
                className="w-3 h-3 rounded-full"
                style={{ background: color }}
              />
              <span className="text-xs text-[#888899] capitalize">
                {category === 'vc' ? 'VCs & Angels' : category}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
