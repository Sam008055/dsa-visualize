import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Moon, Sun, BarChart3, Share2, Info, Github, BookOpen, Layers, ArrowRightLeft } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { Link, useLocation } from "react-router";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

interface NavbarProps {
  isDarkMode: boolean;
  onToggleDarkMode: () => void;
}

export function Navbar({ isDarkMode, onToggleDarkMode }: NavbarProps) {
  const [showAboutDialog, setShowAboutDialog] = useState(false);
  const location = useLocation();

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: 'DSA Visualizer',
        text: 'Check out this amazing sorting algorithm visualizer!',
        url: window.location.href,
      }).catch(() => {
        copyToClipboard();
      });
    } else {
      copyToClipboard();
    }
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(window.location.href);
    toast.success("Link copied to clipboard!");
  };

  return (
    <>
      <motion.nav 
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3, ease: "easeOut" }}
        className="border-b backdrop-blur-sm sticky top-0 z-50 shadow-level-3"
        style={{
          background: 'linear-gradient(90deg, #06B6D4 0%, #0EA5E9 50%, #14B8A6 100%)',
          backgroundSize: '200% 100%',
          animation: 'gradientShift 8s ease infinite'
        }}
      >
        <style>{`
          @keyframes gradientShift {
            0%, 100% { background-position: 0% 50%; }
            50% { background-position: 100% 50%; }
          }
        `}</style>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-8">
            <motion.div 
              className="flex items-center gap-3 cursor-pointer"
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.98 }}
              transition={{ type: "spring", stiffness: 400, damping: 17 }}
              onClick={() => window.location.href = '/'}
            >
              <div className="bg-white/20 p-2 rounded-xl backdrop-blur-sm shadow-lg">
                <BarChart3 className="h-6 w-6 text-white" />
              </div>
              <span className="font-bold text-xl tracking-tight text-white drop-shadow-lg hidden sm:block" style={{ textShadow: '0 2px 8px rgba(0,0,0,0.3)' }}>DSA Visualizer</span>
            </motion.div>

            <div className="hidden md:flex items-center gap-1">
              <Link to="/visualizer">
                <Button 
                  variant="ghost" 
                  className={`text-white hover:bg-white/20 ${location.pathname === '/visualizer' ? 'bg-white/20' : ''}`}
                >
                  <ArrowRightLeft className="w-4 h-4 mr-2" />
                  Sorting
                </Button>
              </Link>
              <Link to="/data-structures">
                <Button 
                  variant="ghost" 
                  className={`text-white hover:bg-white/20 ${location.pathname === '/data-structures' ? 'bg-white/20' : ''}`}
                >
                  <Layers className="w-4 h-4 mr-2" />
                  Data Structures
                </Button>
              </Link>
            </div>
          </div>
          
          <div className="flex items-center gap-2">
            {/* Mobile Menu Links (Icon only) */}
            <div className="md:hidden flex gap-1 mr-2">
              <Link to="/visualizer">
                <Button variant="ghost" size="icon" className="text-white hover:bg-white/20">
                  <ArrowRightLeft className="w-5 h-5" />
                </Button>
              </Link>
              <Link to="/data-structures">
                <Button variant="ghost" size="icon" className="text-white hover:bg-white/20">
                  <Layers className="w-5 h-5" />
                </Button>
              </Link>
            </div>

            <motion.div 
              whileHover={{ scale: 1.1 }} 
              whileTap={{ scale: 0.95 }}
              transition={{ type: "spring", stiffness: 300 }}
            >
              <Button
                variant="ghost"
                size="icon"
                onClick={() => window.open('https://github.com', '_blank')}
                className="rounded-full bg-white/10 hover:bg-white/20 text-white border-0 h-10 w-10 transition-all duration-300 hidden sm:flex"
                aria-label="GitHub Repository"
              >
                <Github className="h-5 w-5" />
              </Button>
            </motion.div>

            <motion.div 
              whileHover={{ scale: 1.1 }} 
              whileTap={{ scale: 0.95 }}
              transition={{ type: "spring", stiffness: 300 }}
            >
              <Button
                variant="ghost"
                size="icon"
                onClick={() => window.open('https://en.wikipedia.org/wiki/Sorting_algorithm', '_blank')}
                className="rounded-full bg-white/10 hover:bg-white/20 text-white border-0 h-10 w-10 transition-all duration-300 hidden sm:flex"
                aria-label="Algorithm Documentation"
              >
                <BookOpen className="h-5 w-5" />
              </Button>
            </motion.div>
            
            <motion.div 
              whileHover={{ scale: 1.1, rotate: 5 }} 
              whileTap={{ scale: 0.95 }}
              transition={{ type: "spring", stiffness: 300 }}
            >
              <Button
                variant="ghost"
                size="icon"
                onClick={handleShare}
                className="rounded-full bg-white/10 hover:bg-white/20 text-white border-0 h-10 w-10 transition-all duration-300"
                aria-label="Share this visualizer"
              >
                <Share2 className="h-5 w-5" />
              </Button>
            </motion.div>

            <motion.div 
              whileHover={{ scale: 1.1 }} 
              whileTap={{ scale: 0.95 }}
              transition={{ type: "spring", stiffness: 300 }}
            >
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setShowAboutDialog(true)}
                className="rounded-full bg-white/10 hover:bg-white/20 text-white border-0 h-10 w-10 transition-all duration-300"
                aria-label="About this application"
              >
                <Info className="h-5 w-5" />
              </Button>
            </motion.div>
            
            <motion.div 
              whileHover={{ scale: 1.1 }} 
              whileTap={{ scale: 0.95 }}
              transition={{ type: "spring", stiffness: 300 }}
            >
              <Button
                variant="ghost"
                size="icon"
                onClick={onToggleDarkMode}
                className="rounded-full bg-white/10 hover:bg-white/20 text-white border-0 h-10 w-10 transition-all duration-300"
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
          </div>
        </div>
      </motion.nav>

      <Dialog open={showAboutDialog} onOpenChange={setShowAboutDialog}>
        <DialogContent className="glass-card backdrop-blur-xl border-2 border-white/20 max-w-md">
          <DialogHeader>
            <DialogTitle className="text-2xl font-bold gradient-primary bg-clip-text text-transparent">About DSA Visualizer</DialogTitle>
            <DialogDescription className="space-y-4 pt-4">
              <p className="text-base leading-relaxed">
                An interactive visualization tool for understanding sorting algorithms through real-time animations and complexity analysis.
              </p>
              <div className="space-y-2">
                <h4 className="font-semibold text-foreground text-sm">Features:</h4>
                <ul className="list-disc list-inside space-y-1 text-sm">
                  <li>Real-time algorithm visualization</li>
                  <li>Side-by-side algorithm comparison</li>
                  <li>Interactive timeline scrubber</li>
                  <li>Live complexity graph</li>
                  <li>Sound effects for operations</li>
                  <li>Custom array input</li>
                </ul>
              </div>
              <div className="pt-4 border-t">
                <p className="text-xs text-muted-foreground">
                  Built with React, Framer Motion, and Recharts • 2025
                </p>
              </div>
            </DialogDescription>
          </DialogHeader>
        </DialogContent>
      </Dialog>
    </>
  );
}