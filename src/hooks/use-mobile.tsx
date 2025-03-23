import { useState, useEffect, useCallback } from "react"

const MOBILE_BREAKPOINT = 768

export function useIsMobile() {
  const [isMobile, setIsMobile] = useState(() => 
    typeof window !== 'undefined' 
      ? window.matchMedia(`(max-width: ${MOBILE_BREAKPOINT - 1}px)`).matches 
      : false
  )

  const handleChange = useCallback((e: MediaQueryListEvent) => {
    setIsMobile(e.matches)
  }, [])

  useEffect(() => {
    const mql = window.matchMedia(`(max-width: ${MOBILE_BREAKPOINT - 1}px)`)
    mql.addEventListener("change", handleChange)
    return () => mql.removeEventListener("change", handleChange)
  }, [handleChange])

  return isMobile
}
