import { useState, useCallback } from 'react';
import { useGLTF } from '@react-three/drei';
import ModelCanvas from './ModelCanvas';
// import { useWorkerGLTF } from '../../hooks/useWorkerGLTF'; // Backup loading strategy

const Computer = ({ isMobile }) => {
	// Primary rendering strategy
	const computer = useGLTF('/desktop_pc/scene.glb');

	/* Backup GLTF worker loading strategy - uncomment if needed
  const { scene, error } = useWorkerGLTF('/desktop_pc/scene.glb');
  if (error) {
    console.error('GLTF loading error:', error);
    return null;
  }
  const computer = { scene };
  */

	return (
		<mesh>
			<ambientLight intensity={1} />
			<directionalLight position={[5, 5, 5]} intensity={1} />
			<directionalLight position={[-5, -5, -5]} intensity={1} />
			<spotLight position={[-20, 50, 10]} angle={0.12} penumbra={1} intensity={1} castShadow shadow-mapSize={1024} />
			<primitive
				object={computer.scene}
				scale={isMobile ? 0.32 : 0.65}
				position={isMobile ? [0, -2, -0.5] : [0, -2.7, -1]}
				rotation={[-0.01, -0.2, -0.1]}
			/>
		</mesh>
	);
};

const ComputersCanvas = () => {
	const [isMobile, setIsMobile] = useState(false);
	const [rotation, setRotation] = useState([0, 0, 0]);

	const handleResize = useCallback(entries => {
		if (!entries?.[0]) return;
		const width = entries[0].contentRect.width;
		setIsMobile(width < 900);
	}, []);

	const handleMouseMove = useCallback(e => {
		const rect = e.currentTarget.getBoundingClientRect();
		const x = e.clientX - rect.left;
		const moveX = (x / rect.width - 0.5) * 2;
		setRotation([0, moveX * 0.5, 0]);
	}, []);

	return (
		<ModelCanvas
			workerName='computerCanvasWorker'
			cameraProps={{ position: [20, 3, 5], fov: 25 }}
			onResize={handleResize}
			onMouseMove={handleMouseMove}>
			<group rotation={rotation}>
				<Computer isMobile={isMobile} />
			</group>
		</ModelCanvas>
	);
};

useGLTF.preload('/desktop_pc/scene.glb');

export default ComputersCanvas;
