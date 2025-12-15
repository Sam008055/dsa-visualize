import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import { ArrowRight, BarChart3, Zap, Code2, Moon, Sun } from "lucide-react";
import { useNavigate } from "react-router";
import { useState, useEffect } from "react";

export default function Landing() {
  const navigate = useNavigate();
  const [isDarkMode, setIsDarkMode] = useState(false);

  // Toggle Dark Mode with smooth transition
  useEffect(() => {
    const root = document.documentElement;
    root.style.transition = 'background-color 0.3s ease, color 0.3s ease';
    
    if (isDarkMode) {
      root.classList.add("dark");
    } else {
      root.classList.remove("dark");
    }
  }, [isDarkMode]);

  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col">
      {/* Navbar */}
      <nav className="px-6 py-4 flex justify-between items-center max-w-7xl mx-auto w-full">
        <div className="flex items-center gap-2 font-bold text-xl">
          <div className="bg-primary/10 p-2 rounded-lg">
            <BarChart3 className="h-6 w-6 text-primary" />
          </div>
          <span>DSA Visualizer</span>
        </div>
        <div className="flex gap-4 items-center">
          <motion.div 
            whileHover={{ scale: 1.1 }} 
            whileTap={{ scale: 0.95 }}
            transition={{ type: "spring", stiffness: 300 }}
          >
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setIsDarkMode(!isDarkMode)}
              className="rounded-full"
              aria-label={isDarkMode ? "Switch to light mode" : "Switch to dark mode"}
            >
              <motion.div
                initial={false}
                animate={{ 
                  rotate: isDarkMode ? 180 : 0,
                  scale: [1, 1.2, 1]
                }}
                transition={{ duration: 0.5, ease: "easeInOut" }}
              >
                {isDarkMode ? <Moon className="h-5 w-5" /> : <Sun className="h-5 w-5" />}
              </motion.div>
            </Button>
          </motion.div>
          <Button variant="ghost" onClick={() => navigate("/auth")}>Sign In</Button>
          <Button onClick={() => navigate("/visualizer")}>Launch App</Button>
        </div>
      </nav>

      {/* Hero Section */}
      <main className="flex-1 flex flex-col items-center justify-center text-center px-4 py-20">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="max-w-3xl space-y-8"
        >
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 text-primary text-sm font-medium">
            <Zap className="h-4 w-4" />
            <span>Interactive Algorithm Learning</span>
          </div>
          
          <h1 className="text-5xl md:text-7xl font-bold tracking-tight text-foreground">
            Master Algorithms <br />
            <span className="text-primary">Visually</span>
          </h1>
          
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Watch sorting algorithms come to life with step-by-step animations. 
            Understand Bubble Sort, Merge Sort, and Quick Sort like never before.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center pt-8">
            <Button size="lg" className="h-12 px-8 text-lg" onClick={() => navigate("/visualizer")}>
              Start Visualizing <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
            <Button size="lg" variant="outline" className="h-12 px-8 text-lg">
              View on GitHub
            </Button>
          </div>
        </motion.div>

        {/* Features Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto mt-24 px-4">
          {[
            {
              icon: <BarChart3 className="h-8 w-8 text-primary" />,
              title: "Real-time Visualization",
              desc: "Watch every comparison and swap happen in real-time with smooth animations."
            },
            {
              icon: <Code2 className="h-8 w-8 text-amber-500" />,
              title: "Step-by-Step Logic",
              desc: "Detailed explanations for every step of the algorithm execution."
            },
            {
              icon: <Zap className="h-8 w-8 text-emerald-500" />,
              title: "Performance Metrics",
              desc: "Track time complexity, space complexity, and operation counts."
            }
          ].map((feature, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 + (i * 0.1) }}
              className="p-6 rounded-2xl bg-card border shadow-sm text-left hover:shadow-md transition-shadow"
            >
              <div className="mb-4 p-3 bg-muted rounded-xl w-fit">
                {feature.icon}
              </div>
              <h3 className="text-xl font-bold mb-2">{feature.title}</h3>
              <p className="text-muted-foreground">{feature.desc}</p>
            </motion.div>
          ))}
        </div>
      </main>

      <footer className="py-8 text-center text-sm text-muted-foreground border-t">
        <p>© 2025 DSA Visualizer. Built for students, by students.</p>
      </footer>
    </div>
  );
}