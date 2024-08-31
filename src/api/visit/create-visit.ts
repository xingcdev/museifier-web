import { VisitDto } from '../dtos/visitDto';
import { fetcher } from '../fetcher';
import type { VisitRequestBody } from './visit-request-body';

export function createVisit(requestBody: VisitRequestBody) {
	return fetcher<VisitDto>('/visits', {
		method: 'POST',
		body: JSON.stringify(requestBody),
	});
}
