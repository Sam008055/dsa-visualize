import { SortingStep, AlgorithmInfo } from "./types";

export const mergeSortInfo: AlgorithmInfo = {
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
        if (L[i] <= R[j]) arr[k++] = L[i++];\n        else arr[k++] = R[j++];
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
};

export function mergeSort(array: number[], steps: SortingStep[], counters: { comparisons: number, swaps: number }) {
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
