import { GraphData } from "@/lib/algorithms/types";
import { motion } from "framer-motion";

interface GraphVisualizerProps {
  data: GraphData | null | undefined;
  currentNodeId?: string;
  visitedIds?: string[];
}

export function GraphVisualizer({ data, currentNodeId, visitedIds = [] }: GraphVisualizerProps) {
  if (!data || data.nodes.length === 0) {
    return (
      <div className="w-full h-[400px] flex items-center justify-center text-muted-foreground">
        Empty Graph
      </div>
    );
  }

  return (
    <div className="w-full h-[400px] overflow-hidden bg-black/5 rounded-xl border border-white/10 relative">
      <svg width="100%" height="100%" viewBox="0 0 800 400" preserveAspectRatio="xMidYMid meet">
        {/* Edges */}
        {data.edges.map((edge, i) => {
          const source = data.nodes.find(n => n.id === edge.source);
          const target = data.nodes.find(n => n.id === edge.target);
          if (!source || !target) return null;

          return (
            <motion.line
              key={`${edge.source}-${edge.target}-${i}`}
              initial={{ pathLength: 0, opacity: 0 }}
              animate={{ pathLength: 1, opacity: 1 }}
              x1={source.x}
              y1={source.y}
              x2={target.x}
              y2={target.y}
              stroke="currentColor"
              strokeWidth="2"
              className="text-muted-foreground/30"
            />
          );
        })}

        {/* Nodes */}
        {data.nodes.map((node) => {
          const isCurrent = node.id === currentNodeId;
          const isVisited = visitedIds.includes(node.id);

          return (
            <g key={node.id}>
              <motion.circle
                initial={{ scale: 0 }}
                animate={{ 
                  scale: isCurrent ? 1.2 : 1,
                  fill: isCurrent ? "var(--primary)" : isVisited ? "var(--secondary)" : "var(--background)",
                  stroke: isCurrent ? "var(--primary)" : isVisited ? "var(--secondary-foreground)" : "var(--muted-foreground)"
                }}
                cx={node.x}
                cy={node.y}
                r={25}
                strokeWidth={2}
                className="cursor-pointer"
              />
              <motion.text
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                x={node.x}
                y={node.y}
                dy=".3em"
                textAnchor="middle"
                className={`text-xs font-bold ${isCurrent ? "fill-primary-foreground" : "fill-foreground"}`}
              >
                {node.value}
              </motion.text>
            </g>
          );
        })}
      </svg>
    </div>
  );
}
