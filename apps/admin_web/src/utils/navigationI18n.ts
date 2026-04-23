import { navGroups } from '../config/navigation'
import type { I18nMessages } from '../i18n/types'

type NavigationKey = keyof I18nMessages['navigation']

const getNavigationLabel = (messages: I18nMessages, key: string, fallback: string) => {
  return messages.navigation[key as NavigationKey] ?? fallback
}

export const getNavigationBreadcrumbLabels = (
  messages: I18nMessages,
  basePath: string,
  fallback: readonly string[] = [],
) => {
  const group = navGroups.find((item) => item.children.some((child) => child.path === basePath))
  const child = group?.children.find((item) => item.path === basePath)

  return [
    group ? getNavigationLabel(messages, group.key, group.label) : fallback[0],
    child ? getNavigationLabel(messages, child.key, child.label) : fallback[1],
  ]
}
