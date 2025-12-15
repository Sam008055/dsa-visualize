export type AlgorithmType = 
  | "Bubble Sort" 
  | "Merge Sort" 
  | "Quick Sort" 
  | "Insertion Sort" 
  | "Selection Sort" 
  | "Stack Operations" 
  | "Queue Operations"
  | "Tree Operations"
  | "Graph Operations";

export interface TreeNode {
  id: string;
  value: number;
  left: TreeNode | null;
  right: TreeNode | null;
  x: number;
  y: number;
}

export interface GraphNode {
  id: string;
  value: number;
  x: number;
  y: number;
}

export interface GraphEdge {
  source: string;
  target: string;
  weight?: number;
}

export interface GraphData {
  nodes: GraphNode[];
  edges: GraphEdge[];
  isDirected: boolean;
}

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
  // New fields for Tree/Graph
  tree?: TreeNode | null;
  graph?: GraphData | null;
  visited?: string[]; // IDs of visited nodes
  current?: string; // ID of current node being processed
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