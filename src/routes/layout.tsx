import { red } from '@mui/material/colors';
import CssBaseline from '@mui/material/CssBaseline';
import type { LinkProps } from '@mui/material/Link';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import { LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { forwardRef } from 'react';
import {
	Outlet,
	Link as RouterLink,
	LinkProps as RouterLinkProps,
} from 'react-router-dom';
import { AppHeader } from '../components/app-header';
import { RequireAuth } from '../components/require-auth';
import { AppFooter } from '../components/ui/app-footer';

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

export default function Layout() {
	return (
		<RequireAuth>
			<LocalizationProvider dateAdapter={AdapterDayjs}>
				<ThemeProvider theme={theme}>
					<CssBaseline />
					<AppHeader />
					<Outlet />
					<AppFooter />
				</ThemeProvider>
			</LocalizationProvider>
		</RequireAuth>
	);
}
