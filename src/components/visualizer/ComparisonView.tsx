import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  AlgorithmType, 
  generateSteps, 
  SortingStep,
  ALGORITHMS 
} from "@/lib/sortingAlgorithms";
import { ArrayVisualizer } from "./ArrayVisualizer";
import { Trophy, Zap } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface ComparisonViewProps {
  algorithmA: AlgorithmType;
  algorithmB: AlgorithmType;
  initialArray: number[];
  currentStepIndex: number;
  maxValue: number;
}

export function ComparisonView({
  algorithmA,
  algorithmB,
  initialArray,
  currentStepIndex,
  maxValue,
}: ComparisonViewProps) {
  const [stepsA, setStepsA] = useState<SortingStep[]>([]);
  const [stepsB, setStepsB] = useState<SortingStep[]>([]);
  const [winner, setWinner] = useState<"A" | "B" | null>(null);

  useEffect(() => {
    if (initialArray.length > 0) {
      const newStepsA = generateSteps(algorithmA, initialArray);
      const newStepsB = generateSteps(algorithmB, initialArray);
      setStepsA(newStepsA);
      setStepsB(newStepsB);
      setWinner(null);
    }
  }, [initialArray, algorithmA, algorithmB]);

  useEffect(() => {
    if (currentStepIndex >= Math.max(stepsA.length - 1, stepsB.length - 1)) {
      if (stepsA.length < stepsB.length) {
        setWinner("A");
      } else if (stepsB.length < stepsA.length) {
        setWinner("B");
      }
    }
  }, [currentStepIndex, stepsA.length, stepsB.length]);

  const currentStepA = stepsA[Math.min(currentStepIndex, stepsA.length - 1)] || stepsA[0];
  const currentStepB = stepsB[Math.min(currentStepIndex, stepsB.length - 1)] || stepsB[0];

  const isAComplete = currentStepIndex >= stepsA.length - 1;
  const isBComplete = currentStepIndex >= stepsB.length - 1;
  const bothComplete = isAComplete && isBComplete;

  const speedRatio = stepsB.length > 0 ? (stepsA.length / stepsB.length).toFixed(2) : "1.00";

  return (
    <div className="space-y-6">
      <AnimatePresence>
        {bothComplete && winner && (
          <motion.div
            initial={{ opacity: 0, y: -20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -20, scale: 0.95 }}
            transition={{ duration: 0.5, type: "spring", stiffness: 300 }}
            className="glass-card backdrop-blur-xl bg-gradient-to-r from-emerald-500/10 to-teal-500/10 border-2 border-emerald-500/50 rounded-xl p-6 text-center shadow-level-3"
          >
            <div className="flex items-center justify-center gap-3 mb-2">
              <motion.div
                animate={{ rotate: [0, 10, -10, 0] }}
                transition={{ duration: 0.5, repeat: 3 }}
              >
                <Trophy className="h-8 w-8 text-emerald-500" />
              </motion.div>
              <h3 className="text-2xl font-bold">
                {winner === "A" ? algorithmA : algorithmB} Wins! 🎉
              </h3>
            </div>
            <p className="text-muted-foreground">
              {stepsA.length} steps vs {stepsB.length} steps
            </p>
            <p className="text-sm text-muted-foreground mt-1">
              {winner === "A" ? algorithmA : algorithmB} is {speedRatio}x {winner === "A" ? "faster" : "slower"}
            </p>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.4 }}
        >
          <Card className={`glass-card backdrop-blur-xl border-2 transition-all duration-300 ${isAComplete && winner === "A" ? "border-emerald-500 shadow-emerald-500/20 shadow-lg" : "border-white/10"}`}>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium flex items-center justify-between">
                <span>{algorithmA}</span>
                <AnimatePresence>
                  {isAComplete && winner === "A" && (
                    <motion.div
                      initial={{ scale: 0, rotate: -180 }}
                      animate={{ scale: 1, rotate: 0 }}
                      exit={{ scale: 0, rotate: 180 }}
                      transition={{ type: "spring", stiffness: 300 }}
                    >
                      <Badge variant="default" className="bg-emerald-500">
                        <Zap className="h-3 w-3 mr-1" />
                        Winner
                      </Badge>
                    </motion.div>
                  )}
                </AnimatePresence>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Steps:</span>
                  <span className="font-bold">{stepsA.length}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Comparisons:</span>
                  <span className="font-medium">{currentStepA?.comparisons || 0}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Swaps:</span>
                  <span className="font-medium">{currentStepA?.swaps || 0}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Complexity:</span>
                  <span className="font-mono text-xs">{ALGORITHMS[algorithmA].timeComplexity}</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.1 }}
        >
          <Card className="glass-card backdrop-blur-xl bg-muted/30 border-2 border-white/10">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-center">Live Comparison</CardTitle>
            </CardHeader>
            <CardContent className="text-center">
              <div className="space-y-3">
                <div>
                  <p className="text-xs text-muted-foreground mb-1">Efficiency Ratio</p>
                  <motion.p 
                    className="text-3xl font-bold text-primary"
                    key={speedRatio}
                    initial={{ scale: 1.2 }}
                    animate={{ scale: 1 }}
                    transition={{ type: "spring", stiffness: 300 }}
                  >
                    {speedRatio}x
                  </motion.p>
                </div>
                <div className="pt-2 border-t">
                  <p className="text-xs text-muted-foreground">Current Step</p>
                  <p className="text-lg font-semibold">{currentStepIndex + 1}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.4, delay: 0.2 }}
        >
          <Card className={`glass-card backdrop-blur-xl border-2 transition-all duration-300 ${isBComplete && winner === "B" ? "border-emerald-500 shadow-emerald-500/20 shadow-lg" : "border-white/10"}`}>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium flex items-center justify-between">
                <span>{algorithmB}</span>
                <AnimatePresence>
                  {isBComplete && winner === "B" && (
                    <motion.div
                      initial={{ scale: 0, rotate: -180 }}
                      animate={{ scale: 1, rotate: 0 }}
                      exit={{ scale: 0, rotate: 180 }}
                      transition={{ type: "spring", stiffness: 300 }}
                    >
                      <Badge variant="default" className="bg-emerald-500">
                        <Zap className="h-3 w-3 mr-1" />
                        Winner
                      </Badge>
                    </motion.div>
                  )}
                </AnimatePresence>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Steps:</span>
                  <span className="font-bold">{stepsB.length}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Comparisons:</span>
                  <span className="font-medium">{currentStepB?.comparisons || 0}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Swaps:</span>
                  <span className="font-medium">{currentStepB?.swaps || 0}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Complexity:</span>
                  <span className="font-mono text-xs">{ALGORITHMS[algorithmB].timeComplexity}</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <motion.div 
          className="space-y-2"
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.4, delay: 0.3 }}
        >
          <div className="flex items-center justify-between px-2">
            <h3 className="font-semibold text-sm">{algorithmA}</h3>
            <AnimatePresence>
              {isAComplete && (
                <motion.div
                  initial={{ scale: 0, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  exit={{ scale: 0, opacity: 0 }}
                >
                  <Badge variant="outline" className="text-xs">Complete</Badge>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
          {currentStepA && (
            <ArrayVisualizer step={currentStepA} maxValue={maxValue} />
          )}
          <p className="text-xs text-muted-foreground text-center px-2 min-h-[2.5rem]">
            {currentStepA?.explanation || "Initializing..."}
          </p>
        </motion.div>

        <motion.div 
          className="space-y-2"
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.4, delay: 0.4 }}
        >
          <div className="flex items-center justify-between px-2">
            <h3 className="font-semibold text-sm">{algorithmB}</h3>
            <AnimatePresence>
              {isBComplete && (
                <motion.div
                  initial={{ scale: 0, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  exit={{ scale: 0, opacity: 0 }}
                >
                  <Badge variant="outline" className="text-xs">Complete</Badge>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
          {currentStepB && (
            <ArrayVisualizer step={currentStepB} maxValue={maxValue} />
          )}
          <p className="text-xs text-muted-foreground text-center px-2 min-h-[2.5rem]">
            {currentStepB?.explanation || "Initializing..."}
          </p>
        </motion.div>
      </div>
    </div>
  );
}