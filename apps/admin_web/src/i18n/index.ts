import { enUSMessages } from './locales/en-US'
import { koKRMessages } from './locales/ko-KR'
import { zhCNMessages } from './locales/zh-CN'
import type { I18nMessages, LocaleCode, LocaleOption } from './types'

export const defaultLocale: LocaleCode = 'zh-CN'

export const localeOptions: LocaleOption[] = [
  { code: 'zh-CN', label: '中文' },
  { code: 'en-US', label: 'English' },
  { code: 'ko-KR', label: '한국어' },
]

export const i18nResources: Record<LocaleCode, I18nMessages> = {
  'zh-CN': zhCNMessages,
  'en-US': enUSMessages,
  'ko-KR': koKRMessages,
}

export const getMessages = (locale: LocaleCode = defaultLocale) => {
  return i18nResources[locale] ?? i18nResources[defaultLocale]
}

export type { I18nMessages, LocaleCode, LocaleOption }
