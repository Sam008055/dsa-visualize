import { SortingStep } from "@/lib/sortingAlgorithms";
import { motion } from "framer-motion";
import { useEffect, useState } from "react";

interface ArrayVisualizerProps {
  step: SortingStep;
  maxValue: number;
}

export function ArrayVisualizer({ step, maxValue }: ArrayVisualizerProps) {
  const { array, comparing, swapping, sorted } = step;
  const [containerWidth, setContainerWidth] = useState(800);

  useEffect(() => {
    const handleResize = () => {
      const container = document.getElementById("visualizer-container");
      if (container) {
        setContainerWidth(container.clientWidth);
      }
    };
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // Calculate bar width based on container width and array length
  // Min width 4px, max width 60px
  const barWidth = Math.max(4, Math.min(60, (containerWidth - (array.length * 2)) / array.length));
  const gap = 2;

  return (
    <div 
      id="visualizer-container"
      className="w-full h-[400px] flex items-end justify-center bg-card rounded-xl border shadow-sm p-4 overflow-hidden relative"
    >
      <div className="flex items-end justify-center gap-[2px]" style={{ height: "100%" }}>
        {array.map((value, index) => {
          let color = "bg-primary"; // Default Teal
          
          if (sorted.includes(index)) {
            color = "bg-emerald-500"; // Sorted Green
          } else if (swapping.includes(index)) {
            color = "bg-destructive"; // Swapping Red
          } else if (comparing.includes(index)) {
            color = "bg-amber-500"; // Comparing Amber
          }

          const heightPercentage = (value / maxValue) * 100;

          return (
            <motion.div
              key={index}
              layout
              initial={false}
              animate={{
                height: `${heightPercentage}%`,
                backgroundColor: sorted.includes(index) 
                  ? "var(--color-chart-4)" 
                  : swapping.includes(index) 
                    ? "var(--color-destructive)" 
                    : comparing.includes(index) 
                      ? "var(--color-accent)" 
                      : "var(--color-primary)",
              }}
              transition={{ type: "spring", stiffness: 300, damping: 25 }}
              style={{
                width: `${barWidth}px`,
                minHeight: "4px",
              }}
              className={`rounded-t-md relative group ${color}`}
            >
              {/* Tooltip/Label for small arrays */}
              {array.length <= 20 && (
                <span className="absolute -top-6 left-1/2 -translate-x-1/2 text-xs font-medium text-muted-foreground">
                  {value}
                </span>
              )}
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}
