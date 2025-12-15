import { SortingStep, AlgorithmInfo, TreeNode } from "./types";

export const treeInfo: AlgorithmInfo = {
  name: "Binary Search Tree",
  description: "Hierarchical data structure with ordered nodes.",
  timeComplexity: "O(log n) avg",
  spaceComplexity: "O(n)",
  bestCase: "O(log n)",
  averageCase: "O(log n)",
  worstCase: "O(n)",
  stable: false,
  inPlace: false,
  howItWorks: [
    "Root: The top node of the tree",
    "Left Child: Smaller than parent",
    "Right Child: Larger than parent",
    "Leaf: Node with no children"
  ],
  advantages: [
    "Efficient searching and sorting",
    "Dynamic size",
    "Reflects structural relationships"
  ],
  disadvantages: [
    "Can become unbalanced (skewed)",
    "No O(1) access like arrays"
  ],
  useCases: [
    "Hierarchical data (file systems)",
    "Database indexing",
    "Symbol tables"
  ],
  codeImplementations: {
    c: `struct Node {
    int data;
    struct Node *left, *right;
};`,
    cpp: `struct Node {
    int data;
    Node *left, *right;
};`,
    python: `class Node:
    def __init__(self, key):
        self.left = None
        self.right = None
        self.val = key`,
    java: `class Node {
    int key;
    Node left, right;
    public Node(int item) {
        key = item;
        left = right = null;
    }
}`
  }
};

// Helper to clone tree
function cloneTree(node: TreeNode | null): TreeNode | null {
  if (!node) return null;
  return {
    ...node,
    left: cloneTree(node.left),
    right: cloneTree(node.right)
  };
}

// Helper to position nodes
function positionNodes(node: TreeNode | null, x: number, y: number, level: number, width: number): void {
  if (!node) return;
  node.x = x;
  node.y = y;
  const offset = width / (Math.pow(2, level + 1));
  positionNodes(node.left, x - offset, y + 60, level + 1, width);
  positionNodes(node.right, x + offset, y + 60, level + 1, width);
}

export function insertNode(root: TreeNode | null, value: number, steps: SortingStep[], width: number = 800): TreeNode {
  const newSteps: SortingStep[] = [];
  
  if (!root) {
    const newNode: TreeNode = {
      id: Math.random().toString(36).substr(2, 9),
      value,
      left: null,
      right: null,
      x: width / 2,
      y: 50
    };
    
    steps.push({
      array: [],
      comparing: [],
      swapping: [],
      sorted: [],
      tree: newNode,
      explanation: `Created root node with value ${value}`,
      comparisons: 0,
      swaps: 0,
      current: newNode.id
    });
    return newNode;
  }

  const newRoot = cloneTree(root);
  // Re-calculate positions for the cloned tree to ensure consistency
  positionNodes(newRoot, width / 2, 50, 1, width);

  let current = newRoot;
  let parent: TreeNode | null = null;
  
  steps.push({
    array: [],
    comparing: [],
    swapping: [],
    sorted: [],
    tree: newRoot,
    explanation: `Inserting ${value}... Starting at root`,
    comparisons: 0,
    swaps: 0,
    current: current?.id
  });

  while (current) {
    parent = current;
    if (value < current.value) {
      steps.push({
        array: [],
        comparing: [],
        swapping: [],
        sorted: [],
        tree: newRoot,
        explanation: `${value} < ${current.value}, going left`,
        comparisons: 0,
        swaps: 0,
        current: current.left?.id || current.id
      });
      
      if (!current.left) {
        current.left = {
          id: Math.random().toString(36).substr(2, 9),
          value,
          left: null,
          right: null,
          x: 0, y: 0 // Will be positioned
        };
        break;
      }
      current = current.left;
    } else {
      steps.push({
        array: [],
        comparing: [],
        swapping: [],
        sorted: [],
        tree: newRoot,
        explanation: `${value} >= ${current.value}, going right`,
        comparisons: 0,
        swaps: 0,
        current: current.right?.id || current.id
      });

      if (!current.right) {
        current.right = {
          id: Math.random().toString(36).substr(2, 9),
          value,
          left: null,
          right: null,
          x: 0, y: 0 // Will be positioned
        };
        break;
      }
      current = current.right;
    }
  }

  // Update positions after insertion
  positionNodes(newRoot, width / 2, 50, 1, width);

  steps.push({
    array: [],
    comparing: [],
    swapping: [],
    sorted: [],
    tree: newRoot,
    explanation: `Inserted ${value}`,
    comparisons: 0,
    swaps: 0,
    current: undefined
  });

  return newRoot!;
}

export function searchTree(root: TreeNode | null, value: number, steps: SortingStep[]) {
  let current = root;
  steps.push({
    array: [],
    comparing: [],
    swapping: [],
    sorted: [],
    tree: root,
    explanation: `Searching for ${value}...`,
    comparisons: 0,
    swaps: 0,
    current: current?.id
  });

  while (current) {
    steps.push({
      array: [],
      comparing: [],
      swapping: [],
      sorted: [],
      tree: root,
      explanation: `Checking ${current.value}...`,
      comparisons: 0,
      swaps: 0,
      current: current.id
    });

    if (value === current.value) {
      steps.push({
        array: [],
        comparing: [],
        swapping: [],
        sorted: [],
        tree: root,
        explanation: `Found ${value}!`,
        comparisons: 0,
        swaps: 0,
        current: current.id,
        visited: [current.id]
      });
      return true;
    }

    if (value < current.value) {
      steps.push({
        array: [],
        comparing: [],
        swapping: [],
        sorted: [],
        tree: root,
        explanation: `${value} < ${current.value}, going left`,
        comparisons: 0,
        swaps: 0,
        current: current.left?.id || current.id
      });
      current = current.left;
    } else {
      steps.push({
        array: [],
        comparing: [],
        swapping: [],
        sorted: [],
        tree: root,
        explanation: `${value} > ${current.value}, going right`,
        comparisons: 0,
        swaps: 0,
        current: current.right?.id || current.id
      });
      current = current.right;
    }
  }

  steps.push({
    array: [],
    comparing: [],
    swapping: [],
    sorted: [],
    tree: root,
    explanation: `${value} not found in tree`,
    comparisons: 0,
    swaps: 0
  });
  return false;
}

export function traverseTree(root: TreeNode | null, type: 'inorder' | 'preorder' | 'postorder', steps: SortingStep[]) {
  const visited: string[] = [];
  
  const traverse = (node: TreeNode | null) => {
    if (!node) return;

    if (type === 'preorder') {
      visited.push(node.id);
      steps.push({
        array: [],
        comparing: [],
        swapping: [],
        sorted: [],
        tree: root,
        explanation: `Visiting ${node.value} (Preorder)`,
        comparisons: 0,
        swaps: 0,
        current: node.id,
        visited: [...visited]
      });
    }

    traverse(node.left);

    if (type === 'inorder') {
      visited.push(node.id);
      steps.push({
        array: [],
        comparing: [],
        swapping: [],
        sorted: [],
        tree: root,
        explanation: `Visiting ${node.value} (Inorder)`,
        comparisons: 0,
        swaps: 0,
        current: node.id,
        visited: [...visited]
      });
    }

    traverse(node.right);

    if (type === 'postorder') {
      visited.push(node.id);
      steps.push({
        array: [],
        comparing: [],
        swapping: [],
        sorted: [],
        tree: root,
        explanation: `Visiting ${node.value} (Postorder)`,
        comparisons: 0,
        swaps: 0,
        current: node.id,
        visited: [...visited]
      });
    }
  };

  steps.push({
    array: [],
    comparing: [],
    swapping: [],
    sorted: [],
    tree: root,
    explanation: `Starting ${type} traversal`,
    comparisons: 0,
    swaps: 0,
    visited: []
  });

  traverse(root);

  steps.push({
    array: [],
    comparing: [],
    swapping: [],
    sorted: [],
    tree: root,
    explanation: `${type} traversal complete`,
    comparisons: 0,
    swaps: 0,
    visited: [...visited]
  });
}