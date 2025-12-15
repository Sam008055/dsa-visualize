import { AlgorithmType, ALGORITHMS, SortingStep } from "@/lib/sortingAlgorithms";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ComplexityGraph } from "./ComplexityGraph";
import { motion } from "framer-motion";

interface InfoPanelProps {
  algorithm: AlgorithmType;
  step: SortingStep;
  currentStepIndex: number;
  totalSteps: number;
  arraySize: number;
}

export function InfoPanel({ algorithm, step, currentStepIndex, totalSteps, arraySize }: InfoPanelProps) {
  const info = ALGORITHMS[algorithm];

  const getComplexityColor = (complexity: string) => {
    if (complexity.includes("log n")) return "gradient-success";
    if (complexity.includes("n²")) return "gradient-accent";
    return "gradient-primary";
  };

  return (
    <div className="space-y-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
      >
        <Card className="glass-card shadow-level-2 border-2">
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <CardTitle className="text-xl font-bold tracking-tight gradient-primary bg-clip-text text-transparent">
                {info.name}
              </CardTitle>
              <Badge 
                variant="outline" 
                className={`${getComplexityColor(info.timeComplexity)} text-white border-0 px-3 py-1 font-mono text-xs`}
              >
                {info.timeComplexity}
              </Badge>
            </div>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground leading-relaxed mb-4">
              {info.description}
            </p>
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div className="p-3 rounded-xl bg-muted/30 border">
                <span className="text-muted-foreground block text-xs uppercase tracking-wider mb-1">Time</span>
                <span className="font-bold text-base">{info.timeComplexity}</span>
              </div>
              <div className="p-3 rounded-xl bg-muted/30 border">
                <span className="text-muted-foreground block text-xs uppercase tracking-wider mb-1">Space</span>
                <span className="font-bold text-base">{info.spaceComplexity}</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3, delay: 0.1 }}
      >
        <Card className="glass-card shadow-level-2 border-2 border-primary/20">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-semibold uppercase tracking-wider text-muted-foreground">
              Current Step
            </CardTitle>
          </CardHeader>
          <CardContent>
            <motion.p 
              key={currentStepIndex}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.2 }}
              className="text-base font-medium leading-relaxed min-h-[3rem] mb-4"
            >
              {step.explanation}
            </motion.p>
            
            <div className="grid grid-cols-2 gap-4 pt-4 border-t">
              <div className="text-center p-3 rounded-xl bg-gradient-to-br from-cyan-500/10 to-teal-500/10 border border-primary/20">
                <span className="text-xs text-muted-foreground uppercase tracking-wider block mb-1">Comparisons</span>
                <motion.p 
                  key={`comp-${step.comparisons}`}
                  initial={{ scale: 1.2, color: "rgb(6, 182, 212)" }}
                  animate={{ scale: 1, color: "inherit" }}
                  transition={{ duration: 0.3 }}
                  className="text-3xl font-bold text-foreground"
                >
                  {step.comparisons}
                </motion.p>
              </div>
              <div className="text-center p-3 rounded-xl bg-gradient-to-br from-red-500/10 to-orange-500/10 border border-destructive/20">
                <span className="text-xs text-muted-foreground uppercase tracking-wider block mb-1">Swaps</span>
                <motion.p 
                  key={`swap-${step.swaps}`}
                  initial={{ scale: 1.2, color: "rgb(239, 68, 68)" }}
                  animate={{ scale: 1, color: "inherit" }}
                  transition={{ duration: 0.3 }}
                  className="text-3xl font-bold text-foreground"
                >
                  {step.swaps}
                </motion.p>
              </div>
            </div>

            <div className="mt-4 flex gap-4 text-xs pt-3 border-t">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full gradient-accent" />
                <span className="text-muted-foreground">Comparing</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full gradient-destructive" />
                <span className="text-muted-foreground">Swapping</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full gradient-success" />
                <span className="text-muted-foreground">Sorted</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3, delay: 0.2 }}
      >
        <ComplexityGraph
          algorithm={algorithm}
          currentStep={currentStepIndex}
          totalSteps={totalSteps}
          currentComparisons={step.comparisons}
          currentSwaps={step.swaps}
          arraySize={arraySize}
        />
      </motion.div>
    </div>
  );
}