import {
	getAccessTokenInCookie,
	redirectToLoginPage,
	saveAccessTokenInCookie,
	saveIdTokenInCookie,
	saveRefreshTokenInCookie,
} from '../utils/auth-utils';
import { refreshAccessToken } from './auth';

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

				// eslint-disable-next-line @typescript-eslint/ban-ts-comment
				// @ts-expect-error
				return await fetch(url, { ...init, headers });
			} catch {
				redirectToLoginPage();
			}
		}

		if (!res.ok) {
			return Promise.reject(res);
		}
		return await res.json();
	} catch (err) {
		return Promise.reject(err);
	}
}
