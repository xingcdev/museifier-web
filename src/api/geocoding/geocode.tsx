import type { GeocodingDto } from './geocoding-dto';

export async function geocode(query: string) {
	const searchParams = new URLSearchParams({
		q: query,
		limit: '1',
	});

	try {
		const res = await fetch(
			`${
				import.meta.env.VITE_GEOCODING_API_URL
			}/search?${searchParams.toString()}`,
			{
				// Do not send token cookies
				credentials: 'omit',
			}
		);

		if (!res.ok) {
			return Promise.reject('Error with Geocoding API.');
		}
		const json: GeocodingDto = await res.json();
		return json.features[0].geometry.coordinates;
	} catch (err) {
		return Promise.reject(err);
	}
}
