import { SortingStep, AlgorithmInfo } from "./types";

export const stackInfo: AlgorithmInfo = {
  name: "Stack Operations",
  description: "LIFO (Last In First Out) data structure visualization.",
  timeComplexity: "O(1)",
  spaceComplexity: "O(n)",
  bestCase: "O(1)",
  averageCase: "O(1)",
  worstCase: "O(1)",
  stable: true,
  inPlace: false,
  howItWorks: [
    "Push: Add element to the top",
    "Pop: Remove element from the top",
    "Peek: View top element",
    "LIFO: Last element added is first to be removed"
  ],
  advantages: [
    "Constant time O(1) operations",
    "Simple memory management",
    "Efficient for function calls/recursion",
    "Undo/Redo functionality"
  ],
  disadvantages: [
    "No random access",
    "Fixed size (in static implementation)"
  ],
  useCases: [
    "Function call stack",
    "Expression evaluation",
    "Backtracking algorithms",
    "Browser history"
  ],
  codeImplementations: {
    c: `struct Stack {
    int top;
    int capacity;
    int* array;
};

void push(struct Stack* stack, int item) {
    stack->array[++stack->top] = item;
}

int pop(struct Stack* stack) {
    return stack->array[stack->top--];
}`,
    cpp: `class Stack {
    stack<int> s;
public:
    void push(int x) { s.push(x); }
    void pop() { s.pop(); }
    int top() { return s.top(); }
};`,
    python: `class Stack:
    def __init__(self):
        self.items = []
    
    def push(self, item):
        self.items.append(item)
    
    def pop(self):
        return self.items.pop()`,
    java: `class Stack {
    private List<Integer> items = new ArrayList<>();
    
    public void push(int item) {
        items.add(item);
    }
    
    public int pop() {
        return items.remove(items.size() - 1);
    }
}`
  }
};

export function stackOperations(initialArray: number[], steps: SortingStep[], counters: { comparisons: number, swaps: number }) {
  // Simulate stack operations using the initial array as the source of data
  const stack: number[] = [];
  
  steps.push({
    array: [],
    comparing: [],
    swapping: [],
    sorted: [],
    explanation: "Stack is initially empty",
    comparisons: 0,
    swaps: 0,
  });

  // Push all elements
  for (let i = 0; i < initialArray.length; i++) {
    const val = initialArray[i];
    stack.push(val);
    
    steps.push({
      array: [...stack],
      comparing: [stack.length - 1], // Highlight top
      swapping: [],
      sorted: [],
      explanation: `Push(${val}): Added ${val} to the top of the stack`,
      comparisons: 0,
      swaps: 0,
    });
  }

  // Pop all elements
  while (stack.length > 0) {
    const val = stack[stack.length - 1];
    
    steps.push({
      array: [...stack],
      comparing: [stack.length - 1], // Highlight top before pop
      swapping: [],
      sorted: [],
      explanation: `Peek: Top element is ${val}`,
      comparisons: 0,
      swaps: 0,
    });

    stack.pop();
    
    steps.push({
      array: [...stack],
      comparing: [],
      swapping: [],
      sorted: [],
      explanation: `Pop(): Removed ${val} from the top`,
      comparisons: 0,
      swaps: 0,
    });
  }
}
