import type { VisitDto } from '../dtos/visitDto';
import { fetcher } from '../fetcher';

export function getVisit(id: string) {
	return fetcher<VisitDto>(`/visits/${id}`);
}
