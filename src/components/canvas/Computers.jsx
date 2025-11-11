import { useRef, useEffect, memo, useCallback } from "react";
import { useGLTF } from "@react-three/drei";
import { useFrame } from "@react-three/fiber";
import ModelCanvas from "./ModelCanvas";
import { useResponsiveScale } from "../../hooks/useResponsiveScale";

const Computer = memo(({ scaleRef, positionRef, rotationRef }) => {
  const computer = useGLTF("/desktop_pc/scene.glb");
  const groupRef = useRef();
  const meshRef = useRef();

  // Smoothly interpolate rotation and update scale/position using refs
  useFrame(() => {
    if (!groupRef.current || rotationRef.current === undefined) return;

    // Update rotation
    const target = rotationRef.current;
    groupRef.current.rotation.y += (target - groupRef.current.rotation.y) * 0.1;

    // Update scale and position from refs (no re-renders)
    if (meshRef.current && scaleRef.current && positionRef.current) {
      meshRef.current.scale.set(
        scaleRef.current,
        scaleRef.current,
        scaleRef.current
      );
      meshRef.current.position.set(...positionRef.current);
    }
  });

  return (
    <group ref={groupRef}>
      <ambientLight intensity={1} />
      <directionalLight position={[5, 5, 5]} intensity={1} />
      <directionalLight position={[-5, -5, -5]} intensity={1} />
      <spotLight
        position={[-20, 50, 10]}
        angle={0.12}
        penumbra={1}
        intensity={1}
        castShadow
        shadow-mapSize={1024}
      />
      <primitive
        ref={meshRef}
        object={computer.scene}
        scale={0.6}
        position={[-0.5, -2.5, -1]}
        rotation={[-0.01, -0.2, -0.1]}
      />
    </group>
  );
});

Computer.displayName = "Computer";

const ComputersCanvas = () => {
  const containerRef = useRef(null);
  const positionRef = useRef([-0.5, -2.5, -1]);
  const targetRotationRef = useRef(0);

  // Use responsive scale hook with position calculation
  const { scaleRef } = useResponsiveScale({
    minScale: 0.28,
    maxScale: 0.6,
    minWidth: 400,
    maxWidth: 1920,
    onResize: ({ scaleProgress }) => {
      // Position configuration (y and z vary with scale)
      const minY = -1.3;
      const maxY = -2.2;
      const minZ = -0.5;
      const maxZ = -1;

      // Calculate responsive position
      const yPos = minY + scaleProgress * (maxY - minY);
      const zPos = minZ + scaleProgress * (maxZ - minZ);

      // Update position ref (no re-render, no canvas remount)
      positionRef.current = [-0.5, yPos, zPos];
    },
  });

  // Handle mouse/touch movement with drag support for touch devices
  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const isTouchDevice =
      "ontouchstart" in window || navigator.maxTouchPoints > 0;
    let isDragging = false;
    let lastX = 0;

    if (isTouchDevice) {
      // Touch device: drag to rotate
      const handleTouchStart = (e) => {
        isDragging = true;
        lastX = e.touches[0].clientX;
      };

      const handleTouchMove = (e) => {
        if (!isDragging) return;
        e.preventDefault(); // Prevent page scrolling while dragging on canvas
        const currentX = e.touches[0].clientX;
        const deltaX = currentX - lastX;
        const rotationDelta = (deltaX / window.innerWidth) * 2; // Sensitivity
        targetRotationRef.current += rotationDelta;
        lastX = currentX; // Update for next move
      };

      const handleTouchEnd = () => {
        isDragging = false;
      };

      // Attach to container, not window
      container.addEventListener("touchstart", handleTouchStart, {
        passive: true,
      });
      container.addEventListener("touchmove", handleTouchMove, {
        passive: false,
      }); // passive: false to allow preventDefault
      container.addEventListener("touchend", handleTouchEnd, { passive: true });
      container.addEventListener("touchcancel", handleTouchEnd, {
        passive: true,
      });

      return () => {
        container.removeEventListener("touchstart", handleTouchStart);
        container.removeEventListener("touchmove", handleTouchMove);
        container.removeEventListener("touchend", handleTouchEnd);
        container.removeEventListener("touchcancel", handleTouchEnd);
      };
    } else {
      // Desktop: follow mouse
      const handleMouseMove = (e) => {
        const moveX = (e.clientX / window.innerWidth - 0.5) * 2;
        targetRotationRef.current = moveX * 0.5;
      };

      window.addEventListener("mousemove", handleMouseMove, { passive: true });

      return () => {
        window.removeEventListener("mousemove", handleMouseMove);
      };
    }
  }, []);

  return (
    <div ref={containerRef} className="w-full h-screen">
      <ModelCanvas
        key="computer-canvas" // Prevent unmounting
        workerName="computerCanvasWorker"
        continuousAnimation={true}
        cameraProps={{ position: [20, 3, 5], fov: 25 }}
        containerClassName="w-full h-full"
        canvasProps={{
          gl: {
            preserveDrawingBuffer: false, // Let browser manage buffer
            antialias: true,
            alpha: true,
            powerPreference: "high-performance",
          },
          onCreated: ({ gl }) => {
            // Add WebGL context loss/restore handlers
            const canvas = gl.domElement;

            const handleContextLost = (event) => {
              event.preventDefault();
              console.warn("WebGL context lost, attempting to restore...");
            };

            const handleContextRestored = () => {
              console.log("WebGL context restored successfully");
            };

            canvas.addEventListener(
              "webglcontextlost",
              handleContextLost,
              false
            );
            canvas.addEventListener(
              "webglcontextrestored",
              handleContextRestored,
              false
            );

            return () => {
              canvas.removeEventListener("webglcontextlost", handleContextLost);
              canvas.removeEventListener(
                "webglcontextrestored",
                handleContextRestored
              );
            };
          },
        }}
      >
        <Computer
          scaleRef={scaleRef}
          positionRef={positionRef}
          rotationRef={targetRotationRef}
        />
      </ModelCanvas>
    </div>
  );
};

useGLTF.preload("/desktop_pc/scene.glb");

export default ComputersCanvas;
