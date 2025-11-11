import { useState, useRef, useEffect, memo } from "react";
import { useGLTF } from "@react-three/drei";
import { useFrame } from "@react-three/fiber";
import ModelCanvas from "./ModelCanvas";

const Computer = memo(({ isMobile, rotationRef }) => {
  const computer = useGLTF("/desktop_pc/scene.glb");
  const groupRef = useRef();

  // Smoothly interpolate rotation using ref (no re-renders)
  useFrame(() => {
    if (!groupRef.current || rotationRef.current === undefined) return;

    // Lerp (linear interpolation) for smooth rotation
    const target = rotationRef.current;
    groupRef.current.rotation.y += (target - groupRef.current.rotation.y) * 0.1;
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
        object={computer.scene}
        scale={isMobile ? 0.32 : 0.65}
        position={isMobile ? [0, -2, -0.5] : [0, -2.7, -1]}
        rotation={[-0.01, -0.2, -0.1]}
      />
    </group>
  );
});

Computer.displayName = "Computer";

const ComputersCanvas = () => {
  const [isMobile, setIsMobile] = useState(false);
  const targetRotationRef = useRef(0);
  const containerRef = useRef(null);

  // Handle responsive sizing
  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 900);
    };

    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // Handle mouse/touch movement - use global window tracking like TechBalls
  useEffect(() => {
    const handlePointerMove = (e) => {
      const x = e.clientX || e.touches?.[0]?.clientX;
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
    <div ref={containerRef} className="w-full h-screen">
      <ModelCanvas
        workerName="computerCanvasWorker"
        continuousAnimation={true}
        cameraProps={{ position: [20, 3, 5], fov: 25 }}
        containerClassName="w-full h-full"
      >
        <Computer isMobile={isMobile} rotationRef={targetRotationRef} />
      </ModelCanvas>
    </div>
  );
};

useGLTF.preload("/desktop_pc/scene.glb");

export default ComputersCanvas;
