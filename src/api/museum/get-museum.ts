import type { VisitedMuseumDto } from '../dtos/visited-museum-dto';
import { fetcher } from '../fetcher';

export function getMuseum(id: string) {
	return fetcher<VisitedMuseumDto>(`/museums/${id}`);
}
