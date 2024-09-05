import type { MuseumDto } from './museumDto';

export interface GetNearbyMuseumsDto {
	query: string;
	latitude: number;
	longitude: number;
	data: MuseumDto[];
}
