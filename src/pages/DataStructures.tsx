import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Navbar } from "@/components/Navbar";
import { ArrayVisualizer } from "@/components/visualizer/ArrayVisualizer";
import { TimelineScrubber } from "@/components/visualizer/TimelineScrubber";
import { ControlPanel } from "@/components/visualizer/ControlPanel";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { SortingStep } from "@/lib/sortingAlgorithms";
import { soundManager } from "@/lib/soundManager";
import { toast } from "sonner";
import { Play, RotateCcw, Plus, Minus, Network, GitGraph, Search, Trash2, Route } from "lucide-react";
import { TreeVisualizer } from "@/components/visualizer/TreeVisualizer";
import { GraphVisualizer } from "@/components/visualizer/GraphVisualizer";
import { insertNode, searchTree, traverseTree } from "@/lib/algorithms/tree";
import { bfs, dfs, findShortestPath } from "@/lib/algorithms/graph";
import { TreeNode, GraphData, GraphNode, GraphEdge } from "@/lib/algorithms/types";
import { useAuth } from "@/hooks/use-auth";
import { useNavigate } from "react-router";
import { Loader2 } from "lucide-react";

type DSType = "Stack Operations" | "Queue Operations" | "Tree Operations" | "Graph Operations";

export default function DataStructures() {
  
  const [activeTab, setActiveTab] = useState<DSType>("Stack Operations");
  const [steps, setSteps] = useState<SortingStep[]>([{
    array: [],
    comparing: [],
    swapping: [],
    sorted: [],
    explanation: "Initializing...",
    comparisons: 0,
    swaps: 0
  }]);
  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [speed, setSpeed] = useState(1);
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [inputValue, setInputValue] = useState("");
  const [secondInputValue, setSecondInputValue] = useState(""); // For path finding or edge creation
  const [soundEnabled, setSoundEnabled] = useState(true);

  // Tree State
  const [treeRoot, setTreeRoot] = useState<TreeNode | null>(null);
  
  // Graph State
  const [graphData, setGraphData] = useState<GraphData>({ nodes: [], edges: [], isDirected: false });
  const [selectedNodeId, setSelectedNodeId] = useState<string | null>(null);

  const timerRef = useRef<NodeJS.Timeout | null>(null);

  // Initialize
  useEffect(() => {
    resetDS();
  }, [activeTab]);

  const resetDS = () => {
    setIsPlaying(false);
    setCurrentStepIndex(0);
    setTreeRoot(null);
    setGraphData({ nodes: [], edges: [], isDirected: false });
    setSteps([{
      array: [],
      comparing: [],
      swapping: [],
      sorted: [],
      explanation: `Ready to visualize ${activeTab}`,
      comparisons: 0,
      swaps: 0,
      tree: null,
      graph: { nodes: [], edges: [], isDirected: false }
    }]);
  };

  // Animation Loop
  useEffect(() => {
    if (isPlaying) {
      const intervalTime = 1000 / (speed * 1.5);
      timerRef.current = setInterval(() => {
        setCurrentStepIndex((prev) => {
          if (prev >= steps.length - 1) {
            setIsPlaying(false);
            return prev;
          }
          return prev + 1;
        });
      }, intervalTime);
    } else {
      if (timerRef.current) clearInterval(timerRef.current);
    }
    return () => { if (timerRef.current) clearInterval(timerRef.current); };
  }, [isPlaying, speed, steps.length]);

  // Dark Mode with smooth transition
  useEffect(() => {
    const root = document.documentElement;
    root.style.transition = 'background-color 0.3s ease, color 0.3s ease';
    
    if (isDarkMode) {
      root.classList.add("dark");
    } else {
      root.classList.remove("dark");
    }
  }, [isDarkMode]);

  // Sound
  useEffect(() => {
    soundManager.setEnabled(soundEnabled);
  }, [soundEnabled]);

  // Tree Operations
  const handleTreeInsert = () => {
    const val = parseInt(inputValue);
    if (isNaN(val)) {
      toast.error("Please enter a valid number");
      return;
    }

    // Use the tree from the last step or current state
    const currentRoot = steps[steps.length - 1]?.tree || treeRoot;
    const newSteps: SortingStep[] = [];
    
    // We need to pass a mutable array to capture steps
    const newRoot = insertNode(currentRoot, val, newSteps);
    
    setTreeRoot(newRoot);
    setSteps(newSteps);
    setCurrentStepIndex(0);
    setIsPlaying(true);
    setInputValue("");
  };

  const handleTreeSearch = () => {
    const val = parseInt(inputValue);
    if (isNaN(val)) {
      toast.error("Please enter a valid number");
      return;
    }
    const currentRoot = steps[steps.length - 1]?.tree || treeRoot;
    if (!currentRoot) {
      toast.error("Tree is empty");
      return;
    }
    const newSteps: SortingStep[] = [];
    searchTree(currentRoot, val, newSteps);
    setSteps(newSteps);
    setCurrentStepIndex(0);
    setIsPlaying(true);
    setInputValue("");
  };

  const handleTreeTraversal = (type: 'inorder' | 'preorder' | 'postorder') => {
    const currentRoot = steps[steps.length - 1]?.tree || treeRoot;
    if (!currentRoot) {
      toast.error("Tree is empty");
      return;
    }
    const newSteps: SortingStep[] = [];
    traverseTree(currentRoot, type, newSteps);
    setSteps(newSteps);
    setCurrentStepIndex(0);
    setIsPlaying(true);
  };

  // Graph Operations
  const handleAddGraphNode = () => {
    const val = parseInt(inputValue);
    if (isNaN(val)) {
      toast.error("Please enter a valid number");
      return;
    }

    const newNode: GraphNode = {
      id: Math.random().toString(36).substr(2, 9),
      value: val,
      x: 100 + Math.random() * 600,
      y: 50 + Math.random() * 300
    };

    const newGraph = {
      ...graphData,
      nodes: [...graphData.nodes, newNode]
    };

    setGraphData(newGraph);
    setSteps([{
      ...steps[0],
      graph: newGraph,
      explanation: `Added node ${val}`
    }]);
    setInputValue("");
  };

  const handleRemoveGraphNode = () => {
    const val = parseInt(inputValue);
    if (isNaN(val)) {
      toast.error("Please enter a valid number");
      return;
    }
    
    const nodeToRemove = graphData.nodes.find(n => n.value === val);
    if (!nodeToRemove) {
      toast.error("Node not found");
      return;
    }

    const newGraph = {
      nodes: graphData.nodes.filter(n => n.id !== nodeToRemove.id),
      edges: graphData.edges.filter(e => e.source !== nodeToRemove.id && e.target !== nodeToRemove.id),
      isDirected: graphData.isDirected
    };

    setGraphData(newGraph);
    setSteps([{
      ...steps[0],
      graph: newGraph,
      explanation: `Removed node ${val}`
    }]);
    setInputValue("");
  };

  const handleAddGraphEdge = () => {
    if (graphData.nodes.length < 2) {
      toast.error("Need at least 2 nodes to create an edge");
      return;
    }
    // Randomly connect two unconnected nodes for simplicity in this demo
    // In a real app, we'd select nodes
    const source = graphData.nodes[Math.floor(Math.random() * graphData.nodes.length)];
    const target = graphData.nodes[Math.floor(Math.random() * graphData.nodes.length)];
    
    if (source.id === target.id) return;

    const newGraph = {
      ...graphData,
      edges: [...graphData.edges, { source: source.id, target: target.id }]
    };

    setGraphData(newGraph);
    setSteps([{
      ...steps[0],
      graph: newGraph,
      explanation: `Added edge between ${source.value} and ${target.value}`
    }]);
  };

  const handleFindPath = () => {
    const startVal = parseInt(inputValue);
    const endVal = parseInt(secondInputValue);
    
    if (isNaN(startVal) || isNaN(endVal)) {
      toast.error("Please enter valid start and end values");
      return;
    }

    const startNode = graphData.nodes.find(n => n.value === startVal);
    const endNode = graphData.nodes.find(n => n.value === endVal);

    if (!startNode || !endNode) {
      toast.error("Start or end node not found");
      return;
    }

    const newSteps: SortingStep[] = [];
    findShortestPath(graphData, startNode.id, endNode.id, newSteps);
    setSteps(newSteps);
    setCurrentStepIndex(0);
    setIsPlaying(true);
  };

  const handleGraphBFS = () => {
    if (graphData.nodes.length === 0) return;
    const startNode = graphData.nodes[0];
    const newSteps: SortingStep[] = [];
    bfs(graphData, startNode.id, newSteps);
    setSteps(newSteps);
    setCurrentStepIndex(0);
    setIsPlaying(true);
  };

  const handleGraphDFS = () => {
    if (graphData.nodes.length === 0) return;
    const startNode = graphData.nodes[0];
    const newSteps: SortingStep[] = [];
    dfs(graphData, startNode.id, newSteps);
    setSteps(newSteps);
    setCurrentStepIndex(0);
    setIsPlaying(true);
  };

  const handlePush = () => {
    const val = parseInt(inputValue);
    if (isNaN(val)) {
      toast.error("Please enter a valid number");
      return;
    }
    
    const currentStep = steps[currentStepIndex]; // Branch off current state
    // If we are in the middle of a playback, we should probably truncate future steps or just add to the end?
    // For simplicity in this interactive mode, let's assume we append to the current state if it's the last step, 
    // or we might need to handle branching. 
    // To keep it simple: We only allow interaction if we are at the latest step or we reset future steps.
    
    // Let's just take the array from the current step and create a new step
    const currentArray = currentStep.array;
    
    if (currentArray.length >= 10) {
      toast.error("Max capacity reached (10 elements)");
      return;
    }

    const newArray = [...currentArray, val];
    const newStep: SortingStep = {
      array: newArray,
      comparing: [],
      swapping: [],
      sorted: [],
      explanation: activeTab === "Stack Operations" 
        ? `Pushed ${val} onto the stack` 
        : `Enqueued ${val}`,
      comparisons: 0,
      swaps: 0
    };

    // If we are not at the end, we discard future steps to maintain consistency
    const newSteps = steps.slice(0, currentStepIndex + 1);
    newSteps.push(newStep);
    
    setSteps(newSteps);
    setCurrentStepIndex(newSteps.length - 1);
    setInputValue("");
    if (soundEnabled) soundManager.playSwapSound();
  };

  const handlePop = () => {
    const currentStep = steps[currentStepIndex];
    const currentArray = currentStep.array;

    if (currentArray.length === 0) {
      toast.error("Is empty!");
      return;
    }

    let newArray: number[];
    let val: number;

    if (activeTab === "Stack Operations") {
      val = currentArray[currentArray.length - 1];
      newArray = currentArray.slice(0, -1);
    } else {
      val = currentArray[0];
      newArray = currentArray.slice(1);
    }

    const newStep: SortingStep = {
      array: newArray,
      comparing: [],
      swapping: [],
      sorted: [],
      explanation: activeTab === "Stack Operations" 
        ? `Popped ${val} from the stack` 
        : `Dequeued ${val}`,
      comparisons: 0,
      swaps: 0
    };

    const newSteps = steps.slice(0, currentStepIndex + 1);
    newSteps.push(newStep);
    
    setSteps(newSteps);
    setCurrentStepIndex(newSteps.length - 1);
    if (soundEnabled) soundManager.playCompareSound();
  };

  const runDemo = () => {
    setIsPlaying(false);
    const demoSteps: SortingStep[] = [];
    
    if (activeTab === "Tree Operations") {
      let root: TreeNode | null = null;
      const values = [50, 30, 70, 20, 40, 60, 80];
      
      demoSteps.push({
        array: [],
        comparing: [],
        swapping: [],
        sorted: [],
        tree: null,
        explanation: "Starting Binary Search Tree Demo",
        comparisons: 0,
        swaps: 0
      });

      for (const val of values) {
        root = insertNode(root, val, demoSteps);
      }
      
      demoSteps.push({
        ...demoSteps[demoSteps.length - 1],
        explanation: "Tree Demo Complete",
        current: undefined
      });
      
      setTreeRoot(root);
    } else if (activeTab === "Graph Operations") {
      const nodes: GraphNode[] = [
        { id: "1", value: 1, x: 400, y: 50 },
        { id: "2", value: 2, x: 250, y: 150 },
        { id: "3", value: 3, x: 550, y: 150 },
        { id: "4", value: 4, x: 150, y: 250 },
        { id: "5", value: 5, x: 350, y: 250 },
        { id: "6", value: 6, x: 650, y: 250 },
      ];
      
      const edges: GraphEdge[] = [
        { source: "1", target: "2" },
        { source: "1", target: "3" },
        { source: "2", target: "4" },
        { source: "2", target: "5" },
        { source: "3", target: "6" },
        { source: "3", target: "5" },
      ];

      const demoGraph: GraphData = { nodes, edges, isDirected: false };
      setGraphData(demoGraph);

      demoSteps.push({
        array: [],
        comparing: [],
        swapping: [],
        sorted: [],
        graph: demoGraph,
        explanation: "Created Demo Graph",
        comparisons: 0,
        swaps: 0
      });

      bfs(demoGraph, "1", demoSteps);
    } else {
      // Stack and Queue Demo
      let currentArray: number[] = [];
      
      // Helper to add step
      const addStep = (arr: number[], explanation: string) => {
        demoSteps.push({
          array: [...arr],
          comparing: [],
          swapping: [],
          sorted: [],
          explanation,
          comparisons: 0,
          swaps: 0
        });
      };

      addStep([], "Starting Demo...");

      const operations = [10, 25, 5, 40];
      
      // Push operations
      for (const val of operations) {
        currentArray = [...currentArray, val];
        addStep(currentArray, activeTab === "Stack Operations" ? `Push ${val}` : `Enqueue ${val}`);
      }

      // Pop one
      if (activeTab === "Stack Operations") {
        const val = currentArray.pop();
        addStep(currentArray, `Pop ${val} (LIFO - Last In First Out)`);
      } else {
        const val = currentArray.shift();
        addStep(currentArray, `Dequeue ${val} (FIFO - First In First Out)`);
      }

      // Push another
      currentArray = [...currentArray, 99];
      addStep(currentArray, activeTab === "Stack Operations" ? `Push 99` : `Enqueue 99`);

      // Pop all
      while (currentArray.length > 0) {
        if (activeTab === "Stack Operations") {
          const val = currentArray.pop();
          addStep(currentArray, `Pop ${val}`);
        } else {
          const val = currentArray.shift();
          addStep(currentArray, `Dequeue ${val}`);
        }
      }

      addStep([], "Demo Complete");
    }

    setSteps(demoSteps);
    setCurrentStepIndex(0);
    setTimeout(() => setIsPlaying(true), 500);
  };

  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col font-sans transition-colors duration-500">
      <Navbar isDarkMode={isDarkMode} onToggleDarkMode={() => setIsDarkMode(!isDarkMode)} />

      <main className="flex-1 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 w-full">
        <div className="flex flex-col gap-8">
          
          {/* Header & Controls */}
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
            <div>
              <h1 className="text-3xl font-bold tracking-tight text-foreground">
                Data Structures
              </h1>
              <p className="text-muted-foreground mt-1">
                Interactive visualization of Stacks, Queues, Trees, and Graphs.
              </p>
            </div>

            <Tabs value={activeTab} onValueChange={(v) => setActiveTab(v as DSType)} className="w-full md:w-auto">
              <TabsList className="grid w-full grid-cols-2 md:grid-cols-4">
                <TabsTrigger value="Stack Operations">Stack</TabsTrigger>
                <TabsTrigger value="Queue Operations">Queue</TabsTrigger>
                <TabsTrigger value="Tree Operations">Tree</TabsTrigger>
                <TabsTrigger value="Graph Operations">Graph</TabsTrigger>
              </TabsList>
            </Tabs>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Visualization Area */}
            <div className="lg:col-span-2 space-y-6">
              <Card className="glass-card border-white/10 shadow-level-2 overflow-hidden">
                <CardHeader className="pb-2">
                  <CardTitle className="flex flex-col gap-2">
                    <span>Visualization</span>
                    <span className="text-sm font-normal text-muted-foreground font-mono break-words">
                      {steps[currentStepIndex]?.explanation}
                    </span>
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-6 min-h-[450px] flex items-center justify-center bg-black/5">
                  {activeTab === "Stack Operations" || activeTab === "Queue Operations" ? (
                    <ArrayVisualizer 
                      step={steps[currentStepIndex]} 
                      maxValue={100} 
                      algorithm={activeTab}
                    />
                  ) : activeTab === "Tree Operations" ? (
                    <TreeVisualizer 
                      root={steps[currentStepIndex]?.tree || treeRoot}
                      currentNodeId={steps[currentStepIndex]?.current}
                      visitedIds={steps[currentStepIndex]?.visited}
                    />
                  ) : (
                    <GraphVisualizer 
                      data={steps[currentStepIndex]?.graph || graphData}
                      currentNodeId={steps[currentStepIndex]?.current}
                      visitedIds={steps[currentStepIndex]?.visited}
                    />
                  )}
                </CardContent>
              </Card>

              <TimelineScrubber
                currentStep={currentStepIndex}
                totalSteps={steps.length}
                onStepChange={(val) => { setIsPlaying(false); setCurrentStepIndex(val); }}
                isPlaying={isPlaying}
              />
              
              <ControlPanel 
                isPlaying={isPlaying}
                onPlayPause={() => setIsPlaying(!isPlaying)}
                onReset={resetDS}
                onStepForward={() => setCurrentStepIndex(Math.min(steps.length - 1, currentStepIndex + 1))}
                onStepBack={() => setCurrentStepIndex(Math.max(0, currentStepIndex - 1))}
                speed={speed}
                onSpeedChange={setSpeed}
                currentStep={currentStepIndex}
                totalSteps={steps.length}
                soundEnabled={soundEnabled}
                onSoundToggle={() => setSoundEnabled(!soundEnabled)}
              />
            </div>

            {/* Controls Sidebar */}
            <div className="space-y-6">
              <Card className="glass-card border-white/10 shadow-level-2">
                <CardHeader>
                  <CardTitle>Operations</CardTitle>
                  <CardDescription>Manipulate the data structure</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex gap-2">
                    <Input 
                      placeholder="Value" 
                      type="number" 
                      value={inputValue}
                      onChange={(e) => setInputValue(e.target.value)}
                      onKeyDown={(e) => e.key === "Enter" && (
                        activeTab === "Tree Operations" ? handleTreeInsert() :
                        activeTab === "Graph Operations" ? handleAddGraphNode() :
                        handlePush()
                      )}
                    />
                    <Button 
                      onClick={() => {
                        if (activeTab === "Tree Operations") handleTreeInsert();
                        else if (activeTab === "Graph Operations") handleAddGraphNode();
                        else handlePush();
                      }} 
                      className="gradient-primary text-white"
                    >
                      <Plus className="w-4 h-4 mr-1" />
                      Add
                    </Button>
                  </div>
                  
                  {activeTab === "Stack Operations" && (
                    <Button onClick={handlePop} variant="destructive" className="w-full">
                      <Minus className="w-4 h-4 mr-1" />
                      Pop
                    </Button>
                  )}

                  {activeTab === "Queue Operations" && (
                    <Button onClick={handlePop} variant="destructive" className="w-full">
                      <Minus className="w-4 h-4 mr-1" />
                      Dequeue
                    </Button>
                  )}

                  {activeTab === "Tree Operations" && (
                    <div className="space-y-2">
                      <Button onClick={handleTreeSearch} variant="secondary" className="w-full">
                        <Search className="w-4 h-4 mr-2" />
                        Search
                      </Button>
                      <div className="grid grid-cols-3 gap-1">
                        <Button onClick={() => handleTreeTraversal('inorder')} variant="outline" size="sm" className="text-xs">Inorder</Button>
                        <Button onClick={() => handleTreeTraversal('preorder')} variant="outline" size="sm" className="text-xs">Preorder</Button>
                        <Button onClick={() => handleTreeTraversal('postorder')} variant="outline" size="sm" className="text-xs">Postorder</Button>
                      </div>
                    </div>
                  )}

                  {activeTab === "Graph Operations" && (
                    <div className="space-y-2">
                      <Button onClick={handleRemoveGraphNode} variant="destructive" className="w-full">
                        <Trash2 className="w-4 h-4 mr-2" />
                        Remove Node
                      </Button>
                      <Button onClick={handleAddGraphEdge} variant="outline" className="w-full">
                        <Network className="w-4 h-4 mr-2" />
                        Add Random Edge
                      </Button>
                      <div className="grid grid-cols-2 gap-2">
                        <Button onClick={handleGraphBFS} variant="secondary">BFS</Button>
                        <Button onClick={handleGraphDFS} variant="secondary">DFS</Button>
                      </div>
                      
                      <div className="pt-2 border-t">
                        <p className="text-xs text-muted-foreground mb-2">Path Finding</p>
                        <div className="flex gap-2 mb-2">
                          <Input 
                            placeholder="To Value" 
                            type="number" 
                            value={secondInputValue}
                            onChange={(e) => setSecondInputValue(e.target.value)}
                          />
                        </div>
                        <Button onClick={handleFindPath} variant="default" className="w-full">
                          <Route className="w-4 h-4 mr-2" />
                          Find Path (From Input 1 to 2)
                        </Button>
                      </div>
                    </div>
                  )}

                  <div className="relative my-4">
                    <div className="absolute inset-0 flex items-center">
                      <span className="w-full border-t" />
                    </div>
                    <div className="relative flex justify-center text-xs uppercase">
                      <span className="bg-background px-2 text-muted-foreground">Or</span>
                    </div>
                  </div>

                  <Button onClick={runDemo} variant="outline" className="w-full border-primary/50 hover:bg-primary/10">
                    <Play className="w-4 h-4 mr-2" />
                    Run Automated Demo
                  </Button>
                  
                  <Button onClick={resetDS} variant="ghost" className="w-full">
                    <RotateCcw className="w-4 h-4 mr-2" />
                    Reset
                  </Button>
                </CardContent>
              </Card>

              <Card className="glass-card border-white/10 shadow-level-2">
                <CardHeader>
                  <CardTitle>Info</CardTitle>
                </CardHeader>
                <CardContent className="text-sm text-muted-foreground space-y-2">
                  {activeTab === "Tree Operations" && (
                    <>
                      <p><strong>Binary Search Tree (BST)</strong></p>
                      <p>Nodes are arranged such that left child &lt; parent &lt; right child.</p>
                      <p><strong>Traversals:</strong></p>
                      <ul className="list-disc pl-4 space-y-1">
                        <li>Inorder: Left, Root, Right</li>
                        <li>Preorder: Root, Left, Right</li>
                        <li>Postorder: Left, Right, Root</li>
                      </ul>
                    </>
                  )}
                  {activeTab === "Graph Operations" && (
                    <>
                      <p><strong>Graph Traversal</strong></p>
                      <p>BFS explores neighbors level by level. DFS explores as deep as possible along each branch.</p>
                      <p><strong>Path Finding</strong></p>
                      <p>Uses BFS to find the shortest path between two nodes in an unweighted graph.</p>
                    </>
                  )}
                  {activeTab === "Stack Operations" && (
                    <>
                      <p><strong>LIFO (Last-In, First-Out)</strong></p>
                      <p>Elements are added to the top and removed from the top.</p>
                    </>
                  )}
                  {activeTab === "Queue Operations" && (
                    <>
                      <p><strong>FIFO (First-In, First-Out)</strong></p>
                      <p>Elements are added to the rear and removed from the front.</p>
                    </>
                  )}
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}