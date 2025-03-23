import { Toaster } from "@/components/ui/toaster";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { HashRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import ThankYou from "./pages/ThankYou";
import "@/components/ui/cta-button.css";
import { LanguageProvider } from "@/contexts/LanguageContext";
import { AccessibilityProvider } from "@/contexts/AccessibilityContext";
import { AccessibilityPanel } from "@/components/ui/AccessibilityPanel";
import "./App.css"; // ייבוא קובץ ה-CSS העיקרי
import { useEffect } from "react";
import { smoothScrollTo } from "./lib/scrollUtils";

const queryClient = new QueryClient();

// Helper function to handle global hash fragment clicks for smooth scrolling
const useHashFragmentHandler = () => {
  useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      // Check if the clicked element is an anchor with a hash fragment
      const target = e.target as HTMLElement;
      const anchor = target.closest('a');
      
      if (anchor && anchor.hash && anchor.hash.startsWith('#')) {
        // Get the ID without the # symbol
        const id = anchor.hash.substring(1);
        
        // If there's an element with this ID on the page
        if (id && document.getElementById(id)) {
          e.preventDefault();
          smoothScrollTo(id);
        }
      }
    };

    // Add click event listener to the document
    document.addEventListener('click', handleClick);
    
    return () => {
      document.removeEventListener('click', handleClick);
    };
  }, []);
};

// Helper function to handle image paths with the correct base URL
export const getImagePath = (path: string): string => {
  // Remove leading slash if present to avoid double slashes
  const cleanPath = path.startsWith('/') ? path.slice(1) : path;
  
  // In development mode, just use the path relative to the public directory
  // In production, prepend the BASE_URL 
  return (import.meta.env.DEV) 
    ? `/${cleanPath}` 
    : `${import.meta.env.BASE_URL}${cleanPath}`;
};

const App = () => {
  // Use our custom hook to handle hash fragment clicks
  useHashFragmentHandler();
  
  return (
    <QueryClientProvider client={queryClient}>
      <LanguageProvider>
        <AccessibilityProvider>
          <Toaster />
          <AccessibilityPanel />
          <HashRouter>
            <Routes>
              <Route path="/" element={<Index />} />
              <Route path="/thank-you" element={<ThankYou />} />
              <Route path="*" element={<NotFound />} />
            </Routes>
          </HashRouter>
        </AccessibilityProvider>
      </LanguageProvider>
    </QueryClientProvider>
  );
};

export default App;
