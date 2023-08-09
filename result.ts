import { isPromiseLike } from "./promise.ts";
import { ensureError } from "./error.ts";

export type RValue<T> = [T, undefined];
export type RError<E extends Error = Error> = [undefined, E];
export type Result<T, E extends Error = Error> = RValue<T> | RError<E>;

export function resultify<TArgs extends unknown[], TReturn>(
	fn: (...args: TArgs) => TReturn,
): (...args: TArgs) => Result<Awaited<TReturn>>;
export function resultify<TArgs extends unknown[], TReturn>(
	fn: (...args: TArgs) => PromiseLike<TReturn>,
): (...args: TArgs) => PromiseLike<Result<Awaited<TReturn>>>;

/**
 * Wraps a function to return a result tuple instead of throwing.
 * If the function returns a promise-like, the result tuple will be wrapped in a promise-like as well..
 */
export function resultify<TArgs extends unknown[], TReturn>(
	fn: (...args: TArgs) => TReturn | PromiseLike<TReturn>,
) {
	return (...args: TArgs) => {
		try {
			const value = fn(...args);
			if (isPromiseLike(value)) {
				return value.then(
					(value) => [value, undefined],
					(error) => [undefined, ensureError(error)],
				);
			}
			return [value, undefined];
		} catch (e) {
			return [undefined, ensureError(e)];
		}
	};
}
