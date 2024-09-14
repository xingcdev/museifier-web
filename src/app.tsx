import CssBaseline from '@mui/material/CssBaseline';
import { ThemeProvider } from '@mui/material/styles';
import { LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import dayjs from 'dayjs';
import 'dayjs/locale/fr';
import relativeTime from 'dayjs/plugin/relativeTime';
import { RouterProvider } from 'react-router-dom';
import { AuthProvider } from './context/auth-provider';
import { router } from './router';
import { theme } from './theme';

dayjs.locale('fr');
dayjs.extend(relativeTime);

const queryClient = new QueryClient({
	defaultOptions: {
		queries: {
			refetchOnWindowFocus: false,
		},
	},
});

declare module '@mui/material/styles' {
	interface PaletteColor {
		bg?: string;
	}

	interface SimplePaletteColorOptions {
		bg?: string;
	}
}

export default function App() {
	return (
		<AuthProvider>
			<QueryClientProvider client={queryClient}>
				<LocalizationProvider dateAdapter={AdapterDayjs}>
					<ThemeProvider theme={theme}>
						<CssBaseline />
						<RouterProvider router={router} />
					</ThemeProvider>
				</LocalizationProvider>

				<ReactQueryDevtools initialIsOpen={false} />
			</QueryClientProvider>
		</AuthProvider>
	);
}
