import { createContext, useState, type ReactNode } from 'react';

interface AuthContextType {
	isAuthenticated: boolean;
	user: User | null;
	setIsAuthenticated: (value: boolean) => void;
	setUser: (value: User | null) => void;
}

interface User {
	id: string;
	email: string;
	username: string;
	accessToken: string;
}

export const AuthContext = createContext<AuthContextType | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
	const [isAuthenticated, setIsAuthenticated] = useState(false);
	const [user, setUser] = useState<User | null>(null);

	return (
		<AuthContext.Provider
			value={{ isAuthenticated, user, setIsAuthenticated, setUser }}
		>
			{children}
		</AuthContext.Provider>
	);
}
