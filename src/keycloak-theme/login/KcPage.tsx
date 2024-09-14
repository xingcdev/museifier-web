import { CssBaseline, ThemeProvider } from '@mui/material';
import type { ClassKey } from 'keycloakify/login';
import DefaultPage from 'keycloakify/login/DefaultPage';
import { Suspense, lazy } from 'react';
import { keycloakTheme } from '../../theme';
import type { KcContext } from './KcContext';
import Template from './Template';
import { useI18n } from './i18n';
const UserProfileFormFields = lazy(
	() => import('keycloakify/login/UserProfileFormFields')
);
const Login = lazy(() => import('./pages/Login'));

const doMakeUserConfirmPassword = true;

export default function KcPage(props: { kcContext: KcContext }) {
	const { kcContext } = props;

	const { i18n } = useI18n({ kcContext });

	return (
		<Suspense>
			<ThemeProvider theme={keycloakTheme}>
				<CssBaseline />
				{(() => {
					switch (kcContext.pageId) {
						case 'login.ftl':
							return (
								<Login
									{...{ kcContext, i18n, classes }}
									Template={Template}
									doUseDefaultCss={false}
								/>
							);
						default:
							return (
								<DefaultPage
									kcContext={kcContext}
									i18n={i18n}
									classes={classes}
									Template={Template}
									doUseDefaultCss={false}
									UserProfileFormFields={UserProfileFormFields}
									doMakeUserConfirmPassword={doMakeUserConfirmPassword}
								/>
							);
					}
				})()}
			</ThemeProvider>
		</Suspense>
	);
}

const classes = {} satisfies { [key in ClassKey]?: string };
