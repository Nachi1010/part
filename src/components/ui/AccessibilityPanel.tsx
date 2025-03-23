import React, { useState, useEffect } from 'react';
import { useAccessibility } from '@/contexts/AccessibilityContext';
import { useLanguage } from '@/contexts/LanguageContext';

export const AccessibilityPanel = () => {
  const { 
    fontSize, 
    highContrast, 
    increaseFontSize, 
    decreaseFontSize, 
    resetFontSize, 
    toggleHighContrast 
  } = useAccessibility();
  const { currentLang } = useLanguage();
  const [isOpen, setIsOpen] = useState(false);

  // כאשר נלחץ אלמנט מחוץ לפאנל, הפאנל ייסגר
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const panel = document.getElementById('accessibility-panel');
      if (panel && !panel.contains(event.target as Node) && isOpen) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen]);

  // סגירת הפאנל כאשר נלחץ אסקייפ
  useEffect(() => {
    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape' && isOpen) {
        setIsOpen(false);
      }
    };

    document.addEventListener('keydown', handleEscape);
    return () => {
      document.removeEventListener('keydown', handleEscape);
    };
  }, [isOpen]);

  // פתיחת הפאנל כאשר נלחץ העוגן
  useEffect(() => {
    const handleAnchorClick = () => {
      const hash = window.location.hash;
      if (hash === '#accessibility') {
        setIsOpen(true);
      }
    };

    window.addEventListener('hashchange', handleAnchorClick);
    // בדיקה בטעינה הראשונית של הדף
    if (window.location.hash === '#accessibility') {
      setIsOpen(true);
    }

    return () => {
      window.removeEventListener('hashchange', handleAnchorClick);
    };
  }, []);

  const dir = currentLang === 'he' ? 'rtl' : 'ltr';
  const textAlign = currentLang === 'he' ? 'right' : 'left';

  const translations = {
    en: {
      title: 'Accessibility Options',
      fontSize: 'Font Size',
      increaseFont: 'Increase',
      decreaseFont: 'Decrease',
      resetFont: 'Reset',
      contrast: 'High Contrast',
      on: 'On',
      off: 'Off',
      close: 'Close'
    },
    he: {
      title: 'אפשרויות נגישות',
      fontSize: 'גודל טקסט',
      increaseFont: 'הגדל',
      decreaseFont: 'הקטן',
      resetFont: 'איפוס',
      contrast: 'ניגודיות גבוהה',
      on: 'פעיל',
      off: 'כבוי',
      close: 'סגור'
    }
  };

  const t = translations[currentLang];

  if (!isOpen) {
    return null; // אם הפאנל סגור, אין מה להציג
  }

  return (
    <div 
      id="accessibility-panel"
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50"
      dir={dir}
    >
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl p-6 max-w-sm w-full mx-4">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold" style={{ textAlign }}>
            {t.title}
          </h2>
          <button 
            onClick={() => setIsOpen(false)}
            className="p-1 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700"
            aria-label={t.close}
          >
            ✕
          </button>
        </div>

        <div className="space-y-6">
          {/* Font Size Controls */}
          <div>
            <h3 className="font-medium mb-2" style={{ textAlign }}>
              {t.fontSize}: {fontSize}%
            </h3>
            <div className="flex gap-2">
              <button 
                onClick={decreaseFontSize}
                className="flex-1 py-2 px-3 bg-gray-200 dark:bg-gray-700 rounded hover:bg-gray-300 dark:hover:bg-gray-600"
                disabled={fontSize <= 70}
              >
                {t.decreaseFont} (-)
              </button>
              <button 
                onClick={resetFontSize}
                className="flex-1 py-2 px-3 bg-gray-200 dark:bg-gray-700 rounded hover:bg-gray-300 dark:hover:bg-gray-600"
              >
                {t.resetFont}
              </button>
              <button 
                onClick={increaseFontSize}
                className="flex-1 py-2 px-3 bg-gray-200 dark:bg-gray-700 rounded hover:bg-gray-300 dark:hover:bg-gray-600"
                disabled={fontSize >= 150}
              >
                {t.increaseFont} (+)
              </button>
            </div>
          </div>

          {/* High Contrast Toggle */}
          <div>
            <h3 className="font-medium mb-2" style={{ textAlign }}>
              {t.contrast}
            </h3>
            <button 
              onClick={toggleHighContrast}
              className={`w-full py-2 px-4 rounded ${
                highContrast 
                  ? 'bg-blue-600 text-white' 
                  : 'bg-gray-200 dark:bg-gray-700'
              }`}
            >
              {highContrast ? t.on : t.off}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}; 