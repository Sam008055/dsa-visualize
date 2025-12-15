import { SortingStep } from "@/lib/sortingAlgorithms";
import { motion } from "framer-motion";
import { useEffect, useState, useRef } from "react";

interface ArrayVisualizerProps {
  step: SortingStep;
  maxValue: number;
}

interface Particle {
  id: number;
  x: number;
  y: number;
  vx: number;
  vy: number;
  life: number;
  maxLife: number;
  color: string;
  size: number;
}

export function ArrayVisualizer({ step, maxValue }: ArrayVisualizerProps) {
  const { array, comparing, swapping, sorted } = step;
  const [containerWidth, setContainerWidth] = useState(800);
  const [particles, setParticles] = useState<Particle[]>([]);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const particleIdRef = useRef(0);
  const animationFrameRef = useRef<number | null>(null);
  const prevStepRef = useRef<SortingStep>(step);

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

  // Create particles when swapping or comparing
  useEffect(() => {
    const prevStep = prevStepRef.current;
    const container = document.getElementById("visualizer-container");
    if (!container) {
      prevStepRef.current = step;
      return;
    }

    const barWidth = Math.max(4, Math.min(60, (containerWidth - (array.length * 2)) / array.length));
    const containerRect = container.getBoundingClientRect();

    // Detect new swaps - check if swapping array has changed
    const hasNewSwap = swapping.length > 0 && 
      (!prevStep || JSON.stringify(swapping.sort()) !== JSON.stringify(prevStep.swapping.sort()));
    
    if (hasNewSwap) {
      swapping.forEach(index => {
        const x = index * (barWidth + 2) + barWidth / 2;
        const y = containerRect.height / 2;
        createParticleBurst(x, y, "#EF4444", 10, 500);
      });
    }

    // Detect new comparisons - check if comparing array has changed
    const hasNewComparison = comparing.length > 0 && 
      (!prevStep || JSON.stringify(comparing.sort()) !== JSON.stringify(prevStep.comparing.sort()));
    
    if (hasNewComparison) {
      comparing.forEach(index => {
        const x = index * (barWidth + 2) + barWidth / 2;
        const y = containerRect.height / 2;
        createParticleBurst(x, y, "#F59E0B", 6, 300);
      });
    }

    prevStepRef.current = step;
  }, [step, swapping, comparing, containerWidth, array.length]);

  const createParticleBurst = (x: number, y: number, color: string, count: number, lifetime: number) => {
    const newParticles: Particle[] = [];
    for (let i = 0; i < count; i++) {
      const angle = (Math.PI * 2 * i) / count + (Math.random() - 0.5) * 0.5;
      const speed = 3 + Math.random() * 2;
      newParticles.push({
        id: particleIdRef.current++,
        x,
        y,
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed,
        life: lifetime,
        maxLife: lifetime,
        color,
        size: 3 + Math.random(),
      });
    }
    setParticles(prev => [...prev, ...newParticles]);
  };

  // Animate particles
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const animate = () => {
      // Clear canvas
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // Update and draw particles
      setParticles(prevParticles => {
        const updatedParticles = prevParticles
          .map(particle => ({
            ...particle,
            x: particle.x + particle.vx,
            y: particle.y + particle.vy,
            vx: particle.vx * 0.98, // Deceleration
            vy: particle.vy * 0.98,
            life: particle.life - 16, // Assume ~60fps
          }))
          .filter(particle => particle.life > 0);

        // Draw particles
        updatedParticles.forEach(particle => {
          const alpha = particle.life / particle.maxLife;
          const scale = 0.5 + alpha * 0.5;
          
          ctx.save();
          ctx.globalAlpha = alpha;
          ctx.fillStyle = particle.color;
          ctx.shadowBlur = 8;
          ctx.shadowColor = particle.color;
          ctx.beginPath();
          ctx.arc(particle.x, particle.y, particle.size * scale, 0, Math.PI * 2);
          ctx.fill();
          ctx.restore();
        });

        return updatedParticles;
      });

      animationFrameRef.current = requestAnimationFrame(animate);
    };

    animate();

    return () => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, []);

  // Update canvas size
  useEffect(() => {
    const canvas = canvasRef.current;
    const container = document.getElementById("visualizer-container");
    if (canvas && container) {
      canvas.width = container.clientWidth;
      canvas.height = container.clientHeight;
    }
  }, [containerWidth]);

  const barWidth = Math.max(4, Math.min(60, (containerWidth - (array.length * 2)) / array.length));

  return (
    <div 
      id="visualizer-container"
      className="w-full h-[400px] flex items-end justify-center bg-card rounded-xl border shadow-sm p-4 overflow-hidden relative"
    >
      {/* Particle canvas overlay */}
      <canvas
        ref={canvasRef}
        className="absolute inset-0 pointer-events-none"
        style={{ zIndex: 10 }}
      />
      
      <div className="flex items-end justify-center gap-[2px]" style={{ height: "100%" }}>
        {array.map((value, index) => {
          let color = "bg-primary";
          
          if (sorted.includes(index)) {
            color = "bg-emerald-500";
          } else if (swapping.includes(index)) {
            color = "bg-destructive";
          } else if (comparing.includes(index)) {
            color = "bg-amber-500";
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