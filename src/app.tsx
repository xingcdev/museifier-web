import { red } from '@mui/material/colors';
import CssBaseline from '@mui/material/CssBaseline';
import type { LinkProps } from '@mui/material/Link';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import { LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';
import { forwardRef } from 'react';
import {
	Link as RouterLink,
	LinkProps as RouterLinkProps,
	RouterProvider,
} from 'react-router-dom';
import { AuthProvider } from './context/auth-provider';
import { router } from './router';

dayjs.extend(relativeTime);

const queryClient = new QueryClient({
	defaultOptions: {
		queries: {
			refetchOnWindowFocus: false,
		},
	},
});

const LinkBehavior = forwardRef<
	HTMLAnchorElement,
	Omit<RouterLinkProps, 'to'> & { href: RouterLinkProps['to'] }
>((props, ref) => {
	const { href, ...other } = props;
	// Map href (Material UI) -> to (react-router)
	return <RouterLink ref={ref} to={href} {...other} />;
});

declare module '@mui/material/styles' {
	interface PaletteColor {
		bg?: string;
	}

	interface SimplePaletteColorOptions {
		bg?: string;
	}
}

const theme = createTheme({
	palette: {
		error: {
			main: red[700],
			light: red[400],
			dark: red[800],
			bg: red[100],
			contrastText: '#fff',
		},
	},
	components: {
		MuiLink: {
			defaultProps: {
				component: LinkBehavior,
			} as LinkProps,
		},
		MuiButtonBase: {
			defaultProps: {
				LinkComponent: LinkBehavior,
			},
		},
	},
});

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
