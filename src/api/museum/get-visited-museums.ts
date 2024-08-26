import { PageDto } from '../dtos/pageDto';
import type { VisitedMuseumDto } from '../dtos/visited-museum-dto';
import { fetcher } from '../fetcher';

export function getVisitedMuseums(
	page: number = 1,
	size: number = 20,
	sort: string
) {
	const searchParams = new URLSearchParams({
		page: page.toString(),
		size: size.toString(),
		sort,
	});

	return fetcher<PageDto<VisitedMuseumDto>>(
		`/museums/visited?${searchParams.toString()}`
	);
}
