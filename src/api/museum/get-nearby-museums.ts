import type { GetNearbyMuseumsDto } from '../dtos/get-nearby-museums-dto';
import { fetcher } from '../fetcher';

export function getNearbyMuseums(address: string) {
	const searchParams = new URLSearchParams({
		q: address,
	});

	return fetcher<GetNearbyMuseumsDto>(
		`/museums/nearby?${searchParams.toString()}`
	);
}
