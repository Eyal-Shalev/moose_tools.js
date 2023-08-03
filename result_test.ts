import {resultify} from "./result.ts";
import {describe, it} from "https://deno.land/std@0.195.0/testing/bdd.ts";
import {assertEquals} from "https://deno.land/std@0.195.0/assert/assert_equals.ts";

const someError = new Error("someError");

function thrower(error = someError) {
	throw error;
}

function rejecter(error = someError) {
	return Promise.reject(error);
}

describe("result", function () {
	describe("resultify", function () {
		describe("when the function throws", function () {
			it("should return a result tuple", function () {
				const result = resultify(thrower)();
				assertEquals(result, [undefined, someError]);
			});

			it("should return a result tuple from a promise", async function () {
				const result = await resultify(rejecter)();
				assertEquals(result, [undefined, someError]);
			});
		});

		describe("when the function does not throw", function () {
			it("should return a result tuple", function () {
				const result = resultify(() => 42)();
				assertEquals(result, [42, undefined]);
			});

			it("should return a result tuple from a promise", async function () {
				const result = await resultify(() => Promise.resolve(42))();
				assertEquals(result, [42, undefined]);
			});
		});
	});
});
