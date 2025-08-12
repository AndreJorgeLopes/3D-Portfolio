import { useRef, useEffect } from 'react';
import { Preload } from '@react-three/drei';
import { useOffscreenCanvas } from '../../hooks/useOffscreenCanvas';

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

	// Event handlers
	useEffect(() => {
		const container = containerRef.current;
		if (!container) return;

		// Handle resize
		if (onResize) {
			const observer = new ResizeObserver(onResize);
			observer.observe(container);
			onResize();
			return () => observer.disconnect();
		}
	}, [onResize]);

	useEffect(() => {
		const container = containerRef.current;
		if (!container || !onMouseMove) return;

		container.addEventListener('mousemove', onMouseMove, { passive: true });
		return () => container.removeEventListener('mousemove', onMouseMove);
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
