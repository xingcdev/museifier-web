// Used for paginated response
export interface PageDto<T> {
	data: T[];
	pageInfo: {
		page: number;
		size: number;
		totalResults: number;
		totalPages: number;
		last: boolean;
	};
}
