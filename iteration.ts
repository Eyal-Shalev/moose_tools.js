export type TypedIterable<T, TReturn = void, TNext = undefined> = {
	[Symbol.iterator](): Iterator<T, TReturn, TNext>;
};

export type TypedIterableIterator<T, TReturn = void, TNext = undefined> =
	& Iterator<T, TReturn, TNext>
	& TypedIterable<T, TReturn, TNext>;

export type BetterGenerator<T, TReturn = void, TNext = undefined> = Generator<
	T,
	TReturn,
	TNext
>;

export type IterableOrIterator<T, TReturn = void, TNext = undefined> =
	| TypedIterable<T, TReturn, TNext>
	| Iterator<T, TReturn, TNext>;


export function range(): BetterGenerator<number>;
export function range(stop: number): BetterGenerator<number>;
export function range(start: number, stop: number): BetterGenerator<number>;
export function range(start: number, stop: number, step: number): BetterGenerator<number>;

/**
 * Returns an iterable of numbers from start (inclusive) to end (exclusive) by step.
 */
export function* range(...args: [] | [end: number] | [start: number, end: number] | [start: number, end: number, step: number]): BetterGenerator<number> {
	args = args.length === 0 ? [0, Infinity, 1] : args;
	args = args.length === 1 ? [0, args[0], 1] : args;
	args = args.length === 2 ? [...args, 1] : args;
	const [start, end, step] = args;
	for (let i = start; i < end; i += step) {
		yield i;
	}
}

/**
 * Returns an iterable of numbers from start (inclusive) to end (exclusive) by step.
 */
export function* repeat<T>(value: T, times = Infinity): BetterGenerator<T> {
	if (times < 0) throw new RangeError(`times must be >= 0`);
	for (let i = 0; i < times; i++) {
		yield value;
	}
}

export function memo<T, TNext = undefined>(
	iterableOrIterator: IterableOrIterator<T, void, TNext>,
): TypedIterable<T, void, TNext> {
	const cache: T[] = [];
	const iterator = iteratorFromIterable(iterableOrIterator);
	let nextParams: [] | [TNext] = [];
	return {
		*[Symbol.iterator](): Iterator<T, void, TNext> {
			for (const value of cache) {
				yield value;
			}
			let result = iterator.next(...nextParams);
			while (!result.done) {
				cache.push(result.value);
				const nextParam = yield result.value;
				nextParams = nextParam === undefined ? [] : [nextParam];
				result = iterator.next(...nextParams);
			}
		},
	};
}

export function take<T, TReturn = void, TNext = unknown>(
	iterableOrIterator: IterableOrIterator<T, TReturn, TNext>,
	count = 1,
): TypedIterable<T, TReturn | void, TNext> {
	if (count < 0) throw new RangeError(`count must be >= 0`);
	const iterator = iteratorFromIterable(iterableOrIterator);
	return {
		*[Symbol.iterator](): Iterator<T, TReturn | void, TNext> {
			let nextParam: TNext | undefined = undefined;
			for (let i = 0; i < count; i++) {
				const nextParams: [] | [TNext] = nextParam === undefined
					? []
					: [nextParam];
				const result = iterator.next(...nextParams);
				if (!result.done) {
					nextParam = yield result.value;
				} else {
					return result.value;
				}
			}
		},
	};
}

export function* takeLast<T>(
	list: ArrayLike<T>,
	count = 1,
): BetterGenerator<T> {
	if (count < 0) throw new RangeError(`count must be >= 0`);
	for (let i = list.length - 1; i >= 0 && i >= count; i--) {
		yield list[i];
	}
}

export function isIterable(obj: unknown): obj is TypedIterable<unknown> {
	return typeof obj === "object" && !!obj && Symbol.iterator in obj &&
		typeof obj[Symbol.iterator] === "function";
}

/**
 * Returns an iterator from an iterable or iterator.
 */
function iteratorFromIterable<T, TReturn = void, TNext = undefined>(
	iter: TypedIterable<T, TReturn, TNext> | Iterator<T, TReturn, TNext>,
): Iterator<T, TReturn, TNext> {
	if (Symbol.iterator in iter) {
		return iter[Symbol.iterator]();
	}
	return iter;
}
