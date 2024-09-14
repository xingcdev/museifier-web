import { red } from '@mui/material/colors';
import type { LinkProps } from '@mui/material/Link';
import { createTheme } from '@mui/material/styles';
import 'dayjs/locale/fr';
import { forwardRef } from 'react';
import {
	Link as RouterLink,
	LinkProps as RouterLinkProps,
} from 'react-router-dom';

const LinkBehavior = forwardRef<
	HTMLAnchorElement,
	Omit<RouterLinkProps, 'to'> & { href: RouterLinkProps['to'] }
>((props, ref) => {
	const { href, ...other } = props;
	// Map href (Material UI) -> to (react-router)
	return <RouterLink ref={ref} to={href} {...other} />;
});

export const theme = createTheme({
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

// Do not use 'LinkBehavior' component in Keycloak page because we don't want to load <RouterProvider router={router} />.
export const keycloakTheme = createTheme({
	palette: theme.palette,
});
