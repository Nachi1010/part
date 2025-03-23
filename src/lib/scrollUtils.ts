/**
 * פונקציית עזר לגלילה חלקה בין אלמנטים בדף
 * Utility function for smooth scrolling between page elements
 */

export const smoothScrollTo = (
  eOrId: React.MouseEvent<HTMLAnchorElement> | string
): void => {
  if (typeof eOrId === 'string') {
    // If given an ID directly
    const element = document.getElementById(eOrId);
    if (element) {
      element.scrollIntoView({
        behavior: "smooth",
        block: "start",
      });
    }
    return;
  }

  // Original behavior with event object
  const e = eOrId;
  e.preventDefault();
  const href = e.currentTarget.getAttribute("href");
  
  if (href?.startsWith("#")) {
    const targetId = href.substring(1);
    const element = document.getElementById(targetId);
    
    if (element) {
      // קביעת גלילה חלקה עם אופציה לשינוי המיקום
      element.scrollIntoView({
        behavior: "smooth",
        block: "start",
      });
    }
  }
};