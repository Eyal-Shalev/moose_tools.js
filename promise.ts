export function isPromiseLike(value: unknown): value is PromiseLike<unknown> {
  return typeof value === "object" && value !== null &&
    typeof (value as PromiseLike<unknown>).then === "function";
}
