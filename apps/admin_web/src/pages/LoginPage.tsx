import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { message } from 'antd'
import { login } from '../services/auth'

export function LoginPage() {
  const navigate = useNavigate()
  const [showPassword, setShowPassword] = useState(false)
  const [loading, setLoading] = useState(false)
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [remember, setRemember] = useState(false)
  const [errors, setErrors] = useState({ username: false, password: false })

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault()

    if (!username.trim() || !password.trim()) {
      setErrors({
        username: !username.trim(),
        password: !password.trim()
      })
      message.error('请输入用户名和密码')
      return
    }

    setErrors({ username: false, password: false })

    setLoading(true)
    try {
      const result = await login({
        username: username.trim(),
        password: password.trim(),
        remember
      })

      if (result.code === 200 && result.data) {
        message.success('登录成功')
        navigate('/')
      } else {
        setErrors({ username: true, password: true })
        message.error(result.message || '登录失败')
      }
    } catch {
      message.error('登录失败，请稍后重试')
    } finally {
      setLoading(false)
    }
  }

  return (
    <>
      <main className="login-page">
        <div className="login-shell">
          <div className="login-card-react">
            <div className="login-brand">
              <h1 className="login-brand-title">PRODUCT SERVICE</h1>
              <p className="login-brand-subtitle">LOGIN</p>
            </div>

            <form onSubmit={handleSubmit}>
              <div className="login-field">
                <label className="login-field-label" htmlFor="username">
                  ID
                </label>
                <div className="login-input-wrap">
                  <span className="login-input-icon" aria-hidden="true">
                    <svg viewBox="0 0 24 24" width="16" height="16" fill="currentColor">
                      <path d="M12 12a5 5 0 1 0-5-5 5.006 5.006 0 0 0 5 5Zm0-8a3 3 0 1 1-3 3 3 3 0 0 1 3-3Zm0 10c-4.411 0-8 2.691-8 6a1 1 0 0 0 2 0c0-2.206 2.692-4 6-4s6 1.794 6 4a1 1 0 0 0 2 0c0-3.309-3.589-6-8-6Z" />
                    </svg>
                  </span>
                  <input
                    id="username"
                    className={`login-field-input with-icon ${errors.username ? 'is-invalid' : ''}`}
                    type="text"
                    placeholder="ID"
                    autoComplete="off"
                    value={username}
                    onChange={(e) => {
                      setUsername(e.target.value)
                      if (errors.username) setErrors(prev => ({ ...prev, username: false }))
                    }}
                    onFocus={() => {
                      if (errors.username) setErrors(prev => ({ ...prev, username: false }))
                    }}
                    disabled={loading}
                  />
                </div>
              </div>

              <div className="login-field">
                <div className="login-field-head">
                  <label className="login-field-label" htmlFor="password">
                    Password
                  </label>
                  <a className="login-field-link" href="#">
                    Forgot Password?
                  </a>
                </div>
                <div className="login-input-wrap">
                  <span className="login-input-icon" aria-hidden="true">
                    <svg viewBox="0 0 24 24" width="16" height="16" fill="currentColor">
                      <path d="M17 8h-1V6a4 4 0 0 0-8 0v2H7a3 3 0 0 0-3 3v7a3 3 0 0 0 3 3h10a3 3 0 0 0 3-3v-7a3 3 0 0 0-3-3Zm-7-2a2 2 0 0 1 4 0v2h-4Zm8 12a1 1 0 0 1-1 1H7a1 1 0 0 1-1-1v-7a1 1 0 0 1 1-1h10a1 1 0 0 1 1 1Z" />
                    </svg>
                  </span>
                  <input
                    id="password"
                    className={`login-field-input with-icon with-action ${errors.password ? 'is-invalid' : ''}`}
                    type={showPassword ? 'text' : 'password'}
                    placeholder="PASSWORD"
                    autoComplete="off"
                    value={password}
                    onChange={(e) => {
                      setPassword(e.target.value)
                      if (errors.password) setErrors(prev => ({ ...prev, password: false }))
                    }}
                    onFocus={() => {
                      if (errors.password) setErrors(prev => ({ ...prev, password: false }))
                    }}
                    disabled={loading}
                  />
                  <button
                    className="login-input-action"
                    type="button"
                    aria-label="Toggle password visibility"
                    onClick={() => setShowPassword((value) => !value)}
                    disabled={loading}
                  >
                    {showPassword ? (
                      <svg viewBox="0 0 24 24" width="16" height="16" fill="currentColor">
                        <path d="m4.707 3.293-1.414 1.414 2.135 2.135C3.155 8.426 2.087 10.38 2.02 10.507a1 1 0 0 0 0 .986C2.162 11.76 5.62 18 12 18a10.935 10.935 0 0 0 5.203-1.244l2.09 2.09 1.414-1.414ZM12 16c-4.383 0-7.219-3.802-7.941-5 .418-.652 1.437-2.071 2.965-3.206l1.49 1.49A3.957 3.957 0 0 0 8 11a4 4 0 0 0 4 4 3.957 3.957 0 0 0 1.716-.514l2.03 2.03A8.734 8.734 0 0 1 12 16Zm0-7a1.991 1.991 0 0 1 1.68.93l-2.75-2.75A1.991 1.991 0 0 1 12 9Zm9.98 1.507C21.838 10.24 18.38 4 12 4a10.935 10.935 0 0 0-4.851 1.095l1.542 1.542A8.605 8.605 0 0 1 12 6c4.383 0 7.219 3.802 7.941 5a11.44 11.44 0 0 1-2.376 2.676l1.42 1.42a13.61 13.61 0 0 0 3-3.603 1 1 0 0 0-.005-.986Z" />
                      </svg>
                    ) : (
                      <svg viewBox="0 0 24 24" width="16" height="16" fill="currentColor">
                        <path d="M12 5c-6.418 0-9.748 6.08-9.886 6.339a1 1 0 0 0 0 .942C2.252 12.54 5.582 18.62 12 18.62s9.748-6.08 9.886-6.339a1 1 0 0 0 0-.942C21.748 11.08 18.418 5 12 5Zm0 11.62c-4.445 0-7.145-3.841-7.853-4.81C4.855 10.84 7.555 7 12 7s7.145 3.841 7.853 4.81C19.145 12.779 16.445 16.62 12 16.62Zm0-7.62a3 3 0 1 0 3 3 3 3 0 0 0-3-3Zm0 4a1 1 0 1 1 1-1 1 1 0 0 1-1 1Z" />
                      </svg>
                    )}
                  </button>
                </div>
              </div>

              <div className="login-field" style={{ display: 'flex', alignItems: 'center', gap: 8, marginTop: -8 }}>
                <input
                  type="checkbox"
                  id="remember"
                  checked={remember}
                  onChange={(e) => setRemember(e.target.checked)}
                  disabled={loading}
                />
                <label htmlFor="remember" style={{ color: '#666', cursor: 'pointer' }}>
                  Remember Me
                </label>
              </div>

              <button
                className="login-submit-btn"
                type="submit"
                disabled={loading}
                style={{ opacity: loading ? 0.7 : 1 }}
              >
                {loading ? '登录中...' : 'Sign In'}
              </button>

              <div style={{ textAlign: 'center', marginTop: 16, color: '#999' }}>
              </div>
            </form>
          </div>
        </div>
      </main>

      <footer className="login-footer">
      </footer>
    </>
  )
}
