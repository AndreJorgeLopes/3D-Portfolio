import { setup } from '@react-three/offscreen';
import { Points, PointMaterial } from '@react-three/drei';

const StarScene = ({ variant = 'default' }) => {
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

	return (
		<group rotation={[0, 0, Math.PI / 4]}>
			<Points positions={positions} stride={3} frustumCulled>
				<PointMaterial
					transparent
					color={variant === 'default' ? '#f272c8' : '#72f2c8'}
					size={variant === 'default' ? 0.002 : 0.001}
					sizeAttenuation={true}
					depthWrite={false}
				/>
			</Points>
		</group>
	);
};

setup(StarScene);
