import type { zhCNMessages } from './locales/zh-CN'

export type LocaleCode = 'zh-CN' | 'en-US' | 'ko-KR'

type DeepStringValues<T> = {
  readonly [K in keyof T]: T[K] extends string ? string : DeepStringValues<T[K]>
}

export type I18nMessages = DeepStringValues<typeof zhCNMessages>

export type LocaleOption = {
  code: LocaleCode
  label: string
}
