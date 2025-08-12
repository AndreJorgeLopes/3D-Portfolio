import { setup } from '@react-three/offscreen';
import { Decal, useTexture } from '@react-three/drei';
import { useMemo } from 'react';

const BallScene = ({ imgUrl }) => {
	try {
		const [decal] = useTexture([imgUrl]);

		// Memoize geometry and material for better performance
		const geometry = useMemo(() => new THREE.IcosahedronGeometry(1, 1), []);
		const material = useMemo(
			() =>
				new THREE.MeshStandardMaterial({
					color: '#fff8eb',
					polygonOffset: true,
					polygonOffsetFactor: -5,
					flatShading: true,
					// Performance optimizations
					toneMapped: false,
					fog: false,
				}),
			[]
		);

		return (
			<>
				<ambientLight intensity={0.25} />
				<directionalLight position={[0, 0, 0.05]} />
				<mesh castShadow receiveShadow scale={1} geometry={geometry} material={material} frustumCulled={true}>
					<Decal position={[0, 0, 1]} rotation={[2 * Math.PI, 0, 6.25]} scale={1} flatShading map={decal} />
				</mesh>
			</>
		);
	} catch (error) {
		console.error('Error in BallScene worker:', error);
		return null;
	}
};

// Combine base settings with performance optimizations
setup(BallScene, {
	gl: {
		preserveDrawingBuffer: true,
		powerPreference: 'high-performance',
		antialias: false,
		stencil: false,
		depth: true,
	},
	camera: {
		position: [0, 0, 4],
		fov: 45,
	},
	dpr: [1, 1.5],
	frameloop: 'demand',
	performance: {
		min: 0.5,
		max: 1,
	},
});
