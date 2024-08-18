import { jwtDecode } from 'jwt-decode';
import { useEffect, type ReactNode } from 'react';
import { useRefreshAccessToken } from '../hooks/use-refresh-access-token';
import { UseAuth } from '../hooks/useAuth';
import type { JwtPayload } from '../types/oauth-types';
import {
	getAccessTokenInCookie,
	getRefreshTokenInCookie,
	redirectToLoginPage,
	removeAccessTokenInCookie,
	removeRefreshTokenInCookie,
	saveAccessTokenInCookie,
	saveIdTokenInCookie,
	saveRefreshTokenInCookie,
} from '../utils/auth-utils';

// Persistent login
// 1. Get the token
// 2. If no token, redirect to the login page
// 2. If there is a token, check if the token is expired
// 3.if it is, redirect to the login page

export function RequireAuth({ children }: { children: ReactNode }) {
	const { setIsAuthenticated, isAuthenticated, setUser } = UseAuth();
	const { mutate: refreshAccessToken } = useRefreshAccessToken();

	// Persistent login
	useEffect(() => {
		const accessTokenInCookie = getAccessTokenInCookie();
		const refreshTokenInCookie = getRefreshTokenInCookie();

		if (accessTokenInCookie) {
			try {
				const decodedToken = jwtDecode<JwtPayload>(accessTokenInCookie);
				setUser({
					id: decodedToken.sub || '',
					username: decodedToken.name,
					email: decodedToken.email,
					accessToken: accessTokenInCookie,
				});
				setIsAuthenticated(true);
			} catch {
				removeAccessTokenInCookie();
				redirectToLoginPage();
			}
		} else {
			// The token doesn't exist or is expired
			if (refreshTokenInCookie) {
				// Attempt to refresh the expired access token
				refreshAccessToken(undefined, {
					onSuccess: (newData) => {
						saveAccessTokenInCookie(newData.access_token, newData.expires_in);
						saveRefreshTokenInCookie(
							newData.refresh_token,
							newData.refresh_expires_in
						);
						saveIdTokenInCookie(newData.id_token, newData.expires_in);

						const newDecodedToken = jwtDecode<JwtPayload>(newData.access_token);
						setUser({
							id: newDecodedToken.sub || '',
							username: newDecodedToken.name,
							email: newDecodedToken.email,
							accessToken: newData.access_token,
						});
						setIsAuthenticated(true);
					},
					onError: () => {
						// No refresh token found
						removeRefreshTokenInCookie();
						redirectToLoginPage();
					},
				});
			} else {
				redirectToLoginPage();
			}
		}
	}, [refreshAccessToken, setIsAuthenticated, setUser]);

	return isAuthenticated ? children : null;
}
