import { useEffect } from 'react';
import { AnimatePresence } from 'framer-motion';
import './index.css';

function MyApp({ Component, pageProps }) {
	useEffect(() => {
		const registerServiceWorker = async () => {
			try {
				const registration = await navigator.serviceWorker.register('/sw.js', {
					scope: '/',
				});

				// Handle updates
				registration.addEventListener('updatefound', () => {
					const newWorker = registration.installing;
					newWorker.addEventListener('statechange', () => {
						if (newWorker.state === 'installed' && navigator.serviceWorker.controller) {
							newWorker.postMessage('SKIP_WAITING');
						}
					});
				});

				// Handle controller change
				navigator.serviceWorker.addEventListener('controllerchange', () => {
					window.location.reload();
				});
			} catch (error) {
				console.error('Service worker registration failed:', error);
			}
		};

		const preloadModels = async () => {
			const models = ['/desktop_pc/scene.glb', '/planet/scene.glb'];

			if (!('caches' in window)) return;

			for (const model of models) {
				try {
					const cache = await caches.open('3d-portfolio-cache-v1');
					const cached = await cache.match(model);

					if (!cached) {
						const response = await fetch(model);
						if (response.ok) {
							await cache.put(model, response);
						}
					}
				} catch (error) {
					console.error(`Failed to preload model ${model}:`, error);
				}
			}
		};

		// Only run on client side
		if (typeof window !== 'undefined') {
			// Register SW if supported
			if ('serviceWorker' in navigator) {
				window.addEventListener('load', registerServiceWorker);
			}

			// Start preloading models
			preloadModels();

			// Request persistent storage for better caching
			if (navigator.storage && navigator.storage.persist) {
				navigator.storage.persist().then(isPersisted => {
					if (isPersisted) {
						console.log('Storage will not be cleared except by explicit user action');
					}
				});
			}
		}
	}, []);

	return (
		<AnimatePresence mode='wait'>
			<Component {...pageProps} />
		</AnimatePresence>
	);
}

export default MyApp;
