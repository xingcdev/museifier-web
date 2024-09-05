import type { GeocodingDto } from './geocoding-dto';

export async function getAddressAutocompletion(query: string, limit?: number) {
	const searchParams = new URLSearchParams({
		q: query,
		limit: limit?.toString() || '5',
	});

	try {
		const res = await fetch(
			`${
				import.meta.env.VITE_GEOCODING_API_URL
			}/search?${searchParams.toString()}`,
			{
				headers: {
					'Content-Type': 'application/json',
				},
			}
		);

		if (!res.ok) {
			return Promise.reject('Error with Geocoding API.');
		}
		const json: GeocodingDto = await res.json();
		return json;
	} catch (err) {
		return Promise.reject(err);
	}
}
