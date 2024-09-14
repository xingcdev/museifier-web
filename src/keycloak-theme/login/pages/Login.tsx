import VisibilityIcon from '@mui/icons-material/Visibility';
import VisibilityOffIcon from '@mui/icons-material/VisibilityOff';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import FormControl from '@mui/material/FormControl';
import FormHelperText from '@mui/material/FormHelperText';
import IconButton from '@mui/material/IconButton';
import InputAdornment from '@mui/material/InputAdornment';
import InputLabel from '@mui/material/InputLabel';
import Link from '@mui/material/Link';
import OutlinedInput from '@mui/material/OutlinedInput';
import Stack from '@mui/material/Stack';
import TextField from '@mui/material/TextField';
import { getKcClsx } from 'keycloakify/login/lib/kcClsx';
import type { PageProps } from 'keycloakify/login/pages/PageProps';
import { clsx } from 'keycloakify/tools/clsx';
import { useState } from 'react';
import type { KcContext } from '../KcContext';
import type { I18n } from '../i18n';

export default function Login(
	props: PageProps<Extract<KcContext, { pageId: 'login.ftl' }>, I18n>
) {
	const { kcContext, i18n, doUseDefaultCss, Template, classes } = props;

	const { kcClsx } = getKcClsx({
		doUseDefaultCss,
		classes,
	});

	const {
		social,
		realm,
		url,
		usernameHidden,
		login,
		auth,
		registrationDisabled,
		messagesPerField,
	} = kcContext;

	const { msg, msgStr } = i18n;

	const [isLoginButtonDisabled, setIsLoginButtonDisabled] = useState(false);

	return (
		<Template
			kcContext={kcContext}
			i18n={i18n}
			doUseDefaultCss={doUseDefaultCss}
			classes={classes}
			displayMessage={!messagesPerField.existsError('username', 'password')}
			headerNode={msg('loginAccountTitle')}
			displayInfo={
				realm.password && realm.registrationAllowed && !registrationDisabled
			}
			infoNode={
				<div id="kc-registration-container">
					<div id="kc-registration">
						<span>
							{msg('noAccount')}{' '}
							<a tabIndex={8} href={url.registrationUrl}>
								{msg('doRegister')}
							</a>
						</span>
					</div>
				</div>
			}
			socialProvidersNode={
				<>
					{realm.password &&
						social?.providers !== undefined &&
						social.providers.length !== 0 && (
							<div
								id="kc-social-providers"
								className={kcClsx('kcFormSocialAccountSectionClass')}
							>
								<hr />
								<h2>{msg('identity-provider-login-label')}</h2>
								<ul
									className={kcClsx(
										'kcFormSocialAccountListClass',
										social.providers.length > 3 &&
											'kcFormSocialAccountListGridClass'
									)}
								>
									{social.providers.map((...[p, , providers]) => (
										<li key={p.alias}>
											<a
												id={`social-${p.alias}`}
												className={kcClsx(
													'kcFormSocialAccountListButtonClass',
													providers.length > 3 && 'kcFormSocialAccountGridItem'
												)}
												type="button"
												href={p.loginUrl}
											>
												{p.iconClasses && (
													<i
														className={clsx(
															kcClsx('kcCommonLogoIdP'),
															p.iconClasses
														)}
														aria-hidden="true"
													></i>
												)}
												<span
													className={clsx(
														kcClsx('kcFormSocialAccountNameClass'),
														p.iconClasses && 'kc-social-icon-text'
													)}
													dangerouslySetInnerHTML={{ __html: p.displayName }}
												></span>
											</a>
										</li>
									))}
								</ul>
							</div>
						)}
				</>
			}
		>
			<div id="kc-form">
				{realm.password && (
					<Stack
						component="form"
						id="kc-form-login"
						onSubmit={() => {
							setIsLoginButtonDisabled(true);
							return true;
						}}
						action={url.loginAction}
						method="post"
						spacing={3}
					>
						{!usernameHidden && (
							<div className={kcClsx('kcFormGroupClass')}>
								{/* <label htmlFor="username" className={kcClsx('kcLabelClass')}>
										{!realm.loginWithEmailAllowed
											? msg('username')
											: !realm.registrationEmailAsUsername
											? msg('usernameOrEmail')
											: msg('email')}
									</label>
									<input
										tabIndex={2}
										id="username"
										className={kcClsx('kcInputClass')}
										name="username"
										defaultValue={login.username ?? ''}
										type="text"
										autoFocus
										autoComplete="username"
										aria-invalid={messagesPerField.existsError(
											'username',
											'password'
										)}
									/>
									{messagesPerField.existsError('username', 'password') && (
										<span
											id="input-error"
											className={kcClsx('kcInputErrorMessageClass')}
											aria-live="polite"
											dangerouslySetInnerHTML={{
												__html: messagesPerField.getFirstError(
													'username',
													'password'
												),
											}}
										/>
									)} */}
								<TextField
									fullWidth
									label={
										!realm.loginWithEmailAllowed
											? msg('username')
											: !realm.registrationEmailAsUsername
											? msg('usernameOrEmail')
											: msg('email')
									}
									tabIndex={2}
									name="username"
									defaultValue={login.username ?? ''}
									autoFocus
									autoComplete="username"
									aria-invalid={messagesPerField.existsError(
										'username',
										'password'
									)}
									error={messagesPerField.existsError('username', 'password')}
									helperText={messagesPerField.getFirstError(
										'username',
										'password'
									)}
								/>
							</div>
						)}

						<div className={kcClsx('kcFormGroupClass')}>
							{/* <label htmlFor="password" className={kcClsx('kcLabelClass')}>
									{msg('password')}
								</label>
								<PasswordWrapper
									kcClsx={kcClsx}
									i18n={i18n}
									passwordInputId="password"
								>
									<input
										tabIndex={3}
										id="password"
										className={kcClsx('kcInputClass')}
										name="password"
										type="password"
										autoComplete="current-password"
										aria-invalid={messagesPerField.existsError(
											'username',
											'password'
										)}
									/>
								</PasswordWrapper>
								{usernameHidden &&
									messagesPerField.existsError('username', 'password') && (
										<span
											id="input-error"
											className={kcClsx('kcInputErrorMessageClass')}
											aria-live="polite"
											dangerouslySetInnerHTML={{
												__html: messagesPerField.getFirstError(
													'username',
													'password'
												),
											}}
										/>
									)} */}
							<PasswordTextField
								messagesPerField={messagesPerField}
								msg={msg}
							/>

							<Box
								display="flex"
								justifyContent={
									realm.rememberMe && !usernameHidden
										? 'space-between'
										: 'flex-end'
								}
							>
								<div id="kc-form-options">
									{realm.rememberMe && !usernameHidden && (
										<div className="checkbox">
											<label>
												<input
													tabIndex={5}
													id="rememberMe"
													name="rememberMe"
													type="checkbox"
													defaultChecked={!!login.rememberMe}
												/>{' '}
												{msg('rememberMe')}
											</label>
										</div>
									)}
								</div>
								<div className={kcClsx('kcFormOptionsWrapperClass')}>
									{realm.resetPasswordAllowed && (
										<Link
											tabIndex={6}
											href={url.loginResetCredentialsUrl}
											color="textPrimary"
										>
											{msg('doForgotPassword')}
										</Link>
									)}
								</div>
							</Box>
						</div>

						<div id="kc-form-buttons" className={kcClsx('kcFormGroupClass')}>
							{/* <input
									type="hidden"
									id="id-hidden-input"
									name="credentialId"
									value={auth.selectedCredential}
								/>
								<input
									tabIndex={7}
									disabled={isLoginButtonDisabled}
									className={kcClsx(
										'kcButtonClass',
										'kcButtonPrimaryClass',
										'kcButtonBlockClass',
										'kcButtonLargeClass'
									)}
									name="login"
									id="kc-login"
									type="submit"
									value={msgStr('doLogIn')}
								/> */}
							<TextField
								type="hidden"
								id="id-hidden-input"
								name="credentialId"
								defaultValue={auth.selectedCredential}
							/>
							<Button
								variant="contained"
								fullWidth
								tabIndex={7}
								disabled={isLoginButtonDisabled}
								name="login"
								id="kc-login"
								type="submit"
							>
								{msgStr('doLogIn')}
							</Button>
						</div>
					</Stack>
				)}
			</div>
		</Template>
	);
}

function PasswordTextField({
	messagesPerField,
	msg,
}: {
	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	messagesPerField: any;
	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	msg: any;
}) {
	const [showPassword, setShowPassword] = useState(false);

	const handleClickShowPassword = () => setShowPassword((show) => !show);

	const handleMousePassword = (event: React.MouseEvent<HTMLButtonElement>) => {
		event.preventDefault();
	};

	return (
		<FormControl variant="outlined" fullWidth>
			<InputLabel
				htmlFor="outlined-adornment-password"
				error={messagesPerField.existsError('username', 'password')}
			>
				{msg('password')}
			</InputLabel>
			<OutlinedInput
				id="outlined-adornment-password"
				type={showPassword ? 'text' : 'password'}
				tabIndex={3}
				name="password"
				autoComplete="current-password"
				aria-invalid={messagesPerField.existsError('username', 'password')}
				error={messagesPerField.existsError('username', 'password')}
				endAdornment={
					<InputAdornment position="end">
						<IconButton
							aria-label="toggle password visibility"
							onClick={handleClickShowPassword}
							onMouseDown={handleMousePassword}
							onMouseUp={handleMousePassword}
							edge="end"
						>
							{showPassword ? <VisibilityOffIcon /> : <VisibilityIcon />}
						</IconButton>
					</InputAdornment>
				}
			/>
			<FormHelperText
				id="outlined-password-helper-text"
				error={messagesPerField.existsError('username', 'password')}
			>
				{messagesPerField.getFirstError('username', 'password')}
			</FormHelperText>
		</FormControl>
	);
}
