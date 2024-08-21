import type { MuseumDto } from './museumDto';

export interface VisitDto {
	id: string;
	comment: string;
	museum: MuseumDto;
}
