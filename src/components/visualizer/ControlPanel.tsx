import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { Pause, Play, RotateCcw, SkipBack, SkipForward, Volume2, VolumeX } from "lucide-react";

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
    <div className="flex flex-col md:flex-row items-center justify-between gap-6 p-6 bg-card border rounded-xl shadow-sm mt-4">
      <div className="flex items-center gap-2">
        <Button
          variant="outline"
          size="icon"
          onClick={onReset}
          title="Reset"
        >
          <RotateCcw className="h-4 w-4" />
        </Button>
        
        <div className="w-px h-8 bg-border mx-2" />

        <Button
          variant="outline"
          size="icon"
          onClick={onStepBack}
          disabled={currentStep === 0 || isPlaying}
        >
          <SkipBack className="h-4 w-4" />
        </Button>

        <Button
          variant={isPlaying ? "secondary" : "default"}
          size="icon"
          className="h-12 w-12 rounded-full"
          onClick={onPlayPause}
        >
          {isPlaying ? (
            <Pause className="h-6 w-6" />
          ) : (
            <Play className="h-6 w-6 ml-1" />
          )}
        </Button>

        <Button
          variant="outline"
          size="icon"
          onClick={onStepForward}
          disabled={currentStep >= totalSteps - 1 || isPlaying}
        >
          <SkipForward className="h-4 w-4" />
        </Button>

        <div className="w-px h-8 bg-border mx-2" />

        <Button
          variant={soundEnabled ? "default" : "outline"}
          size="icon"
          onClick={onSoundToggle}
          title={soundEnabled ? "Sound On" : "Sound Off"}
        >
          {soundEnabled ? (
            <Volume2 className="h-4 w-4" />
          ) : (
            <VolumeX className="h-4 w-4" />
          )}
        </Button>
      </div>

      <div className="flex flex-col gap-2 w-full md:w-64">
        <div className="flex justify-between text-xs text-muted-foreground">
          <span>Speed: {speed}x</span>
          <span>Step {currentStep + 1} of {totalSteps}</span>
        </div>
        <Slider
          value={[speed]}
          min={0.25}
          max={2}
          step={0.25}
          onValueChange={(vals) => onSpeedChange(vals[0])}
          className="cursor-pointer"
        />
      </div>
    </div>
  );
}