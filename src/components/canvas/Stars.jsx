import { useMemo, useRef } from 'react';
import { Points, PointMaterial } from '@react-three/drei';
import { useFrame } from '@react-three/fiber';
import ModelCanvas from './ModelCanvas';

const Stars = ({ variant = 'default' }) => {
	const ref = useRef();

	// Memoize star positions to prevent recalculation
	const positions = useMemo(() => {
		const count = variant === 'default' ? 5000 : 3000;
		const radius = variant === 'default' ? 1.2 : 1.4;
		const positions = new Float32Array(count * 3);

		for (let i = 0; i < count; i++) {
			const r = variant === 'default' ? radius * Math.random() : radius + 0.4 * Math.random();
			const theta = 2 * Math.PI * Math.random();
			const phi = variant === 'default' ? Math.acos(2 * Math.random() - 1) : Math.random() * Math.PI;

			positions[i * 3] = r * Math.sin(phi) * Math.cos(theta);
			positions[i * 3 + 1] = r * Math.sin(phi) * Math.sin(theta);
			positions[i * 3 + 2] = variant === 'default' ? r * Math.cos(phi) : -Math.abs(r * Math.cos(phi));
		}

		return positions;
	}, [variant]);

	// Optimized animation with delta-based rotation
	const speed = variant === 'default' ? 10 : 40;
	useFrame((_, delta) => {
		if (!ref.current) return;
		ref.current.rotation.x -= delta / speed;
		ref.current.rotation.y -= delta / (speed * 1.5);
	});

	return (
		<group ref={ref} rotation={[0, 0, Math.PI / 4]}>
			<Points positions={positions} stride={3} frustumCulled>
				<PointMaterial
					transparent
					color={variant === 'default' ? '#f272c8' : '#72f2c8'}
					size={variant === 'default' ? 0.002 : 0.001}
					sizeAttenuation={true}
					depthWrite={false}
					// Performance optimizations
					toneMapped={false}
					fog={false}
				/>
			</Points>
		</group>
	);
};

const StarsCanvas = ({ variant = 'default' }) => (
	<ModelCanvas
		workerName='starsCanvasWorker'
		continuousAnimation={true} // Stars need continuous animation
		containerClassName={variant === 'bottom'
			? 'w-full h-full pointer-events-none' // Bottom stars full height as background
			: 'absolute inset-0 w-full h-full z-0 pointer-events-none' // Top stars as background layer
		}
		cameraProps={{
			position: [0, 0, 1],
			fov: 45,
			near: 0.1,
			far: 10,
		}}
		gl={{ antialias: false }}>
		<Stars variant={variant} />
	</ModelCanvas>
);

export default StarsCanvas;
