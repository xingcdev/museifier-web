import {
	getAccessTokenInCookie,
	saveAccessTokenInCookie,
	saveIdTokenInCookie,
	saveRefreshTokenInCookie,
} from '../utils/auth-utils';
import { logout, refreshAccessToken } from './auth';
import { ErrorDto } from './dtos/errorDto';

export async function fetcher<T>(url: string, init?: RequestInit): Promise<T> {
	const accessToken = getAccessTokenInCookie() || '';
	const headers = {
		...init?.headers,
		'Content-Type': 'application/json',
		Authorization: `bearer ${accessToken}`,
	};

	try {
		const res = await fetch(`${import.meta.env.VITE_API_URL}${url}`, {
			...init,
			// Do not send token cookies
			credentials: 'omit',
			headers,
		});

		if (res.status === 401) {
			// Attempt to refresh the token if we get a 401 response
			try {
				const newResponse = await refreshAccessToken();
				headers['Authorization'] = `Bearer ${newResponse.access_token}`;
				saveAccessTokenInCookie(
					newResponse.access_token,
					newResponse.expires_in
				);
				saveRefreshTokenInCookie(
					newResponse.refresh_token,
					newResponse.refresh_expires_in
				);
				saveIdTokenInCookie(newResponse.id_token, newResponse.expires_in);
			} catch {
				logout();
				return Promise.reject('No refresh token');
			}
			return await fetcher(url, { ...init, headers });
		}

		if (!res.ok) {
			const json: ErrorDto = await res.json();
			return Promise.reject(json);
		}
		return await res.json();
	} catch (err) {
		return Promise.reject(err);
	}
}
