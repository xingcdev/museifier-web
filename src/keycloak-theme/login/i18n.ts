import { createUseI18n } from 'keycloakify/login';

export const { useI18n, ofTypeI18n } = createUseI18n({
	en: {
		loginTitle: 'Connexion - Muséifier',
		email: 'Email',
	},
	fr: {
		loginTitle: 'Connexion - Muséifier',
		email: 'Email',
	},
});

export type I18n = typeof ofTypeI18n;
