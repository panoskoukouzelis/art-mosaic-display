
import { useState, useEffect } from "react";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { ThemeProvider } from "./components/theme-provider";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import ArtworkView from "./pages/ArtworkView";
import Slider from "./pages/Slider";
import Screensaver from "./components/Screensaver";
import "./i18n/config";

const queryClient = new QueryClient();

const App = () => {
  const [showScreensaver, setShowScreensaver] = useState(false);
  const [inactivityTimer, setInactivityTimer] = useState<NodeJS.Timeout | null>(null);

  const handleActivity = () => {
    setShowScreensaver(false);
    if (inactivityTimer) {
      clearTimeout(inactivityTimer);
    }
    const timer = setTimeout(() => {
      setShowScreensaver(true);
    }, 60000); // 1 minute
    setInactivityTimer(timer);
  };

  useEffect(() => {
    handleActivity();
    return () => {
      if (inactivityTimer) {
        clearTimeout(inactivityTimer);
      }
    };
  }, []);

  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider defaultTheme="light" storageKey="vite-ui-theme">
        <TooltipProvider>
          <Toaster />
          <Sonner />
          {showScreensaver && <Screensaver onInteraction={handleActivity} />}
          <BrowserRouter>
            <Routes>
              <Route path="/" element={<Index />} />
              <Route path="/artwork/:id" element={<ArtworkView />} />
              <Route path="/slider" element={<Slider />} />
              <Route path="*" element={<NotFound />} />
            </Routes>
          </BrowserRouter>
        </TooltipProvider>
      </ThemeProvider>
    </QueryClientProvider>
  );
};

export default App;
