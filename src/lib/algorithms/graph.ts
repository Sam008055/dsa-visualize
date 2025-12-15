import { SortingStep, AlgorithmInfo, GraphData, GraphNode, GraphEdge } from "./types";

export const graphInfo: AlgorithmInfo = {
  name: "Graph Operations",
  description: "Network of nodes (vertices) connected by edges.",
  timeComplexity: "Varies",
  spaceComplexity: "O(V + E)",
  bestCase: "N/A",
  averageCase: "N/A",
  worstCase: "N/A",
  stable: false,
  inPlace: false,
  howItWorks: [
    "Vertex: A node in the graph",
    "Edge: A connection between two vertices",
    "BFS: Breadth-First Search (Level by level)",
    "DFS: Depth-First Search (Deep as possible)"
  ],
  advantages: [
    "Models real-world networks",
    "Flexible relationships",
    "Pathfinding capabilities"
  ],
  disadvantages: [
    "Complex implementation",
    "High memory usage for dense graphs"
  ],
  useCases: [
    "Social networks",
    "GPS Navigation",
    "Network routing",
    "Dependency resolution"
  ],
  codeImplementations: {
    c: `// Adjacency Matrix
int graph[V][V];`,
    cpp: `// Adjacency List
vector<int> adj[V];`,
    python: `graph = {
    'A': ['B', 'C'],
    'B': ['A', 'D', 'E'],
    ...
}`,
    java: `class Graph {
    private int V;
    private LinkedList<Integer> adj[];
}`
  }
};

export function bfs(graph: GraphData, startNodeId: string, steps: SortingStep[]) {
  const visited = new Set<string>();
  const queue: string[] = [startNodeId];
  const visitedList: string[] = [];
  
  visited.add(startNodeId);
  visitedList.push(startNodeId);

  steps.push({
    array: [],
    comparing: [],
    swapping: [],
    sorted: [],
    graph: graph,
    visited: [...visitedList],
    current: startNodeId,
    explanation: `Starting BFS from node ${graph.nodes.find(n => n.id === startNodeId)?.value}`,
    comparisons: 0,
    swaps: 0
  });

  while (queue.length > 0) {
    const nodeId = queue.shift()!;
    
    steps.push({
      array: [],
      comparing: [],
      swapping: [],
      sorted: [],
      graph: graph,
      visited: [...visitedList],
      current: nodeId,
      explanation: `Visiting node ${graph.nodes.find(n => n.id === nodeId)?.value}`,
      comparisons: 0,
      swaps: 0
    });

    // Find neighbors
    const neighbors = graph.edges
      .filter(e => e.source === nodeId || (!graph.isDirected && e.target === nodeId))
      .map(e => e.source === nodeId ? e.target : e.source);

    for (const neighborId of neighbors) {
      if (!visited.has(neighborId)) {
        visited.add(neighborId);
        visitedList.push(neighborId);
        queue.push(neighborId);
        
        steps.push({
          array: [],
          comparing: [],
          swapping: [],
          sorted: [],
          graph: graph,
          visited: [...visitedList],
          current: neighborId,
          explanation: `Found unvisited neighbor ${graph.nodes.find(n => n.id === neighborId)?.value}`,
          comparisons: 0,
          swaps: 0
        });
      }
    }
  }
  
  steps.push({
    array: [],
    comparing: [],
    swapping: [],
    sorted: [],
    graph: graph,
    visited: [...visitedList],
    explanation: "BFS Traversal Complete",
    comparisons: 0,
    swaps: 0
  });
}

export function dfs(graph: GraphData, startNodeId: string, steps: SortingStep[]) {
  const visited = new Set<string>();
  const visitedList: string[] = [];
  
  const dfsHelper = (nodeId: string) => {
    visited.add(nodeId);
    visitedList.push(nodeId);
    
    steps.push({
      array: [],
      comparing: [],
      swapping: [],
      sorted: [],
      graph: graph,
      visited: [...visitedList],
      current: nodeId,
      explanation: `Visiting node ${graph.nodes.find(n => n.id === nodeId)?.value}`,
      comparisons: 0,
      swaps: 0
    });

    const neighbors = graph.edges
      .filter(e => e.source === nodeId || (!graph.isDirected && e.target === nodeId))
      .map(e => e.source === nodeId ? e.target : e.source);

    for (const neighborId of neighbors) {
      if (!visited.has(neighborId)) {
        dfsHelper(neighborId);
      }
    }
  };

  steps.push({
    array: [],
    comparing: [],
    swapping: [],
    sorted: [],
    graph: graph,
    visited: [],
    current: startNodeId,
    explanation: `Starting DFS from node ${graph.nodes.find(n => n.id === startNodeId)?.value}`,
    comparisons: 0,
    swaps: 0
  });

  dfsHelper(startNodeId);

  steps.push({
    array: [],
    comparing: [],
    swapping: [],
    sorted: [],
    graph: graph,
    visited: [...visitedList],
    explanation: "DFS Traversal Complete",
    comparisons: 0,
    swaps: 0
  });
}

export function findShortestPath(graph: GraphData, startId: string, endId: string, steps: SortingStep[]) {
  const queue: { id: string; path: string[] }[] = [{ id: startId, path: [startId] }];
  const visited = new Set<string>();
  visited.add(startId);

  steps.push({
    array: [],
    comparing: [],
    swapping: [],
    sorted: [],
    graph: graph,
    explanation: `Finding shortest path from ${graph.nodes.find(n => n.id === startId)?.value} to ${graph.nodes.find(n => n.id === endId)?.value}`,
    comparisons: 0,
    swaps: 0,
    current: startId,
    visited: [startId]
  });

  while (queue.length > 0) {
    const { id, path } = queue.shift()!;
    
    if (id === endId) {
      steps.push({
        array: [],
        comparing: [],
        swapping: [],
        sorted: [],
        graph: graph,
        explanation: `Found path! Length: ${path.length - 1}`,
        comparisons: 0,
        swaps: 0,
        current: id,
        visited: path // Highlight the path
      });
      return;
    }

    const neighbors = graph.edges
      .filter(e => e.source === id || (!graph.isDirected && e.target === id))
      .map(e => e.source === id ? e.target : e.source);

    for (const neighborId of neighbors) {
      if (!visited.has(neighborId)) {
        visited.add(neighborId);
        const newPath = [...path, neighborId];
        queue.push({ id: neighborId, path: newPath });
        
        steps.push({
          array: [],
          comparing: [],
          swapping: [],
          sorted: [],
          graph: graph,
          explanation: `Exploring ${graph.nodes.find(n => n.id === neighborId)?.value}`,
          comparisons: 0,
          swaps: 0,
          current: neighborId,
          visited: [...Array.from(visited)] // Show visited so far
        });
      }
    }
  }

  steps.push({
    array: [],
    comparing: [],
    swapping: [],
    sorted: [],
    graph: graph,
    explanation: `No path found`,
    comparisons: 0,
    swaps: 0,
    visited: Array.from(visited)
  });
}