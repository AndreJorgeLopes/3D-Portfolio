import { useState, useEffect, useMemo } from 'react';
import { Canvas as DefaultCanvas } from '@react-three/fiber';
import { Canvas as OffscreenCanvas } from '@react-three/offscreen';
import { Suspense } from 'react';
import CanvasLoader from '../components/Loader';

/**
 * Hook for managing 3D canvas rendering with automatic offscreen support
 * @param {Object} options - Configuration options
 * @param {string} options.workerName - Name of the worker file
 * @param {Object} options.canvasProps - Props for the canvas
 * @param {Function} options.onError - Error callback
 * @returns {Object} Configured Canvas component and support info
 */
export function useOffscreenCanvas({ workerName, canvasProps = {}, onError = console.error }) {
	const [isSupported, setIsSupported] = useState(false);

	// Check for offscreen support
	useEffect(() => {
		if (typeof window === 'undefined') return;
		setIsSupported('OffscreenCanvas' in window);
	}, []);

	// Base performance-optimized configuration
	const baseConfig = useMemo(
		() => ({
			dpr: [1, 1.5],
			gl: {
				antialias: false,
				powerPreference: 'high-performance',
				failIfMajorPerformanceCaveat: true,
				alpha: false, // Disable alpha for better performance
				stencil: false,
				depth: true,
			},
			frameloop: 'demand', // Only render when needed
			performance: {
				min: 0.5,
				max: 1,
				debounce: 200, // Debounce performance adjustments
			},
			legacy: false, // Disable legacy mode
		}),
		[]
	);

	// Get worker path based on environment and handle errors
	const workerUrl = useMemo(() => {
		// Use a static import path for webpack
		const workerPath = `/workers/${
			workerName.endsWith('.jsx') || workerName.endsWith('.js') ? workerName : `${workerName}.js`
		}`;

		return {
			development: workerPath,
			production: `${process.env.NEXT_PUBLIC_BASE_PATH || ''}${workerPath}`,
		}[process.env.NODE_ENV || 'development'];
	}, [workerName]);

	// Merge canvas configurations
	const mergedProps = useMemo(
		() => ({
			...baseConfig,
			...canvasProps,
			gl: {
				...baseConfig.gl,
				...canvasProps.gl,
			},
		}),
		[baseConfig, canvasProps]
	);

	// Create configured Canvas component
	const Canvas = useMemo(() => {
		const SelectedCanvas = isSupported ? OffscreenCanvas : DefaultCanvas;

		return function ConfiguredCanvas({ children, ...props }) {
			const finalProps = {
				...mergedProps,
				...props,
				...(isSupported && { workerUrl }),
			};

			return (
				<SelectedCanvas {...finalProps}>
					<Suspense fallback={<CanvasLoader />}>{children}</Suspense>
				</SelectedCanvas>
			);
		};
	}, [isSupported, mergedProps, workerUrl]);

	// Error handling for worker creation
	useEffect(() => {
		if (isSupported) {
			const testWorker = (new Worker(workerUrl).onerror = error => {
				onError(new Error(`Failed to load worker: ${JSON.stringify(error)}`));
				setIsSupported(false);
			});
		}
	}, [isSupported, workerUrl, onError]);

	return {
		Canvas,
		isSupported,
		workerUrl,
	};
}
