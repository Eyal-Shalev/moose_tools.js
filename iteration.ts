export type TypedIterable<T, TReturn = void, TNext = never> = Iterable<T> & {
	[Symbol.iterator](): Iterator<T, TReturn, TNext>;
};

/**
 * Returns an iterable of numbers from start (inclusive) to end (exclusive) by step.
 */
export function range(
	start = 0,
	end = Infinity,
	step = 1,
): TypedIterable<number> {
	return {
		*[Symbol.iterator](): Iterator<number, void, never> {
			for (let i = start; i < end; i += step) {
				yield i;
			}
		},
	};
}


/**
 * Returns an iterable of numbers from start (inclusive) to end (exclusive) by step.
 */
export function repeat<T>(value: T, times = Infinity): TypedIterable<T> {
	return {
		*[Symbol.iterator](): Iterator<T, void, never> {
			for (let i = 0; i < times; i++) {
				yield value;
			}
		},
	};
}
