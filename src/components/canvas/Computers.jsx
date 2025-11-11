import { useState, useRef, useEffect, memo } from "react";
import { useGLTF } from "@react-three/drei";
import { useFrame } from "@react-three/fiber";
import ModelCanvas from "./ModelCanvas";

const Computer = memo(({ scale, position, rotationRef }) => {
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
        scale={scale}
        position={position}
        rotation={[-0.01, -0.2, -0.1]}
      />
    </group>
  );
});

Computer.displayName = "Computer";

const ComputersCanvas = () => {
  const [scale, setScale] = useState(0.6);
  const [position, setPosition] = useState([0, -2.5, -1]);
  const targetRotationRef = useRef(0);
  const containerRef = useRef(null);

  // Handle responsive sizing with smooth automated scaling
  useEffect(() => {
    const handleResize = () => {
      const width = window.innerWidth;

      // Scale configuration
      const minScale = 0.28;
      const maxScale = 0.6;
      const minWidth = 400;
      const maxWidth = 1920;

      // Calculate responsive scale (linear interpolation)
      const scaleRange = maxScale - minScale;
      const widthRange = maxWidth - minWidth;
      const clampedWidth = Math.max(minWidth, Math.min(maxWidth, width));
      const scaleProgress = (clampedWidth - minWidth) / widthRange;
      const calculatedScale = minScale + scaleProgress * scaleRange;

      // Position configuration (y and z vary with scale)
      const minY = -1.3;
      const maxY = -2.2;
      const minZ = -0.5;
      const maxZ = -1;

      // Calculate responsive position
      const yPos = minY + scaleProgress * (maxY - minY);
      const zPos = minZ + scaleProgress * (maxZ - minZ);

      setScale(calculatedScale);
      setPosition([-0.5, yPos, zPos]); // X stays at -0.5 (left positioning)
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
        <Computer
          scale={scale}
          position={position}
          rotationRef={targetRotationRef}
        />
      </ModelCanvas>
    </div>
  );
};

useGLTF.preload("/desktop_pc/scene.glb");

export default ComputersCanvas;
