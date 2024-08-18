import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { RouterProvider } from 'react-router-dom';
import { AuthProvider } from './context/auth-provider';
import { router } from './router';

const queryClient = new QueryClient();

export default function App() {
	return (
		<AuthProvider>
			<QueryClientProvider client={queryClient}>
				<RouterProvider router={router} />
			</QueryClientProvider>
		</AuthProvider>
	);
}
