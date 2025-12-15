import { SortingStep, AlgorithmInfo } from "./types";

export const insertionSortInfo: AlgorithmInfo = {
  name: "Insertion Sort",
  description: "Builds the sorted array one item at a time by comparing.",
  timeComplexity: "O(n²)",
  spaceComplexity: "O(1)",
  bestCase: "O(n)",
  averageCase: "O(n²)",
  worstCase: "O(n²)",
  stable: true,
  inPlace: true,
  howItWorks: [
    "Start with the second element",
    "Compare with elements before it",
    "Shift elements greater than key to the right",
    "Insert key in correct position",
    "Repeat for all elements"
  ],
  advantages: [
    "Simple implementation",
    "Efficient for small data sets",
    "Adaptive (fast for sorted data)",
    "Stable sort",
    "In-place"
  ],
  disadvantages: [
    "Inefficient for large lists",
    "O(n²) time complexity"
  ],
  useCases: [
    "Small arrays",
    "Nearly sorted data",
    "Online sorting (sorting as data is received)"
  ],
  codeImplementations: {
    c: `void insertionSort(int arr[], int n) {
    for (int i = 1; i < n; i++) {
        int key = arr[i];
        int j = i - 1;
        while (j >= 0 && arr[j] > key) {
            arr[j + 1] = arr[j];
            j = j - 1;
        }
        arr[j + 1] = key;
    }
}`,
    cpp: `void insertionSort(vector<int>& arr) {
    int n = arr.size();
    for (int i = 1; i < n; i++) {
        int key = arr[i];
        int j = i - 1;
        while (j >= 0 && arr[j] > key) {
            arr[j + 1] = arr[j];
            j--;
        }
        arr[j + 1] = key;
    }
}`,
    python: `def insertion_sort(arr):
    for i in range(1, len(arr)):
        key = arr[i]
        j = i - 1
        while j >= 0 and key < arr[j]:
            arr[j + 1] = arr[j]
            j -= 1
        arr[j + 1] = key
    return arr`,
    java: `public static void insertionSort(int[] arr) {
    int n = arr.length;
    for (int i = 1; i < n; ++i) {
        int key = arr[i];
        int j = i - 1;
        while (j >= 0 && arr[j] > key) {
            arr[j + 1] = arr[j];
            j = j - 1;
        }
        arr[j + 1] = key;
    }
}`
  }
};

export function insertionSort(array: number[], steps: SortingStep[], counters: { comparisons: number, swaps: number }) {
  const n = array.length;
  
  // Initial state - first element is considered sorted
  steps.push({
    array: [...array],
    comparing: [],
    swapping: [],
    sorted: [0],
    explanation: "First element is considered sorted",
    comparisons: counters.comparisons,
    swaps: counters.swaps,
  });

  for (let i = 1; i < n; i++) {
    let key = array[i];
    let j = i - 1;
    
    steps.push({
      array: [...array],
      comparing: [i],
      swapping: [],
      sorted: Array.from({length: i}, (_, k) => k),
      explanation: `Selected key ${key} at index ${i}`,
      comparisons: counters.comparisons,
      swaps: counters.swaps,
    });

    while (j >= 0) {
      counters.comparisons++;
      steps.push({
        array: [...array],
        comparing: [j, j + 1], // Visualizing comparison with the "hole" or current position
        swapping: [],
        sorted: Array.from({length: i}, (_, k) => k),
        explanation: `Comparing ${array[j]} with key ${key}`,
        comparisons: counters.comparisons,
        swaps: counters.swaps,
      });

      if (array[j] > key) {
        array[j + 1] = array[j];
        counters.swaps++; // Counting shifts as swaps for visualization consistency
        steps.push({
          array: [...array],
          comparing: [],
          swapping: [j, j + 1],
          sorted: Array.from({length: i}, (_, k) => k),
          explanation: `Moving ${array[j]} to the right`,
          comparisons: counters.comparisons,
          swaps: counters.swaps,
        });
        j = j - 1;
      } else {
        break;
      }
    }
    array[j + 1] = key;
    steps.push({
      array: [...array],
      comparing: [],
      swapping: [j + 1],
      sorted: Array.from({length: i + 1}, (_, k) => k),
      explanation: `Inserted key ${key} at index ${j + 1}`,
      comparisons: counters.comparisons,
      swaps: counters.swaps,
    });
  }
}
