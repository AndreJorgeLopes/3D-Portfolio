import { setup } from '@react-three/offscreen';
import { createPortal } from '@react-three/fiber';
import { OrbitControls, Preload, useGLTF } from '@react-three/drei';

// This is just the 3D scene logic that will run in the worker
function WorkerScene({ isMobile }) {
	const computer = useGLTF('/desktop_pc/scene.glb');

	return createPortal(
		<>
			<hemisphereLight intensity={0.15} groundColor='black' />
			<spotLight position={[-20, 50, 10]} angle={0.12} penumbra={1} intensity={1} castShadow shadow-mapSize={1024} />
			<pointLight intensity={1} />
			<primitive
				object={computer.scene}
				scale={isMobile ? 0.32 : 0.65}
				position={isMobile ? [0, -2, -0.5] : [0, -2.7, -1]}
				rotation={[-0.01, -0.2, -0.1]}
			/>
			<Preload all />
		</>,
		null
	);
}

setup(WorkerScene);
