import { useMutation } from '@tanstack/react-query';
import { jwtDecode } from 'jwt-decode';
import { useCallback, useEffect } from 'react';
import { useLocation, useNavigate, useSearchParams } from 'react-router-dom';
import { getAccessToken } from '../api/auth';
import { UseAuth } from '../hooks/useAuth';
import type { JwtPayload } from '../types/oauth-types';
import {
	redirectToLoginPage,
	saveAccessTokenInCookie,
	saveRefreshTokenInCookie,
} from '../utils/auth-utils';

// 1. Redirect to the OAuth login page
// 2. Once the user logs in successfully, redirect to the initial page
// 3. If there is not the cookie, <AuthGuard /> get the 'code' to get the access_token.
// 4. Save the access_token in the cookie
// 5. Send ONCE a request to refresh token if the request status is 403.
// 6. Persistent Login

export function AuthCallback() {
	const currentLocation = useLocation();
	const { setIsAuthenticated, setUser } = UseAuth();
	const navigate = useNavigate();

	const mutation = useMutation({
		mutationFn: ({ code }: { code: string }) => getAccessToken(code),
	});
	const [searchParams, setSearchParams] = useSearchParams();

	const clearAuthParams = useCallback(() => {
		if (searchParams.has('session_state')) {
			searchParams.delete('session_state');
		}
		if (searchParams.has('iss')) {
			searchParams.delete('iss');
		}
		if (searchParams.has('code')) {
			searchParams.delete('code');
		}
		setSearchParams(searchParams);
	}, [searchParams, setSearchParams]);

	useEffect(() => {
		const searchParams = new URLSearchParams(currentLocation.search);
		const authorizationCode = searchParams.get('code');
		const sessionState = searchParams.get('session_state');
		const iss = searchParams.get('iss');

		if (sessionState && authorizationCode && iss) {
			if (!mutation.isPending) {
				mutation.mutate(
					{ code: authorizationCode },
					{
						onSuccess: (data) => {
							saveAccessTokenInCookie(data.access_token, data.expires_in);
							saveRefreshTokenInCookie(
								data.refresh_token,
								data.refresh_expires_in
							);

							const decodedToken = jwtDecode<JwtPayload>(data.access_token);
							setUser({
								id: decodedToken.sub || '',
								username: decodedToken.name,
								email: decodedToken.email,
								accessToken: data.access_token,
							});
							setIsAuthenticated(true);
							clearAuthParams();
							navigate('/');
						},
						onError: () => {
							redirectToLoginPage();
						},
					}
				);
			}
		}
	}, [
		clearAuthParams,
		currentLocation.search,
		mutation,
		navigate,
		setIsAuthenticated,
		setUser,
	]);

	return null;
}
