import { MenuFoldOutlined, MenuUnfoldOutlined } from '@ant-design/icons'
import { Badge, Button, Dropdown, Layout, Menu, Space, Typography, message } from 'antd'
import { Input, List, Modal } from 'antd'
import { CloseOutlined, MessageOutlined, PlusOutlined, SearchOutlined } from '@ant-design/icons'
import type { MenuProps } from 'antd'
import { useEffect, useMemo, useRef, useState } from 'react'
import { Link, Outlet, useLocation, useNavigate } from 'react-router-dom'
import globeIcon from '../assets/globe.svg'
import logoImg from '../assets/logo.svg'
import { navGroups } from '../config/navigation'
import { I18nContext } from '../i18n/context'
import { defaultLocale, getMessages, localeOptions, type LocaleCode } from '../i18n'
import { fetchWithAuth, getUserInfo, logout, getToken } from '../services/auth'
import { Editor } from '@tinymce/tinymce-react'

const { Header, Sider, Content } = Layout
const { Text } = Typography
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL ?? ''
const LOCALE_STORAGE_KEY = 'ps-v3-locale'

type FeedbackStatus = 'modified' | 'followed' | 'unread'

type FeedbackItem = {
  id: string
  title: string
  content: string
  category: string
  status: FeedbackStatus
  author?: string | null
  created_at?: string
}

type FeedbackApiRecord = FeedbackItem & {
  author?: string | null
  source?: string | null
  created_at?: string
}

type SaveFeedbackOptions = {
  feedbackId: string
  title: string
  content: string
  category: string
  selectSaved?: boolean
  showMessage?: boolean
}

const feedbackStatusConfig: Record<FeedbackStatus, { color: string; label: string }> = {
  modified: { color: '#52c41a', label: '已修改' },
  followed: { color: '#faad14', label: '已关注' },
  unread: { color: '#94a3b8', label: '未读' },
}
const feedbackStatusMenuItems: MenuProps['items'] = Object.entries(feedbackStatusConfig).map(([key, value]) => ({
  key,
  label: value.label,
}))

const formatFeedbackTime = (value?: string) => {
  if (!value) return '未保存'

  const date = new Date(value)
  if (Number.isNaN(date.getTime())) return '未知时间'

  return date.toLocaleString('zh-CN', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
    hour12: false,
  })
}

const getFeedbackCategory = (pathname: string) => {
  const cleanPath = pathname.replace(/\/+$/, '') || '/'
  const basePaths = navGroups
    .flatMap((group) => group.children.map((child) => child.path))
    .filter((path) => path !== '/')
    .sort((a, b) => b.length - a.length)
  const basePath = basePaths.find((path) => cleanPath === path || cleanPath.startsWith(`${path}/`))

  if (basePath && cleanPath !== basePath) {
    return `${basePath}/:id`
  }

  return cleanPath
}

const getInitialLocale = (): LocaleCode => {
  const savedLocale = window.localStorage.getItem(LOCALE_STORAGE_KEY)
  return localeOptions.some((option) => option.code === savedLocale) ? (savedLocale as LocaleCode) : defaultLocale
}

export function AppLayout() {
  const location = useLocation()
  const navigate = useNavigate()
  const [collapsed, setCollapsed] = useState(false)
  const [language, setLanguage] = useState<LocaleCode>(getInitialLocale)
  const [feedbackOpen, setFeedbackOpen] = useState(false)
  const [feedbackItems, setFeedbackItems] = useState<FeedbackItem[]>([])
  const [selectedFeedbackId, setSelectedFeedbackId] = useState('')
  const [feedbackTitle, setFeedbackTitle] = useState('')
  const [feedbackContent, setFeedbackContent] = useState('')
  const [feedbackLoading, setFeedbackLoading] = useState(false)
  const [feedbackSaving, setFeedbackSaving] = useState(false)
  const [hoveredFeedbackId, setHoveredFeedbackId] = useState('')
  const contentRef = useRef<HTMLElement | null>(null)

  const currentUser = getUserInfo()
  const canConfirmFeedbackStatus = Boolean(
    currentUser?.username.toLowerCase() === 'admin' || currentUser?.roles.includes('admin'),
  )
  const feedbackCategory = useMemo(() => getFeedbackCategory(location.pathname), [location.pathname])
  const messages = useMemo(() => getMessages(language), [language])
  const i18nValue = useMemo(
    () => ({
      locale: language,
      messages,
      setLocale: setLanguage,
    }),
    [language, messages],
  )
  const selectedFeedback = feedbackItems.find((item) => item.id === selectedFeedbackId)
  const pendingFeedbackCount = feedbackItems.filter((item) => item.status !== 'modified').length

  const canDeleteFeedbackItem = (item: FeedbackItem) => {
    const isOwner = Boolean(
      item.author && currentUser?.username && item.author.trim().toLowerCase() === currentUser.username.trim().toLowerCase(),
    )

    return canConfirmFeedbackStatus || isOwner
  }

  const hasFeedbackDraftChanged = (item: FeedbackItem | undefined) => {
    const title = feedbackTitle.trim()
    const content = feedbackContent.trim()

    if (!item) {
      return Boolean(title || content)
    }

    return title !== item.title || content !== item.content.trim()
  }

  const persistCurrentFeedbackDraft = () => {
    setFeedbackItems((items) =>
      items.map((item) =>
        item.id === selectedFeedbackId
          ? {
            ...item,
            title: feedbackTitle.trim() || item.title,
            content: feedbackContent,
          }
          : item,
      ),
    )
  }

  const submitFeedback = async ({
    feedbackId,
    title,
    content,
    category,
    selectSaved = false,
    showMessage = false,
  }: SaveFeedbackOptions) => {
    const cleanTitle = title.trim()
    const cleanContent = content.trim()

    if (!cleanTitle || !cleanContent) {
      return null
    }

    const isNewFeedback = !feedbackId || feedbackId.startsWith('local-')
    const response = await fetchWithAuth(
      isNewFeedback ? `${API_BASE_URL}/api/feedback` : `${API_BASE_URL}/api/feedback/${feedbackId}`,
      {
        method: isNewFeedback ? 'POST' : 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          title: cleanTitle,
          content: cleanContent,
          source: 'ps-v3',
          category,
          status: 'unread',
        }),
      },
    )

    if (!response.ok) {
      throw new Error(await response.text())
    }

    const data = (await response.json()) as { record: FeedbackApiRecord }
    const savedItem = {
      id: data.record.id,
      title: data.record.title,
      content: data.record.content,
      category: data.record.category,
      status: data.record.status,
      author: data.record.author,
      created_at: data.record.created_at,
    }

    setFeedbackItems((items) => {
      const hasCurrentItem = items.some((item) => item.id === feedbackId)

      if (!hasCurrentItem) {
        return [savedItem, ...items]
      }

      return items.map((item) => (item.id === feedbackId ? savedItem : item))
    })

    if (selectSaved) {
      setSelectedFeedbackId(savedItem.id)
      setFeedbackTitle(savedItem.title)
      setFeedbackContent(savedItem.content)
    }

    if (showMessage) {
      message.success('意见已保存')
    }

    return savedItem
  }

  const handleSelectFeedback = async (item: FeedbackItem) => {
    if (item.id === selectedFeedbackId) return
    if (feedbackSaving) return

    persistCurrentFeedbackDraft()
    const currentFeedbackId = selectedFeedbackId
    const currentTitle = feedbackTitle
    const currentContent = feedbackContent
    const shouldSaveCurrentFeedback = hasFeedbackDraftChanged(selectedFeedback)

    if (currentFeedbackId && shouldSaveCurrentFeedback && currentTitle.trim() && currentContent.trim()) {
      setFeedbackSaving(true)
      try {
        await submitFeedback({
          feedbackId: currentFeedbackId,
          title: currentTitle,
          content: currentContent,
          category: selectedFeedback?.category ?? feedbackCategory,
        })
      } catch (error) {
        console.error(error)
        message.error('当前意见保存失败，请确认 pyapi 服务已启动')
        setFeedbackSaving(false)
        return
      }
      setFeedbackSaving(false)
    }

    setSelectedFeedbackId(item.id)
    setFeedbackTitle(item.title)
    setFeedbackContent(item.content)
  }

  const handleAddFeedback = () => {
    persistCurrentFeedbackDraft()
    const nextId = `local-${Date.now()}`
    const title = `意见 ${feedbackItems.length + 1}`
    const nextItem: FeedbackItem = {
      id: nextId,
      title,
      content: '',
      category: feedbackCategory,
      status: 'unread',
      author: currentUser?.username,
      created_at: undefined,
    }

    setFeedbackItems((items) => [...items, nextItem])
    setSelectedFeedbackId(nextId)
    setFeedbackTitle(title)
    setFeedbackContent('')
  }

  const handleCloseFeedback = () => {
    persistCurrentFeedbackDraft()
    setFeedbackOpen(false)
  }

  const loadFeedbackItems = async (category: string, options?: { syncEditor?: boolean; silent?: boolean }) => {
    if (options?.syncEditor) {
      setFeedbackLoading(true)
    }

    try {
      const response = await fetchWithAuth(`${API_BASE_URL}/api/feedback?category=${encodeURIComponent(category)}`)
      if (!response.ok) {
        throw new Error(await response.text())
      }

      const data = (await response.json()) as { items?: FeedbackApiRecord[] }
      const items = (data.items ?? []).map((item) => ({
        id: item.id,
        title: item.title,
        content: item.content,
        category: item.category,
        status: item.status,
        author: item.author,
        created_at: item.created_at,
      }))

      setFeedbackItems(items)

      if (options?.syncEditor) {
        if (items.length > 0) {
          setSelectedFeedbackId(items[0].id)
          setFeedbackTitle(items[0].title)
          setFeedbackContent(items[0].content)
        } else {
          setSelectedFeedbackId('')
          setFeedbackTitle('')
          setFeedbackContent('')
        }
      }
    } catch (error) {
      console.error(error)
      if (!options?.silent) {
        message.error('意见列表加载失败，请确认 pyapi 服务已启动')
      }
    } finally {
      if (options?.syncEditor) {
        setFeedbackLoading(false)
      }
    }
  }

  useEffect(() => {
    loadFeedbackItems(feedbackCategory, { silent: true, syncEditor: feedbackOpen })
    if (!feedbackOpen) {
      setSelectedFeedbackId('')
      setFeedbackTitle('')
      setFeedbackContent('')
    }
  }, [feedbackCategory])

  useEffect(() => {
    window.localStorage.setItem(LOCALE_STORAGE_KEY, language)
  }, [language])

  useEffect(() => {
    const scrollContainer = contentRef.current
    if (!scrollContainer) return

    const updateStickyBarState = () => {
      const isStuck = scrollContainer.scrollTop > 0
      scrollContainer.querySelectorAll<HTMLElement>('.app-sticky-page-bar').forEach((bar) => {
        bar.classList.toggle('is-stuck', isStuck)
      })
    }

    updateStickyBarState()
    scrollContainer.addEventListener('scroll', updateStickyBarState, { passive: true })
    window.addEventListener('resize', updateStickyBarState)

    return () => {
      scrollContainer.removeEventListener('scroll', updateStickyBarState)
      window.removeEventListener('resize', updateStickyBarState)
    }
  }, [location.pathname, location.search])

  const handleOpenFeedback = async () => {
    setFeedbackOpen(true)
    await loadFeedbackItems(feedbackCategory, { syncEditor: true })
  }

  const handleSaveFeedback = async () => {
    const title = feedbackTitle.trim()
    const content = feedbackContent.trim()

    if (!title) {
      message.warning('请输入意见标题')
      return
    }

    if (!content) {
      message.warning('请输入意见内容')
      return
    }

    setFeedbackItems((items) =>
      items.map((item) =>
        item.id === selectedFeedbackId
          ? {
            ...item,
            title,
            content,
          }
          : item,
      ),
    )

    setFeedbackSaving(true)
    try {
      await submitFeedback({
        feedbackId: selectedFeedbackId,
        title,
        content,
        category: selectedFeedback?.category ?? feedbackCategory,
        selectSaved: true,
        showMessage: true,
      })
    } catch (error) {
      console.error(error)
      message.error('意见保存失败，请确认 pyapi 服务已启动')
    } finally {
      setFeedbackSaving(false)
    }
  }

  const handleConfirmFeedbackStatus = async (item: FeedbackItem, nextStatus: FeedbackStatus) => {
    if (!canConfirmFeedbackStatus || item.status === nextStatus) return

    if (!item.id || item.id.startsWith('local-')) {
      setFeedbackItems((items) => items.map((current) => (current.id === item.id ? { ...current, status: nextStatus } : current)))
      return
    }

    setFeedbackSaving(true)
    try {
      const response = await fetchWithAuth(`${API_BASE_URL}/api/feedback/${item.id}/status`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          status: nextStatus,
        }),
      })

      if (!response.ok) {
        throw new Error(await response.text())
      }

      const data = (await response.json()) as { record: FeedbackApiRecord }
      const savedItem = {
        id: data.record.id,
        title: data.record.title,
        content: data.record.content,
        category: data.record.category,
        status: data.record.status,
        author: data.record.author,
        created_at: data.record.created_at,
      }

      setFeedbackItems((items) => items.map((current) => (current.id === item.id ? { ...current, status: savedItem.status } : current)))
      message.success('状态已确认')
    } catch (error) {
      console.error(error)
      message.error('状态确认失败，请确认当前账号有权限')
    } finally {
      setFeedbackSaving(false)
    }
  }

  const removeFeedbackFromList = (feedbackId: string) => {
    const nextItems = feedbackItems.filter((item) => item.id !== feedbackId)
    const nextItem = nextItems[0]

    setFeedbackItems(nextItems)
    setSelectedFeedbackId(nextItem?.id ?? '')
    setFeedbackTitle(nextItem?.title ?? '')
    setFeedbackContent(nextItem?.content ?? '')
  }

  const handleDeleteFeedback = (item: FeedbackItem) => {
    if (!canDeleteFeedbackItem(item)) return

    Modal.confirm({
      title: '确认删除该意见？',
      content: '删除后无法恢复，请确认是否继续。',
      width: 300,
      okText: '删除',
      okType: 'danger',
      cancelText: '取消',
      onOk: async () => {
        if (item.id.startsWith('local-')) {
          removeFeedbackFromList(item.id)
          return
        }

        setFeedbackSaving(true)
        try {
          const response = await fetchWithAuth(`${API_BASE_URL}/api/feedback/${item.id}`, {
            method: 'DELETE',
          })

          if (!response.ok) {
            throw new Error(await response.text())
          }

          removeFeedbackFromList(item.id)
          message.success('意见已删除')
        } catch (error) {
          console.error(error)
          message.error('删除失败，请确认当前账号有权限')
          throw error
        } finally {
          setFeedbackSaving(false)
        }
      },
    })
  }

  const menuItems = useMemo<MenuProps['items']>(() => {
    return navGroups.map((group) => {
      const groupLabel = messages.navigation[group.key as keyof typeof messages.navigation] ?? group.label

      if (group.key === 'dashboard') {
        const child = group.children[0]
        return {
          key: child.path,
          icon: group.icon,
          label: <Link to={child.path}>{groupLabel}</Link>,
        }
      }

      return {
        key: group.key,
        icon: group.icon,
        label: groupLabel,
        children: group.children.map((child) => ({
          key: child.path,
          label: (
            <Link to={child.path}>
              {messages.navigation[child.key as keyof typeof messages.navigation] ?? child.label}
            </Link>
          ),
        })),
      }
    })
  }, [messages])

  const selectedPath =
    navGroups
      .flatMap((group) => group.children)
      .find((child) => location.pathname === child.path || location.pathname.startsWith(`${child.path}/`))
      ?.path ?? location.pathname

  const selectedKeys = [selectedPath]
  const openKeys = navGroups
    .filter(
      (group) =>
        group.key !== 'dashboard' &&
        group.children.some((child) => location.pathname === child.path || location.pathname.startsWith(`${child.path}/`)),
    )
    .map((group) => group.key)
  const currentNavGroup = navGroups.find((group) =>
    group.children.some((child) => location.pathname === child.path || location.pathname.startsWith(`${child.path}/`)),
  )
  const currentNavItem = currentNavGroup?.children.find(
    (child) => location.pathname === child.path || location.pathname.startsWith(`${child.path}/`),
  )
  const feedbackNavigationText = [
    currentNavGroup
      ? messages.navigation[currentNavGroup.key as keyof typeof messages.navigation] ?? currentNavGroup.label
      : '',
    currentNavItem ? messages.navigation[currentNavItem.key as keyof typeof messages.navigation] ?? currentNavItem.label : '',
    currentNavItem && location.pathname !== currentNavItem.path ? messages.common.detail : '',
  ]
    .filter(Boolean)
    .join(' / ')

  const languageMenuItems: MenuProps['items'] = localeOptions.map((option) => ({
    key: option.code,
    label: option.label,
  }))

  const userMenuItems: MenuProps['items'] = [
    {
      key: 'current-user',
      label: (
        <span style={{ color: '#64748b', fontWeight: 600 }}>
          {currentUser?.realName || currentUser?.username || messages.layout.anonymousUser}
        </span>
      ),
      disabled: true,
    },
    { type: 'divider' },
    { key: 'profile', label: messages.layout.profile },
    { key: 'logout', label: messages.layout.logout },
  ]

  return (
    <I18nContext.Provider value={i18nValue}>
      <Layout style={{ height: '100vh', overflow: 'hidden' }}>
        <Header
          className="app-header"
          style={{
            background: '#fff',
            borderBottom: '1px solid #cbd0dd',
            paddingInline: 24,
            height: 64,
            lineHeight: '64px',
            zIndex: 10,
            display: 'flex',
            alignItems: 'center',
            flexShrink: 0,
          }}
        >
          <div style={{ width: '100%', display: 'flex', justifyContent: 'space-between', alignItems: 'center', height: '100%' }}>
            <div style={{ display: 'flex', alignItems: 'center' }}>
              <div style={{ width: '240px', display: 'flex', alignItems: 'center' }}>
                <img src={logoImg} alt="logo" width={24} height={24} />
                <Text strong style={{ color: '#6e7891', lineHeight: 1, fontSize: '20px', paddingLeft: '10px' }}>
                  {messages.layout.productService}
                </Text>
              </div>
              <div style={{ width: 364 }}>
                <Input
                  className="app-header-scan-input"
                  placeholder={messages.layout.scanBarcode}
                  prefix={(
                    <svg
                      className="app-header-scan-prefix"
                      xmlns="http://www.w3.org/2000/svg"
                      width="16"
                      height="16"
                      fill="currentColor"
                      viewBox="0 0 16 16"
                    >
                      <path d="M1.5 1a.5.5 0 0 0-.5.5v3a.5.5 0 0 1-1 0v-3A1.5 1.5 0 0 1 1.5 0h3a.5.5 0 0 1 0 1zM11 .5a.5.5 0 0 1 .5-.5h3A1.5 1.5 0 0 1 16 1.5v3a.5.5 0 0 1-1 0v-3a.5.5 0 0 0-.5-.5h-3a.5.5 0 0 1-.5-.5M.5 11a.5.5 0 0 1 .5.5v3a.5.5 0 0 0 .5.5h3a.5.5 0 0 1 0 1h-3A1.5 1.5 0 0 1 0 14.5v-3a.5.5 0 0 1 .5-.5m15 0a.5.5 0 0 1 .5.5v3a1.5 1.5 0 0 1-1.5 1.5h-3a.5.5 0 0 1 0-1h3a.5.5 0 0 0 .5-.5v-3a.5.5 0 0 1 .5-.5M3 4.5a.5.5 0 0 1 1 0v7a.5.5 0 0 1-1 0zm2 0a.5.5 0 0 1 1 0v7a.5.5 0 0 1-1 0zm2 0a.5.5 0 0 1 1 0v7a.5.5 0 0 1-1 0zm2 0a.5.5 0 0 1 .5-.5h1a.5.5 0 0 1 .5.5v7a.5.5 0 0 1-.5.5h-1a.5.5 0 0 1-.5-.5zm3 0a.5.5 0 0 1 1 0v7a.5.5 0 0 1-1 0z" />
                    </svg>
                  )}
                  suffix={<SearchOutlined className="app-header-scan-suffix" />}
                />
              </div>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: 16, height: '100%' }}>
              <button
                title={messages.layout.feedback}
                className="app-top-icon-btn"
                onClick={handleOpenFeedback}
                style={{
                  height: 34,
                  padding: '0 10px',
                  border: 'none',
                  borderRadius: 9999,
                  color: '#64748b',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: 6,
                  cursor: 'pointer',
                  fontWeight: 600,
                }}
              >
                <Badge count={pendingFeedbackCount} size="small" offset={[4, -2]}>
                  <MessageOutlined style={{ fontSize: '19px' }} />
                </Badge>
              </button>

              <Dropdown
                trigger={['click']}
                menu={{
                  items: languageMenuItems,
                  selectedKeys: [language],
                  onClick: ({ key }) => setLanguage(key as LocaleCode),
                }}
              >
                <button
                  title={messages.layout.language}
                  className="app-top-icon-btn"
                  style={{
                    padding: 8,
                    border: 'none',
                    borderRadius: 9999,
                    color: '#64748b',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    cursor: 'pointer',
                  }}
                >
                  <img
                    src={globeIcon}
                    alt={messages.layout.language}
                    width={20}
                    height={20}
                    style={{
                      display: 'block',
                      filter: 'invert(46%) sepia(11%) saturate(563%) hue-rotate(176deg) brightness(91%) contrast(88%)',
                    }}
                  />
                </button>
              </Dropdown>

              <div style={{ display: 'flex', alignItems: 'center', gap: 12, paddingLeft: 16, borderLeft: '1px solid #e2e8f0', height: 32 }}>
                <Dropdown
                  trigger={['click']}
                  menu={{
                    items: userMenuItems,
                    onClick: ({ key }) => {
                      if (key === 'profile') navigate('/permission/user')
                      if (key === 'logout') {
                        logout().finally(() => navigate('/login', { replace: true }))
                      }
                    },
                  }}
                >
                  <button
                    className="app-top-avatar-btn"
                    style={{
                      width: 36,
                      height: 36,
                      borderRadius: 50,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      border: 'none',
                      cursor: 'pointer',
                      padding: 0,
                    }}
                  >
                    <svg style={{ fill: 'currentColor' }} viewBox="0 0 1024 1024" width="20" height="20">
                      <path d="M502.178909 38.632727c-131.072 0-237.521455 104.168727-237.521454 232.727273s106.402909 232.727273 237.521454 232.727273c131.165091 0 237.568-104.168727 237.568-232.727273s-106.309818-232.727273-237.568-232.727273z m0 0c-131.072 0-237.521455 104.168727-237.521454 232.727273s106.402909 232.727273 237.521454 232.727273c131.165091 0 237.568-104.168727 237.568-232.727273s-106.309818-232.727273-237.568-232.727273zM413.184 581.678545c-169.472 0-306.874182 134.609455-306.874182 300.590546v19.316364c0 67.909818 137.402182 67.956364 306.874182 67.956363h197.957818c169.425455 0 306.781091-2.513455 306.781091-67.956363v-19.316364c0-165.981091-137.355636-300.590545-306.781091-300.590546H413.184z m0 0" />
                    </svg>
                  </button>
                </Dropdown>
              </div>
            </div>
          </div>
        </Header>

        <style>{`
        .tox-tinymce {
          --tox-private-keyboard-focus-outline-color: transparent !important;
          --tox-private-keyboard-focus-outline-width: 0 !important;
          border: none !important;
          border-radius: 0 !important;
          box-shadow: none !important;
          outline: none !important;
          cursor: text !important;
        }
        .tox-tinymce--focused {
          border-color: transparent !important;
          box-shadow: none !important;
          outline: none !important;
        }
        .tox-edit-area__iframe,
        .tox-edit-area__iframe:focus {
          outline: none !important;
        }
      `}</style>
        <Modal
          title={(
            <span style={{ display: 'inline-flex', alignItems: 'center', gap: 10 }}>
              <span>{messages.feedback.title}</span>
              <span style={{ color: '#94a3b8', fontSize: 13, fontWeight: 400 }}>
                {feedbackNavigationText || location.pathname}
              </span>
            </span>
          )}
          open={feedbackOpen}
          onCancel={handleCloseFeedback}
          closable
          footer={null}
          width={900}
        >
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            <div style={{ display: 'grid', gridTemplateColumns: '250px 1fr', gap: 0, height: 480, border: '1px solid #d9d9d9', borderRadius: 8, overflow: 'hidden' }}>
              <List
                bordered={false}
                loading={feedbackLoading}
                size="small"
                dataSource={feedbackItems}
                style={{ height: '100%', overflow: 'auto', borderRight: '1px solid #d9d9d9', borderRadius: 0 }}
                renderItem={(item) => {
                  const statusConfig = feedbackStatusConfig[item.status]
                  const canDeleteCurrentItem = canDeleteFeedbackItem(item)
                  const showDeleteIcon = canDeleteCurrentItem && hoveredFeedbackId === item.id
                  const statusDot = (
                    <span
                      title={statusConfig.label}
                      style={{
                        width: 7,
                        height: 7,
                        borderRadius: 9999,
                        background: statusConfig.color,
                        flexShrink: 0,
                        display: 'inline-block',
                      }}
                    />
                  )

                  return (
                    <List.Item
                      onClick={() => handleSelectFeedback(item)}
                      onMouseEnter={() => setHoveredFeedbackId(item.id)}
                      onMouseLeave={() => setHoveredFeedbackId('')}
                      style={{
                        cursor: 'pointer',
                        background: item.id === selectedFeedbackId ? '#e6f4ff' : undefined,
                        color: item.id === selectedFeedbackId ? '#1677ff' : undefined,
                      }}
                    >
                      <span style={{ display: 'flex', alignItems: 'center', gap: 8, minWidth: 0, width: '100%' }}>
                        <span style={{ display: 'inline-flex', alignItems: 'center', gap: 8, minWidth: 0, flex: 1 }}>
                          {canConfirmFeedbackStatus ? (
                            <Dropdown
                              trigger={['click']}
                              menu={{
                                items: feedbackStatusMenuItems,
                                selectedKeys: [item.status],
                                onClick: ({ key, domEvent }) => {
                                  domEvent.stopPropagation()
                                  handleConfirmFeedbackStatus(item, key as FeedbackStatus)
                                },
                              }}
                            >
                              <button
                                type="button"
                                title={`确认状态：${statusConfig.label}`}
                                onClick={(event) => event.stopPropagation()}
                                style={{
                                  border: 'none',
                                  background: 'transparent',
                                  padding: 4,
                                  margin: -4,
                                  display: 'inline-flex',
                                  alignItems: 'center',
                                  cursor: 'pointer',
                                }}
                              >
                                {statusDot}
                              </button>
                            </Dropdown>
                          ) : (
                            statusDot
                          )}
                          <span style={{ display: 'inline-flex', flexDirection: 'column', minWidth: 0, lineHeight: 1.2 }}>
                            <span style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{item.title}</span>
                            <span style={{ color: '#94a3b8' }}>
                              {item.author || '未知用户'} · {formatFeedbackTime(item.created_at)}
                            </span>
                          </span>
                        </span>
                        {canDeleteCurrentItem ? (
                          <button
                            type="button"
                            title="删除意见"
                            onClick={(event) => {
                              event.stopPropagation()
                              handleDeleteFeedback(item)
                            }}
                            style={{
                              width: 16,
                              height: 16,
                              border: showDeleteIcon ? '1px solid #ffccc7' : '1px solid transparent',
                              borderRadius: 9999,
                              background: '#fff',
                              color: showDeleteIcon ? '#ff4d4f' : '#94a3b8',
                              cursor: 'pointer',
                              padding: 0,
                              opacity: showDeleteIcon ? 1 : 0,
                              pointerEvents: showDeleteIcon ? 'auto' : 'none',
                              display: 'inline-flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                              transform: 'translateX(5px)',
                              transition: 'opacity 0.15s ease, background 0.15s ease, color 0.15s ease',
                              flexShrink: 0,
                            }}
                          >
                            <CloseOutlined />
                          </button>
                        ) : null}
                      </span>
                    </List.Item>
                  )
                }}
              />
              <div style={{ display: 'flex', flexDirection: 'column', gap: 0 }}>
                <div style={{ height: '100%', overflow: 'hidden', cursor: 'text' }}>
                  <Editor
                    tinymceScriptSrc="/tinymce/tinymce.min.js"
                    apiKey={import.meta.env.VITE_TINYMCE_API_KEY}
                    licenseKey="gpl"
                    value={feedbackContent}
                    onEditorChange={(content) => {
                      setFeedbackContent(content)

                      // 提取第一行文字作为标题
                      const tempDiv = document.createElement('div')
                      tempDiv.innerHTML = content
                      const text = tempDiv.textContent || tempDiv.innerText || ''
                      const lines = text.trim().split('\n').filter(line => line.trim())
                      const firstLine = lines[0]?.trim()

                      const newTitle = firstLine || `意见 ${feedbackItems.length}`

                      setFeedbackTitle(newTitle)

                      // 同步更新左侧列表中的标题
                      setFeedbackItems(items => items.map(item =>
                        item.id === selectedFeedbackId ? { ...item, title: newTitle, content } : item
                      ))
                    }}
                    init={{
                      height: '100%',
                      menubar: false,
                      plugins: [
                        'advlist', 'autolink', 'lists', 'link', 'image', 'charmap', 'preview',
                        'anchor', 'searchreplace', 'visualblocks', 'code', 'fullscreen',
                        'insertdatetime', 'media', 'table', 'code', 'help', 'wordcount'
                      ],
                      toolbar: false,
                      content_style: 'body { font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, "Noto Sans", sans-serif, "Apple Color Emoji", "Segoe UI Emoji", "Segoe UI Symbol", "Noto Color Emoji"; font-size: 14px }',
                      branding: false,
                      promotion: false,
                      statusbar: false,
                      placeholder: selectedFeedback ? messages.feedback.editContentPlaceholder : messages.feedback.contentPlaceholder,
                      auto_focus: true,
                      setup: (editor) => {
                        editor.on('init', () => {
                          editor.getContainer().style.border = 'none';
                          editor.getContainer().style.cursor = 'text';
                          editor.getContainer().style.outline = 'none';
                          editor.focus();
                        });
                      },
                      images_upload_handler: (blobInfo) => new Promise((resolve, reject) => {
                        const xhr = new XMLHttpRequest();
                        xhr.withCredentials = true;
                        xhr.open('POST', `${API_BASE_URL}/api/upload`);

                        const token = getToken();
                        if (token) {
                          xhr.setRequestHeader('Authorization', `Bearer ${token}`);
                        }

                        xhr.onload = () => {
                          if (xhr.status < 200 || xhr.status >= 300) {
                            reject('HTTP Error: ' + xhr.status);
                            return;
                          }

                          const json = JSON.parse(xhr.responseText);

                          if (!json || typeof json.location !== 'string') {
                            reject('Invalid JSON: ' + xhr.responseText);
                            return;
                          }

                          resolve(API_BASE_URL + json.location);
                        };

                        xhr.onerror = () => {
                          reject('Image upload failed due to a XHR Transport error. Code: ' + xhr.status);
                        };

                        const formData = new FormData();
                        formData.append('file', blobInfo.blob(), blobInfo.filename());

                        xhr.send(formData);
                      }),
                    }}
                  />
                </div>
              </div>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: '250px 1fr', gap: 0, alignItems: 'center' }}>
              <div style={{ display: 'flex', justifyContent: 'center' }}>
                <Button type="link" icon={<PlusOutlined />} onClick={handleAddFeedback} style={{ padding: 0 }}>
                  {messages.feedback.addTitle}
                </Button>
              </div>
              <Space style={{ width: '100%', justifyContent: 'flex-end' }}>
                <Button key="save" type="primary" loading={feedbackSaving} onClick={handleSaveFeedback}>
                  {messages.common.save}
                </Button>
                <Button key="close" onClick={handleCloseFeedback}>
                  {messages.common.close}
                </Button>
              </Space>
            </div>
          </div>
        </Modal>

        <Layout style={{ minHeight: 0 }}>
          <Sider
            className="app-sider"
            width={240}
            collapsedWidth={72}
            collapsible
            collapsed={collapsed}
            trigger={null}
            theme="light"
            style={{ borderRight: '1px solid #cbd0dd', position: 'relative' }}
          >
            <Menu
              mode="inline"
              items={menuItems}
              inlineCollapsed={collapsed}
              selectedKeys={selectedKeys}
              defaultOpenKeys={openKeys}
              onClick={(event) => navigate(event.key)}
              style={{ borderInlineEnd: 'none', height: 'calc(100% - 52px)', paddingTop: 12, overflow: 'auto' }}
            />

            <div
              style={{
                position: 'absolute',
                left: 0,
                right: 0,
                bottom: 0,
                height: 52,
                borderTop: '1px solid #e2e8f0',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                background: '#fff',
              }}
            >
              <Button
                type="text"
                onClick={() => setCollapsed((value) => !value)}
                icon={collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
                style={{ width: collapsed ? 40 : 200 }}
              >
                {collapsed ? '' : '折叠菜单'}
              </Button>
            </div>
          </Sider>

          <Content ref={contentRef} style={{ padding: 24, overflow: 'auto', minHeight: 0 }}>
            <Outlet />
          </Content>
        </Layout>
      </Layout>
    </I18nContext.Provider>
  )
}
