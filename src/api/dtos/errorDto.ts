export interface ErrorDto {
	timestamp: string;
	code: string;
	message: string;
}

export function isErrorDto(object: any): object is ErrorDto {
	return 'timestamp' in object && 'code' in object && 'message' in object;
}
