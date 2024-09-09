import type { GetNearbyMuseumsDto } from '../dtos/get-nearby-museums-dto';
import { fetcher } from '../fetcher';

export function getNearbyMuseums(lat: number, lon: number) {
	const searchParams = new URLSearchParams({
		location: `${lat},${lon}`,
	});

	return fetcher<GetNearbyMuseumsDto>(
		`/museums/nearby?${searchParams.toString()}`
	);
}
