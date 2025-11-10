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
	continuousAnimation = false, // Add support for continuous animation (needed for Stars)
}) => {
	const containerRef = useRef(null);

	// Initialize canvas with offscreen support and performance settings
	const { Canvas, isSupported } = useOffscreenCanvas({
		workerName,
		continuousAnimation, // Pass through the continuous animation flag
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

	// Removed forced reload cleanup that caused remount races with Offscreen Canvas
	// Strict Mode double-mount is safe; @react-three/offscreen handles internal cleanup.

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

		container.addEventListener('mousemove', onMouseMove, { passive: true });
		return () => {
			// Fix: Check if container still exists before removing listener
			if (container && container.removeEventListener) {
				container.removeEventListener('mousemove', onMouseMove);
			}
		};
	}, [onMouseMove]);

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
