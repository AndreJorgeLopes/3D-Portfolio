import { setup } from '@react-three/offscreen';
import { useGLTF } from '@react-three/drei';

const Computer = ({ isMobile }) => {
	try {
		const computer = useGLTF('/desktop_pc/scene.glb', {
			meshOptimization: true, // Enable mesh optimization
			draco: true, // Enable Draco compression
		});

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
					frustumCulled={true}
					castShadow={false}
					receiveShadow={false}
				/>
			</mesh>
		);
	} catch (error) {
		console.error('Error in ComputerScene worker:', error);
		return null;
	}
};

// Combine base settings with performance optimizations
setup(Computer, {
	gl: {
		preserveDrawingBuffer: true,
		powerPreference: 'high-performance',
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
	frameloop: 'demand',
	performance: {
		min: 0.5,
		max: 1,
	},
});

// Preload with optimizations
useGLTF.preload('/desktop_pc/scene.glb', {
	meshOptimization: true,
	draco: true,
});
