import { SortingStep, AlgorithmType } from "@/lib/sortingAlgorithms";
import { motion, AnimatePresence } from "framer-motion";
import { useEffect, useState, useRef } from "react";
import { Check } from "lucide-react";

interface ArrayVisualizerProps {
  step: SortingStep;
  maxValue: number;
  algorithm?: AlgorithmType;
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

export function ArrayVisualizer({ step, maxValue, algorithm }: ArrayVisualizerProps) {
  if (!step) return null;
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

    // Only do particle effects for sorting algorithms
    if (algorithm === "Stack Operations" || algorithm === "Queue Operations") {
        prevStepRef.current = step;
        return;
    }

    const barWidth = Math.max(4, Math.min(60, (containerWidth - (array.length * 2)) / array.length));
    const containerRect = container.getBoundingClientRect();

    const hasNewSwap = swapping.length > 0 && 
      (!prevStep || JSON.stringify(swapping.sort()) !== JSON.stringify(prevStep.swapping.sort()));
    
    if (hasNewSwap) {
      swapping.forEach(index => {
        const x = index * (barWidth + 2) + barWidth / 2;
        const y = containerRect.height / 2;
        createParticleBurst(x, y, "#EF4444", 12, 500);
      });
    }

    const hasNewComparison = comparing.length > 0 && 
      (!prevStep || JSON.stringify(comparing.sort()) !== JSON.stringify(prevStep.comparing.sort()));
    
    if (hasNewComparison) {
      comparing.forEach(index => {
        const x = index * (barWidth + 2) + barWidth / 2;
        const y = containerRect.height / 2;
        createParticleBurst(x, y, "#F59E0B", 8, 300);
      });
    }

    prevStepRef.current = step;
  }, [step, swapping, comparing, containerWidth, array.length, algorithm]);

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
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      setParticles(prevParticles => {
        const updatedParticles = prevParticles
          .map(particle => ({
            ...particle,
            x: particle.x + particle.vx,
            y: particle.y + particle.vy,
            vx: particle.vx * 0.98,
            vy: particle.vy * 0.98,
            life: particle.life - 16,
          }))
          .filter(particle => particle.life > 0);

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

  if (algorithm === "Stack Operations") {
    return (
      <div 
        id="visualizer-container"
        className="w-full h-[400px] flex items-center justify-center glass-card rounded-2xl shadow-level-3 p-6 overflow-hidden relative"
      >
        <div className="relative flex flex-col items-center">
            <div className="text-muted-foreground mb-4 font-mono text-sm">TOP</div>
            <div className="w-32 min-h-[300px] border-l-4 border-r-4 border-b-4 border-primary/30 rounded-b-xl flex flex-col-reverse items-center p-2 gap-2 bg-black/5 backdrop-blur-sm">
                <AnimatePresence mode="popLayout">
                    {array.map((value, index) => (
                        <motion.div
                            key={`${index}-${value}`}
                            initial={{ opacity: 0, y: -50, scale: 0.8 }}
                            animate={{ opacity: 1, y: 0, scale: 1 }}
                            exit={{ opacity: 0, y: -50, scale: 0.8 }}
                            transition={{ type: "spring", stiffness: 400, damping: 25 }}
                            className="w-full h-12 rounded-lg gradient-primary flex items-center justify-center text-white font-bold shadow-lg border border-white/20"
                        >
                            {value}
                        </motion.div>
                    ))}
                </AnimatePresence>
                {array.length === 0 && (
                    <div className="absolute inset-0 flex items-center justify-center text-muted-foreground/30 font-bold text-xl pointer-events-none">
                        EMPTY
                    </div>
                )}
            </div>
            <div className="text-muted-foreground mt-2 font-mono text-sm">BOTTOM</div>
        </div>
      </div>
    );
  }

  if (algorithm === "Queue Operations") {
    return (
      <div 
        id="visualizer-container"
        className="w-full h-[400px] flex items-center justify-center glass-card rounded-2xl shadow-level-3 p-6 overflow-hidden relative"
      >
        <div className="relative flex flex-col items-center w-full max-w-3xl">
            <div className="flex justify-between w-full px-12 mb-2 text-muted-foreground font-mono text-sm">
                <span>FRONT (Dequeue)</span>
                <span>REAR (Enqueue)</span>
            </div>
            <div className="w-full h-32 border-t-4 border-b-4 border-primary/30 flex items-center px-4 gap-2 overflow-x-auto bg-black/5 backdrop-blur-sm relative">
                <AnimatePresence mode="popLayout">
                    {array.map((value, index) => (
                        <motion.div
                            key={`${index}-${value}`}
                            initial={{ opacity: 0, x: 50, scale: 0.8 }}
                            animate={{ opacity: 1, x: 0, scale: 1 }}
                            exit={{ opacity: 0, x: -50, scale: 0.8 }}
                            transition={{ type: "spring", stiffness: 400, damping: 25 }}
                            className="min-w-[60px] h-[60px] rounded-xl gradient-accent flex items-center justify-center text-white font-bold shadow-lg border border-white/20"
                        >
                            {value}
                        </motion.div>
                    ))}
                </AnimatePresence>
                {array.length === 0 && (
                    <div className="absolute inset-0 flex items-center justify-center text-muted-foreground/30 font-bold text-xl pointer-events-none">
                        EMPTY QUEUE
                    </div>
                )}
            </div>
        </div>
      </div>
    );
  }

  const barWidth = Math.max(4, Math.min(60, (containerWidth - (array.length * 2)) / array.length));

  const getBarStyle = (index: number) => {
    if (sorted.includes(index)) {
      return "gradient-success glow-success";
    } else if (swapping.includes(index)) {
      return "gradient-destructive glow-destructive";
    } else if (comparing.includes(index)) {
      return "gradient-accent glow-accent";
    }
    return "gradient-primary";
  };

  return (
    <div 
      id="visualizer-container"
      className="w-full h-[400px] flex items-end justify-center glass-card rounded-2xl shadow-level-3 p-6 overflow-hidden relative group hover:shadow-level-4 transition-shadow duration-300"
    >
      {/* Particle canvas overlay */}
      <canvas
        ref={canvasRef}
        className="absolute inset-0 pointer-events-none"
        style={{ zIndex: 10 }}
      />
      
      {/* Subtle grid pattern on hover */}
      <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"
        style={{
          backgroundImage: 'linear-gradient(rgba(100, 116, 139, 0.05) 1px, transparent 1px), linear-gradient(90deg, rgba(100, 116, 139, 0.05) 1px, transparent 1px)',
          backgroundSize: '20px 20px'
        }}
      />
      
      <div className="flex items-end justify-center gap-[2px]" style={{ height: "100%" }}>
        {array.map((value, index) => {
          const heightPercentage = (value / maxValue) * 100;
          const isSorted = sorted.includes(index);
          const isSwapping = swapping.includes(index);
          const isComparing = comparing.includes(index);

          return (
            <motion.div
              key={index}
              layout
              initial={false}
              animate={{
                height: `${heightPercentage}%`,
                scale: isSwapping ? 1.1 : isComparing ? 1.05 : 1.0,
                x: isSwapping ? [0, -3, 3, 0] : 0,
              }}
              transition={{ 
                type: "spring", 
                stiffness: 300, 
                damping: 25,
                x: { duration: 0.3 }
              }}
              style={{
                width: `${barWidth}px`,
                minHeight: "4px",
              }}
              className={`rounded-t-xl relative group/bar ${getBarStyle(index)} border-2 border-white/20`}
            >
              {/* Value label */}
              {array.length <= 20 && (
                <motion.span 
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="absolute -top-7 left-1/2 -translate-x-1/2 text-xs font-bold text-foreground font-mono"
                >
                  {value}
                </motion.span>
              )}
              
              {/* Checkmark for sorted elements */}
              <AnimatePresence>
                {isSorted && (
                  <motion.div
                    initial={{ scale: 0, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    exit={{ scale: 0, opacity: 0 }}
                    transition={{ type: "spring", stiffness: 400, damping: 17 }}
                    className="absolute top-2 left-1/2 -translate-x-1/2 bg-white rounded-full p-1"
                  >
                    <Check className="h-3 w-3 text-green-600" />
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}