import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { Pause, Play, RotateCcw, SkipBack, SkipForward, Volume2, VolumeX } from "lucide-react";
import { motion } from "framer-motion";

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
    <div className="glass-card p-6 rounded-2xl shadow-level-2">
      <div className="flex flex-col md:flex-row items-center justify-between gap-6">
        <div className="flex items-center gap-3">
          <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
            <Button
              variant="outline"
              size="icon"
              onClick={onReset}
              title="Reset"
              className="h-12 w-12 rounded-xl border-2 hover:gradient-primary hover:text-white hover:border-0 transition-all duration-200"
              aria-label="Reset visualization"
            >
              <RotateCcw className="h-5 w-5" />
            </Button>
          </motion.div>
          
          <div className="w-px h-10 bg-border mx-1" />

          <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
            <Button
              variant="outline"
              size="icon"
              onClick={onStepBack}
              disabled={currentStep === 0 || isPlaying}
              className="h-12 w-12 rounded-xl border-2 hover:gradient-primary hover:text-white hover:border-0 transition-all duration-200 disabled:opacity-50"
              aria-label="Step backward"
            >
              <SkipBack className="h-5 w-5" />
            </Button>
          </motion.div>

          <motion.div 
            whileHover={{ scale: 1.08 }} 
            whileTap={{ scale: 0.98 }}
          >
            <Button
              size="icon"
              className={`h-14 w-14 rounded-full shadow-level-3 hover:shadow-level-4 transition-all duration-200 ${
                isPlaying 
                  ? "bg-secondary hover:bg-secondary/80" 
                  : "gradient-primary text-white border-0 glow-primary"
              }`}
              onClick={onPlayPause}
              aria-label={isPlaying ? "Pause" : "Play"}
            >
              <motion.div
                initial={false}
                animate={{ rotate: isPlaying ? 0 : 0 }}
                transition={{ duration: 0.2 }}
              >
                {isPlaying ? (
                  <Pause className="h-6 w-6" />
                ) : (
                  <Play className="h-6 w-6 ml-0.5" />
                )}
              </motion.div>
            </Button>
          </motion.div>

          <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
            <Button
              variant="outline"
              size="icon"
              onClick={onStepForward}
              disabled={currentStep >= totalSteps - 1 || isPlaying}
              className="h-12 w-12 rounded-xl border-2 hover:gradient-primary hover:text-white hover:border-0 transition-all duration-200 disabled:opacity-50"
              aria-label="Step forward"
            >
              <SkipForward className="h-5 w-5" />
            </Button>
          </motion.div>

          <div className="w-px h-10 bg-border mx-1" />

          <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
            <Button
              variant={soundEnabled ? "default" : "outline"}
              size="icon"
              onClick={onSoundToggle}
              title={soundEnabled ? "Sound On" : "Sound Off"}
              className={`h-12 w-12 rounded-xl border-2 transition-all duration-200 ${
                soundEnabled 
                  ? "gradient-primary text-white border-0 glow-primary" 
                  : "hover:gradient-primary hover:text-white hover:border-0"
              }`}
              aria-label={soundEnabled ? "Mute sound" : "Unmute sound"}
            >
              {soundEnabled ? (
                <Volume2 className="h-5 w-5" />
              ) : (
                <VolumeX className="h-5 w-5" />
              )}
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
      
      {isPlaying && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          className="mt-4 text-center text-sm text-primary font-medium"
        >
          Playing...
        </motion.div>
      )}
    </div>
  );
}