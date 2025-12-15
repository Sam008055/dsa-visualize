import { TreeNode } from "@/lib/algorithms/types";
import { motion, AnimatePresence } from "framer-motion";

interface TreeVisualizerProps {
  root: TreeNode | null | undefined;
  currentNodeId?: string;
  visitedIds?: string[];
}

export function TreeVisualizer({ root, currentNodeId, visitedIds = [] }: TreeVisualizerProps) {
  if (!root) {
    return (
      <div className="w-full h-[400px] flex items-center justify-center text-muted-foreground">
        Empty Tree
      </div>
    );
  }

  const renderNode = (node: TreeNode) => {
    const isCurrent = node.id === currentNodeId;
    const isVisited = visitedIds.includes(node.id);

    return (
      <g key={node.id}>
        {/* Edges */}
        {node.left && (
          <motion.line
            initial={{ pathLength: 0, opacity: 0 }}
            animate={{ pathLength: 1, opacity: 1 }}
            x1={node.x}
            y1={node.y}
            x2={node.left.x}
            y2={node.left.y}
            stroke="currentColor"
            strokeWidth="2"
            className="text-muted-foreground/50"
          />
        )}
        {node.right && (
          <motion.line
            initial={{ pathLength: 0, opacity: 0 }}
            animate={{ pathLength: 1, opacity: 1 }}
            x1={node.x}
            y1={node.y}
            x2={node.right.x}
            y2={node.right.y}
            stroke="currentColor"
            strokeWidth="2"
            className="text-muted-foreground/50"
          />
        )}

        {/* Recursive calls */}
        {node.left && renderNode(node.left)}
        {node.right && renderNode(node.right)}

        {/* Node Circle */}
        <motion.circle
          initial={{ scale: 0 }}
          animate={{ 
            scale: isCurrent ? 1.2 : 1,
            fill: isCurrent ? "var(--primary)" : "var(--background)",
            stroke: isCurrent ? "var(--primary)" : "var(--muted-foreground)"
          }}
          cx={node.x}
          cy={node.y}
          r={20}
          strokeWidth={2}
          className="fill-background"
        />
        
        {/* Node Value */}
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
  };

  return (
    <div className="w-full h-[400px] overflow-hidden bg-black/5 rounded-xl border border-white/10 relative">
      <svg width="100%" height="100%" viewBox="0 0 800 400" preserveAspectRatio="xMidYMid meet">
        {renderNode(root)}
      </svg>
    </div>
  );
}
