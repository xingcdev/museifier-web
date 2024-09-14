import Box from '@mui/material/Box';
import Link from '@mui/material/Link';
import Typography from '@mui/material/Typography';
import { getKcClsx } from 'keycloakify/login/lib/kcClsx';
import { useStylesAndScripts } from 'keycloakify/login/Template.useStylesAndScripts';
import type { TemplateProps } from 'keycloakify/login/TemplateProps';
import { clsx } from 'keycloakify/tools/clsx';
import { useSetClassName } from 'keycloakify/tools/useSetClassName';
import { useEffect } from 'react';
import LoginImg from '../../assets/le-louvre.jpg';
import { AppLogo } from '../../components/app-logo';
import { Copyright } from '../../components/ui/copyright';
import type { I18n } from './i18n';
import type { KcContext } from './KcContext';

export default function Template(props: TemplateProps<KcContext, I18n>) {
	const {
		displayInfo = false,
		displayMessage = true,
		displayRequiredFields = false,
		headerNode,
		socialProvidersNode = null,
		infoNode = null,
		documentTitle,
		bodyClassName,
		kcContext,
		i18n,
		doUseDefaultCss,
		classes,
		children,
	} = props;

	const { kcClsx } = getKcClsx({ doUseDefaultCss, classes });

	const { msg, msgStr } = i18n;

	const { auth, url, message, isAppInitiatedAction } = kcContext;

	useEffect(() => {
		document.title =
			documentTitle ?? msgStr('loginTitle', kcContext.realm.displayName);
	}, []);

	// useSetClassName({
	// 	qualifiedName: 'html',
	// 	className: kcClsx(''),
	// });

	useSetClassName({
		qualifiedName: 'body',
		className: bodyClassName ?? kcClsx('kcBodyClass'),
	});

	const { isReadyToRender } = useStylesAndScripts({
		kcContext,
		doUseDefaultCss,
	});

	if (!isReadyToRender) {
		return null;
	}

	return (
		<Box display="flex" height="100vh">
			<Box
				flexBasis="50%"
				sx={{
					position: 'relative',
					background: `url(${LoginImg})`,
					backgroundRepeat: 'no-repeat',
					backgroundSize: 'cover',
					backgroundPosition: 'center',
					maxWidth: 900,
				}}
			>
				<Typography
					color="white"
					sx={{ position: 'absolute', bottom: 10, left: 20 }}
				>
					Photo par{' '}
					<Link
						href="https://alphacoders.com/users/profile/194044/Oreskis"
						color="#fff"
					>
						Oreskis
					</Link>{' '}
					sur{' '}
					<Link
						href="https://wall.alphacoders.com/big.php?i=1275605"
						color="#fff"
					>
						Alpha Coders
					</Link>
				</Typography>
			</Box>
			<Box
				display="flex"
				justifyContent="center"
				flexGrow={1}
				pt={20}
				position="relative"
			>
				<AppLogo sx={{ position: 'absolute', top: 10, left: 15 }} />
				<Copyright sx={{ position: 'absolute', bottom: 10, left: 15 }} />
				<div className={kcClsx('kcLoginClass')}>
					<Box width={380}>
						<header className={kcClsx('kcFormHeaderClass')}>
							{/* {realm.internationalizationEnabled &&
								(assert(locale !== undefined), locale.supported.length > 1) && (
									<div className={kcClsx('kcLocaleMainClass')} id="kc-locale">
										<div
											id="kc-locale-wrapper"
											className={kcClsx('kcLocaleWrapperClass')}
										>
											<div
												id="kc-locale-dropdown"
												className={clsx(
													'menu-button-links',
													kcClsx('kcLocaleDropDownClass')
												)}
											>
												<button
													tabIndex={1}
													id="kc-current-locale-link"
													aria-label={msgStr('languages')}
													aria-haspopup="true"
													aria-expanded="false"
													aria-controls="language-switch1"
												>
													{labelBySupportedLanguageTag[currentLanguageTag]}
												</button>
												<ul
													role="menu"
													tabIndex={-1}
													aria-labelledby="kc-current-locale-link"
													aria-activedescendant=""
													id="language-switch1"
													className={kcClsx('kcLocaleListClass')}
												>
													{locale.supported.map(({ languageTag }, i) => (
														<li
															key={languageTag}
															className={kcClsx('kcLocaleListItemClass')}
															role="none"
														>
															<a
																role="menuitem"
																id={`language-${i + 1}`}
																className={kcClsx('kcLocaleItemClass')}
																href={getChangeLocaleUrl(languageTag)}
															>
																{labelBySupportedLanguageTag[languageTag]}
															</a>
														</li>
													))}
												</ul>
											</div>
										</div>
									</div>
								)} */}
							{(() => {
								const node = !(
									auth !== undefined &&
									auth.showUsername &&
									!auth.showResetCredentials
								) ? (
									<Box textAlign="center" mb={6}>
										<Typography variant="h3" component="h1" sx={{ mb: 0.5 }}>
											Bienvenue
										</Typography>
										<Typography
											id="kc-page-title"
											variant="body1"
											component="p"
											color="text.secondary"
										>
											{headerNode}
										</Typography>
									</Box>
								) : (
									<div id="kc-username" className={kcClsx('kcFormGroupClass')}>
										<label id="kc-attempted-username">
											{auth.attemptedUsername}
										</label>
										<a
											id="reset-login"
											href={url.loginRestartFlowUrl}
											aria-label={msgStr('restartLoginTooltip')}
										>
											<div className="kc-login-tooltip">
												<i className={kcClsx('kcResetFlowIcon')}></i>
												<span className="kc-tooltip-text">
													{msg('restartLoginTooltip')}
												</span>
											</div>
										</a>
									</div>
								);

								if (displayRequiredFields) {
									return (
										<div className={kcClsx('kcContentWrapperClass')}>
											<div
												className={clsx(
													kcClsx('kcLabelWrapperClass'),
													'subtitle'
												)}
											>
												<span className="subtitle">
													<span className="required">*</span>
													{msg('requiredFields')}
												</span>
											</div>
											<div className="col-md-10">{node}</div>
										</div>
									);
								}

								return node;
							})()}
						</header>
						<div id="kc-content">
							<div id="kc-content-wrapper">
								{/* App-initiated actions should not see warning messages about the need to complete the action during login. */}
								{displayMessage &&
									message !== undefined &&
									(message.type !== 'warning' || !isAppInitiatedAction) && (
										<div
											className={clsx(
												`alert-${message.type}`,
												kcClsx('kcAlertClass'),
												`pf-m-${
													message?.type === 'error' ? 'danger' : message.type
												}`
											)}
										>
											<div className="pf-c-alert__icon">
												{message.type === 'success' && (
													<span
														className={kcClsx('kcFeedbackSuccessIcon')}
													></span>
												)}
												{message.type === 'warning' && (
													<span
														className={kcClsx('kcFeedbackWarningIcon')}
													></span>
												)}
												{message.type === 'error' && (
													<span
														className={kcClsx('kcFeedbackErrorIcon')}
													></span>
												)}
												{message.type === 'info' && (
													<span className={kcClsx('kcFeedbackInfoIcon')}></span>
												)}
											</div>
											<span
												className={kcClsx('kcAlertTitleClass')}
												dangerouslySetInnerHTML={{
													__html: message.summary,
												}}
											/>
										</div>
									)}
								{children}
								{auth !== undefined && auth.showTryAnotherWayLink && (
									<form
										id="kc-select-try-another-way-form"
										action={url.loginAction}
										method="post"
									>
										<div className={kcClsx('kcFormGroupClass')}>
											<input type="hidden" name="tryAnotherWay" value="on" />
											<a
												href="#"
												id="try-another-way"
												onClick={() => {
													document.forms[
														'kc-select-try-another-way-form' as never
													].submit();
													return false;
												}}
											>
												{msg('doTryAnotherWay')}
											</a>
										</div>
									</form>
								)}
								{socialProvidersNode}
								{displayInfo && (
									<div id="kc-info" className={kcClsx('kcSignUpClass')}>
										<div
											id="kc-info-wrapper"
											className={kcClsx('kcInfoAreaWrapperClass')}
										>
											{infoNode}
										</div>
									</div>
								)}
							</div>
						</div>
					</Box>
				</div>
			</Box>
		</Box>
	);
}
