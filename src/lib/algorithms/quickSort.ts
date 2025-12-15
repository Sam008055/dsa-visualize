import { SortingStep, AlgorithmInfo } from "./types";

export const quickSortInfo: AlgorithmInfo = {
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
};

export function quickSort(array: number[], steps: SortingStep[], counters: { comparisons: number, swaps: number }) {
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
