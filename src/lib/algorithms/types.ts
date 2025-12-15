export type AlgorithmType = 
  | "Bubble Sort" 
  | "Merge Sort" 
  | "Quick Sort" 
  | "Insertion Sort" 
  | "Selection Sort" 
  | "Stack Operations" 
  | "Queue Operations";

export interface SortingStep {
  array: number[];
  comparing: number[];
  swapping: number[];
  sorted: number[];
  explanation: string;
  comparisons: number;
  swaps: number;
  // Optional fields for Stack/Queue visualization
  highlight?: number[]; // Generic highlight
}

export interface AlgorithmInfo {
  name: string;
  description: string;
  timeComplexity: string;
  spaceComplexity: string;
  bestCase: string;
  averageCase: string;
  worstCase: string;
  stable: boolean;
  inPlace: boolean;
  howItWorks: string[];
  advantages: string[];
  disadvantages: string[];
  useCases: string[];
  codeImplementations: {
    c: string;
    cpp: string;
    python: string;
    java: string;
  };
}
