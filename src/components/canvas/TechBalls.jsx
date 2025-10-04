import React, { Suspense, useMemo, useCallback, useState } from 'react';
import { Canvas } from '@react-three/fiber';
import { Decal, useTexture } from '@react-three/drei';
import CanvasLoader from '../Loader';

const Ball = ({ imgUrl, position }) => {
	const [decal] = useTexture([imgUrl]);

	return (
		<mesh castShadow receiveShadow scale={0.9} position={position}>
			<icosahedronGeometry args={[1, 1]} />
			<meshStandardMaterial color='#fff8eb' polygonOffset polygonOffsetFactor={-5} flatShading />
			<Decal position={[0, 0, 1]} rotation={[2 * Math.PI, 0, 6.25]} scale={1} flatShading map={decal} />
		</mesh>
	);
};

const TechBallsCanvas = ({ technologies }) => {
	const [mouseX, setMouseX] = useState(0);

	const handleMouseMove = useCallback(event => {
		const moveX = (event.clientX / window.innerWidth - 0.5) * 2;
		setMouseX(moveX);
	}, []);

	const ballPositions = useMemo(() => {
		const cols = 5;
		const spacing = 2.5;
		const startX = -(cols - 1) * spacing / 2;
		const startY = (Math.ceil(technologies.length / cols) - 1) * spacing / 2;

		return technologies.map((_, index) => {
			const col = index % cols;
			const row = Math.floor(index / cols);
			return [startX + col * spacing, startY - row * spacing, 0];
		});
	}, [technologies]);

	return (
		<div className='w-full h-[400px]' onMouseMove={handleMouseMove}>
			<Canvas
				frameloop='demand'
				dpr={[1, 1.5]}
				gl={{
					preserveDrawingBuffer: false,
					antialias: false,
					powerPreference: 'high-performance',
				}}
				camera={{ position: [0, 0, 12], fov: 45 }}>
				<Suspense fallback={<CanvasLoader />}>
					<ambientLight intensity={0.25} />
					<directionalLight position={[0, 0, 0.05]} />
					<group rotation={[0, mouseX * 0.3, 0]}>
						{technologies.map((tech, index) => (
							<Ball key={tech.name} imgUrl={tech.icon.src} position={ballPositions[index]} />
						))}
					</group>
				</Suspense>
			</Canvas>
		</div>
	);
};

export default TechBallsCanvas;
