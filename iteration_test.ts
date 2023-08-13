import { memo, range, repeat, take } from "./iteration.ts";
import { assertEquals } from "https://deno.land/std@0.195.0/assert/assert_equals.ts";
import { describe, it } from "https://deno.land/std@0.195.0/testing/bdd.ts";

describe("iteration", function () {
	describe("range", function () {
		it("should return an iterable of numbers from start (inclusive) to end (exclusive) by step", function () {
			const iterator = range(-3, 3, 1.5);
			const result = [...iterator];
			assertEquals(result, [-3, -1.5, 0, 1.5]);
		});
		it("", function () {
			const iterator = range();
			assertEquals(Array.from(take(iterator, 3)), [0, 1, 2]);
			assertEquals(Array.from(take(iterator, 3)), [3, 4, 5]);
		});
	});

	describe("repeat", function () {
		it("should return an iterable of the same value repeated", function () {
			const foo = Symbol("foo");
			const iterator = repeat(foo, 3);
			assertEquals([...iterator], [foo, foo, foo]);
		});
	});

	describe("memo", function () {
		it("should return an iterable that caches the values of the original iterable", function () {
			const memoed = memo(range());
			assertEquals([...take(memoed, 3)], [0, 1, 2]);
			assertEquals([...take(memoed, 3)], [0, 1, 2]);
			assertEquals([...take(memoed, 3)], [0, 1, 2]);
		});
	});
});
