import { useState, useEffect, useRef, ChangeEvent } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { AlgorithmType, generateSteps, SortingStep } from "@/lib/sortingAlgorithms";
import { ArrayVisualizer } from "@/components/visualizer/ArrayVisualizer";
import { ControlPanel } from "@/components/visualizer/ControlPanel";
import { InfoPanel } from "@/components/visualizer/InfoPanel";
import { TimelineScrubber } from "@/components/visualizer/TimelineScrubber";
import { ComparisonView } from "@/components/visualizer/ComparisonView";
import { VisualizerControls } from "@/components/visualizer/VisualizerControls";
import { Navbar } from "@/components/Navbar";
import { soundManager } from "@/lib/soundManager";
import { toast } from "sonner";
import { useAuth } from "@/hooks/use-auth";
import { Loader2 } from "lucide-react";
import { useNavigate } from "react-router";

export default function Visualizer() {
  const { isLoading: authLoading, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  
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
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [soundEnabled, setSoundEnabled] = useState(true);

  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const prevStepRef = useRef<SortingStep | null>(null);

  const generateRandomArray = (size: number) => {
    const newArray = Array.from({ length: size }, () => Math.floor(Math.random() * 100) + 5);
    setInitialArray(newArray);
    setCustomInput(newArray.join(", "));
    setArraySize(size);
  };

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
  }, [currentStepIndex, soundEnabled, steps, initialArray.length, algorithm]);

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

  // Toggle Dark Mode with smooth transition
  useEffect(() => {
    const root = document.documentElement;
    root.style.transition = 'background-color 0.3s ease, color 0.3s ease';
    
    if (isDarkMode) {
      root.classList.add("dark");
    } else {
      root.classList.remove("dark");
    }
  }, [isDarkMode]);

  // Update sound manager when sound is toggled and handle user interaction
  useEffect(() => {
    soundManager.setEnabled(soundEnabled);
  }, [soundEnabled]);

  // Initialize audio context on first user interaction
  useEffect(() => {
    const initAudio = () => {
      if (soundEnabled) {
        soundManager.setEnabled(true);
      }
    };
    
    const events = ['click', 'touchstart', 'keydown'];
    events.forEach(event => {
      document.addEventListener(event, initAudio, { once: true });
    });

    return () => {
      events.forEach(event => {
        document.removeEventListener(event, initAudio);
      });
    };
  }, [soundEnabled]);

  // Cleanup sound manager on unmount
  useEffect(() => {
    return () => {
      soundManager.dispose();
    };
  }, []);

  // Redirect if not authenticated
  useEffect(() => {
    if (!authLoading && !isAuthenticated) {
      navigate("/auth");
    }
  }, [authLoading, isAuthenticated, navigate]);

  // Show loading state while checking auth
  if (authLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  // Don't render if not authenticated
  if (!isAuthenticated) {
    return null;
  }

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
    <div className="min-h-screen bg-background text-foreground flex flex-col font-sans transition-colors duration-500">
      <Navbar isDarkMode={isDarkMode} onToggleDarkMode={() => setIsDarkMode(!isDarkMode)} />

      <main className="flex-1 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 md:py-8 w-full">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 md:gap-8">
          
          <div className="lg:col-span-2 space-y-6">
            <VisualizerControls
              algorithm={algorithm}
              algorithmB={algorithmB}
              comparisonMode={comparisonMode}
              customInput={customInput}
              onAlgorithmChange={setAlgorithm}
              onAlgorithmBChange={setAlgorithmB}
              onComparisonModeToggle={() => setComparisonMode(!comparisonMode)}
              onCustomInputChange={handleCustomInput}
              onApplyCustomInput={applyCustomInput}
              onGenerateRandomArray={generateRandomArray}
            />

            <AnimatePresence mode="wait">
              {steps.length > 0 && (
                comparisonMode ? (
                  <motion.div
                    key="comparison"
                    initial={{ opacity: 0, scale: 0.95, y: 20 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.95, y: -20 }}
                    transition={{ duration: 0.5, type: "spring", stiffness: 300, damping: 25 }}
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
                    initial={{ opacity: 0, scale: 0.95, y: 20 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.95, y: -20 }}
                    transition={{ duration: 0.5, type: "spring", stiffness: 300, damping: 25 }}
                    className="space-y-6"
                  >
                    <ArrayVisualizer 
                      step={steps[currentStepIndex]} 
                      maxValue={Math.max(...initialArray, 100)} 
                      algorithm={algorithm}
                    />
                    
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

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.3, ease: "easeOut" }}
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

          <motion.div 
            className="lg:col-span-1"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.2, ease: "easeOut" }}
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

      <motion.footer 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.6, delay: 0.5 }}
        className="border-t py-6 mt-12 glass-card backdrop-blur-lg"
      >
        <div className="max-w-7xl mx-auto px-4 flex flex-col md:flex-row items-center justify-between gap-4 text-sm text-muted-foreground">
          <p>© 2025 DSA Visualizer | Premium Algorithm Learning</p>
          <div className="flex items-center gap-6">
            <motion.a 
              href="#" 
              className="hover:text-primary transition-colors duration-300"
              whileHover={{ scale: 1.05, x: 2 }}
              transition={{ type: "spring", stiffness: 300 }}
            >
              Privacy Policy
            </motion.a>
            <motion.a 
              href="#" 
              className="hover:text-primary transition-colors duration-300"
              whileHover={{ scale: 1.05, x: 2 }}
              transition={{ type: "spring", stiffness: 300 }}
            >
              Terms of Service
            </motion.a>
          </div>
        </div>
      </motion.footer>
    </div>
  );
}