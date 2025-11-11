import React, { useMemo, useState, useEffect } from "react";
import { useFrame } from "@react-three/fiber";
import { Decal, useTexture } from "@react-three/drei";
import ModelCanvas from "./ModelCanvas";

const Ball = React.memo(({ imgUrl, position, mouseXRef, active, scale }) => {
  const [decal] = useTexture([imgUrl]);
  const meshRef = React.useRef();

  // Smooth horizontal rotation only (no vertical auto spin)
  useFrame(() => {
    if (!meshRef.current || !active) return;
    const targetY = (mouseXRef.current || 0) * 0.8;
    meshRef.current.rotation.y += (targetY - meshRef.current.rotation.y) * 0.1;
  });

  return (
    <mesh
      ref={meshRef}
      castShadow
      receiveShadow
      position={position}
      scale={scale}
    >
      <icosahedronGeometry args={[1, 1]} />
      <meshStandardMaterial
        color="#fff8eb"
        flatShading
        polygonOffset
        polygonOffsetFactor={-5}
      />
      <Decal
        position={[0, 0, 1]}
        rotation={[2 * Math.PI, 0, 6.25]}
        scale={1}
        map={decal}
      />
    </mesh>
  );
});

const TechBallsCanvas = ({ technologies }) => {
  const mouseXRef = React.useRef(0);
  const containerRef = React.useRef(null);
  const [inView, setInView] = useState(true);
  const [ballScale, setBallScale] = useState(1);
  const [containerSize, setContainerSize] = useState({ width: 0, height: 0 });
  const icons = useMemo(
    () => technologies.map((t) => t.icon.src),
    [technologies]
  );

  // Global mouse tracking
  useEffect(() => {
    const onMove = (e) => {
      mouseXRef.current = (e.clientX / window.innerWidth - 0.5) * 2;
    };
    window.addEventListener("mousemove", onMove, { passive: true });
    return () => window.removeEventListener("mousemove", onMove);
  }, []);

  // Observe container size and compute ball scale clamped to container
  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;
    const ro = new ResizeObserver((entries) => {
      const cr = entries[0].contentRect;
      setContainerSize({ width: cr.width, height: cr.height });
    });
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  useEffect(() => {
    const { width, height } = containerSize;
    if (!width || !height) return;

    const cols = 5;
    const padding = 1.5; // Increased padding to prevent overflow
    const cameraZ = 12;
    const fov = 45;

    const viewportHeight = 2 * cameraZ * Math.tan((fov * Math.PI) / 360);
    const viewportWidth = viewportHeight * (width / height);

    // Calculate maximum scale based on viewport to prevent overflow
    const gridUnits = 2.5 * (cols - 1) + 2;
    const sMax = Math.max(0.5, (viewportWidth - padding) / gridUnits);

    // Progressive scale based on viewport width with stricter limits
    const sProg =
      viewportWidth < 5
        ? 0.6 // Extra small screens
        : viewportWidth < 8
        ? 0.8 // Small screens
        : viewportWidth < 12
        ? 1.0 // Medium screens
        : viewportWidth < 16
        ? 1.2 // Large screens
        : 1.4; // Extra large screens (max)

    // Use the minimum of calculated values and apply absolute maximum
    const calculatedScale = Math.min(sProg, sMax);
    const maxAbsoluteScale = 1.4; // Hard limit to prevent balls from being too large

    setBallScale(Math.min(calculatedScale, maxAbsoluteScale));
  }, [containerSize]);

  // Intersection observer to pause animation when not visible
  useEffect(() => {
    if (!containerRef.current || typeof IntersectionObserver === "undefined")
      return;
    const obs = new IntersectionObserver(
      (entries) => {
        setInView(entries[0].isIntersecting);
      },
      { threshold: 0.15 }
    );
    obs.observe(containerRef.current);
    return () => obs.disconnect();
  }, []);

  const ballPositions = useMemo(() => {
    const cols = 5;
    const spacing = 2.5 * ballScale; // adjust spacing with scale
    const startX = (-(cols - 1) * spacing) / 2;
    const rows = Math.ceil(technologies.length / cols);
    const startY = ((rows - 1) * spacing) / 2;

    return technologies.map((_, index) => {
      const col = index % cols;
      const row = Math.floor(index / cols);
      return [startX + col * spacing, startY - row * spacing, 0];
    });
  }, [technologies, ballScale]);

  return (
    <div ref={containerRef} className="w-full h-[400px]">
      <ModelCanvas
        workerName="techBallsCanvasWorker"
        continuousAnimation
        cameraProps={{ position: [0, 0, 12], fov: 45 }}
        containerClassName="w-full h-[400px]"
        workerProps={{
          icons,
          containerWidth: containerSize.width,
          containerHeight: containerSize.height,
          cols: 5,
          padding: 0.5,
        }}
        onMouseMove={(e) => {
          const rect = containerRef.current?.getBoundingClientRect();
          if (!rect) return;
          const x = e.clientX - rect.left;
          mouseXRef.current = (x / rect.width - 0.5) * 2;
        }}
      >
        <ambientLight intensity={0.45} />
        <directionalLight position={[6, 8, 6]} intensity={0.9} />
        <pointLight position={[-10, -5, -10]} intensity={0.35} />
        {technologies.map((tech, index) => (
          <Ball
            key={tech.name}
            imgUrl={tech.icon.src}
            position={ballPositions[index]}
            mouseXRef={mouseXRef}
            active={inView}
            scale={ballScale}
          />
        ))}
      </ModelCanvas>
    </div>
  );
};

export default TechBallsCanvas;
