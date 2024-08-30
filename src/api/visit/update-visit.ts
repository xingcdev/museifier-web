import { VisitDto } from '../dtos/visitDto';
import { fetcher } from '../fetcher';

interface UpdateVisitVariables {
	id: string;
	title: string;
	comment: string;
}

export function updateVisit(variables: UpdateVisitVariables) {
	return fetcher<VisitDto>(`/visits/${variables.id}`, {
		method: 'PUT',
		body: JSON.stringify({
			title: variables.title,
			comment: variables.comment,
		}),
	});
}
