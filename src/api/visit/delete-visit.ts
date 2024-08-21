import { VisitDto } from '../dtos/visitDto';
import { fetcher } from '../fetcher';

export function deleteVisit(id: string) {
	return fetcher<VisitDto>(`/visits/${id}`, {
		method: 'DELETE',
	});
}
