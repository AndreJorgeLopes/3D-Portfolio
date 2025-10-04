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
		<div className='relative w-full h-[550px]'>
			<ModelCanvas
				workerName='earthCanvasWorker'
				cameraProps={{
					fov: 45,
					near: 0.1,
					far: 200,
					position: [-4, 3, 6],
				}}
				gl={{ preserveDrawingBuffer: false }}>
				<Earth />
			</ModelCanvas>
		</div>
	);
};

useGLTF.preload('/planet/scene.glb');

export default EarthCanvas;
