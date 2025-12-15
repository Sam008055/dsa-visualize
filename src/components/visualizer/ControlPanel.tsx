import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { Pause, Play, RotateCcw, SkipBack, SkipForward, Volume2, VolumeX } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

interface ControlPanelProps {
  isPlaying: boolean;
  onPlayPause: () => void;
  onReset: () => void;
  onStepForward: () => void;
  onStepBack: () => void;
  speed: number;
  onSpeedChange: (value: number) => void;
  currentStep: number;
  totalSteps: number;
  soundEnabled: boolean;
  onSoundToggle: () => void;
}

export function ControlPanel({
  isPlaying,
  onPlayPause,
  onReset,
  onStepForward,
  onStepBack,
  speed,
  onSpeedChange,
  currentStep,
  totalSteps,
  soundEnabled,
  onSoundToggle,
}: ControlPanelProps) {
  return (
    <div className="glass-card p-4 md:p-6 rounded-2xl shadow-level-2 border-2 border-white/10 backdrop-blur-xl">
      <div className="flex flex-col md:flex-row items-center justify-between gap-6">
        <div className="flex items-center gap-2 md:gap-3">
          <motion.div 
            whileHover={{ scale: 1.08, rotate: -15 }} 
            whileTap={{ scale: 0.92 }}
            transition={{ type: "spring", stiffness: 400, damping: 15 }}
          >
            <Button
              variant="outline"
              size="icon"
              onClick={onReset}
              title="Reset"
              className="h-10 w-10 md:h-12 md:w-12 rounded-xl border-2 hover:gradient-primary hover:text-white hover:border-0 transition-all duration-300 hover:shadow-level-2"
              aria-label="Reset visualization"
            >
              <RotateCcw className="h-4 w-4 md:h-5 md:w-5" />
            </Button>
          </motion.div>
          
          <div className="w-px h-8 md:h-10 bg-border mx-1" />

          <motion.div 
            whileHover={{ scale: 1.08, x: -3 }} 
            whileTap={{ scale: 0.92 }}
            transition={{ type: "spring", stiffness: 400, damping: 15 }}
          >
            <Button
              variant="outline"
              size="icon"
              onClick={onStepBack}
              disabled={currentStep === 0 || isPlaying}
              className="h-10 w-10 md:h-12 md:w-12 rounded-xl border-2 hover:gradient-primary hover:text-white hover:border-0 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed hover:shadow-level-2"
              aria-label="Step backward"
            >
              <SkipBack className="h-4 w-4 md:h-5 md:w-5" />
            </Button>
          </motion.div>

          <motion.div 
            whileHover={{ scale: 1.1 }} 
            whileTap={{ scale: 0.95 }}
            transition={{ type: "spring", stiffness: 400, damping: 15 }}
          >
            <Button
              size="icon"
              className={`h-12 w-12 md:h-14 md:w-14 rounded-full shadow-level-3 hover:shadow-level-4 transition-all duration-300 ${
                isPlaying 
                  ? "bg-secondary hover:bg-secondary/80" 
                  : "gradient-primary text-white border-0 glow-primary"
              }`}
              onClick={onPlayPause}
              aria-label={isPlaying ? "Pause" : "Play"}
            >
              <AnimatePresence mode="wait">
                <motion.div
                  key={isPlaying ? "pause" : "play"}
                  initial={{ scale: 0.8, opacity: 0, rotate: -90 }}
                  animate={{ scale: 1, opacity: 1, rotate: 0 }}
                  exit={{ scale: 0.8, opacity: 0, rotate: 90 }}
                  transition={{ duration: 0.2 }}
                >
                  {isPlaying ? (
                    <Pause className="h-5 w-5 md:h-6 md:w-6" />
                  ) : (
                    <Play className="h-5 w-5 md:h-6 md:w-6 ml-0.5" />
                  )}
                </motion.div>
              </AnimatePresence>
            </Button>
          </motion.div>

          <motion.div 
            whileHover={{ scale: 1.08, x: 3 }} 
            whileTap={{ scale: 0.92 }}
            transition={{ type: "spring", stiffness: 400, damping: 15 }}
          >
            <Button
              variant="outline"
              size="icon"
              onClick={onStepForward}
              disabled={currentStep >= totalSteps - 1 || isPlaying}
              className="h-10 w-10 md:h-12 md:w-12 rounded-xl border-2 hover:gradient-primary hover:text-white hover:border-0 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed hover:shadow-level-2"
              aria-label="Step forward"
            >
              <SkipForward className="h-4 w-4 md:h-5 md:w-5" />
            </Button>
          </motion.div>

          <div className="w-px h-8 md:h-10 bg-border mx-1" />

          <motion.div 
            whileHover={{ scale: 1.08 }} 
            whileTap={{ scale: 0.92 }}
            transition={{ type: "spring", stiffness: 400, damping: 15 }}
          >
            <Button
              variant={soundEnabled ? "default" : "outline"}
              size="icon"
              onClick={onSoundToggle}
              title={soundEnabled ? "Sound On" : "Sound Off"}
              className={`h-10 w-10 md:h-12 md:w-12 rounded-xl border-2 transition-all duration-300 ${
                soundEnabled 
                  ? "gradient-primary text-white border-0 glow-primary" 
                  : "hover:gradient-primary hover:text-white hover:border-0 hover:shadow-level-2"
              }`}
              aria-label={soundEnabled ? "Mute sound" : "Unmute sound"}
            >
              <AnimatePresence mode="wait">
                <motion.div
                  key={soundEnabled ? "on" : "off"}
                  initial={{ scale: 0.8, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  exit={{ scale: 0.8, opacity: 0 }}
                  transition={{ duration: 0.2 }}
                >
                  {soundEnabled ? (
                    <Volume2 className="h-4 w-4 md:h-5 md:w-5" />
                  ) : (
                    <VolumeX className="h-4 w-4 md:h-5 md:w-5" />
                  )}
                </motion.div>
              </AnimatePresence>
            </Button>
          </motion.div>
        </div>

        <div className="flex flex-col gap-3 w-full md:w-80">
          <div className="flex justify-between text-xs text-muted-foreground font-medium">
            <span>Speed: <span className="text-primary font-bold">{speed}x</span></span>
            <span>Step <span className="text-primary font-bold">{currentStep + 1}</span> of {totalSteps}</span>
          </div>
          <div className="relative">
            <Slider
              value={[speed]}
              min={0.25}
              max={2}
              step={0.25}
              onValueChange={(vals) => onSpeedChange(vals[0])}
              className="cursor-pointer"
              aria-label="Playback speed"
            />
            <div className="absolute -top-8 left-0 right-0 flex justify-between text-[10px] text-muted-foreground font-mono">
              <span>0.25x</span>
              <span>0.5x</span>
              <span>1x</span>
              <span>1.5x</span>
              <span>2x</span>
            </div>
          </div>
        </div>
      </div>
      
      <AnimatePresence>
        {isPlaying && (
          <motion.div
            initial={{ opacity: 0, y: -10, height: 0 }}
            animate={{ opacity: 1, y: 0, height: "auto" }}
            exit={{ opacity: 0, y: -10, height: 0 }}
            transition={{ duration: 0.3 }}
            className="mt-4 text-center text-sm text-primary font-medium"
          >
            <motion.span
              animate={{ opacity: [1, 0.5, 1] }}
              transition={{ duration: 1.5, repeat: Infinity }}
            >
              Playing...
            </motion.span>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}