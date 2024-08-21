import type { MuseumDto } from '../dtos/museumDto';
import { PageDto } from '../dtos/pageDto';
import { fetcher } from '../fetcher';

export function getMuseums(page: number = 1, size: number = 20) {
	const searchParams = new URLSearchParams({
		page: page.toString(),
		size: size.toString(),
	});
	return fetcher<PageDto<MuseumDto>>(`/museums?${searchParams.toString()}`);
}
