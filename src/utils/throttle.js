export function throttle(func, wait) {
	let timeout;
	let lastRan;

	return function executedFunction(...args) {
		const context = this;

		if (!lastRan) {
			func.apply(context, args);
			lastRan = Date.now();
		} else {
			clearTimeout(timeout);
			timeout = setTimeout(
				function () {
					if (Date.now() - lastRan >= wait) {
						func.apply(context, args);
						lastRan = Date.now();
					}
				},
				wait - (Date.now() - lastRan)
			);
		}
	};
}

export function debounce(func, wait) {
	let timeout;

	return function executedFunction(...args) {
		const context = this;

		clearTimeout(timeout);
		timeout = setTimeout(() => func.apply(context, args), wait);
	};
}
