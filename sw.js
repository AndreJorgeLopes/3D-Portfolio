const CACHE_NAME = '3d-portfolio-cache-v1';
const MODEL_URLS = ['/desktop_pc/scene.glb', '/planet/scene.glb'];

self.addEventListener('install', event => {
	// Pre-cache model files
	event.waitUntil(
		(async () => {
			const cache = await caches.open(CACHE_NAME);
			await cache.addAll(MODEL_URLS);
			self.skipWaiting();
		})()
	);
});

self.addEventListener('activate', event => {
	event.waitUntil(
		(async () => {
			const keys = await caches.keys();
			await Promise.all(
				keys.map(key => {
					if (key !== CACHE_NAME) {
						return caches.delete(key);
					}
				})
			);
			self.clients.claim();
		})()
	);
});

// Stale-while-revalidate for .glb files
self.addEventListener('fetch', event => {
	const { request } = event;

	// Only handle .glb files
	if (!request.url.endsWith('.glb')) return;

	event.respondWith(
		(async () => {
			const cache = await caches.open(CACHE_NAME);
			const cachedResponse = await cache.match(request);

			const networkFetch = fetch(request)
				.then(async response => {
					if (response && response.status === 200) {
						const clone = response.clone();
						const cache = await caches.open(CACHE_NAME);
						await cache.put(request, clone);
					}
					return response;
				})
				.catch(err => {
					console.error('Fetch failed:', err);
					return null;
				});

			return cachedResponse || networkFetch;
		})()
	);
});

// Handle skip waiting
self.addEventListener('message', event => {
	if (event.data === 'SKIP_WAITING') {
		self.skipWaiting();
	}
});

// Additional optimization: Background sync for model updates
self.addEventListener('sync', event => {
	if (event.tag === 'update-models') {
		event.waitUntil(
			(async () => {
				for (const url of MODEL_URLS) {
					try {
						const response = await fetch(url);
						if (response.ok) {
							const cache = await caches.open(CACHE_NAME);
							await cache.put(url, response);
						}
					} catch (error) {
						console.error(`Failed to update model ${url}:`, error);
					}
				}
			})()
		);
	}
});
