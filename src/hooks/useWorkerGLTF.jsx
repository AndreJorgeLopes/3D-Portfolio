import { useEffect, useState, useCallback } from 'react';
import { ObjectLoader } from 'three';

export function useWorkerGLTF(url) {
	const [state, setState] = useState({
		scene: null,
		error: null,
		isLoading: true,
	});

	const handleWorkerMessage = useCallback(e => {
		const { type, gltf, error: workerError } = e.data;

		if (type === 'SUCCESS') {
			const loader = new ObjectLoader();
			const loadedScene = loader.parse(gltf);
			setState({ scene: loadedScene, error: null, isLoading: false });
		} else if (type === 'ERROR') {
			setState({ scene: null, error: workerError, isLoading: false });
		}
	}, []);

	const handleWorkerError = useCallback(error => {
		setState({ scene: null, error: error.message, isLoading: false });
	}, []);

	useEffect(() => {
		let worker;
		let isMounted = true;

		async function loadWithWorker() {
			if (!url) {
				setState({ scene: null, error: 'No URL provided', isLoading: false });
				return;
			}

			try {
				setState(prev => ({ ...prev, isLoading: true, error: null }));
				worker = new Worker(new URL('../workers/gltfWorker.js', import.meta.url));

				worker.onmessage = e => {
					if (isMounted) {
						handleWorkerMessage(e);
					}
				};

				worker.onerror = error => {
					if (isMounted) {
						handleWorkerError(error);
					}
				};

				worker.postMessage({ url });
			} catch (err) {
				if (isMounted) {
					setState({ scene: null, error: err.message, isLoading: false });
				}
			}
		}

		loadWithWorker();

		return () => {
			isMounted = false;
			if (worker) {
				worker.terminate();
			}
		};
	}, [url, handleWorkerMessage, handleWorkerError]);

	return state;
}
