import { motion, AnimatePresence } from "framer-motion";
import { useState, useRef, useEffect } from "react";

interface TimelineScrubberProps {
  currentStep: number;
  totalSteps: number;
  onStepChange: (step: number) => void;
  isPlaying: boolean;
}

export function TimelineScrubber({
  currentStep,
  totalSteps,
  onStepChange,
  isPlaying,
}: TimelineScrubberProps) {
  const [hoveredStep, setHoveredStep] = useState<number | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const barRef = useRef<HTMLDivElement>(null);

  const calculateStepFromPosition = (clientX: number): number => {
    if (!barRef.current) return currentStep;
    
    const rect = barRef.current.getBoundingClientRect();
    const x = clientX - rect.left;
    const percentage = Math.max(0, Math.min(1, x / rect.width));
    return Math.floor(percentage * (totalSteps - 1));
  };

  const handleClick = (e: React.MouseEvent<HTMLDivElement>) => {
    const step = calculateStepFromPosition(e.clientX);
    onStepChange(step);
  };

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const step = calculateStepFromPosition(e.clientX);
    setHoveredStep(step);

    if (isDragging) {
      onStepChange(step);
    }
  };

  const handleMouseDown = (e: React.MouseEvent<HTMLDivElement>) => {
    setIsDragging(true);
    const step = calculateStepFromPosition(e.clientX);
    onStepChange(step);
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  const handleMouseLeave = () => {
    setHoveredStep(null);
    setIsDragging(false);
  };

  useEffect(() => {
    const handleGlobalMouseUp = () => setIsDragging(false);
    window.addEventListener("mouseup", handleGlobalMouseUp);
    return () => window.removeEventListener("mouseup", handleGlobalMouseUp);
  }, []);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "ArrowLeft" && currentStep > 0) {
        e.preventDefault();
        onStepChange(currentStep - 1);
      } else if (e.key === "ArrowRight" && currentStep < totalSteps - 1) {
        e.preventDefault();
        onStepChange(currentStep + 1);
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [currentStep, totalSteps, onStepChange]);

  const progressPercentage = (currentStep / (totalSteps - 1)) * 100;
  const hoverPercentage = hoveredStep !== null ? (hoveredStep / (totalSteps - 1)) * 100 : 0;

  return (
    <motion.div 
      className="w-full space-y-2 mt-4"
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
    >
      <div className="flex justify-between text-xs text-muted-foreground px-1">
        <span>Step {currentStep + 1}</span>
        <span>Total: {totalSteps}</span>
      </div>

      <div
        ref={barRef}
        className="relative h-10 glass-card rounded-lg cursor-pointer group border-2 border-white/10 backdrop-blur-xl overflow-hidden"
        onClick={handleClick}
        onMouseMove={handleMouseMove}
        onMouseDown={handleMouseDown}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseLeave}
      >
        <div className="absolute inset-0 bg-gradient-to-r from-muted/50 via-muted/30 to-muted/50" />

        <AnimatePresence>
          {hoveredStep !== null && !isDragging && (
            <motion.div
              className="absolute top-0 bottom-0 w-1 bg-accent/50 shadow-lg"
              style={{ left: `${hoverPercentage}%` }}
              initial={{ opacity: 0, scaleY: 0.8 }}
              animate={{ opacity: 1, scaleY: 1 }}
              exit={{ opacity: 0, scaleY: 0.8 }}
              transition={{ duration: 0.15 }}
            />
          )}
        </AnimatePresence>

        <motion.div
          className="absolute top-0 bottom-0 left-0 gradient-primary opacity-30 border-r-2 border-primary"
          style={{ width: `${progressPercentage}%` }}
          transition={{ duration: isPlaying ? 0.2 : 0.3, ease: "easeOut" }}
        />

        <motion.div
          className="absolute top-0 bottom-0 w-1 gradient-primary shadow-lg glow-primary"
          style={{ left: `${progressPercentage}%` }}
          transition={{ duration: isPlaying ? 0.2 : 0.3, ease: "easeOut" }}
        />

        <AnimatePresence>
          {hoveredStep !== null && (
            <motion.div
              className="absolute -top-10 glass-card backdrop-blur-xl text-foreground px-3 py-1.5 rounded-lg text-xs font-medium border-2 border-primary/20 shadow-level-3 pointer-events-none"
              style={{ left: `${hoverPercentage}%`, transform: "translateX(-50%)" }}
              initial={{ opacity: 0, y: 5, scale: 0.9 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 5, scale: 0.9 }}
              transition={{ duration: 0.2 }}
            >
              Step {hoveredStep + 1}
            </motion.div>
          )}
        </AnimatePresence>

        {totalSteps <= 50 && (
          <div className="absolute inset-0 flex items-center">
            {Array.from({ length: totalSteps }).map((_, i) => (
              <div
                key={i}
                className="flex-1 h-full border-r border-border/20 last:border-r-0"
              />
            ))}
          </div>
        )}
      </div>

      <motion.div 
        className="text-xs text-muted-foreground text-center"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.2 }}
      >
        Click or drag to jump to any step • Use ← → arrow keys to navigate
      </motion.div>
    </motion.div>
  );
}