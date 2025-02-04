import Cookies from 'js-cookie';

export function redirectToLoginPage() {
	const clientId = import.meta.env.VITE_OAUTH_CLIENT_ID;
	const authorizationServerUri = import.meta.env
		.VITE_OAUTH_AUTHORIZATION_SERVER_URI;
	const redirectUri = import.meta.env.VITE_OAUTH_REDIRECT_URI;
	const loginUrl = `${authorizationServerUri}?response_type=code&client_id=${clientId}&redirect_uri=${redirectUri}&scope=openid`;
	window.location.href = loginUrl;
}

export function getAccessTokenInCookie() {
	return Cookies.get('access_token');
}

export function saveAccessTokenInCookie(token: string, expiredIn: number) {
	const expireDate = new Date(new Date().getTime() + 1000 * expiredIn);
	Cookies.set('access_token', token, {
		expires: expireDate,
		secure: true,
		sameSite: 'Strict',
	});
}

export function removeAccessTokenInCookie() {
	Cookies.remove('access_token', { secure: true, sameSite: 'Strict' });
}

export function getRefreshTokenInCookie() {
	return Cookies.get('refresh_token');
}

export function saveRefreshTokenInCookie(token: string, expiredIn: number) {
	const expireDate = new Date(new Date().getTime() + 1000 * expiredIn);
	Cookies.set('refresh_token', token, {
		expires: expireDate,
		secure: true,
		sameSite: 'Strict',
	});
}

export function removeRefreshTokenInCookie() {
	Cookies.remove('refresh_token', { secure: true, sameSite: 'Strict' });
}

// Id token is used for logout
export function getIdTokenInCookie() {
	return Cookies.get('id_token');
}

export function saveIdTokenInCookie(token: string, expiredIn: number) {
	const expireDate = new Date(new Date().getTime() + 1000 * expiredIn);
	Cookies.set('id_token', token, {
		expires: expireDate,
		secure: true,
		sameSite: 'Strict',
	});
}

export function removeIdTokenInCookie() {
	Cookies.remove('id_token', { secure: true, sameSite: 'Strict' });
}
