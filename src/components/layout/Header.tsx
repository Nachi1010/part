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
  const [prevScrollY, setPrevScrollY] = useState(0);

  const handleScroll = useCallback(() => {
    const currentScrollY = window.scrollY;
    if (currentScrollY === 0) {
        setScrolled(false);
    } else if (currentScrollY > prevScrollY) {
        setScrolled(true);
    } else if (currentScrollY < prevScrollY) {
        setScrolled(false);
    }
    setPrevScrollY(currentScrollY);
  }, [prevScrollY]);

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
      <div className="container mx-auto flex items-center justify-between h-full px-0 sm:px-4 lg:px-8">
        <div className="flex items-center gap-2 md:gap-4">
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
            className="flex items-center hover:opacity-90 transition-opacity md:ml-12 lg:ml-20 xl:ml-32"
            aria-label="Home"
          >
            <picture>
              <img 
                src={getImagePath("/images/2.png")}
                alt="CloserAI"
                className={`w-auto transition-all duration-700 ${scrolled ? 'h-8 md:h-10' : 'h-12 md:h-14'}`}
              />
            </picture>
          </Link>
        </div>        
        <Button 
          variant="ghost" 
          size="sm" 
          onClick={() => setCurrentLang(currentLang === "en" ? "he" : "en")}
          className="hover:bg-dark-light/20 transition-colors font-bold"
          aria-label={t.languageLabel}
          style={{
            color: '#0f172a', 
            '--tw-text-opacity': '1',
            '--text-color': '#0f172a'
          } as React.CSSProperties}
        >
          <Globe className="h-5 w-5 mr-2" style={{color: '#0f172a'}} aria-hidden="true" />
          <div style={{
            color: '#0f172a', 
            fontWeight: 'bold', 
            display: 'inline',
            textShadow: 'none',
            filter: 'none',
            boxShadow: 'none'
          }}>{t.toggleLanguage}</div>        </Button>
        </div>
    </header>
  );
};
