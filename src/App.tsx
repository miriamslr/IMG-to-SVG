import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Link } from "react-router-dom";
import Index from "./pages/Index";
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
          <Route path="/vectorizer" element={<ComingSoon name="Vectorizer.js" />} />
          <Route path="/imagetracer" element={<ComingSoon name="ImageTracer" />} />
          <Route path="/svgcode" element={<ComingSoon name="SVGcode" />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

// Componente temporário para páginas em desenvolvimento
const ComingSoon = ({ name }: { name: string }) => (
  <div className="min-h-[calc(100vh-4rem)] flex items-center justify-center">
    <div className="text-center">
      <h1 className="text-4xl font-bold text-gray-900 mb-4">{name}</h1>
      <p className="text-gray-600">Esta página está em desenvolvimento.</p>
    </div>
  </div>
);

export default App;