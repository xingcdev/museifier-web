import type { OAuthDto } from '../types/oauth-types';
import { getRefreshTokenInCookie } from '../utils/auth-utils';

export async function getAccessToken(code: string): Promise<OAuthDto> {
	const clientId = import.meta.env.VITE_OAUTH_CLIENT_ID;
	const clientSecret = import.meta.env.VITE_OAUTH_CLIENT_SECRET;
	const tokenUri = import.meta.env.VITE_OAUTH_TOKEN_URI;
	const redirectUri = import.meta.env.VITE_OAUTH_REDIRECT_URI;

	const urlencoded = new URLSearchParams();
	urlencoded.append('grant_type', 'authorization_code');
	urlencoded.append('client_id', clientId);
	urlencoded.append('client_secret', clientSecret);
	urlencoded.append('redirect_uri', redirectUri);
	urlencoded.append('scope', 'openid');
	urlencoded.append('code', code);

	const response = await fetch(tokenUri, {
		headers: {
			'Content-type': 'application/x-www-form-urlencoded; charset=utf-8',
		},
		method: 'POST',
		body: urlencoded,
	});

	if (!response.ok) {
		return Promise.reject(`Response status: ${response.status}`);
	}

	return await response.json();
}

// attempt to refresh the access token if
// 1. the request fails due to an expired access token.
// 2. the token in the cookie is expired when refreshing the page

export async function refreshAccessToken(): Promise<OAuthDto> {
	const clientId = import.meta.env.VITE_OAUTH_CLIENT_ID;
	const clientSecret = import.meta.env.VITE_OAUTH_CLIENT_SECRET;
	const tokenUri = import.meta.env.VITE_OAUTH_TOKEN_URI;
	const redirectUri = import.meta.env.VITE_OAUTH_REDIRECT_URI;
	const refreshToken = getRefreshTokenInCookie();

	if (!refreshToken) return Promise.reject('No refresh token found');

	const urlencoded = new URLSearchParams();
	urlencoded.append('grant_type', 'refresh_token');
	urlencoded.append('client_id', clientId);
	urlencoded.append('client_secret', clientSecret);
	urlencoded.append('redirect_uri', redirectUri);
	urlencoded.append('scope', 'openid');
	urlencoded.append('refresh_token', refreshToken);

	const response = await fetch(tokenUri, {
		headers: {
			'Content-type': 'application/x-www-form-urlencoded; charset=utf-8',
		},
		method: 'POST',
		body: urlencoded,
	});

	if (!response.ok) {
		return Promise.reject(`Response status: ${response.status}`);
	}

	return await response.json();
}
