import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Link } from "react-router-dom";
import Index from "./pages/Index";
import Vectorizer from "./pages/Vectorizer";
import ImageTracer from "./pages/ImageTracer";
import SVGcode from "./pages/SVGcode";
import { Button } from "./components/ui/button";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <nav className="bg-white shadow-sm border-b">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-center h-16 gap-4 items-center">
              <Link to="/">
                <Button variant="ghost">Potrace</Button>
              </Link>
              <Link to="/vectorizer">
                <Button variant="ghost">Vectorizer.js</Button>
              </Link>
              <Link to="/imagetracer">
                <Button variant="ghost">ImageTracer</Button>
              </Link>
              <Link to="/svgcode">
                <Button variant="ghost">SVGcode</Button>
              </Link>
            </div>
          </div>
        </nav>
        
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/vectorizer" element={<Vectorizer />} />
          <Route path="/imagetracer" element={<ImageTracer />} />
          <Route path="/svgcode" element={<SVGcode />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;