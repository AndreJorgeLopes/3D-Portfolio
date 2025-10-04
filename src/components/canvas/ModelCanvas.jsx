import { useRef, useEffect, useMemo, useCallback } from 'react';
import { Preload } from '@react-three/drei';
import { useOffscreenCanvas } from '../../hooks/useOffscreenCanvas';
import { throttle, debounce } from '../../utils/throttle';

/**
 * Wrapper component for 3D model canvases
 * Handles layout and events while delegating rendering to useOffscreenCanvas
 */
const ModelCanvas = ({
	children,
	workerName,
	cameraProps,
	onResize,
	onMouseMove,
	containerClassName = 'w-full h-screen',
	containerStyle = {},
	canvasProps = {},
}) => {
	const containerRef = useRef(null);

	// Initialize canvas with offscreen support and performance settings
	const { Canvas, isSupported } = useOffscreenCanvas({
		workerName,
		canvasProps: {
			...canvasProps,
			camera: cameraProps,
			shadows: true,
			dpr: [1, 2],
			gl: {
				...canvasProps.gl,
				preserveDrawingBuffer: false,
				powerPreference: 'high-performance',
			},
			// Use frameloop='demand' for better performance
			frameloop: 'demand',
			// Performance optimization
			performance: {
				min: 0.5,
				max: 1,
			},
		},
		onError: error => {
			console.error('Canvas error:', error);
			// Fallback to regular canvas if worker fails
			return false;
		},
	});

	// Handle strict mode double mounting
	useEffect(() => {
		if (isSupported) {
			const cleanup = () => {
				// Force cleanup of any existing workers
				window.location.reload();
			};
			window.addEventListener('beforeunload', cleanup);
			return () => window.removeEventListener('beforeunload', cleanup);
		}
	}, [isSupported]);

	// Memoize throttled/debounced handlers
	const throttledMouseMove = useMemo(() => (onMouseMove ? throttle(onMouseMove, 16) : null), [onMouseMove]);

	const debouncedResize = useMemo(() => (onResize ? debounce(onResize, 150) : null), [onResize]);

	// Event handlers
	useEffect(() => {
		const container = containerRef.current;
		if (!container) return;

		if (debouncedResize) {
			const observer = new ResizeObserver(debouncedResize);
			observer.observe(container);
			debouncedResize();
			return () => observer.disconnect();
		}
	}, [debouncedResize]);

	useEffect(() => {
		const container = containerRef.current;
		if (!container || !throttledMouseMove) return;

		container.addEventListener('mousemove', throttledMouseMove, { passive: true });
		return () => container.removeEventListener('mousemove', throttledMouseMove);
	}, [throttledMouseMove]);

	if (!Canvas) return null;

	return (
		<div ref={containerRef} className={containerClassName} style={containerStyle}>
			<Canvas>
				{children}
				<Preload all />
			</Canvas>
		</div>
	);
};

export default ModelCanvas;
