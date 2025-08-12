import { GLTFLoader } from 'three-stdlib';

const loader = new GLTFLoader();

self.onmessage = e => {
	const { url } = e.data;
	loader.load(
		url,
		gltf => {
			self.postMessage({ type: 'SUCCESS', gltf: gltf.scene.toJSON() });
		},
		undefined,
		error => {
			self.postMessage({ type: 'ERROR', error: error.message });
		}
	);
};
