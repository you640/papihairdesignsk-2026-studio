export const i18n = {
    locales: ['sk'],
    defaultLocale: 'sk',
} as const

export type Locale = (typeof i18n.locales)[number]
