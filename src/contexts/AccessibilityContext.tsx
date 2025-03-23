import React, { createContext, useContext, useState, useEffect } from 'react';

type AccessibilityContextType = {
  fontSize: number;
  highContrast: boolean;
  increaseFontSize: () => void;
  decreaseFontSize: () => void;
  resetFontSize: () => void;
  toggleHighContrast: () => void;
};

const AccessibilityContext = createContext<AccessibilityContextType | undefined>(undefined);

export const useAccessibility = () => {
  const context = useContext(AccessibilityContext);
  if (!context) {
    throw new Error('useAccessibility must be used within an AccessibilityProvider');
  }
  return context;
};

export const AccessibilityProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [fontSize, setFontSize] = useState(100); // באחוזים
  const [highContrast, setHighContrast] = useState(false);

  const increaseFontSize = () => {
    if (fontSize < 150) {
      setFontSize(prevSize => prevSize + 10);
    }
  };

  const decreaseFontSize = () => {
    if (fontSize > 70) {
      setFontSize(prevSize => prevSize - 10);
    }
  };

  const resetFontSize = () => {
    setFontSize(100);
  };

  const toggleHighContrast = () => {
    setHighContrast(prev => !prev);
  };

  // החלת השינויים על ה-DOM
  useEffect(() => {
    document.documentElement.style.fontSize = `${fontSize}%`;
    if (highContrast) {
      document.documentElement.classList.add('high-contrast');
    } else {
      document.documentElement.classList.remove('high-contrast');
    }
  }, [fontSize, highContrast]);

  return (
    <AccessibilityContext.Provider value={{
      fontSize,
      highContrast,
      increaseFontSize,
      decreaseFontSize,
      resetFontSize,
      toggleHighContrast
    }}>
      {children}
    </AccessibilityContext.Provider>
  );
}; 