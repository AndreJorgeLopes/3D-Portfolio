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
export function useOffscreenCanvas({
	workerName,
	canvasProps = {},
	onError = console.error,
	continuousAnimation = false,
}) {
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
				alpha: true, // Enable alpha for transparent backgrounds
				premultipliedAlpha: false, // Important for proper transparency
				stencil: false,
				depth: true,
			},
			frameloop: continuousAnimation ? 'always' : 'demand', // Stars need continuous animation, others can use demand
			performance: {
				min: 0.5,
				max: 1,
				debounce: 200, // Debounce performance adjustments
			},
			legacy: false, // Disable legacy mode
		}),
		[continuousAnimation]
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

	// Create configured Canvas component - disable offscreen for now to avoid worker issues
	const Canvas = useMemo(() => {
		// Always use DefaultCanvas for stability
		const SelectedCanvas = DefaultCanvas;

		return function ConfiguredCanvas({ children, ...props }) {
			const finalProps = {
				...mergedProps,
				...props,
			};

			return (
				<SelectedCanvas {...finalProps}>
					<Suspense fallback={<CanvasLoader />}>{children}</Suspense>
				</SelectedCanvas>
			);
		};
	}, [mergedProps]);

	return {
		Canvas,
		isSupported,
		workerUrl,
	};
}
