import { createUseI18n } from 'keycloakify/login';

export const { useI18n, ofTypeI18n } = createUseI18n({
	fr: {
		email: 'Email',
	},
});

export type I18n = typeof ofTypeI18n;
