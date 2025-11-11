import { Suspense } from "react";
import { useGLTF, OrbitControls, Preload } from "@react-three/drei";
import ModelCanvas from "./ModelCanvas";

const Earth = () => {
  const earth = useGLTF("/planet/scene.glb");

  return (
    <>
      <hemisphereLight intensity={0.15} groundColor="black" />
      <spotLight
        position={[-20, 50, 10]}
        angle={0.12}
        penumbra={1}
        intensity={1}
        castShadow
        shadow-mapSize={1024}
      />
      <pointLight intensity={1} />
      <primitive
        object={earth.scene}
        scale={2.5}
        position-y={0}
        rotation-y={0}
      />
      <OrbitControls
        autoRotate
        enableZoom={false}
        maxPolarAngle={Math.PI / 2}
        minPolarAngle={Math.PI / 2}
      />
    </>
  );
};

const EarthCanvas = () => {
  return (
    <ModelCanvas
      key="earth-canvas"
      workerName="earthCanvasWorker"
      continuousAnimation={true}
      containerClassName="w-full h-full"
      cameraProps={{
        fov: 45,
        near: 0.1,
        far: 200,
        position: [-4, 3, 6],
      }}
      canvasProps={{
        gl: {
          preserveDrawingBuffer: false,
          alpha: true,
          premultipliedAlpha: false,
          antialias: true,
          powerPreference: "high-performance",
        },
        onCreated: ({ gl }) => {
          // Add WebGL context loss/restore handlers
          const canvas = gl.domElement;

          const handleContextLost = (event) => {
            event.preventDefault();
            console.warn("Earth: WebGL context lost, attempting to restore...");
          };

          const handleContextRestored = () => {
            console.log("Earth: WebGL context restored successfully");
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
      <Earth />
    </ModelCanvas>
  );
};

useGLTF.preload("/planet/scene.glb");

export default EarthCanvas;
