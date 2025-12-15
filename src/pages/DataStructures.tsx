import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Navbar } from "@/components/Navbar";
import { ArrayVisualizer } from "@/components/visualizer/ArrayVisualizer";
import { TimelineScrubber } from "@/components/visualizer/TimelineScrubber";
import { ControlPanel } from "@/components/visualizer/ControlPanel";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { SortingStep } from "@/lib/sortingAlgorithms";
import { soundManager } from "@/lib/soundManager";
import { toast } from "sonner";
import { Play, RotateCcw, Plus, Minus } from "lucide-react";

type DSType = "Stack Operations" | "Queue Operations";

export default function DataStructures() {
  const [activeTab, setActiveTab] = useState<DSType>("Stack Operations");
  const [steps, setSteps] = useState<SortingStep[]>([]);
  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [speed, setSpeed] = useState(1);
  const [isDarkMode, setIsDarkMode] = useState(true);
  const [inputValue, setInputValue] = useState("");
  const [soundEnabled, setSoundEnabled] = useState(true);

  const timerRef = useRef<NodeJS.Timeout | null>(null);

  // Initialize
  useEffect(() => {
    resetDS();
  }, [activeTab]);

  const resetDS = () => {
    setIsPlaying(false);
    setCurrentStepIndex(0);
    setSteps([{
      array: [],
      comparing: [],
      swapping: [],
      sorted: [],
      explanation: `${activeTab === "Stack Operations" ? "Stack" : "Queue"} is empty`,
      comparisons: 0,
      swaps: 0
    }]);
  };

  // Animation Loop
  useEffect(() => {
    if (isPlaying) {
      const intervalTime = 1000 / (speed * 1.5);
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
    return () => { if (timerRef.current) clearInterval(timerRef.current); };
  }, [isPlaying, speed, steps.length]);

  // Dark Mode
  useEffect(() => {
    const root = document.documentElement;
    if (isDarkMode) root.classList.add("dark");
    else root.classList.remove("dark");
  }, [isDarkMode]);

  // Sound
  useEffect(() => {
    soundManager.setEnabled(soundEnabled);
  }, [soundEnabled]);

  const handlePush = () => {
    const val = parseInt(inputValue);
    if (isNaN(val)) {
      toast.error("Please enter a valid number");
      return;
    }
    
    const currentStep = steps[currentStepIndex]; // Branch off current state
    // If we are in the middle of a playback, we should probably truncate future steps or just add to the end?
    // For simplicity in this interactive mode, let's assume we append to the current state if it's the last step, 
    // or we might need to handle branching. 
    // To keep it simple: We only allow interaction if we are at the latest step or we reset future steps.
    
    // Let's just take the array from the current step and create a new step
    const currentArray = currentStep.array;
    
    if (currentArray.length >= 10) {
      toast.error("Max capacity reached (10 elements)");
      return;
    }

    const newArray = [...currentArray, val];
    const newStep: SortingStep = {
      array: newArray,
      comparing: [],
      swapping: [],
      sorted: [],
      explanation: activeTab === "Stack Operations" 
        ? `Pushed ${val} onto the stack` 
        : `Enqueued ${val}`,
      comparisons: 0,
      swaps: 0
    };

    // If we are not at the end, we discard future steps to maintain consistency
    const newSteps = steps.slice(0, currentStepIndex + 1);
    newSteps.push(newStep);
    
    setSteps(newSteps);
    setCurrentStepIndex(newSteps.length - 1);
    setInputValue("");
    if (soundEnabled) soundManager.playSwapSound();
  };

  const handlePop = () => {
    const currentStep = steps[currentStepIndex];
    const currentArray = currentStep.array;

    if (currentArray.length === 0) {
      toast.error("Is empty!");
      return;
    }

    let newArray: number[];
    let val: number;

    if (activeTab === "Stack Operations") {
      val = currentArray[currentArray.length - 1];
      newArray = currentArray.slice(0, -1);
    } else {
      val = currentArray[0];
      newArray = currentArray.slice(1);
    }

    const newStep: SortingStep = {
      array: newArray,
      comparing: [],
      swapping: [],
      sorted: [],
      explanation: activeTab === "Stack Operations" 
        ? `Popped ${val} from the stack` 
        : `Dequeued ${val}`,
      comparisons: 0,
      swaps: 0
    };

    const newSteps = steps.slice(0, currentStepIndex + 1);
    newSteps.push(newStep);
    
    setSteps(newSteps);
    setCurrentStepIndex(newSteps.length - 1);
    if (soundEnabled) soundManager.playCompareSound();
  };

  const runDemo = () => {
    setIsPlaying(false);
    const demoSteps: SortingStep[] = [];
    let currentArray: number[] = [];
    
    // Helper to add step
    const addStep = (arr: number[], explanation: string) => {
      demoSteps.push({
        array: [...arr],
        comparing: [],
        swapping: [],
        sorted: [],
        explanation,
        comparisons: 0,
        swaps: 0
      });
    };

    addStep([], "Starting Demo...");

    const operations = [10, 25, 5, 40];
    
    // Push operations
    for (const val of operations) {
      currentArray = [...currentArray, val];
      addStep(currentArray, activeTab === "Stack Operations" ? `Push ${val}` : `Enqueue ${val}`);
    }

    // Pop one
    if (activeTab === "Stack Operations") {
      const val = currentArray.pop();
      addStep(currentArray, `Pop ${val} (LIFO - Last In First Out)`);
    } else {
      const val = currentArray.shift();
      addStep(currentArray, `Dequeue ${val} (FIFO - First In First Out)`);
    }

    // Push another
    currentArray = [...currentArray, 99];
    addStep(currentArray, activeTab === "Stack Operations" ? `Push 99` : `Enqueue 99`);

    // Pop all
    while (currentArray.length > 0) {
      if (activeTab === "Stack Operations") {
        const val = currentArray.pop();
        addStep(currentArray, `Pop ${val}`);
      } else {
        const val = currentArray.shift();
        addStep(currentArray, `Dequeue ${val}`);
      }
    }

    addStep([], "Demo Complete");

    setSteps(demoSteps);
    setCurrentStepIndex(0);
    setTimeout(() => setIsPlaying(true), 500);
  };

  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col font-sans transition-colors duration-500">
      <Navbar isDarkMode={isDarkMode} onToggleDarkMode={() => setIsDarkMode(!isDarkMode)} />

      <main className="flex-1 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 w-full">
        <div className="flex flex-col gap-8">
          
          {/* Header & Controls */}
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
            <div>
              <h1 className="text-3xl font-bold tracking-tight gradient-primary bg-clip-text text-transparent">
                Data Structures
              </h1>
              <p className="text-muted-foreground mt-1">
                Interactive visualization of Stack (LIFO) and Queue (FIFO) operations.
              </p>
            </div>

            <Tabs value={activeTab} onValueChange={(v) => setActiveTab(v as DSType)} className="w-[300px]">
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="Stack Operations">Stack</TabsTrigger>
                <TabsTrigger value="Queue Operations">Queue</TabsTrigger>
              </TabsList>
            </Tabs>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Visualization Area */}
            <div className="lg:col-span-2 space-y-6">
              <Card className="glass-card border-white/10 shadow-level-2 overflow-hidden">
                <CardHeader className="pb-2">
                  <CardTitle className="flex justify-between items-center">
                    <span>Visualization</span>
                    <span className="text-sm font-normal text-muted-foreground font-mono">
                      {steps[currentStepIndex]?.explanation}
                    </span>
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-6 min-h-[450px] flex items-center justify-center bg-black/5">
                  <ArrayVisualizer 
                    step={steps[currentStepIndex]} 
                    maxValue={100} 
                    algorithm={activeTab}
                  />
                </CardContent>
              </Card>

              <TimelineScrubber
                currentStep={currentStepIndex}
                totalSteps={steps.length}
                onStepChange={(val) => { setIsPlaying(false); setCurrentStepIndex(val); }}
                isPlaying={isPlaying}
              />
              
              <ControlPanel 
                isPlaying={isPlaying}
                onPlayPause={() => setIsPlaying(!isPlaying)}
                onReset={resetDS}
                onStepForward={() => setCurrentStepIndex(Math.min(steps.length - 1, currentStepIndex + 1))}
                onStepBack={() => setCurrentStepIndex(Math.max(0, currentStepIndex - 1))}
                speed={speed}
                onSpeedChange={setSpeed}
                currentStep={currentStepIndex}
                totalSteps={steps.length}
                soundEnabled={soundEnabled}
                onSoundToggle={() => setSoundEnabled(!soundEnabled)}
              />
            </div>

            {/* Controls Sidebar */}
            <div className="space-y-6">
              <Card className="glass-card border-white/10 shadow-level-2">
                <CardHeader>
                  <CardTitle>Operations</CardTitle>
                  <CardDescription>Manipulate the data structure</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex gap-2">
                    <Input 
                      placeholder="Value (0-99)" 
                      type="number" 
                      value={inputValue}
                      onChange={(e) => setInputValue(e.target.value)}
                      onKeyDown={(e) => e.key === "Enter" && handlePush()}
                    />
                    <Button onClick={handlePush} className="gradient-primary text-white">
                      <Plus className="w-4 h-4 mr-1" />
                      {activeTab === "Stack Operations" ? "Push" : "Enqueue"}
                    </Button>
                  </div>
                  
                  <Button onClick={handlePop} variant="destructive" className="w-full">
                    <Minus className="w-4 h-4 mr-1" />
                    {activeTab === "Stack Operations" ? "Pop" : "Dequeue"}
                  </Button>

                  <div className="relative my-4">
                    <div className="absolute inset-0 flex items-center">
                      <span className="w-full border-t" />
                    </div>
                    <div className="relative flex justify-center text-xs uppercase">
                      <span className="bg-background px-2 text-muted-foreground">Or</span>
                    </div>
                  </div>

                  <Button onClick={runDemo} variant="outline" className="w-full border-primary/50 hover:bg-primary/10">
                    <Play className="w-4 h-4 mr-2" />
                    Run Automated Demo
                  </Button>
                  
                  <Button onClick={resetDS} variant="ghost" className="w-full">
                    <RotateCcw className="w-4 h-4 mr-2" />
                    Reset
                  </Button>
                </CardContent>
              </Card>

              <Card className="glass-card border-white/10 shadow-level-2">
                <CardHeader>
                  <CardTitle>Info</CardTitle>
                </CardHeader>
                <CardContent className="text-sm text-muted-foreground space-y-2">
                  <p>
                    <strong>{activeTab === "Stack Operations" ? "LIFO (Last-In, First-Out)" : "FIFO (First-In, First-Out)"}</strong>
                  </p>
                  <p>
                    {activeTab === "Stack Operations" 
                      ? "Elements are added to the top and removed from the top. Think of a stack of plates."
                      : "Elements are added to the rear and removed from the front. Think of a line of people."}
                  </p>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
