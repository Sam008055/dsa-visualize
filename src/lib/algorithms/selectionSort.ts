import { SortingStep, AlgorithmInfo } from "./types";

export const selectionSortInfo: AlgorithmInfo = {
  name: "Selection Sort",
  description: "Repeatedly finds the minimum element and puts it at the beginning.",
  timeComplexity: "O(n²)",
  spaceComplexity: "O(1)",
  bestCase: "O(n²)",
  averageCase: "O(n²)",
  worstCase: "O(n²)",
  stable: false,
  inPlace: true,
  howItWorks: [
    "Find the minimum element in unsorted array",
    "Swap it with the element at the beginning",
    "Move the boundary of sorted subarray one step right",
    "Repeat until array is sorted"
  ],
  advantages: [
    "Simple to understand",
    "Performs well on small lists",
    "No additional memory required",
    "Minimizes number of swaps (O(n))"
  ],
  disadvantages: [
    "O(n²) time complexity",
    "Inefficient for large datasets",
    "Not stable"
  ],
  useCases: [
    "Small arrays",
    "When memory writes are costly (fewest swaps)",
    "Checking if everything is already sorted"
  ],
  codeImplementations: {
    c: `void selectionSort(int arr[], int n) {
    for (int i = 0; i < n-1; i++) {
        int min_idx = i;
        for (int j = i+1; j < n; j++)
            if (arr[j] < arr[min_idx])
                min_idx = j;
        int temp = arr[min_idx];
        arr[min_idx] = arr[i];
        arr[i] = temp;
    }
}`,
    cpp: `void selectionSort(vector<int>& arr) {
    int n = arr.size();
    for (int i = 0; i < n-1; i++) {
        int min_idx = i;
        for (int j = i+1; j < n; j++)
            if (arr[j] < arr[min_idx])
                min_idx = j;
        swap(arr[min_idx], arr[i]);
    }
}`,
    python: `def selection_sort(arr):
    for i in range(len(arr)):
        min_idx = i
        for j in range(i+1, len(arr)):
            if arr[j] < arr[min_idx]:
                min_idx = j
        arr[i], arr[min_idx] = arr[min_idx], arr[i]
    return arr`,
    java: `public static void selectionSort(int[] arr) {
    int n = arr.length;
    for (int i = 0; i < n-1; i++) {
        int min_idx = i;
        for (int j = i+1; j < n; j++)
            if (arr[j] < arr[min_idx])
                min_idx = j;
        int temp = arr[min_idx];
        arr[min_idx] = arr[i];
        arr[i] = temp;
    }
}`
  }
};

export function selectionSort(array: number[], steps: SortingStep[], counters: { comparisons: number, swaps: number }) {
  const n = array.length;
  
  for (let i = 0; i < n - 1; i++) {
    let min_idx = i;
    
    steps.push({
      array: [...array],
      comparing: [i],
      swapping: [],
      sorted: Array.from({length: i}, (_, k) => k),
      explanation: `Starting pass ${i + 1}. Current minimum is ${array[i]} at index ${i}`,
      comparisons: counters.comparisons,
      swaps: counters.swaps,
    });

    for (let j = i + 1; j < n; j++) {
      counters.comparisons++;
      steps.push({
        array: [...array],
        comparing: [min_idx, j],
        swapping: [],
        sorted: Array.from({length: i}, (_, k) => k),
        explanation: `Comparing current min ${array[min_idx]} with ${array[j]}`,
        comparisons: counters.comparisons,
        swaps: counters.swaps,
      });

      if (array[j] < array[min_idx]) {
        min_idx = j;
        steps.push({
          array: [...array],
          comparing: [min_idx],
          swapping: [],
          sorted: Array.from({length: i}, (_, k) => k),
          explanation: `Found new minimum: ${array[min_idx]} at index ${min_idx}`,
          comparisons: counters.comparisons,
          swaps: counters.swaps,
        });
      }
    }

    if (min_idx !== i) {
      [array[i], array[min_idx]] = [array[min_idx], array[i]];
      counters.swaps++;
      steps.push({
        array: [...array],
        comparing: [],
        swapping: [i, min_idx],
        sorted: Array.from({length: i}, (_, k) => k),
        explanation: `Swapping minimum ${array[i]} with ${array[min_idx]}`,
        comparisons: counters.comparisons,
        swaps: counters.swaps,
      });
    } else {
      steps.push({
        array: [...array],
        comparing: [],
        swapping: [],
        sorted: Array.from({length: i}, (_, k) => k),
        explanation: `Minimum ${array[i]} is already in correct position`,
        comparisons: counters.comparisons,
        swaps: counters.swaps,
      });
    }
  }
}
