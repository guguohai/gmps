import { createContext, useContext } from 'react'
import { defaultLocale, getMessages } from './index'
import type { I18nMessages, LocaleCode } from './types'

type I18nContextValue = {
  locale: LocaleCode
  messages: I18nMessages
  setLocale: (locale: LocaleCode) => void
}

export const I18nContext = createContext<I18nContextValue>({
  locale: defaultLocale,
  messages: getMessages(defaultLocale),
  setLocale: () => undefined,
})

export const useI18n = () => useContext(I18nContext)
