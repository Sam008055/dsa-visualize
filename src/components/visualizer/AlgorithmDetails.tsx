import { AlgorithmType, ALGORITHMS } from "@/lib/sortingAlgorithms";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { motion } from "framer-motion";
import { CheckCircle2, XCircle, Info, Code2, Lightbulb, TrendingUp } from "lucide-react";
import { ScrollArea } from "@/components/ui/scroll-area";

interface AlgorithmDetailsProps {
  algorithm: AlgorithmType;
}

export function AlgorithmDetails({ algorithm }: AlgorithmDetailsProps) {
  const info = ALGORITHMS[algorithm];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="space-y-4"
    >
      <Card className="glass-card shadow-level-2 border-2 border-white/10 backdrop-blur-xl">
        <CardHeader className="pb-3">
          <CardTitle className="text-lg font-bold flex items-center gap-2">
            <Info className="h-5 w-5 text-primary" />
            Algorithm Properties
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="grid grid-cols-2 gap-3 text-sm">
            <div className="flex items-center gap-2">
              <span className="text-muted-foreground">Stable:</span>
              {info.stable ? (
                <Badge variant="outline" className="bg-green-500/10 text-green-600 border-green-500/20">
                  <CheckCircle2 className="h-3 w-3 mr-1" />
                  Yes
                </Badge>
              ) : (
                <Badge variant="outline" className="bg-red-500/10 text-red-600 border-red-500/20">
                  <XCircle className="h-3 w-3 mr-1" />
                  No
                </Badge>
              )}
            </div>
            <div className="flex items-center gap-2">
              <span className="text-muted-foreground">In-Place:</span>
              {info.inPlace ? (
                <Badge variant="outline" className="bg-green-500/10 text-green-600 border-green-500/20">
                  <CheckCircle2 className="h-3 w-3 mr-1" />
                  Yes
                </Badge>
              ) : (
                <Badge variant="outline" className="bg-red-500/10 text-red-600 border-red-500/20">
                  <XCircle className="h-3 w-3 mr-1" />
                  No
                </Badge>
              )}
            </div>
          </div>

          <div className="space-y-2 pt-2 border-t">
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Best Case:</span>
              <code className="font-mono text-xs bg-muted px-2 py-1 rounded">{info.bestCase}</code>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Average Case:</span>
              <code className="font-mono text-xs bg-muted px-2 py-1 rounded">{info.averageCase}</code>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Worst Case:</span>
              <code className="font-mono text-xs bg-muted px-2 py-1 rounded">{info.worstCase}</code>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Space:</span>
              <code className="font-mono text-xs bg-muted px-2 py-1 rounded">{info.spaceComplexity}</code>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card className="glass-card shadow-level-2 border-2 border-white/10 backdrop-blur-xl">
        <CardHeader className="pb-3">
          <CardTitle className="text-lg font-bold flex items-center gap-2">
            <Lightbulb className="h-5 w-5 text-amber-500" />
            How It Works
          </CardTitle>
        </CardHeader>
        <CardContent>
          <ol className="space-y-2 text-sm">
            {info.howItWorks.map((step, index) => (
              <motion.li
                key={index}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1 }}
                className="flex gap-3"
              >
                <span className="flex-shrink-0 w-6 h-6 rounded-full bg-primary/20 text-primary flex items-center justify-center text-xs font-bold">
                  {index + 1}
                </span>
                <span className="leading-relaxed">{step}</span>
              </motion.li>
            ))}
          </ol>
        </CardContent>
      </Card>

      <Card className="glass-card shadow-level-2 border-2 border-white/10 backdrop-blur-xl">
        <CardHeader className="pb-3">
          <CardTitle className="text-lg font-bold flex items-center gap-2">
            <TrendingUp className="h-5 w-5 text-primary" />
            Pros & Cons
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <h4 className="text-sm font-semibold text-green-600 mb-2 flex items-center gap-2">
              <CheckCircle2 className="h-4 w-4" />
              Advantages
            </h4>
            <ul className="space-y-1 text-sm">
              {info.advantages.map((adv, index) => (
                <li key={index} className="flex gap-2">
                  <span className="text-green-500">•</span>
                  <span>{adv}</span>
                </li>
              ))}
            </ul>
          </div>
          <div>
            <h4 className="text-sm font-semibold text-red-600 mb-2 flex items-center gap-2">
              <XCircle className="h-4 w-4" />
              Disadvantages
            </h4>
            <ul className="space-y-1 text-sm">
              {info.disadvantages.map((dis, index) => (
                <li key={index} className="flex gap-2">
                  <span className="text-red-500">•</span>
                  <span>{dis}</span>
                </li>
              ))}
            </ul>
          </div>
          <div className="pt-2 border-t">
            <h4 className="text-sm font-semibold mb-2">Best Use Cases</h4>
            <div className="flex flex-wrap gap-2">
              {info.useCases.map((useCase, index) => (
                <Badge key={index} variant="outline" className="text-xs">
                  {useCase}
                </Badge>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>

      <Card className="glass-card shadow-level-2 border-2 border-white/10 backdrop-blur-xl">
        <CardHeader className="pb-3">
          <CardTitle className="text-lg font-bold flex items-center gap-2">
            <Code2 className="h-5 w-5 text-primary" />
            Code Implementations
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="python" className="w-full">
            <TabsList className="grid w-full grid-cols-4 mb-4">
              <TabsTrigger value="python">Python</TabsTrigger>
              <TabsTrigger value="java">Java</TabsTrigger>
              <TabsTrigger value="cpp">C++</TabsTrigger>
              <TabsTrigger value="c">C</TabsTrigger>
            </TabsList>
            <TabsContent value="python">
              <ScrollArea className="h-[300px] w-full rounded-lg border bg-muted/30 p-4">
                <pre className="text-xs font-mono">
                  <code>{info.codeImplementations.python}</code>
                </pre>
              </ScrollArea>
            </TabsContent>
            <TabsContent value="java">
              <ScrollArea className="h-[300px] w-full rounded-lg border bg-muted/30 p-4">
                <pre className="text-xs font-mono">
                  <code>{info.codeImplementations.java}</code>
                </pre>
              </ScrollArea>
            </TabsContent>
            <TabsContent value="cpp">
              <ScrollArea className="h-[300px] w-full rounded-lg border bg-muted/30 p-4">
                <pre className="text-xs font-mono">
                  <code>{info.codeImplementations.cpp}</code>
                </pre>
              </ScrollArea>
            </TabsContent>
            <TabsContent value="c">
              <ScrollArea className="h-[300px] w-full rounded-lg border bg-muted/30 p-4">
                <pre className="text-xs font-mono">
                  <code>{info.codeImplementations.c}</code>
                </pre>
              </ScrollArea>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </motion.div>
  );
}
