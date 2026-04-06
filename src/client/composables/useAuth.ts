import { ref } from 'vue'

interface User {
  id: string
  email: string
  name?: string
}

const user = ref<User | null>(null)
const loading = ref(true)
let fetched = false

export function useAuth() {
  async function fetchUser() {
    if (fetched) return
    loading.value = true
    try {
      const res = await fetch('/api/auth/me')
      if (res.ok) {
        user.value = await res.json()
      } else {
        user.value = null
      }
    } catch {
      user.value = null
    } finally {
      loading.value = false
      fetched = true
    }
  }

  async function login(email: string, password: string) {
    const res = await fetch('/api/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password }),
    })
    if (!res.ok) {
      const data = await res.json()
      throw new Error(data.error || 'Login failed')
    }
    user.value = await res.json()
    return user.value
  }

  async function register(email: string, password: string, name?: string) {
    const res = await fetch('/api/auth/register', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password, name }),
    })
    if (!res.ok) {
      const data = await res.json()
      throw new Error(data.error || 'Registration failed')
    }
    user.value = await res.json()
    return user.value
  }

  async function loginWithGoogle(credential: string) {
    const res = await fetch('/api/auth/google', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ credential }),
    })
    if (!res.ok) {
      const data = await res.json()
      throw new Error(data.error || 'Google login failed')
    }
    user.value = await res.json()
    return user.value
  }

  async function logout() {
    await fetch('/api/auth/logout', { method: 'POST' })
    user.value = null
    fetched = false
  }

  return { user, loading, fetchUser, login, register, loginWithGoogle, logout }
}
