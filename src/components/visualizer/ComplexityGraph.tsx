import { useMemo } from "react";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, Area, AreaChart } from "recharts";
import { AlgorithmType } from "@/lib/sortingAlgorithms";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { motion } from "framer-motion";

interface ComplexityGraphProps {
  algorithm: AlgorithmType;
  currentStep: number;
  totalSteps: number;
  currentComparisons: number;
  currentSwaps: number;
  arraySize: number;
}

export function ComplexityGraph({
  algorithm,
  currentStep,
  totalSteps,
  currentComparisons,
  currentSwaps,
  arraySize,
}: ComplexityGraphProps) {
  const data = useMemo(() => {
    const points = [];
    const n = arraySize;
    const stepInterval = Math.max(1, Math.floor(totalSteps / 50));
    
    for (let step = 0; step <= currentStep; step += stepInterval) {
      const progress = step / Math.max(totalSteps - 1, 1);
      const actualOps = Math.floor((currentComparisons + currentSwaps) * (step / Math.max(currentStep, 1)));
      
      let theoreticalOps = 0;
      
      if (algorithm === "Bubble Sort") {
        theoreticalOps = Math.floor((n * (n - 1) / 2) * progress);
      } else if (algorithm === "Merge Sort") {
        theoreticalOps = Math.floor(n * Math.log2(n) * progress * 1.5);
      } else if (algorithm === "Quick Sort") {
        theoreticalOps = Math.floor(n * Math.log2(n) * progress * 1.8);
      }
      
      points.push({
        step,
        actual: actualOps,
        theoretical: theoreticalOps,
      });
    }
    
    if (currentStep > 0 && currentStep % stepInterval !== 0) {
      points.push({
        step: currentStep,
        actual: currentComparisons + currentSwaps,
        theoretical: (() => {
          const progress = currentStep / Math.max(totalSteps - 1, 1);
          if (algorithm === "Bubble Sort") {
            return Math.floor((n * (n - 1) / 2) * progress);
          } else if (algorithm === "Merge Sort") {
            return Math.floor(n * Math.log2(n) * progress * 1.5);
          } else {
            return Math.floor(n * Math.log2(n) * progress * 1.8);
          }
        })(),
      });
    }
    
    return points.sort((a, b) => a.step - b.step);
  }, [algorithm, currentStep, totalSteps, currentComparisons, currentSwaps, arraySize]);

  const efficiency = useMemo(() => {
    if (currentStep === 0) return 100;
    const actualTotal = currentComparisons + currentSwaps;
    const n = arraySize;
    let theoreticalWorst = 0;
    
    if (algorithm === "Bubble Sort") {
      theoreticalWorst = (n * (n - 1)) / 2;
    } else if (algorithm === "Merge Sort") {
      theoreticalWorst = n * Math.log2(n) * 1.5;
    } else if (algorithm === "Quick Sort") {
      theoreticalWorst = n * Math.log2(n) * 1.8;
    }
    
    return Math.min(100, Math.round((actualTotal / theoreticalWorst) * 100));
  }, [algorithm, currentComparisons, currentSwaps, arraySize, currentStep]);

  const complexityLabel = useMemo(() => {
    if (algorithm === "Bubble Sort") return "O(n²) - Quadratic";
    if (algorithm === "Merge Sort") return "O(n log n) - Linearithmic";
    if (algorithm === "Quick Sort") return "O(n log n) avg - Linearithmic";
    return "";
  }, [algorithm]);

  return (
    <Card className="glass-card shadow-level-2 border-2 border-white/10 backdrop-blur-xl">
      <CardHeader className="pb-3">
        <CardTitle className="text-lg font-bold">Complexity Analysis</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="w-full h-[220px] sm:h-[270px] md:h-[300px]">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={data} margin={{ top: 10, right: 10, left: 0, bottom: 20 }}>
              <defs>
                <linearGradient id="actualGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="hsl(var(--primary))" stopOpacity={0.3}/>
                  <stop offset="95%" stopColor="hsl(var(--primary))" stopOpacity={0}/>
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" className="stroke-muted" opacity={0.3} />
              <XAxis 
                dataKey="step" 
                label={{ value: 'Step', position: 'insideBottom', offset: -10, style: { fontSize: '11px', fill: 'hsl(var(--muted-foreground))' } }}
                tick={{ fill: 'hsl(var(--muted-foreground))', fontSize: 10 }}
                tickMargin={8}
                height={50}
                interval="preserveStartEnd"
                minTickGap={30}
              />
              <YAxis 
                label={{ value: 'Operations', angle: -90, position: 'insideLeft', style: { fontSize: '11px', fill: 'hsl(var(--muted-foreground))' } }}
                tick={{ fill: 'hsl(var(--muted-foreground))', fontSize: 10 }}
                tickMargin={8}
                width={55}
                interval="preserveStartEnd"
                minTickGap={20}
              />
              <Tooltip 
                contentStyle={{ 
                  backgroundColor: 'hsl(var(--popover))',
                  border: '1px solid hsl(var(--border))',
                  borderRadius: '0.5rem',
                  fontSize: '0.875rem',
                  backdropFilter: 'blur(10px)'
                }}
                labelStyle={{ color: 'hsl(var(--popover-foreground))' }}
              />
              <Legend 
                wrapperStyle={{ fontSize: '0.7rem', paddingTop: '10px' }}
                iconType="line"
                iconSize={12}
                layout="horizontal"
                align="center"
                verticalAlign="bottom"
                height={36}
              />
              <Area
                type="monotone"
                dataKey="actual"
                stroke="hsl(var(--primary))"
                fill="url(#actualGradient)"
                strokeWidth={2}
                name="Actual Operations"
              />
              <Line
                type="monotone"
                dataKey="theoretical"
                stroke="hsl(var(--destructive))"
                strokeWidth={2}
                strokeDasharray="5 5"
                dot={false}
                name="Theoretical Worst"
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        <div className="space-y-3 pt-4 border-t">
          <motion.div 
            className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2"
            whileHover={{ scale: 1.02 }}
            transition={{ type: "spring", stiffness: 300 }}
          >
            <span className="text-sm text-muted-foreground">Efficiency:</span>
            <motion.span 
              className="font-bold text-lg"
              key={efficiency}
              initial={{ scale: 1.2, color: "hsl(var(--primary))" }}
              animate={{ scale: 1, color: "inherit" }}
              transition={{ duration: 0.3 }}
            >
              {efficiency}%
            </motion.span>
          </motion.div>
          
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2">
            <span className="text-sm text-muted-foreground">Complexity:</span>
            <span className="font-mono text-xs font-medium break-all">{complexityLabel}</span>
          </div>
          
          <div className="text-xs text-muted-foreground pt-2 leading-relaxed">
            {algorithm === "Bubble Sort" && "Compares each element with others repeatedly"}
            {algorithm === "Merge Sort" && "Divides array recursively, then merges sorted halves"}
            {algorithm === "Quick Sort" && "Partitions around pivot, recursively sorts sub-arrays"}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}