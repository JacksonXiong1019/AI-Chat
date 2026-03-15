/**
 * 认证状态管理
 */

import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import type { User } from '@/api/types'
import { globalChannel } from '@/utils/channel'

interface AuthState {
    // 状态
    accessToken: string | null
    user: User | null
    isAuthenticated: boolean

    // 操作
    setAccessToken: (token: string) => void
    setUser: (user: User) => void
    clearAuth: (broadcast?: boolean) => void
}

/**
 * 认证状态 Store
 *
 * 使用 Zustand 管理认证状态，并持久化到 localStorage
 */
export const useAuthStore = create<AuthState>()(
    persist(
        set => ({
            // 初始状态
            accessToken: null,
            user: null,
            isAuthenticated: false,

            // 设置 Access Token
            setAccessToken: (token: string) => {
                set({
                    accessToken: token,
                    isAuthenticated: !!token,
                })
            },

            // 设置用户信息
            setUser: (user: User) => {
                set({ user })
            },

            // 清除认证信息
            clearAuth: (broadcast?: boolean) => {
                set({
                    accessToken: null,
                    user: null,
                    isAuthenticated: false,
                })
                // 默认广播 LOGOUT 消息
                if (broadcast !== false) {
                    globalChannel.postMessage({ type: 'LOGOUT' })
                }
            },
        }),
        {
            name: 'auth-storage',
            // 只持久化 accessToken 和 user
            partialize: state => ({
                accessToken: state.accessToken,
                user: state.user,
                isAuthenticated: state.isAuthenticated,
            }),
        }
    )
)
