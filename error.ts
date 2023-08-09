export class ErrorWrapper extends Error {
	constructor(cause: unknown) {
		super(String(cause), { cause });
	}
}

export function ensureError(error: unknown): Error {
	if (error instanceof Error) {
		return error;
	}
	return new ErrorWrapper(error);
}
