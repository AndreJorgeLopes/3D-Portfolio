import { useMemo } from 'react';

export const useTextVariant = delay => {
	return useMemo(
		() => ({
			hidden: {
				y: -50,
				opacity: 0,
			},
			show: {
				y: 0,
				opacity: 1,
				transition: {
					type: 'spring',
					duration: 1.25,
					delay: delay,
				},
			},
		}),
		[delay]
	);
};

export const useFadeIn = (direction, type, delay, duration) => {
	return useMemo(
		() => ({
			hidden: {
				x: direction === 'left' ? 100 : direction === 'right' ? -100 : 0,
				y: direction === 'up' ? 100 : direction === 'down' ? -100 : 0,
				opacity: 0,
			},
			show: {
				x: 0,
				y: 0,
				opacity: 1,
				transition: {
					type: type,
					delay: delay,
					duration: duration,
					ease: 'easeOut',
				},
			},
		}),
		[direction, type, delay, duration]
	);
};

export const useSlideIn = (direction, type, delay, duration) => {
	return useMemo(
		() => ({
			hidden: {
				x: direction === 'left' ? '-100%' : direction === 'right' ? '100%' : 0,
				y: direction === 'up' ? '100%' : direction === 'down' ? '100%' : 0,
			},
			show: {
				x: 0,
				y: 0,
				transition: {
					type: type,
					delay: delay,
					duration: duration,
					ease: 'easeOut',
				},
			},
		}),
		[direction, type, delay, duration]
	);
};

export const useStaggerContainer = (staggerChildren, delayChildren) => {
	return useMemo(
		() => ({
			hidden: {},
			show: {
				transition: {
					staggerChildren: staggerChildren,
					delayChildren: delayChildren || 0,
				},
			},
		}),
		[staggerChildren, delayChildren]
	);
};
