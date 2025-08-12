import React, { Suspense, useState, useEffect } from 'react';
import { Canvas } from '@react-three/fiber';
import { Decal, Preload, useTexture } from '@react-three/drei';

import CanvasLoader from '../Loader';

const Ball = props => {
	const [decal] = useTexture([props.imgUrl]);

	return (
		<>
			<ambientLight intensity={0.25} />
			<directionalLight position={[0, 0, 0.05]} />
			<mesh castShadow receiveShadow scale={1}>
				<icosahedronGeometry args={[1, 1]} />
				<meshStandardMaterial color='#fff8eb' polygonOffset polygonOffsetFactor={-5} flatShading />
				<Decal position={[0, 0, 1]} rotation={[2 * Math.PI, 0, 6.25]} scale={1} flatShading map={decal} />
			</mesh>
		</>
	);
};

const BallCanvas = ({ icon }) => {
	const [rotation, setRotation] = useState([0, 0, 0]);

	useEffect(() => {
		const handleMouseMove = event => {
			const { clientX } = event;
			const moveX = (clientX / window.innerWidth - 0.5) * 2;
			setRotation([0, moveX * 0.5, 0]);
		};

		window.addEventListener('mousemove', handleMouseMove);

		return () => {
			window.removeEventListener('mousemove', handleMouseMove);
		};
	}, []);

	return (
		<div className='w-28 h-28'>
			<Canvas
				frameloop='demand'
				dpr={[1, 1.5]}
				gl={{ preserveDrawingBuffer: true }}
				camera={{ position: [0, 0, 4], fov: 45 }}>
				<Suspense fallback={<CanvasLoader />}>
					<group rotation={rotation}>
						<Ball imgUrl={icon.src} />
					</group>
				</Suspense>
				<Preload all />
			</Canvas>
		</div>
	);
};

export default BallCanvas;
