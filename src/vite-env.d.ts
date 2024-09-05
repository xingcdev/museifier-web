/// <reference types="vite/client" />

interface ImportMetaEnv {
	readonly VITE_OAUTH_AUTHORIZATION_SERVER_URI: string;
	readonly VITE_OAUTH_CLIENT_ID: string;
	readonly VITE_OAUTH_CLIENT_SECRET: string;
	readonly VITE_OAUTH_REDIRECT_URI: string;
	readonly VITE_OAUTH_TOKEN_URI: string;
	readonly VITE_API_URL: string;
	readonly VITE_OAUTH_LOGOUT_URI: string;
	readonly VITE_GEOCODING_API_URL: string;
}

interface ImportMeta {
	readonly env: ImportMetaEnv;
}
