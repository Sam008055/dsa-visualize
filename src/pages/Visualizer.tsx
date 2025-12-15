import { useState, useEffect, useRef, ChangeEvent } from "react";
import { motion } from "framer-motion";
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Moon, Sun, Github, Linkedin, BarChart3 } from "lucide-react";
import { 
  AlgorithmType, 
  generateSteps, 
  SortingStep 
} from "@/lib/sortingAlgorithms";
import { ArrayVisualizer } from "@/components/visualizer/ArrayVisualizer";
import { ControlPanel } from "@/components/visualizer/ControlPanel";
import { InfoPanel } from "@/components/visualizer/InfoPanel";

export default function Visualizer() {
  const [algorithm, setAlgorithm] = useState<AlgorithmType>("Bubble Sort");
  const [arraySize, setArraySize] = useState(20);
  const [customInput, setCustomInput] = useState("");
  const [initialArray, setInitialArray] = useState<number[]>([]);
  const [steps, setSteps] = useState<SortingStep[]>([]);
  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [speed, setSpeed] = useState(1);
  const [isDarkMode, setIsDarkMode] = useState(false);

  const timerRef = useRef<NodeJS.Timeout | null>(null);

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
    }
  }, [initialArray, algorithm]);

  // Handle animation loop
  useEffect(() => {
    if (isPlaying) {
      const intervalTime = 1000 / (speed * 2); // Base speed adjustment
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
  };
  const handleStepForward = () => {
    if (currentStepIndex < steps.length - 1) setCurrentStepIndex(prev => prev + 1);
  };
  const handleStepBack = () => {
    if (currentStepIndex > 0) setCurrentStepIndex(prev => prev - 1);
  };

  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col font-sans transition-colors duration-300">
      {/* Navbar */}
      <nav className="border-b bg-card/50 backdrop-blur-sm sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="bg-primary/10 p-2 rounded-lg">
              <BarChart3 className="h-6 w-6 text-primary" />
            </div>
            <span className="font-bold text-xl tracking-tight">DSA Visualizer</span>
          </div>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setIsDarkMode(!isDarkMode)}
            className="rounded-full"
          >
            {isDarkMode ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
          </Button>
        </div>
      </nav>

      {/* Main Content */}
      <main className="flex-1 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 w-full">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* Left Column: Controls & Visualizer */}
          <div className="lg:col-span-2 space-y-6">
            
            {/* Top Controls */}
            <div className="flex flex-col sm:flex-row gap-4 items-center justify-between bg-card p-4 rounded-xl border shadow-sm">
              <div className="flex items-center gap-4 w-full sm:w-auto">
                <Select 
                  value={algorithm} 
                  onValueChange={(v) => setAlgorithm(v as AlgorithmType)}
                >
                  <SelectTrigger className="w-[180px]">
                    <SelectValue placeholder="Select Algorithm" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Bubble Sort">Bubble Sort</SelectItem>
                    <SelectItem value="Merge Sort">Merge Sort</SelectItem>
                    <SelectItem value="Quick Sort">Quick Sort</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="flex items-center gap-2 w-full sm:w-auto">
                <Button variant="outline" size="sm" onClick={() => generateRandomArray(10)}>Random 10</Button>
                <Button variant="outline" size="sm" onClick={() => generateRandomArray(50)}>Random 50</Button>
                <Button variant="outline" size="sm" onClick={() => generateRandomArray(100)}>Random 100</Button>
              </div>
            </div>

            {/* Input Area */}
            <div className="flex gap-2">
              <Input 
                placeholder="Enter numbers (comma-separated)" 
                value={customInput}
                onChange={handleCustomInput}
                className="font-mono text-sm"
              />
              <Button onClick={applyCustomInput}>Load</Button>
            </div>

            {/* Visualizer Canvas */}
            {steps.length > 0 && (
              <ArrayVisualizer 
                step={steps[currentStepIndex]} 
                maxValue={Math.max(...initialArray, 100)} 
              />
            )}

            {/* Playback Controls */}
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
            />
          </div>

          {/* Right Column: Info Panel */}
          <div className="lg:col-span-1">
            {steps.length > 0 && (
              <InfoPanel 
                algorithm={algorithm} 
                step={steps[currentStepIndex]} 
              />
            )}
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t py-8 mt-12 bg-card/50">
        <div className="max-w-7xl mx-auto px-4 flex flex-col md:flex-row items-center justify-between gap-4 text-sm text-muted-foreground">
          <p>© 2025 DSA Visualizer | Built with React, Framer Motion</p>
          <div className="flex items-center gap-6">
            <a href="#" className="hover:text-primary transition-colors flex items-center gap-2">
              <Github className="h-4 w-4" /> GitHub
            </a>
            <a href="#" className="hover:text-primary transition-colors flex items-center gap-2">
              <Linkedin className="h-4 w-4" /> LinkedIn
            </a>
          </div>
        </div>
      </footer>
    </div>
  );
}