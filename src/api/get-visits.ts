import { fetcher } from './fetcher';

export function getVisits() {
	return fetcher('/visits');
}
