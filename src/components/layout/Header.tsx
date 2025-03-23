import { useState, useEffect, useCallback } from "react";
import { Menu, Globe } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useLanguage } from "@/contexts/LanguageContext";
import { getImagePath } from "@/App";
import { Link } from "react-router-dom";

interface HeaderProps {
  onMenuToggle: () => void;
}

const translations = {
  en: {
    toggleLanguage: "עברית",
    menuLabel: "Toggle navigation menu",
    languageLabel: "Switch to Hebrew"
  },
  he: {
    toggleLanguage: "English",
    menuLabel: "פתח/סגור תפריט",
    languageLabel: "החלף לאנגלית"
  }
} as const;

export const Header = ({ onMenuToggle }: HeaderProps) => {
  const [scrolled, setScrolled] = useState(false);
  const { currentLang, setCurrentLang } = useLanguage();

  const handleScroll = useCallback(() => {
    setScrolled(window.scrollY > 50);
  }, []);

  useEffect(() => {
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, [handleScroll]);

  const t = translations[currentLang];

  return (
    <header
      className={`fixed top-0 w-full z-50 transition-all duration-700 ease-in-out backdrop-blur-md
        ${scrolled ? 'h-[clamp(3rem,4vw,4rem)] bg-slate-800/85' : 'h-[clamp(4rem,6vw,6rem)] bg-slate-800'}`}
      role="banner"
      style={{ 
        transform: 'translateY(0)' 
      }}
    >
      <div className="container mx-auto flex items-center justify-between h-full">
        <div className="flex items-center gap-4">
          <Button
            variant="ghost"
            size="icon"
            className={`hover:bg-dark-light/20 text-high-contrast transition-all duration-700
              ${scrolled ? 'h-10 w-10' : 'h-12 w-12'}`}
            onClick={onMenuToggle}
            aria-label={t.menuLabel}
          >
            <Menu className={`transition-all duration-700 ${scrolled ? 'h-6 w-6' : 'h-8 w-8'}`} aria-hidden="true" />
          </Button>
          <Link 
            to="/" 
            className="flex items-center hover:opacity-90 transition-opacity"
            aria-label="Home"
          >
            <img 
              src={getImagePath("/images/2.png")}
              alt="Pixel"
              className={`w-auto transition-all duration-700 ${scrolled ? 'h-8' : 'h-12'}`}
            />
          </Link>
        </div>
        <Button 
          variant="ghost" 
          size="sm" 
          onClick={() => setCurrentLang(currentLang === "en" ? "he" : "en")}
          className="text-high-contrast hover:bg-dark-light/20 transition-colors"
          aria-label={t.languageLabel}
        >
          <Globe className="h-5 w-5 mr-2" aria-hidden="true" />
          {t.toggleLanguage}
        </Button>
      </div>
    </header>
  );
};