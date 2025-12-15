import { AlgorithmType, ALGORITHMS, SortingStep } from "@/lib/sortingAlgorithms";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ComplexityGraph } from "./ComplexityGraph";

interface InfoPanelProps {
  algorithm: AlgorithmType;
  step: SortingStep;
  currentStepIndex: number;
  totalSteps: number;
  arraySize: number;
}

export function InfoPanel({ algorithm, step, currentStepIndex, totalSteps, arraySize }: InfoPanelProps) {
  const info = ALGORITHMS[algorithm];

  return (
    <div className="space-y-4">
      <Card>
        <CardHeader className="pb-2">
          <div className="flex items-center justify-between">
            <CardTitle className="text-lg font-bold text-primary">{info.name}</CardTitle>
            <Badge variant="outline">{info.timeComplexity}</Badge>
          </div>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground mb-4">
            {info.description}
          </p>
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div>
              <span className="text-muted-foreground block">Time Complexity</span>
              <span className="font-medium">{info.timeComplexity}</span>
            </div>
            <div>
              <span className="text-muted-foreground block">Space Complexity</span>
              <span className="font-medium">{info.spaceComplexity}</span>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card className="bg-muted/30 border-primary/20">
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium uppercase tracking-wider text-muted-foreground">
            Current Step
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-base font-medium leading-relaxed min-h-[3rem]">
            {step.explanation}
          </p>
          
          <div className="grid grid-cols-2 gap-4 mt-4 pt-4 border-t">
            <div>
              <span className="text-xs text-muted-foreground uppercase tracking-wider">Comparisons</span>
              <p className="text-2xl font-bold text-foreground">{step.comparisons}</p>
            </div>
            <div>
              <span className="text-xs text-muted-foreground uppercase tracking-wider">Swaps</span>
              <p className="text-2xl font-bold text-foreground">{step.swaps}</p>
            </div>
          </div>

          <div className="mt-4 flex gap-4 text-xs pt-2">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-amber-500" />
              <span>Comparing</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-red-500" />
              <span>Swapping</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-emerald-500" />
              <span>Sorted</span>
            </div>
          </div>
        </CardContent>
      </Card>

      <ComplexityGraph
        algorithm={algorithm}
        currentStep={currentStepIndex}
        totalSteps={totalSteps}
        currentComparisons={step.comparisons}
        currentSwaps={step.swaps}
        arraySize={arraySize}
      />
    </div>
  );
}