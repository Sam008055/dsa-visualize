export type AlgorithmType = "Bubble Sort" | "Merge Sort" | "Quick Sort";

export interface SortingStep {
  array: number[];
  comparing: number[];
  swapping: number[];
  sorted: number[];
  explanation: string;
  comparisons: number;
  swaps: number;
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

export const ALGORITHMS: Record<AlgorithmType, AlgorithmInfo> = {
  "Bubble Sort": {
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
  },
  "Merge Sort": {
    name: "Merge Sort",
    description: "Divide-and-conquer approach. Recursively divides array into halves.",
    timeComplexity: "O(n log n)",
    spaceComplexity: "O(n)",
    bestCase: "O(n log n)",
    averageCase: "O(n log n)",
    worstCase: "O(n log n)",
    stable: true,
    inPlace: false,
    howItWorks: [
      "Divide the array into two halves",
      "Recursively sort each half",
      "Merge the two sorted halves back together",
      "Continue until the entire array is sorted",
      "Uses a temporary array for merging"
    ],
    advantages: [
      "Guaranteed O(n log n) time complexity",
      "Stable sorting algorithm",
      "Predictable performance",
      "Excellent for linked lists",
      "Good for external sorting (large datasets)"
    ],
    disadvantages: [
      "Requires O(n) extra space",
      "Not in-place",
      "Slower than quicksort in practice for arrays",
      "Recursive overhead"
    ],
    useCases: [
      "When stable sorting is required",
      "Sorting linked lists",
      "External sorting (disk-based data)",
      "When worst-case O(n log n) is needed",
      "Parallel processing scenarios"
    ],
    codeImplementations: {
      c: `void merge(int arr[], int l, int m, int r) {
    int n1 = m - l + 1, n2 = r - m;
    int L[n1], R[n2];
    
    for (int i = 0; i < n1; i++) L[i] = arr[l + i];
    for (int j = 0; j < n2; j++) R[j] = arr[m + 1 + j];
    
    int i = 0, j = 0, k = l;
    while (i < n1 && j < n2) {
        if (L[i] <= R[j]) arr[k++] = L[i++];
        else arr[k++] = R[j++];
    }
    while (i < n1) arr[k++] = L[i++];
    while (j < n2) arr[k++] = R[j++];
}

void mergeSort(int arr[], int l, int r) {
    if (l < r) {
        int m = l + (r - l) / 2;
        mergeSort(arr, l, m);
        mergeSort(arr, m + 1, r);
        merge(arr, l, m, r);
    }
}`,
      cpp: `void merge(vector<int>& arr, int l, int m, int r) {
    vector<int> L(arr.begin() + l, arr.begin() + m + 1);
    vector<int> R(arr.begin() + m + 1, arr.begin() + r + 1);
    
    int i = 0, j = 0, k = l;
    while (i < L.size() && j < R.size()) {
        if (L[i] <= R[j]) arr[k++] = L[i++];
        else arr[k++] = R[j++];
    }
    while (i < L.size()) arr[k++] = L[i++];
    while (j < R.size()) arr[k++] = R[j++];
}

void mergeSort(vector<int>& arr, int l, int r) {
    if (l < r) {
        int m = l + (r - l) / 2;
        mergeSort(arr, l, m);
        mergeSort(arr, m + 1, r);
        merge(arr, l, m, r);
    }
}`,
      python: `def merge_sort(arr):
    if len(arr) <= 1:
        return arr
    
    mid = len(arr) // 2
    left = merge_sort(arr[:mid])
    right = merge_sort(arr[mid:])
    
    return merge(left, right)

def merge(left, right):
    result = []
    i = j = 0
    
    while i < len(left) and j < len(right):
        if left[i] <= right[j]:
            result.append(left[i])
            i += 1
        else:
            result.append(right[j])
            j += 1
    
    result.extend(left[i:])
    result.extend(right[j:])
    return result`,
      java: `public static void mergeSort(int[] arr, int l, int r) {
    if (l < r) {
        int m = l + (r - l) / 2;
        mergeSort(arr, l, m);
        mergeSort(arr, m + 1, r);
        merge(arr, l, m, r);
    }
}

private static void merge(int[] arr, int l, int m, int r) {
    int n1 = m - l + 1, n2 = r - m;
    int[] L = new int[n1], R = new int[n2];
    
    for (int i = 0; i < n1; i++) L[i] = arr[l + i];
    for (int j = 0; j < n2; j++) R[j] = arr[m + 1 + j];
    
    int i = 0, j = 0, k = l;
    while (i < n1 && j < n2) {
        if (L[i] <= R[j]) arr[k++] = L[i++];
        else arr[k++] = R[j++];
    }
    while (i < n1) arr[k++] = L[i++];
    while (j < n2) arr[k++] = R[j++];
}`
    }
  },
  "Quick Sort": {
    name: "Quick Sort",
    description: "Uses a pivot element to partition the array into smaller and larger elements.",
    timeComplexity: "O(n log n) avg",
    spaceComplexity: "O(log n)",
    bestCase: "O(n log n)",
    averageCase: "O(n log n)",
    worstCase: "O(n²)",
    stable: false,
    inPlace: true,
    howItWorks: [
      "Choose a pivot element from the array",
      "Partition: rearrange array so elements < pivot are before it, elements > pivot are after",
      "Recursively apply quicksort to the sub-arrays",
      "Continue until sub-arrays have 0 or 1 element",
      "No merge step needed - sorting happens in-place"
    ],
    advantages: [
      "Very fast in practice - O(n log n) average",
      "In-place sorting (low memory usage)",
      "Cache-friendly due to locality of reference",
      "Widely used in production systems",
      "Can be parallelized efficiently"
    ],
    disadvantages: [
      "Worst case O(n²) for already sorted data",
      "Not stable (relative order may change)",
      "Recursive implementation uses stack space",
      "Performance depends on pivot selection"
    ],
    useCases: [
      "General-purpose sorting in most languages",
      "Large datasets where average case matters",
      "When memory is limited (in-place)",
      "Systems programming and databases",
      "When stability is not required"
    ],
    codeImplementations: {
      c: `int partition(int arr[], int low, int high) {
    int pivot = arr[high];
    int i = low - 1;
    
    for (int j = low; j < high; j++) {
        if (arr[j] < pivot) {
            i++;
            int temp = arr[i];
            arr[i] = arr[j];
            arr[j] = temp;
        }
    }
    int temp = arr[i + 1];
    arr[i + 1] = arr[high];
    arr[high] = temp;
    return i + 1;
}

void quickSort(int arr[], int low, int high) {
    if (low < high) {
        int pi = partition(arr, low, high);
        quickSort(arr, low, pi - 1);
        quickSort(arr, pi + 1, high);
    }
}`,
      cpp: `int partition(vector<int>& arr, int low, int high) {
    int pivot = arr[high];
    int i = low - 1;
    
    for (int j = low; j < high; j++) {
        if (arr[j] < pivot) {
            i++;
            swap(arr[i], arr[j]);
        }
    }
    swap(arr[i + 1], arr[high]);
    return i + 1;
}

void quickSort(vector<int>& arr, int low, int high) {
    if (low < high) {
        int pi = partition(arr, low, high);
        quickSort(arr, low, pi - 1);
        quickSort(arr, pi + 1, high);
    }
}`,
      python: `def quick_sort(arr, low=0, high=None):
    if high is None:
        high = len(arr) - 1
    
    if low < high:
        pi = partition(arr, low, high)
        quick_sort(arr, low, pi - 1)
        quick_sort(arr, pi + 1, high)
    return arr

def partition(arr, low, high):
    pivot = arr[high]
    i = low - 1
    
    for j in range(low, high):
        if arr[j] < pivot:
            i += 1
            arr[i], arr[j] = arr[j], arr[i]
    
    arr[i + 1], arr[high] = arr[high], arr[i + 1]
    return i + 1`,
      java: `public static void quickSort(int[] arr, int low, int high) {
    if (low < high) {
        int pi = partition(arr, low, high);
        quickSort(arr, low, pi - 1);
        quickSort(arr, pi + 1, high);
    }
}

private static int partition(int[] arr, int low, int high) {
    int pivot = arr[high];
    int i = low - 1;
    
    for (int j = low; j < high; j++) {
        if (arr[j] < pivot) {
            i++;
            int temp = arr[i];
            arr[i] = arr[j];
            arr[j] = temp;
        }
    }
    int temp = arr[i + 1];
    arr[i + 1] = arr[high];
    arr[high] = temp;
    return i + 1;
}`
    }
  }
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
        counters.swaps++;
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