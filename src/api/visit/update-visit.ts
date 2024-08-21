import { VisitDto } from '../dtos/visitDto';
import { fetcher } from '../fetcher';

export function updateVisit(id: string, comment: string) {
	return fetcher<VisitDto>(`/visits/${id}`, {
		method: 'PATCH',
		body: JSON.stringify({ comment }),
	});
}
