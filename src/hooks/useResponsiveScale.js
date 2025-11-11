import { useRef, useEffect, useCallback } from "react";

/**
 * Custom hook for responsive scaling with linear interpolation
 * @param {Object} config - Configuration object
 * @param {number} config.minScale - Minimum scale value
 * @param {number} config.maxScale - Maximum scale value
 * @param {number} config.minWidth - Minimum viewport width
 * @param {number} config.maxWidth - Maximum viewport width
 * @param {Function} config.onResize - Callback function called with calculated values
 * @returns {Object} - { scaleRef, handleResize }
 */
export function useResponsiveScale({
  minScale = 0.28,
  maxScale = 0.6,
  minWidth = 400,
  maxWidth = 1920,
  onResize = null,
} = {}) {
  const scaleRef = useRef(maxScale);

  const handleResize = useCallback(() => {
    const width = window.innerWidth;

    // Calculate responsive scale (linear interpolation)
    const scaleRange = maxScale - minScale;
    const widthRange = maxWidth - minWidth;
    const clampedWidth = Math.max(minWidth, Math.min(maxWidth, width));
    const scaleProgress = (clampedWidth - minWidth) / widthRange;
    const calculatedScale = minScale + scaleProgress * scaleRange;

    scaleRef.current = calculatedScale;

    // Call optional callback with calculated values
    if (onResize) {
      onResize({ scale: calculatedScale, width, scaleProgress });
    }
  }, [minScale, maxScale, minWidth, maxWidth, onResize]);

  useEffect(() => {
    handleResize();

    // Debounce resize to prevent rapid updates
    let resizeTimeout;
    const debouncedResize = () => {
      clearTimeout(resizeTimeout);
      resizeTimeout = setTimeout(handleResize, 100);
    };

    window.addEventListener("resize", debouncedResize);
    return () => {
      clearTimeout(resizeTimeout);
      window.removeEventListener("resize", debouncedResize);
    };
  }, [handleResize]);

  return { scaleRef, handleResize };
}
