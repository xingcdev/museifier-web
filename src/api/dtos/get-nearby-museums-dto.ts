import type { MuseumDto } from './museumDto';

export interface GetNearbyMuseumsDto {
	query: string;
	latitude: number;
	longitude: number;
	totalResults: number;
	data: Data[];
}

interface Data extends MuseumDto {
	totalVisits: number;
	distance: number;
	averageRating: number;
}
