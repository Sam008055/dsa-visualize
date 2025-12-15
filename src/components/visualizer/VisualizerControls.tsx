import { motion } from "framer-motion";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { AlgorithmType } from "@/lib/sortingAlgorithms";
import { ChangeEvent } from "react";

interface VisualizerControlsProps {
  algorithm: AlgorithmType;
  algorithmB: AlgorithmType;
  comparisonMode: boolean;
  customInput: string;
  onAlgorithmChange: (algorithm: AlgorithmType) => void;
  onAlgorithmBChange: (algorithm: AlgorithmType) => void;
  onComparisonModeToggle: () => void;
  onCustomInputChange: (e: ChangeEvent<HTMLInputElement>) => void;
  onApplyCustomInput: () => void;
  onGenerateRandomArray: (size: number) => void;
}

export function VisualizerControls({
  algorithm,
  algorithmB,
  comparisonMode,
  customInput,
  onAlgorithmChange,
  onAlgorithmBChange,
  onComparisonModeToggle,
  onCustomInputChange,
  onApplyCustomInput,
  onGenerateRandomArray,
}: VisualizerControlsProps) {
  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.1, ease: "easeOut" }}
      className="glass-card p-4 md:p-6 rounded-2xl shadow-level-2 border-2 border-white/10"
    >
      <div className="flex flex-col sm:flex-row gap-4 items-center justify-between">
        <div className="flex items-center gap-3 md:gap-4 w-full sm:w-auto flex-wrap">
          <motion.div 
            whileHover={{ scale: 1.05 }} 
            whileTap={{ scale: 0.95 }}
            transition={{ type: "spring", stiffness: 300 }}
          >
            <Button
              variant={comparisonMode ? "default" : "outline"}
              size="sm"
              onClick={onComparisonModeToggle}
              className={`transition-all duration-300 ${comparisonMode ? "gradient-primary text-white border-0 shadow-level-2 glow-primary" : "hover:gradient-primary hover:text-white hover:border-0"}`}
            >
              {comparisonMode ? "Single View" : "Compare Algorithms"}
            </Button>
          </motion.div>
          
          {comparisonMode ? (
            <>
              <div className="relative">
                <Select value={algorithm} onValueChange={(v) => onAlgorithmChange(v as AlgorithmType)}>
                  <SelectTrigger className="w-[140px] h-10 md:h-12 border-2 focus:ring-2 focus:ring-primary focus:ring-offset-2 glass-card backdrop-blur-xl transition-all duration-300 hover:shadow-level-2">
                    <SelectValue placeholder="Algorithm A" />
                  </SelectTrigger>
                  <SelectContent className="glass-card backdrop-blur-xl border-2 border-white/20 shadow-level-3">
                    <SelectItem value="Bubble Sort" className="hover:bg-primary/10 transition-colors duration-200">Bubble Sort</SelectItem>
                    <SelectItem value="Merge Sort" className="hover:bg-primary/10 transition-colors duration-200">Merge Sort</SelectItem>
                    <SelectItem value="Quick Sort" className="hover:bg-primary/10 transition-colors duration-200">Quick Sort</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <span className="text-muted-foreground text-sm font-medium">vs</span>
              <div className="relative">
                <Select value={algorithmB} onValueChange={(v) => onAlgorithmBChange(v as AlgorithmType)}>
                  <SelectTrigger className="w-[140px] h-10 md:h-12 border-2 focus:ring-2 focus:ring-primary focus:ring-offset-2 glass-card backdrop-blur-xl transition-all duration-300 hover:shadow-level-2">
                    <SelectValue placeholder="Algorithm B" />
                  </SelectTrigger>
                  <SelectContent className="glass-card backdrop-blur-xl border-2 border-white/20 shadow-level-3">
                    <SelectItem value="Bubble Sort" className="hover:bg-primary/10 transition-colors duration-200">Bubble Sort</SelectItem>
                    <SelectItem value="Merge Sort" className="hover:bg-primary/10 transition-colors duration-200">Merge Sort</SelectItem>
                    <SelectItem value="Quick Sort" className="hover:bg-primary/10 transition-colors duration-200">Quick Sort</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </>
          ) : (
            <div className="relative">
              <Select value={algorithm} onValueChange={(v) => onAlgorithmChange(v as AlgorithmType)}>
                <SelectTrigger className="w-[180px] md:w-[200px] h-10 md:h-12 border-2 focus:ring-2 focus:ring-primary focus:ring-offset-2 glass-card backdrop-blur-xl transition-all duration-300 hover:shadow-level-2">
                  <SelectValue placeholder="Select Algorithm" />
                </SelectTrigger>
                <SelectContent className="glass-card backdrop-blur-xl border-2 border-white/20 shadow-level-3">
                  <SelectItem value="Bubble Sort" className="hover:bg-primary/10 transition-colors duration-200 cursor-pointer">Bubble Sort</SelectItem>
                  <SelectItem value="Merge Sort" className="hover:bg-primary/10 transition-colors duration-200 cursor-pointer">Merge Sort</SelectItem>
                  <SelectItem value="Quick Sort" className="hover:bg-primary/10 transition-colors duration-200 cursor-pointer">Quick Sort</SelectItem>
                </SelectContent>
              </Select>
            </div>
          )}
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto">
          {[10, 50, 100].map((size) => (
            <motion.div 
              key={size} 
              whileHover={{ scale: 1.05, y: -2 }} 
              whileTap={{ scale: 0.95 }}
              transition={{ type: "spring", stiffness: 300 }}
            >
              <Button 
                variant="outline" 
                size="sm" 
                onClick={() => onGenerateRandomArray(size)}
                className="h-9 md:h-10 hover:gradient-primary hover:text-white hover:border-0 transition-all duration-300 hover:shadow-level-2"
              >
                Random {size}
              </Button>
            </motion.div>
          ))}
        </div>
      </div>

      <motion.div 
        className="flex gap-2 mt-4"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.2 }}
      >
        <Input 
          placeholder="Enter numbers (comma-separated)" 
          value={customInput}
          onChange={onCustomInputChange}
          className="font-mono text-sm h-10 md:h-12 border-2 focus:ring-2 focus:ring-primary focus:ring-offset-2 glass-card backdrop-blur-sm transition-all duration-300"
          aria-label="Custom array input"
        />
        <motion.div 
          whileHover={{ scale: 1.05 }} 
          whileTap={{ scale: 0.95 }}
          transition={{ type: "spring", stiffness: 300 }}
        >
          <Button 
            onClick={onApplyCustomInput}
            className="gradient-primary text-white border-0 shadow-level-2 h-10 md:h-12 px-6 glow-primary transition-all duration-300 hover:shadow-level-3"
          >
            Load
          </Button>
        </motion.div>
      </motion.div>
    </motion.div>
  );
}
