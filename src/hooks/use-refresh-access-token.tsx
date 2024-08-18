import { useMutation } from '@tanstack/react-query';
import { refreshAccessToken } from '../api/auth';

export function useRefreshAccessToken() {
	return useMutation({
		mutationFn: () => refreshAccessToken(),
	});
}
