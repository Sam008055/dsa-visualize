import { useState, useEffect, useRef, ChangeEvent } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Moon, Sun, BarChart3, Share2, Info } from "lucide-react";
import { 
  AlgorithmType, 
  generateSteps, 
  SortingStep 
} from "@/lib/sortingAlgorithms";
import { ArrayVisualizer } from "@/components/visualizer/ArrayVisualizer";
import { ControlPanel } from "@/components/visualizer/ControlPanel";
import { InfoPanel } from "@/components/visualizer/InfoPanel";
import { TimelineScrubber } from "@/components/visualizer/TimelineScrubber";
import { ComparisonView } from "@/components/visualizer/ComparisonView";
import { soundManager } from "@/lib/soundManager";

export default function Visualizer() {
  const [algorithm, setAlgorithm] = useState<AlgorithmType>("Bubble Sort");
  const [algorithmB, setAlgorithmB] = useState<AlgorithmType>("Merge Sort");
  const [comparisonMode, setComparisonMode] = useState(false);
  const [arraySize, setArraySize] = useState(20);
  const [customInput, setCustomInput] = useState("");
  const [initialArray, setInitialArray] = useState<number[]>([]);
  const [steps, setSteps] = useState<SortingStep[]>([]);
  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [speed, setSpeed] = useState(1);
  const [isDarkMode, setIsDarkMode] = useState(true);
  const [soundEnabled, setSoundEnabled] = useState(true);

  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const prevStepRef = useRef<SortingStep | null>(null);

  // Initialize random array
  useEffect(() => {
    generateRandomArray(20);
  }, []);

  // Generate steps when array or algorithm changes
  useEffect(() => {
    if (initialArray.length > 0) {
      const newSteps = generateSteps(algorithm, initialArray);
      setSteps(newSteps);
      setCurrentStepIndex(0);
      setIsPlaying(false);
      prevStepRef.current = null;
    }
  }, [initialArray, algorithm]);

  // Play sounds based on step changes
  useEffect(() => {
    if (currentStepIndex === 0 || !soundEnabled) {
      prevStepRef.current = steps[currentStepIndex];
      return;
    }

    const currentStep = steps[currentStepIndex];
    const prevStep = prevStepRef.current;

    if (!currentStep || !prevStep) {
      prevStepRef.current = currentStep;
      return;
    }

    if (currentStep.sorted.length === initialArray.length && 
        currentStepIndex === steps.length - 1) {
      soundManager.playSortedSound();
    }
    else if (currentStep.swapping.length > 0 && 
             JSON.stringify(currentStep.swapping) !== JSON.stringify(prevStep.swapping)) {
      soundManager.playSwapSound();
    }
    else if (currentStep.comparing.length > 0 && 
             JSON.stringify(currentStep.comparing) !== JSON.stringify(prevStep.comparing)) {
      soundManager.playCompareSound();
    }

    prevStepRef.current = currentStep;
  }, [currentStepIndex, soundEnabled, steps, initialArray.length]);

  // Handle animation loop
  useEffect(() => {
    if (isPlaying) {
      const intervalTime = 1000 / (speed * 2);
      timerRef.current = setInterval(() => {
        setCurrentStepIndex((prev) => {
          if (prev >= steps.length - 1) {
            setIsPlaying(false);
            return prev;
          }
          return prev + 1;
        });
      }, intervalTime);
    } else {
      if (timerRef.current) clearInterval(timerRef.current);
    }

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [isPlaying, speed, steps.length]);

  // Toggle Dark Mode
  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  }, [isDarkMode]);

  // Update sound manager when sound is toggled
  useEffect(() => {
    soundManager.setEnabled(soundEnabled);
    if (soundEnabled && soundManager.isEnabled()) {
      const resumeAudio = () => {
        soundManager.setEnabled(true);
        document.removeEventListener('click', resumeAudio);
      };
      document.addEventListener('click', resumeAudio, { once: true });
    }
  }, [soundEnabled]);

  // Cleanup sound manager on unmount
  useEffect(() => {
    return () => {
      soundManager.dispose();
    };
  }, []);

  const generateRandomArray = (size: number) => {
    const newArray = Array.from({ length: size }, () => Math.floor(Math.random() * 100) + 5);
    setInitialArray(newArray);
    setCustomInput(newArray.join(", "));
    setArraySize(size);
  };

  const handleCustomInput = (e: ChangeEvent<HTMLInputElement>) => {
    setCustomInput(e.target.value);
  };

  const applyCustomInput = () => {
    const numbers = customInput
      .split(",")
      .map((s) => parseInt(s.trim()))
      .filter((n) => !isNaN(n));
    
    if (numbers.length >= 2 && numbers.length <= 200) {
      setInitialArray(numbers);
      setArraySize(numbers.length);
    }
  };

  const handlePlayPause = () => setIsPlaying(!isPlaying);
  const handleReset = () => {
    setIsPlaying(false);
    setCurrentStepIndex(0);
    prevStepRef.current = null;
  };
  const handleStepForward = () => {
    if (currentStepIndex < steps.length - 1) setCurrentStepIndex(prev => prev + 1);
  };
  const handleStepBack = () => {
    if (currentStepIndex > 0) setCurrentStepIndex(prev => prev - 1);
  };
  const handleSoundToggle = () => setSoundEnabled(!soundEnabled);
  
  const handleTimelineChange = (step: number) => {
    setIsPlaying(false);
    setCurrentStepIndex(step);
  };

  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col font-sans transition-colors duration-300">
      {/* Premium Navbar with Gradient */}
      <motion.nav 
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
        className="border-b bg-gradient-to-r from-[#06B6D4] to-[#14B8A6] backdrop-blur-sm sticky top-0 z-50 shadow-level-3"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <motion.div 
            className="flex items-center gap-3"
            whileHover={{ scale: 1.02 }}
            transition={{ type: "spring", stiffness: 400, damping: 17 }}
          >
            <div className="bg-white/20 p-2 rounded-xl backdrop-blur-sm">
              <BarChart3 className="h-6 w-6 text-white" />
            </div>
            <span className="font-bold text-xl tracking-tight text-white">DSA Visualizer</span>
          </motion.div>
          
          <div className="flex items-center gap-3">
            <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.95 }}>
              <Button
                variant="ghost"
                size="icon"
                className="rounded-full bg-white/10 hover:bg-white/20 text-white border-0 h-10 w-10"
                aria-label="Share"
              >
                <Share2 className="h-5 w-5" />
              </Button>
            </motion.div>
            
            <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.95 }}>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setIsDarkMode(!isDarkMode)}
                className="rounded-full bg-white/10 hover:bg-white/20 text-white border-0 h-10 w-10"
                aria-label={isDarkMode ? "Switch to light mode" : "Switch to dark mode"}
              >
                <motion.div
                  initial={false}
                  animate={{ rotate: isDarkMode ? 0 : 180 }}
                  transition={{ duration: 0.3 }}
                >
                  {isDarkMode ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
                </motion.div>
              </Button>
            </motion.div>
          </div>
        </div>
      </motion.nav>

      {/* Main Content */}
      <main className="flex-1 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 w-full">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* Left Column: Controls & Visualizer */}
          <div className="lg:col-span-2 space-y-6">
            
            {/* Top Controls - Glassmorphism Card */}
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: 0.1 }}
              className="glass-card p-6 rounded-2xl shadow-level-2"
            >
              <div className="flex flex-col sm:flex-row gap-4 items-center justify-between">
                <div className="flex items-center gap-4 w-full sm:w-auto flex-wrap">
                  <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                    <Button
                      variant={comparisonMode ? "default" : "outline"}
                      size="sm"
                      onClick={() => setComparisonMode(!comparisonMode)}
                      className={comparisonMode ? "gradient-primary text-white border-0 shadow-level-2" : ""}
                    >
                      {comparisonMode ? "Single View" : "Compare Algorithms"}
                    </Button>
                  </motion.div>
                  
                  {comparisonMode ? (
                    <>
                      <Select 
                        value={algorithm} 
                        onValueChange={(v) => setAlgorithm(v as AlgorithmType)}
                      >
                        <SelectTrigger className="w-[140px] h-12 border-2 focus:ring-2 focus:ring-primary focus:ring-offset-2">
                          <SelectValue placeholder="Algorithm A" />
                        </SelectTrigger>
                        <SelectContent className="glass-card">
                          <SelectItem value="Bubble Sort">Bubble Sort</SelectItem>
                          <SelectItem value="Merge Sort">Merge Sort</SelectItem>
                          <SelectItem value="Quick Sort">Quick Sort</SelectItem>
                        </SelectContent>
                      </Select>
                      <span className="text-muted-foreground text-sm font-medium">vs</span>
                      <Select 
                        value={algorithmB} 
                        onValueChange={(v) => setAlgorithmB(v as AlgorithmType)}
                      >
                        <SelectTrigger className="w-[140px] h-12 border-2 focus:ring-2 focus:ring-primary focus:ring-offset-2">
                          <SelectValue placeholder="Algorithm B" />
                        </SelectTrigger>
                        <SelectContent className="glass-card">
                          <SelectItem value="Bubble Sort">Bubble Sort</SelectItem>
                          <SelectItem value="Merge Sort">Merge Sort</SelectItem>
                          <SelectItem value="Quick Sort">Quick Sort</SelectItem>
                        </SelectContent>
                      </Select>
                    </>
                  ) : (
                    <Select 
                      value={algorithm} 
                      onValueChange={(v) => setAlgorithm(v as AlgorithmType)}
                    >
                      <SelectTrigger className="w-[200px] h-12 border-2 focus:ring-2 focus:ring-primary focus:ring-offset-2">
                        <SelectValue placeholder="Select Algorithm" />
                      </SelectTrigger>
                      <SelectContent className="glass-card">
                        <SelectItem value="Bubble Sort">Bubble Sort</SelectItem>
                        <SelectItem value="Merge Sort">Merge Sort</SelectItem>
                        <SelectItem value="Quick Sort">Quick Sort</SelectItem>
                      </SelectContent>
                    </Select>
                  )}
                </div>

                <div className="flex items-center gap-2 w-full sm:w-auto">
                  {[10, 50, 100].map((size) => (
                    <motion.div key={size} whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                      <Button 
                        variant="outline" 
                        size="sm" 
                        onClick={() => generateRandomArray(size)}
                        className="h-10 hover:gradient-primary hover:text-white hover:border-0 transition-all duration-200"
                      >
                        Random {size}
                      </Button>
                    </motion.div>
                  ))}
                </div>
              </div>

              {/* Input Area */}
              <div className="flex gap-2 mt-4">
                <Input 
                  placeholder="Enter numbers (comma-separated)" 
                  value={customInput}
                  onChange={handleCustomInput}
                  className="font-mono text-sm h-12 border-2 focus:ring-2 focus:ring-primary focus:ring-offset-2"
                  aria-label="Custom array input"
                />
                <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                  <Button 
                    onClick={applyCustomInput}
                    className="gradient-primary text-white border-0 shadow-level-2 h-12 px-6"
                  >
                    Load
                  </Button>
                </motion.div>
              </div>
            </motion.div>

            {/* Visualizer Canvas - Conditional Rendering */}
            <AnimatePresence mode="wait">
              {steps.length > 0 && (
                comparisonMode ? (
                  <motion.div
                    key="comparison"
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    transition={{ duration: 0.4, type: "spring", stiffness: 300, damping: 25 }}
                  >
                    <ComparisonView
                      algorithmA={algorithm}
                      algorithmB={algorithmB}
                      initialArray={initialArray}
                      currentStepIndex={currentStepIndex}
                      maxValue={Math.max(...initialArray, 100)}
                    />
                  </motion.div>
                ) : (
                  <motion.div
                    key="single"
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    transition={{ duration: 0.4, type: "spring", stiffness: 300, damping: 25 }}
                    className="space-y-6"
                  >
                    <ArrayVisualizer 
                      step={steps[currentStepIndex]} 
                      maxValue={Math.max(...initialArray, 100)} 
                    />
                    
                    {/* Timeline Scrubber */}
                    <TimelineScrubber
                      currentStep={currentStepIndex}
                      totalSteps={steps.length}
                      onStepChange={handleTimelineChange}
                      isPlaying={isPlaying}
                    />
                  </motion.div>
                )
              )}
            </AnimatePresence>

            {/* Playback Controls */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: 0.3 }}
            >
              <ControlPanel 
                isPlaying={isPlaying}
                onPlayPause={handlePlayPause}
                onReset={handleReset}
                onStepForward={handleStepForward}
                onStepBack={handleStepBack}
                speed={speed}
                onSpeedChange={setSpeed}
                currentStep={currentStepIndex}
                totalSteps={steps.length}
                soundEnabled={soundEnabled}
                onSoundToggle={handleSoundToggle}
              />
            </motion.div>
          </div>

          {/* Right Column: Info Panel */}
          <motion.div 
            className="lg:col-span-1"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.4, delay: 0.2 }}
          >
            {steps.length > 0 && !comparisonMode && (
              <InfoPanel 
                algorithm={algorithm} 
                step={steps[currentStepIndex]}
                currentStepIndex={currentStepIndex}
                totalSteps={steps.length}
                arraySize={initialArray.length}
              />
            )}
          </motion.div>
        </div>
      </main>

      {/* Premium Footer */}
      <motion.footer 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.6, delay: 0.4 }}
        className="border-t py-6 mt-12 glass-card"
      >
        <div className="max-w-7xl mx-auto px-4 flex flex-col md:flex-row items-center justify-between gap-4 text-sm text-muted-foreground">
          <p>© 2025 DSA Visualizer | Premium Algorithm Learning</p>
          <div className="flex items-center gap-6">
            <motion.a 
              href="#" 
              className="hover:text-primary transition-colors flex items-center gap-2"
              whileHover={{ scale: 1.05 }}
            >
              <Info className="h-4 w-4" /> About
            </motion.a>
          </div>
        </div>
      </motion.footer>
    </div>
  );
}