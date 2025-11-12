import { setup } from "@react-three/offscreen";
import { useGLTF } from "@react-three/drei";

const ABSOLUTE_URL_PATTERN = /^[a-zA-Z][a-zA-Z\d+\-.]*:/;

const BASE_PATH = (() => {
  if (typeof self === "undefined" || !self.location) return "";
  const segments = self.location.pathname.split("/");
  const workersIndex = segments.lastIndexOf("workers");
  if (workersIndex > 0) {
    const baseSegments = segments.slice(0, workersIndex);
    const base = baseSegments.join("/");
    return base === "/" ? "" : base;
  }
  segments.pop();
  const base = segments.join("/");
  return base === "/" ? "" : base;
})();

const withBasePath = (path) => {
  if (ABSOLUTE_URL_PATTERN.test(path)) {
    return path;
  }

  const normalizedPath = path.startsWith("/") ? path : `/${path}`;

  if (!BASE_PATH) {
    return normalizedPath;
  }

  const normalizedBase = BASE_PATH.endsWith("/")
    ? BASE_PATH.slice(0, -1)
    : BASE_PATH;

  if (normalizedPath === "/") {
    return `${normalizedBase}/`;
  }

  return `${normalizedBase}${normalizedPath}`;
};

const COMPUTER_MODEL_URL = withBasePath("/desktop_pc/scene.glb");

const Computer = ({ isMobile, rotation = [0, 0, 0] }) => {
  try {
    const computer = useGLTF(COMPUTER_MODEL_URL, {
      meshOptimization: true, // Enable mesh optimization
      draco: true, // Enable Draco compression
    });

    return (
      <mesh>
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
        <group rotation={rotation}>
          <primitive
            object={computer.scene}
            scale={isMobile ? 0.32 : 0.65}
            position={isMobile ? [0, -2, -0.5] : [0, -2.7, -1]}
            rotation={[-0.01, -0.2, -0.1]}
            frustumCulled={true}
            castShadow={false}
            receiveShadow={false}
          />
        </group>
      </mesh>
    );
  } catch (error) {
    console.error("Error in ComputerScene worker:", error);
    return null;
  }
};

// Combine base settings with performance optimizations
setup(Computer, {
  gl: {
    preserveDrawingBuffer: true,
    powerPreference: "high-performance",
    antialias: false,
    stencil: false,
    depth: true,
  },
  camera: {
    fov: 25,
    position: [20, 3, 5],
    near: 0.1,
    far: 200,
  },
  dpr: [1, 1.5],
  frameloop: "demand",
  performance: {
    min: 0.5,
    max: 1,
  },
});

// Preload with optimizations
useGLTF.preload(COMPUTER_MODEL_URL, {
  meshOptimization: true,
  draco: true,
});
