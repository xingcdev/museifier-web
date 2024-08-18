import { useQuery } from '@tanstack/react-query';
import { getVisits } from '../api/get-visits';

export function VisitsList() {
	const { data } = useQuery({ queryKey: ['visits'], queryFn: getVisits });
	console.log(data);

	return null;
}
