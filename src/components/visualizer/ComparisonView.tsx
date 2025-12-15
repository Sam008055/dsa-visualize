import { useState, useEffect, useRef } from "react";
import { motion } from "framer-motion";
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
      // Both completed, determine winner
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
      {/* Winner Announcement */}
      {bothComplete && winner && (
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-gradient-to-r from-emerald-500/10 to-teal-500/10 border-2 border-emerald-500/50 rounded-xl p-6 text-center"
        >
          <div className="flex items-center justify-center gap-3 mb-2">
            <Trophy className="h-8 w-8 text-emerald-500" />
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

      {/* Comparison Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Algorithm A Stats */}
        <Card className={isAComplete && winner === "A" ? "border-emerald-500 shadow-emerald-500/20 shadow-lg" : ""}>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium flex items-center justify-between">
              <span>{algorithmA}</span>
              {isAComplete && winner === "A" && (
                <Badge variant="default" className="bg-emerald-500">
                  <Zap className="h-3 w-3 mr-1" />
                  Winner
                </Badge>
              )}
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

        {/* Center Comparison */}
        <Card className="bg-muted/30">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-center">Live Comparison</CardTitle>
          </CardHeader>
          <CardContent className="text-center">
            <div className="space-y-3">
              <div>
                <p className="text-xs text-muted-foreground mb-1">Efficiency Ratio</p>
                <p className="text-3xl font-bold text-primary">{speedRatio}x</p>
              </div>
              <div className="pt-2 border-t">
                <p className="text-xs text-muted-foreground">Current Step</p>
                <p className="text-lg font-semibold">{currentStepIndex + 1}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Algorithm B Stats */}
        <Card className={isBComplete && winner === "B" ? "border-emerald-500 shadow-emerald-500/20 shadow-lg" : ""}>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium flex items-center justify-between">
              <span>{algorithmB}</span>
              {isBComplete && winner === "B" && (
                <Badge variant="default" className="bg-emerald-500">
                  <Zap className="h-3 w-3 mr-1" />
                  Winner
                </Badge>
              )}
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
      </div>

      {/* Split Screen Visualizers */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* Algorithm A Visualizer */}
        <div className="space-y-2">
          <div className="flex items-center justify-between px-2">
            <h3 className="font-semibold text-sm">{algorithmA}</h3>
            {isAComplete && (
              <Badge variant="outline" className="text-xs">Complete</Badge>
            )}
          </div>
          {currentStepA && (
            <ArrayVisualizer step={currentStepA} maxValue={maxValue} />
          )}
          <p className="text-xs text-muted-foreground text-center px-2 min-h-[2.5rem]">
            {currentStepA?.explanation || "Initializing..."}
          </p>
        </div>

        {/* Algorithm B Visualizer */}
        <div className="space-y-2">
          <div className="flex items-center justify-between px-2">
            <h3 className="font-semibold text-sm">{algorithmB}</h3>
            {isBComplete && (
              <Badge variant="outline" className="text-xs">Complete</Badge>
            )}
          </div>
          {currentStepB && (
            <ArrayVisualizer step={currentStepB} maxValue={maxValue} />
          )}
          <p className="text-xs text-muted-foreground text-center px-2 min-h-[2.5rem]">
            {currentStepB?.explanation || "Initializing..."}
          </p>
        </div>
      </div>
    </div>
  );
}
