import Container from '@mui/material/Container';
import CssBaseline from '@mui/material/CssBaseline';
import type { LinkProps } from '@mui/material/Link';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import { forwardRef } from 'react';
import {
	Outlet,
	Link as RouterLink,
	LinkProps as RouterLinkProps,
} from 'react-router-dom';
import { AppHeader } from '../components/app-header';
import { RequireAuth } from '../components/require-auth';

const LinkBehavior = forwardRef<
	HTMLAnchorElement,
	Omit<RouterLinkProps, 'to'> & { href: RouterLinkProps['to'] }
>((props, ref) => {
	const { href, ...other } = props;
	// Map href (Material UI) -> to (react-router)
	return <RouterLink ref={ref} to={href} {...other} />;
});

const theme = createTheme({
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
			<ThemeProvider theme={theme}>
				<CssBaseline />
				<AppHeader />
				<Container>
					<Outlet />
				</Container>
			</ThemeProvider>
		</RequireAuth>
	);
}
