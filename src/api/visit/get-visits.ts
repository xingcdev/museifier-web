import { PageDto } from '../dtos/pageDto';
import type { VisitDto } from '../dtos/visitDto';
import { fetcher } from '../fetcher';

export function getVisits(page: number = 1, size: number = 20) {
	const searchParams = new URLSearchParams({
		page: page.toString(),
		size: size.toString(),
	});
	return fetcher<PageDto<VisitDto>>(`/visits?${searchParams.toString()}`);
}
