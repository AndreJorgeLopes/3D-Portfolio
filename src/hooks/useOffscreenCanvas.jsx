import { useState, useEffect, useMemo } from "react";
import { Canvas as DefaultCanvas } from "@react-three/fiber";
import { Canvas as OffscreenCanvas } from "@react-three/offscreen";
import { Suspense } from "react";
import CanvasLoader from "../components/Loader";

/**
 * Hook for managing 3D canvas rendering with automatic offscreen support
 * @param {Object} options - Configuration options
 * @param {string} options.workerName - Name of the worker file
 * @param {Object} options.canvasProps - Props for the canvas
 * @param {Function} options.onError - Error callback
 * @returns {Object} Configured Canvas component and support info
 */
export function useOffscreenCanvas({
  workerName,
  canvasProps = {},
  onError = console.error,
  continuousAnimation = false,
}) {
  const [isSupported, setIsSupported] = useState(false);
  const [worker, setWorker] = useState(null);

  // Check for offscreen support - DISABLED FOR NOW
  useEffect(() => {
    if (typeof window === "undefined") return;
    // Temporarily disable offscreen canvas to use regular canvas
    // setIsSupported("OffscreenCanvas" in window);
    setIsSupported(false);
  }, []);

  // Base performance-optimized configuration
  const baseConfig = useMemo(
    () => ({
      dpr: [1, 1.5],
      gl: {
        antialias: false,
        powerPreference: "high-performance",
        failIfMajorPerformanceCaveat: true,
        alpha: true, // Enable alpha for transparent backgrounds
        premultipliedAlpha: false, // Important for proper transparency
        stencil: false,
        depth: true,
      },
      frameloop: continuousAnimation ? "always" : "demand", // Stars need continuous animation, others can use demand
      performance: {
        min: 0.5,
        max: 1,
        debounce: 200, // Debounce performance adjustments
      },
      legacy: false, // Disable legacy mode
    }),
    [continuousAnimation]
  );

  // Get worker path based on environment
  const workerUrl = useMemo(() => {
    if (!workerName) return null;

    // Use a static import path for webpack
    const workerPath = `/workers/${
      workerName.endsWith(".jsx") || workerName.endsWith(".js")
        ? workerName
        : `${workerName}.js`
    }`;

    return {
      development: workerPath,
      production: `${process.env.NEXT_PUBLIC_BASE_PATH || ""}${workerPath}`,
    }[process.env.NODE_ENV || "development"];
  }, [workerName]);

  // Create worker instance when supported and workerUrl is available
  useEffect(() => {
    if (!isSupported || !workerUrl || typeof window === "undefined") {
      setWorker(null);
      return;
    }

    let workerInstance = null;

    try {
      // Create worker with module type for ES module support
      workerInstance = new Worker(workerUrl, { type: "module" });
      setWorker(workerInstance);
    } catch (error) {
      console.error("Failed to create worker:", error);
      setWorker(null);
    }

    return () => {
      if (workerInstance) {
        workerInstance.terminate();
      }
    };
  }, [isSupported, workerUrl]);

  // Merge canvas configurations
  const mergedProps = useMemo(
    () => ({
      ...baseConfig,
      ...canvasProps,
      gl: {
        ...baseConfig.gl,
        ...canvasProps.gl,
      },
    }),
    [baseConfig, canvasProps]
  );

  // Create configured Canvas component: Offscreen when supported, fallback to DefaultCanvas otherwise
  const Canvas = useMemo(() => {
    const useWorker = isSupported && Boolean(workerName) && Boolean(worker);

    // Return a stable component reference
    if (useWorker) {
      return function OffscreenCanvasWrapper({
        children,
        workerProps = {},
        ...props
      }) {
        const finalProps = { ...mergedProps, ...props, ...workerProps };
        return (
          <OffscreenCanvas
            worker={worker}
            fallback={<CanvasLoader />}
            {...finalProps}
          />
        );
      };
    }

    // Fallback: render regular Canvas with children
    return function DefaultCanvasWrapper({ children }) {
      return (
        <DefaultCanvas {...mergedProps}>
          <Suspense fallback={<CanvasLoader />}>{children}</Suspense>
        </DefaultCanvas>
      );
    };
  }, [mergedProps, isSupported, workerName, worker]);

  return {
    Canvas,
    isSupported,
    workerUrl,
  };
}
