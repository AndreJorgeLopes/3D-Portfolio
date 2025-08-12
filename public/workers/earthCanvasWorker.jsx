import { setup } from '@react-three/offscreen';
import { useGLTF } from '@react-three/drei';

const EarthScene = () => {
	const earth = useGLTF('/planet/scene.glb');

	return (
		<>
			<hemisphereLight intensity={0.15} groundColor='black' />
			<spotLight position={[-20, 50, 10]} angle={0.12} penumbra={1} intensity={1} castShadow shadow-mapSize={1024} />
			<pointLight intensity={1} />
			<primitive object={earth.scene} scale={2.5} position-y={0} rotation-y={0} />
		</>
	);
};

setup(EarthScene);

useGLTF.preload('/planet/scene.glb');
