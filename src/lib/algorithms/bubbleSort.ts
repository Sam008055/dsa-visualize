import { SortingStep, AlgorithmInfo } from "./types";

export const bubbleSortInfo: AlgorithmInfo = {
  name: "Bubble Sort",
  description: "Simple but slow. Compares adjacent elements and swaps if needed.",
  timeComplexity: "O(n²)",
  spaceComplexity: "O(1)",
  bestCase: "O(n)",
  averageCase: "O(n²)",
  worstCase: "O(n²)",
  stable: true,
  inPlace: true,
  howItWorks: [
    "Start at the beginning of the array",
    "Compare each pair of adjacent elements",
    "Swap them if they are in the wrong order",
    "Repeat until no more swaps are needed",
    "Each pass moves the largest unsorted element to its final position"
  ],
  advantages: [
    "Simple to understand and implement",
    "No extra memory required (in-place)",
    "Stable sorting algorithm",
    "Adaptive - efficient for nearly sorted data"
  ],
  disadvantages: [
    "Very slow for large datasets",
    "Poor time complexity O(n²)",
    "Not suitable for production use with large data"
  ],
  useCases: [
    "Educational purposes and learning",
    "Small datasets (< 10 elements)",
    "Nearly sorted data",
    "When simplicity is more important than efficiency"
  ],
  codeImplementations: {
    c: `void bubbleSort(int arr[], int n) {
    for (int i = 0; i < n - 1; i++) {
        int swapped = 0;
        for (int j = 0; j < n - i - 1; j++) {
            if (arr[j] > arr[j + 1]) {
                // Swap arr[j] and arr[j+1]
                int temp = arr[j];
                arr[j] = arr[j + 1];
                arr[j + 1] = temp;
                swapped = 1;
            }
        }
        // If no swaps, array is sorted
        if (!swapped) break;
    }
}`,
    cpp: `void bubbleSort(vector<int>& arr) {
    int n = arr.size();
    for (int i = 0; i < n - 1; i++) {
        bool swapped = false;
        for (int j = 0; j < n - i - 1; j++) {
            if (arr[j] > arr[j + 1]) {
                swap(arr[j], arr[j + 1]);
                swapped = true;
            }
        }
        if (!swapped) break;
    }
}`,
    python: `def bubble_sort(arr):
    n = len(arr)
    for i in range(n - 1):
        swapped = False
        for j in range(n - i - 1):
            if arr[j] > arr[j + 1]:
                arr[j], arr[j + 1] = arr[j + 1], arr[j]
                swapped = True
        if not swapped:
            break
    return arr`,
    java: `public static void bubbleSort(int[] arr) {
    int n = arr.length;
    for (int i = 0; i < n - 1; i++) {
        boolean swapped = false;
        for (int j = 0; j < n - i - 1; j++) {
            if (arr[j] > arr[j + 1]) {
                int temp = arr[j];
                arr[j] = arr[j + 1];
                arr[j + 1] = temp;
                swapped = true;
            }
        }
        if (!swapped) break;
    }
}`
  }
};

export function bubbleSort(array: number[], steps: SortingStep[], counters: { comparisons: number, swaps: number }) {
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
