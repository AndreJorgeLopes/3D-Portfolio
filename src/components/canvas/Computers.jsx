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

  // Handle mouse/touch movement - use global window tracking like TechBalls
  useEffect(() => {
    const handlePointerMove = (e) => {
      const x = e.clientX || e.touches?.[0]?.clientX;
      if (x === undefined) return;
      const moveX = (x / window.innerWidth - 0.5) * 2; // Normalize to -1 to 1
      targetRotationRef.current = moveX * 0.5; // Update ref, no re-render
    };

    window.addEventListener("mousemove", handlePointerMove, { passive: true });
    window.addEventListener("touchmove", handlePointerMove, { passive: true });

    return () => {
      window.removeEventListener("mousemove", handlePointerMove);
      window.removeEventListener("touchmove", handlePointerMove);
    };
  }, []);

  return (
    <ModelCanvas
      key="computer-canvas" // Prevent unmounting
      workerName="computerCanvasWorker"
      continuousAnimation={true}
      cameraProps={{ position: [20, 3, 5], fov: 25 }}
      containerClassName="w-full h-screen"
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

          canvas.addEventListener("webglcontextlost", handleContextLost, false);
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
  );
};

useGLTF.preload("/desktop_pc/scene.glb");

export default ComputersCanvas;
