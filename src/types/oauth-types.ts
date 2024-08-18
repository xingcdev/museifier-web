import { JwtPayload as JwtPayloadFromLibrary } from 'jwt-decode';

export interface OAuthDto {
	access_token: string;
	expires_in: number;
	refresh_expires_in: number;
	refresh_token: string;
	token_type: string;
	id_token: string;
	'not-before-policy': number;
	session_state: string;
	scope: string;
}

export interface JwtPayload extends JwtPayloadFromLibrary {
	name: string;
	email: string;
}
