// 认证服务 - 登录、Token 管理

const TOKEN_KEY = 'ps_auth_token'
const USER_KEY = 'ps_user_info'
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL ?? 'http://localhost:8000'

export type UserInfo = {
  userId: string
  username: string
  realName: string
  avatar?: string
  roles: string[]
  permissions: string[]
}

export type LoginCredentials = {
  username: string
  password: string
  remember?: boolean
}

export type LoginResult = {
  token: string
  expiresIn: number
  user: UserInfo
}

/**
 * 用户登录
 * POST /api/auth/login
 */
export async function login(credentials: LoginCredentials): Promise<{
  code: number
  message: string
  data?: LoginResult
}> {
  const response = await fetch(`${API_BASE_URL}/api/auth/login`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      username: credentials.username,
      password: credentials.password,
      remember: Boolean(credentials.remember),
    }),
  })

  if (!response.ok) {
    let message = '登录失败'
    try {
      const data = (await response.json()) as { detail?: string; message?: string }
      message = data.detail || data.message || message
    } catch {
      message = response.status === 401 ? '用户名或密码错误' : message
    }

    return {
      code: response.status,
      message,
    }
  }

  const payload = (await response.json()) as { code: number; message: string; data: LoginResult }
  const result = payload.data

  // 保存到本地存储
  setToken(result.token, credentials.remember)
  setUserInfo(result.user, credentials.remember)

  return {
    code: payload.code,
    message: payload.message,
    data: result,
  }
}

/**
 * 退出登录
 * POST /api/auth/logout
 */
export async function logout(): Promise<{ code: number; message: string }> {
  const token = getToken()
  if (token) {
    try {
      await fetch(`${API_BASE_URL}/api/auth/logout`, {
        method: 'POST',
        headers: getAuthHeaders(),
      })
    } catch {
      // 本地退出优先，后端退出失败不阻塞用户离开当前会话。
    }
  }

  clearAuth()

  return {
    code: 200,
    message: '退出成功'
  }
}

/**
 * 获取当前登录用户信息
 * GET /api/auth/userinfo
 */
export async function getCurrentUser(): Promise<{
  code: number
  message: string
  data?: UserInfo
}> {
  const token = getToken()
  if (!token) {
    return {
      code: 401,
      message: '未登录'
    }
  }
  
  const user = getUserInfo()
  if (!user) {
    return {
      code: 401,
      message: '登录已过期'
    }
  }
  
  return {
    code: 200,
    message: 'success',
    data: user
  }
}

/**
 * 刷新 Token
 * POST /api/auth/refresh
 */
export async function refreshToken(): Promise<{
  code: number
  message: string
  data?: { token: string; expiresIn: number }
}> {
  const oldToken = getToken()
  if (!oldToken) {
    return {
      code: 401,
      message: '未登录'
    }
  }

  return {
    code: 200,
    message: 'success',
    data: { token: oldToken, expiresIn: 24 * 60 * 60 }
  }
}

/**
 * 修改密码
 * POST /api/auth/password
 */
export async function changePassword(
  oldPassword: string,
  newPassword: string
): Promise<{ code: number; message: string }> {
  // 验证旧密码
  if (oldPassword !== '123456') {
    return {
      code: 400,
      message: '原密码错误'
    }
  }
  
  console.log('[Mock] Password changed to:', newPassword)
  
  return {
    code: 200,
    message: '密码修改成功'
  }
}

// ============================================
// Token 管理工具函数
// ============================================

export function getToken(): string | null {
  return localStorage.getItem(TOKEN_KEY) || sessionStorage.getItem(TOKEN_KEY)
}

export function setToken(token: string, remember?: boolean): void {
  const storage = remember ? localStorage : sessionStorage
  storage.setItem(TOKEN_KEY, token)
}

export function clearToken(): void {
  localStorage.removeItem(TOKEN_KEY)
  sessionStorage.removeItem(TOKEN_KEY)
}

export function getUserInfo(): UserInfo | null {
  const json = localStorage.getItem(USER_KEY) || sessionStorage.getItem(USER_KEY)
  if (!json) return null
  try {
    return JSON.parse(json)
  } catch {
    return null
  }
}

export function setUserInfo(user: UserInfo, remember?: boolean): void {
  const storage = remember ? localStorage : sessionStorage
  storage.setItem(USER_KEY, JSON.stringify(user))
}

export function clearUserInfo(): void {
  localStorage.removeItem(USER_KEY)
  sessionStorage.removeItem(USER_KEY)
}

export function clearAuth(): void {
  clearToken()
  clearUserInfo()
}

// ============================================
// 权限检查
// ============================================

export function hasPermission(permission: string): boolean {
  const user = getUserInfo()
  if (!user) return false
  return user.permissions.includes(permission) || user.roles.includes('admin')
}

export function hasRole(role: string): boolean {
  const user = getUserInfo()
  if (!user) return false
  return user.roles.includes(role)
}

export function hasAnyPermission(permissions: string[]): boolean {
  return permissions.some(p => hasPermission(p))
}

export function hasAllPermissions(permissions: string[]): boolean {
  return permissions.every(p => hasPermission(p))
}

// ============================================
// 登录状态检查
// ============================================

export function isAuthenticated(): boolean {
  return !!getToken() && !!getUserInfo()
}

// ============================================
// 请求拦截器用的认证头
// ============================================

export function getAuthHeaders(): Record<string, string> {
  const token = getToken()
  return token ? { Authorization: `Bearer ${token}` } : {}
}

let handlingUnauthorized = false

export function handleUnauthorizedLogout(): void {
  if (handlingUnauthorized) return
  handlingUnauthorized = true

  clearAuth()

  if (window.location.pathname !== '/login') {
    window.location.replace('/login')
    return
  }

  handlingUnauthorized = false
}

export async function fetchWithAuth(input: RequestInfo | URL, init: RequestInit = {}): Promise<Response> {
  const headers = new Headers(init.headers ?? {})
  const authHeaders = getAuthHeaders()
  Object.entries(authHeaders).forEach(([key, value]) => {
    if (!headers.has(key)) {
      headers.set(key, value)
    }
  })

  const response = await fetch(input, {
    ...init,
    headers,
  })

  if (response.status === 401) {
    handleUnauthorizedLogout()
  }

  return response
}
