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
  const [lastScrollTop, setLastScrollTop] = useState(0);
  const { currentLang, setCurrentLang } = useLanguage();

  const handleScroll = useCallback(() => {
    const currentScrollTop = window.scrollY;
    if (currentScrollTop > lastScrollTop) {
      // גלילה למטה - הקטנת ההידר
      setScrolled(true);
    } else if (currentScrollTop < lastScrollTop) {
      // גלילה למעלה - הגדלת ההידר
      setScrolled(false);
    }
    setLastScrollTop(currentScrollTop);
  }, [lastScrollTop]);

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
    >
      <div className="container mx-auto flex items-center h-full">
        <div className="flex items-center justify-between w-full px-1 md:px-4">
          <Button
            variant="ghost"
            size="icon"
            className="text-high-contrast ml-0 md:ml-0"
            onClick={onMenuToggle}
            aria-label={t.menuLabel}
            style={{ marginLeft: 0 }}
          >
            <Menu className="h-6 w-6" />
          </Button>
          
          <Link to="/" className="mx-auto md:mx-auto">
            <img
              src={getImagePath("kudu-removebg-preview.png")}
              alt="Practics AI"
              className="h-[2.5rem] md:h-[4.5rem] lg:h-[6.5rem] w-auto"
              style={{ marginLeft: '1rem' }}
            />
          </Link>

          <Button
            variant="ghost"
            size="icon"
            onClick={() => setCurrentLang(currentLang === 'en' ? 'he' : 'en')}
            className="text-blue-900 mr-0 md:mr-0"
            aria-label={t.languageLabel}
            style={{ marginRight: 0, color: "#0a3172" }}
          >
            <Globe className="h-5 w-5" />
          </Button>
        </div>
      </div>
    </header>
  );
};
