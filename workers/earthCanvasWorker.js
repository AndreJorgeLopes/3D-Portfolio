import { setup } from '@react-three/offscreen';
import { useGLTF, OrbitControls } from '@react-three/drei';

const ABSOLUTE_URL_PATTERN = /^[a-zA-Z][a-zA-Z\d+\-.]*:/;

const BASE_PATH = (() => {
	if (typeof self === 'undefined' || !self.location) return '';
	const segments = self.location.pathname.split('/');
	const workersIndex = segments.lastIndexOf('workers');
	if (workersIndex > 0) {
		const baseSegments = segments.slice(0, workersIndex);
		const base = baseSegments.join('/');
		return base === '/' ? '' : base;
	}
	segments.pop();
	const base = segments.join('/');
	return base === '/' ? '' : base;
})();

const withBasePath = path => {
	if (ABSOLUTE_URL_PATTERN.test(path)) {
		return path;
	}

	const normalizedPath = path.startsWith('/') ? path : `/${path}`;

	if (!BASE_PATH) {
		return normalizedPath;
	}

	const normalizedBase = BASE_PATH.endsWith('/') ? BASE_PATH.slice(0, -1) : BASE_PATH;

	if (normalizedPath === '/') {
		return `${normalizedBase}/`;
	}

	return `${normalizedBase}${normalizedPath}`;
};

const EARTH_MODEL_URL = withBasePath('/planet/scene.glb');

const EarthScene = () => {
	try {
		const earth = useGLTF(EARTH_MODEL_URL, {
			meshOptimization: true, // Enable mesh optimization
			draco: true, // Enable Draco compression
		});

		return (
			<>
				<hemisphereLight intensity={0.15} groundColor='black' />
				<spotLight position={[-20, 50, 10]} angle={0.12} penumbra={1} intensity={1} castShadow shadow-mapSize={1024} />
				<pointLight intensity={1} />
				<primitive
					object={earth.scene}
					scale={2.5}
					position-y={0}
					rotation-y={0}
					frustumCulled={true}
					castShadow={false}
					receiveShadow={false}
				/>
				<OrbitControls
					autoRotate
					enableZoom={false}
					maxPolarAngle={Math.PI / 2}
					minPolarAngle={Math.PI / 2}
					enableDamping={false}
					rotateSpeed={0.5}
				/>
			</>
		);
	} catch (error) {
		console.error('Error in EarthScene worker:', error);
		return null;
	}
};

// Combine base settings with performance optimizations
setup(EarthScene, {
	gl: {
		preserveDrawingBuffer: false,
		powerPreference: 'high-performance',
		antialias: false,
		stencil: false,
		depth: true,
	},
	camera: {
		fov: 45,
		near: 0.1,
		far: 200,
		position: [-4, 3, 6],
	},
	dpr: [1, 2],
	frameloop: 'demand',
	performance: {
		min: 0.5,
		max: 1,
	},
});

// Preload with optimizations
useGLTF.preload(EARTH_MODEL_URL, {
	meshOptimization: true,
	draco: true,
});
