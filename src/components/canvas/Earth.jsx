import { Suspense } from 'react';
import { useGLTF, OrbitControls, Preload } from '@react-three/drei';
import ModelCanvas from './ModelCanvas';

const Earth = () => {
	const earth = useGLTF('/planet/scene.glb');

	return (
		<>
			<hemisphereLight intensity={0.15} groundColor='black' />
			<spotLight position={[-20, 50, 10]} angle={0.12} penumbra={1} intensity={1} castShadow shadow-mapSize={1024} />
			<pointLight intensity={1} />
			<primitive object={earth.scene} scale={2.5} position-y={0} rotation-y={0} />
			<OrbitControls autoRotate enableZoom={false} maxPolarAngle={Math.PI / 2} minPolarAngle={Math.PI / 2} />
		</>
	);
};

const EarthCanvas = () => {
	return (
		<ModelCanvas
			workerName='earthCanvasWorker'
			containerClassName='w-full h-full'
			cameraProps={{
				fov: 45,
				near: 0.1,
				far: 200,
				position: [-4, 3, 6],
			}}
			canvasProps={{
				gl: {
					preserveDrawingBuffer: false,
					alpha: true, // Ensure transparent background
					premultipliedAlpha: false
				}
			}}>
			<Earth />
		</ModelCanvas>
	);
};

useGLTF.preload('/planet/scene.glb');

export default EarthCanvas;
