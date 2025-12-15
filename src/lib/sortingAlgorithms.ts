import { AlgorithmType, SortingStep, AlgorithmInfo } from "./algorithms/types";
import { bubbleSort, bubbleSortInfo } from "./algorithms/bubbleSort";
import { mergeSort, mergeSortInfo } from "./algorithms/mergeSort";
import { quickSort, quickSortInfo } from "./algorithms/quickSort";
import { insertionSort, insertionSortInfo } from "./algorithms/insertionSort";
import { selectionSort, selectionSortInfo } from "./algorithms/selectionSort";
import { stackOperations, stackInfo } from "./algorithms/stack";
import { queueOperations, queueInfo } from "./algorithms/queue";
import { treeInfo } from "./algorithms/tree";
import { graphInfo } from "./algorithms/graph";

export type { AlgorithmType, SortingStep, AlgorithmInfo };

export const ALGORITHMS: Record<AlgorithmType, AlgorithmInfo> = {
  "Bubble Sort": bubbleSortInfo,
  "Merge Sort": mergeSortInfo,
  "Quick Sort": quickSortInfo,
  "Insertion Sort": insertionSortInfo,
  "Selection Sort": selectionSortInfo,
  "Stack Operations": stackInfo,
  "Queue Operations": queueInfo,
  "Tree Operations": treeInfo,
  "Graph Operations": graphInfo,
};

export function generateSteps(algorithm: AlgorithmType, initialArray: number[]): SortingStep[] {
  const array = [...initialArray];
  const steps: SortingStep[] = [];
  const counters = { comparisons: 0, swaps: 0 };
  
  // Initial state
  steps.push({
    array: [...array],
    comparing: [],
    swapping: [],
    sorted: [],
    explanation: "Initial state",
    comparisons: 0,
    swaps: 0,
  });

  switch (algorithm) {
    case "Bubble Sort":
      bubbleSort(array, steps, counters);
      break;
    case "Merge Sort":
      mergeSort(array, steps, counters);
      break;
    case "Quick Sort":
      quickSort(array, steps, counters);
      break;
    case "Insertion Sort":
      insertionSort(array, steps, counters);
      break;
    case "Selection Sort":
      selectionSort(array, steps, counters);
      break;
    case "Stack Operations":
      stackOperations(array, steps, counters);
      break;
    case "Queue Operations":
      queueOperations(array, steps, counters);
      break;
    case "Tree Operations":
    case "Graph Operations":
      // These are handled interactively, return empty steps or initial state
      break;
  }

  // Final sorted state (only for sorting algorithms)
  if (algorithm !== "Stack Operations" && algorithm !== "Queue Operations" && algorithm !== "Tree Operations" && algorithm !== "Graph Operations") {
    steps.push({
      array: [...array],
      comparing: [],
      swapping: [],
      sorted: array.map((_, i) => i),
      explanation: "Sorting complete!",
      comparisons: counters.comparisons,
      swaps: counters.swaps,
    });
  } else {
    // For Stack/Queue, we might want a final state saying "Operations complete"
    steps.push({
      array: [],
      comparing: [],
      swapping: [],
      sorted: [],
      explanation: "Operations complete!",
      comparisons: counters.comparisons,
      swaps: counters.swaps,
    });
  }

  return steps;
}