import { useContext } from 'react';
import { AuthContext } from '../context/auth-provider';

export function UseAuth() {
	const context = useContext(AuthContext);

	if (!context) throw new Error('AuthContext must be in AuthProvider.');

	return context;
}
