export type AlgorithmType = "Bubble Sort" | "Merge Sort" | "Quick Sort";

export interface SortingStep {
  array: number[];
  comparing: number[]; // Indices being compared
  swapping: number[]; // Indices being swapped
  sorted: number[]; // Indices that are sorted
  explanation: string;
  comparisons: number;
  swaps: number;
}

export const ALGORITHMS: Record<AlgorithmType, {
  name: string;
  description: string;
  timeComplexity: string;
  spaceComplexity: string;
}> = {
  "Bubble Sort": {
    name: "Bubble Sort",
    description: "Simple but slow. Compares adjacent elements and swaps if needed.",
    timeComplexity: "O(n²)",
    spaceComplexity: "O(1)",
  },
  "Merge Sort": {
    name: "Merge Sort",
    description: "Divide-and-conquer approach. Recursively divides array into halves.",
    timeComplexity: "O(n log n)",
    spaceComplexity: "O(n)",
  },
  "Quick Sort": {
    name: "Quick Sort",
    description: "Uses a pivot element to partition the array into smaller and larger elements.",
    timeComplexity: "O(n log n) avg",
    spaceComplexity: "O(log n)",
  },
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
  }

  // Final sorted state
  steps.push({
    array: [...array],
    comparing: [],
    swapping: [],
    sorted: array.map((_, i) => i),
    explanation: "Sorting complete!",
    comparisons: counters.comparisons,
    swaps: counters.swaps,
  });

  return steps;
}

function bubbleSort(array: number[], steps: SortingStep[], counters: { comparisons: number, swaps: number }) {
  const n = array.length;
  const sortedIndices: number[] = [];

  for (let i = 0; i < n - 1; i++) {
    let swapped = false;
    for (let j = 0; j < n - i - 1; j++) {
      // Compare
      counters.comparisons++;
      steps.push({
        array: [...array],
        comparing: [j, j + 1],
        swapping: [],
        sorted: [...sortedIndices],
        explanation: `Comparing ${array[j]} and ${array[j + 1]}`,
        comparisons: counters.comparisons,
        swaps: counters.swaps,
      });

      if (array[j] > array[j + 1]) {
        // Swap
        [array[j], array[j + 1]] = [array[j + 1], array[j]];
        swapped = true;
        counters.swaps++;
        steps.push({
          array: [...array],
          comparing: [],
          swapping: [j, j + 1],
          sorted: [...sortedIndices],
          explanation: `Swapping ${array[j + 1]} and ${array[j]}`,
          comparisons: counters.comparisons,
          swaps: counters.swaps,
        });
      }
    }
    sortedIndices.push(n - 1 - i);
    // Mark end of pass
    steps.push({
      array: [...array],
      comparing: [],
      swapping: [],
      sorted: [...sortedIndices],
      explanation: `Element ${array[n - 1 - i]} is now in its sorted position`,
      comparisons: counters.comparisons,
      swaps: counters.swaps,
    });
    
    if (!swapped) {
        for(let k = 0; k < n - 1 - i; k++) {
            sortedIndices.push(k);
        }
        break;
    }
  }
  for(let i=0; i<n; i++) {
      if(!sortedIndices.includes(i)) sortedIndices.push(i);
  }
}

function mergeSort(array: number[], steps: SortingStep[], counters: { comparisons: number, swaps: number }) {
  const n = array.length;
  
  const merge = (arr: number[], l: number, m: number, r: number) => {
    const n1 = m - l + 1;
    const n2 = r - m;
    
    const L = new Array(n1);
    const R = new Array(n2);
    
    for (let i = 0; i < n1; i++) L[i] = arr[l + i];
    for (let j = 0; j < n2; j++) R[j] = arr[m + 1 + j];
    
    let i = 0;
    let j = 0;
    let k = l;
    
    while (i < n1 && j < n2) {
      counters.comparisons++;
      steps.push({
        array: [...arr],
        comparing: [l + i, m + 1 + j],
        swapping: [],
        sorted: [],
        explanation: `Comparing left subarray value ${L[i]} with right subarray value ${R[j]}`,
        comparisons: counters.comparisons,
        swaps: counters.swaps,
      });
      
      if (L[i] <= R[j]) {
        arr[k] = L[i];
        counters.swaps++; // Counting writes as swaps/moves for visualization stats
        steps.push({
            array: [...arr],
            comparing: [],
            swapping: [k],
            sorted: [],
            explanation: `Placing ${L[i]} at index ${k}`,
            comparisons: counters.comparisons,
            swaps: counters.swaps,
        });
        i++;
      } else {
        arr[k] = R[j];
        counters.swaps++;
        steps.push({
            array: [...arr],
            comparing: [],
            swapping: [k],
            sorted: [],
            explanation: `Placing ${R[j]} at index ${k}`,
            comparisons: counters.comparisons,
            swaps: counters.swaps,
        });
        j++;
      }
      k++;
    }
    
    while (i < n1) {
      arr[k] = L[i];
      counters.swaps++;
      steps.push({
        array: [...arr],
        comparing: [],
        swapping: [k],
        sorted: [],
        explanation: `Placing remaining ${L[i]} at index ${k}`,
        comparisons: counters.comparisons,
        swaps: counters.swaps,
      });
      i++;
      k++;
    }
    
    while (j < n2) {
      arr[k] = R[j];
      counters.swaps++;
      steps.push({
        array: [...arr],
        comparing: [],
        swapping: [k],
        sorted: [],
        explanation: `Placing remaining ${R[j]} at index ${k}`,
        comparisons: counters.comparisons,
        swaps: counters.swaps,
      });
      j++;
      k++;
    }
  };

  const mergeSortHelper = (arr: number[], l: number, r: number) => {
    if (l >= r) return;
    
    const m = l + Math.floor((r - l) / 2);
    
    steps.push({
        array: [...arr],
        comparing: [],
        swapping: [],
        sorted: [],
        explanation: `Dividing array from index ${l} to ${r}`,
        comparisons: counters.comparisons,
        swaps: counters.swaps,
    });

    mergeSortHelper(arr, l, m);
    mergeSortHelper(arr, m + 1, r);
    merge(arr, l, m, r);
  };

  mergeSortHelper(array, 0, n - 1);
}

function quickSort(array: number[], steps: SortingStep[], counters: { comparisons: number, swaps: number }) {
    const partition = (arr: number[], low: number, high: number): number => {
        const pivot = arr[high];
        let i = low - 1;
        
        steps.push({
            array: [...arr],
            comparing: [high],
            swapping: [],
            sorted: [],
            explanation: `Chosen pivot: ${pivot} at index ${high}`,
            comparisons: counters.comparisons,
            swaps: counters.swaps,
        });

        for (let j = low; j < high; j++) {
            counters.comparisons++;
            steps.push({
                array: [...arr],
                comparing: [j, high],
                swapping: [],
                sorted: [],
                explanation: `Comparing ${arr[j]} with pivot ${pivot}`,
                comparisons: counters.comparisons,
                swaps: counters.swaps,
            });

            if (arr[j] < pivot) {
                i++;
                [arr[i], arr[j]] = [arr[j], arr[i]];
                counters.swaps++;
                steps.push({
                    array: [...arr],
                    comparing: [],
                    swapping: [i, j],
                    sorted: [],
                    explanation: `Swapping ${arr[i]} and ${arr[j]} (smaller than pivot)`,
                    comparisons: counters.comparisons,
                    swaps: counters.swaps,
                });
            }
        }
        [arr[i + 1], arr[high]] = [arr[high], arr[i + 1]];
        counters.swaps++;
        steps.push({
            array: [...arr],
            comparing: [],
            swapping: [i + 1, high],
            sorted: [],
            explanation: `Placing pivot ${pivot} at correct position ${i + 1}`,
            comparisons: counters.comparisons,
            swaps: counters.swaps,
        });
        return i + 1;
    };

    const quickSortHelper = (arr: number[], low: number, high: number) => {
        if (low < high) {
            const pi = partition(arr, low, high);
            
            steps.push({
                array: [...arr],
                comparing: [],
                swapping: [],
                sorted: [pi],
                explanation: `Pivot ${arr[pi]} is now sorted`,
                comparisons: counters.comparisons,
                swaps: counters.swaps,
            });

            quickSortHelper(arr, low, pi - 1);
            quickSortHelper(arr, pi + 1, high);
        }
    };

    quickSortHelper(array, 0, array.length - 1);
}