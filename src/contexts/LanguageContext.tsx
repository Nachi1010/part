import { createContext, useContext, ReactNode, useState } from "react";

type Language = "en" | "he";

interface LanguageContextType {
  currentLang: Language;
  setCurrentLang: (lang: Language) => void;
  getTextDirection: () => "ltr" | "rtl";
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [currentLang, setCurrentLang] = useState<Language>("he"); // Default to Hebrew

  const getTextDirection = () => currentLang === "he" ? "rtl" : "ltr";

  return (
    <LanguageContext.Provider value={{ currentLang, setCurrentLang, getTextDirection }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (context === undefined) {
    throw new Error("useLanguage must be used within a LanguageProvider");
  }
  return context;
}