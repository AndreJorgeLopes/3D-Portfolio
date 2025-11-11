import { setup } from "@react-three/offscreen";
import { useTexture } from "@react-three/drei";
import { useThree, useFrame } from "@react-three/fiber";
import React, { useMemo, useRef } from "react";

/**
 * Offscreen worker scene for Tech Balls.
 * Features:
 * - Independent horizontal rotation reacting to pointer X (inside canvas)
 * - Responsive scale (larger on wide viewports – up to ~2x)
 * - Optimized geometry/material reuse
 * - Continuous animation (frameloop: always)
 */

const Ball = ({ imgUrl, position, baseScale }) => {
  const [decal] = useTexture([imgUrl]);
  const ref = useRef();
  // Reuse geometry/material (memoized once)
  const geometry = useMemo(() => new THREE.IcosahedronGeometry(1, 1), []);
  const material = useMemo(
    () =>
      new THREE.MeshStandardMaterial({
        color: "#fff8eb",
        flatShading: true,
        polygonOffset: true,
        polygonOffsetFactor: -5,
        toneMapped: false,
        fog: false,
      }),
    []
  );

  useFrame(() => {
    if (!ref.current) return;
    const { mouse } = useThree();
    const targetY = (mouse.x || 0) * 0.8;
    ref.current.rotation.y += (targetY - ref.current.rotation.y) * 0.12;
  });

  return (
    <mesh
      ref={ref}
      position={position}
      scale={baseScale}
      castShadow
      receiveShadow
      geometry={geometry}
      material={material}
    >
      {/* Decal as a thin plane slightly in front to avoid worker decal rotation complexity */}
      <mesh position={[0, 0, 0.999]}>
        <planeGeometry args={[1.8, 1.8]} />
        <meshBasicMaterial map={decal} transparent toneMapped={false} />
      </mesh>
    </mesh>
  );
};

const TechBallsWorkerScene = ({
  icons = [],
  containerWidth = 0,
  containerHeight = 0,
  cols = 5,
  padding = 0.5,
}) => {
  const { viewport } = useThree();
  // Progressive scale with clamp so total grid fits within viewport width
  const gridUnits = 2.5 * (cols - 1) + 2; // spacing*steps + ball diameter (in world units at scale=1)
  const sProg =
    viewport.width < 5
      ? 0.75
      : viewport.width < 8
      ? 1.0
      : viewport.width < 12
      ? 1.4
      : 2.0;
  const sMax = Math.max(0.6, (viewport.width - (padding ?? 0.5)) / gridUnits);
  const scaleFactor = Math.min(sProg, sMax);

  const spacing = 2.5 * scaleFactor;
  const startX = (-(cols - 1) * spacing) / 2;
  const rows = Math.ceil(icons.length / cols);
  const startY = ((rows - 1) * spacing) / 2;

  const positions = useMemo(
    () =>
      icons.map((_, idx) => {
        const col = idx % cols;
        const row = Math.floor(idx / cols);
        return [startX + col * spacing, startY - row * spacing, 0];
      }),
    [icons, spacing, startX, startY]
  );

  return (
    <>
      <ambientLight intensity={0.45} />
      <directionalLight position={[6, 8, 6]} intensity={0.95} />
      <pointLight position={[-10, -5, -10]} intensity={0.35} />
      {icons.map((icon, i) => (
        <Ball
          key={icon}
          imgUrl={icon}
          position={positions[i]}
          baseScale={scaleFactor}
        />
      ))}
    </>
  );
};

setup(TechBallsWorkerScene, {
  gl: {
    preserveDrawingBuffer: false,
    powerPreference: "high-performance",
    antialias: false,
    stencil: false,
    depth: true,
  },
  camera: {
    position: [0, 0, 12],
    fov: 45,
    near: 0.1,
    far: 100,
  },
  dpr: [1, 1.5],
  frameloop: "demand",
  performance: { min: 0.5, max: 1 },
});
