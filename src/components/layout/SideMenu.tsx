const menuItems = [
  { title: "Home", titleHe: "דף הבית", href: "#hero" },
  { title: "About", titleHe: "אודות", href: "#about" },
  { title: "Course Details", titleHe: "פרטי הקורס", href: "#technical-details" },
  { title: "Registration", titleHe: "הרשמה", href: "#registration-form" },
  { title: "FAQ", titleHe: "שאלות נפוצות", href: "#faq" },
  { title: "Contact", titleHe: "צור קשר", href: "#registration-form" }
] as const;

interface SideMenuProps {
  isOpen: boolean;
  onClose: () => void;
}

import { useLanguage } from "@/contexts/LanguageContext";
import { smoothScrollTo } from "@/lib/scrollUtils";

export const SideMenu = ({ isOpen, onClose }: SideMenuProps) => {
  const { currentLang } = useLanguage();
  
  // Combined function to handle both closing menu and smooth scrolling
  const handleLinkClick = (e: React.MouseEvent<HTMLAnchorElement>, href: string) => {
    e.preventDefault();
    onClose();
    
    // Extract the ID from the href and scroll to it
    if (href.startsWith('#')) {
      const targetId = href.substring(1);
      if (targetId) {
        // Allow a small delay for the menu to close before scrolling
        setTimeout(() => {
          smoothScrollTo(targetId);
        }, 300);
      }
    }
  };
  
  return (
    <>
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40"
          onClick={onClose}
        />
      )}

      <nav
        className={`fixed top-0 left-0 h-full w-64 bg-slate-800 shadow-lg transform transition-transform duration-300 ease-in-out z-50 ${
          isOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="p-6 flex flex-col justify-between h-full">
          <ul className="space-y-4">
            {menuItems.map((item) => (
              <li key={item.title}>
                <a
                  href={item.href}
                  className="text-white/90 hover:text-white transition-colors block py-2"
                  onClick={(e) => handleLinkClick(e, item.href)}
                >
                  {currentLang === "en" ? item.title : item.titleHe}
                </a>
              </li>
            ))}
          </ul>
          
          <div className="mt-auto pt-4 border-t border-slate-700">
            <div className="text-white/60 text-xs space-y-2">
              <button 
                className="block hover:text-white transition-colors text-left w-full"
                onClick={() => {
                  onClose();
                  // Set the accessibility hash and let the AccessibilityPanel handle it
                  window.location.hash = "accessibility";
                }}
              >
                {currentLang === "en" ? "Accessibility" : "נגישות"}
              </button>
              <button 
                className="block hover:text-white transition-colors text-left w-full"
                onClick={(e) => {
                  onClose();
                  // Use setTimeout to allow the menu to close first
                  setTimeout(() => {
                    smoothScrollTo('registration-form');
                  }, 300);
                }}
              >
                {currentLang === "en" ? "More Information" : "מידע נוסף"}
              </button>
            </div>
          </div>
        </div>
      </nav>
    </>
  );
};