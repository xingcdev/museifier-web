import { PageDto } from '../dtos/pageDto';
import type { PaginationDto } from '../dtos/pagination-dto';
import type { SearchingDto } from '../dtos/searching-dto';
import type { SortingDto } from '../dtos/sorting-dto';
import type { VisitedMuseumDto } from '../dtos/visited-museum-dto';
import { fetcher } from '../fetcher';
import type { MuseumFilterCriteriaDto } from './museum-filter-criteria-dto';

export interface GetVisitedMuseumsParams
	extends PaginationDto,
		SearchingDto,
		SortingDto,
		MuseumFilterCriteriaDto {}

export function getVisitedMuseums(params: GetVisitedMuseumsParams) {
	const searchParams = new URLSearchParams({
		page: params.page.toString(),
		size: params.size.toString(),
	});
	if (params.q) {
		searchParams.append('q', params.q);
	}
	if (params.sort) {
		searchParams.append('sort', params.sort);
	}
	if (params.city) {
		searchParams.append('city', params.city);
	}
	if (params.department) {
		searchParams.append('department', params.department);
	}
	if (params.postalCode) {
		searchParams.append('postalCode', params.postalCode);
	}

	return fetcher<PageDto<VisitedMuseumDto>>(
		`/museums/visited?${searchParams.toString()}`
	);
}
