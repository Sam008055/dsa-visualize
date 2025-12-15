import { SortingStep, AlgorithmInfo } from "./types";

export const queueInfo: AlgorithmInfo = {
  name: "Queue Operations",
  description: "FIFO (First In First Out) data structure visualization.",
  timeComplexity: "O(1)",
  spaceComplexity: "O(n)",
  bestCase: "O(1)",
  averageCase: "O(1)",
  worstCase: "O(1)",
  stable: true,
  inPlace: false,
  howItWorks: [
    "Enqueue: Add element to the rear",
    "Dequeue: Remove element from the front",
    "Front: View first element",
    "FIFO: First element added is first to be removed"
  ],
  advantages: [
    "Constant time O(1) operations",
    "Fair scheduling (FCFS)",
    "Buffer management"
  ],
  disadvantages: [
    "No random access",
    "Fixed size (in static implementation)"
  ],
  useCases: [
    "Task scheduling",
    "Print spooling",
    "Breadth-First Search",
    "Data buffering"
  ],
  codeImplementations: {
    c: `struct Queue {
    int front, rear, size;
    unsigned capacity;
    int* array;
};

void enqueue(struct Queue* queue, int item) {
    queue->rear = (queue->rear + 1) % queue->capacity;
    queue->array[queue->rear] = item;
    queue->size = queue->size + 1;
}

int dequeue(struct Queue* queue) {
    int item = queue->array[queue->front];
    queue->front = (queue->front + 1) % queue->capacity;
    queue->size = queue->size - 1;
    return item;
}`,
    cpp: `class Queue {
    queue<int> q;
public:
    void enqueue(int x) { q.push(x); }
    void dequeue() { q.pop(); }
    int front() { return q.front(); }
};`,
    python: `from collections import deque
class Queue:
    def __init__(self):
        self.items = deque([])
    
    def enqueue(self, item):
        self.items.append(item)
    
    def dequeue(self):
        return self.items.popleft()`,
    java: `class Queue {
    private Queue<Integer> q = new LinkedList<>();
    
    public void enqueue(int item) {
        q.add(item);
    }
    
    public int dequeue() {
        return q.remove();
    }
}`
  }
};

export function queueOperations(initialArray: number[], steps: SortingStep[], counters: { comparisons: number, swaps: number }) {
  const queue: number[] = [];
  
  steps.push({
    array: [],
    comparing: [],
    swapping: [],
    sorted: [],
    explanation: "Queue is initially empty",
    comparisons: 0,
    swaps: 0,
  });

  // Enqueue all elements
  for (let i = 0; i < initialArray.length; i++) {
    const val = initialArray[i];
    queue.push(val);
    
    steps.push({
      array: [...queue],
      comparing: [queue.length - 1], // Highlight rear
      swapping: [],
      sorted: [],
      explanation: `Enqueue(${val}): Added ${val} to the rear`,
      comparisons: 0,
      swaps: 0,
    });
  }

  // Dequeue all elements
  while (queue.length > 0) {
    const val = queue[0];
    
    steps.push({
      array: [...queue],
      comparing: [0], // Highlight front
      swapping: [],
      sorted: [],
      explanation: `Front: First element is ${val}`,
      comparisons: 0,
      swaps: 0,
    });

    queue.shift();
    
    steps.push({
      array: [...queue],
      comparing: [],
      swapping: [],
      sorted: [],
      explanation: `Dequeue(): Removed ${val} from the front`,
      comparisons: 0,
      swaps: 0,
    });
  }
}
