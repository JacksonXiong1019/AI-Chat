'use client'

/**
 * OAuth Popup Hook - 弹窗 OAuth 登录
 * 
 * 双重检测机制：
 * 1. postMessage - 弹窗主动通知（快速）
 * 2. session 轮询 - 兜底方案（可靠）
 * 
 * 完整流程：
 * 1. 初始化 ：用户点击登录按钮，调用 openPopup(provider)
   2. 弹窗打开 ：创建并显示 OAuth 登录弹窗
   3. 监听设置 ：
   - 注册 postMessage 事件监听器
   - 启动 session 轮询  
   4.用户操作 ：用户在弹窗中完成 OAuth 登录流程
   5.状态同步 ：
   - 方式 1：弹窗通过 postMessage 发送 oauth-success 消息
   - 方式 2：弹窗关闭后，轮询检测到弹窗关闭，检查 session 状态
   6.成功处理 ：执行 handleSuccess() ，清理资源，调用成功回调
   7.资源清理 ：清除定时器和事件监听器，重置状态
 */

import { useCallback, useRef, useState } from 'react'
import { getSession } from 'next-auth/react'

interface UseOAuthPopupOptions {
  onSuccess?: () => void
  onError?: (error: string) => void
}

export function useOAuthPopup(options: UseOAuthPopupOptions = {}) {
  const { onSuccess, onError } = options
  const [isLoading, setIsLoading] = useState<string | null>(null)
  const popupRef = useRef<Window | null>(null)
  const pollRef = useRef<ReturnType<typeof setInterval> | null>(null)
  const messageHandlerRef = useRef<((e: MessageEvent) => void) | null>(null)
  const successCalledRef = useRef(false)
  const isPollingRef = useRef(false)

  const cleanup = useCallback(() => {
    if (pollRef.current) {
      clearInterval(pollRef.current)
      pollRef.current = null
    }
    if (messageHandlerRef.current) {
      window.removeEventListener('message', messageHandlerRef.current)
      messageHandlerRef.current = null
    }
    isPollingRef.current = false
    setIsLoading(null)
  }, [])

  // 标记成功状态，避免重复调用，清理资源，执行回调
  const handleSuccess = useCallback(() => {
    if (successCalledRef.current) return
    successCalledRef.current = true
    cleanup()
    onSuccess?.()
  }, [cleanup, onSuccess])

  const openPopup = useCallback((provider: 'google' | 'github') => {
    setIsLoading(provider)
    successCalledRef.current = false

    const width = 500
    const height = 600
    const left = window.screenX + (window.outerWidth - width) / 2
    const top = window.screenY + (window.outerHeight - height) / 2

    const url = `/auth/popup/${provider}`

    popupRef.current = window.open(
      url,
      'oauth-popup',
      `width=${width},height=${height},left=${left},top=${top},scrollbars=yes,resizable=yes`
    )

    if (!popupRef.current) {
      cleanup()
      onError?.('弹窗被阻止，请允许弹窗')
      return
    }

    // 方式1: 监听 postMessage（快速响应）
    // 通过 event.origin 验证消息来源，处理 oauth-success 和 oauth-cancelled 两种消息，弹窗登录成功后立即通知，无需等待弹窗关闭
    messageHandlerRef.current = (event: MessageEvent) => {
      if (event.origin !== window.location.origin) return
      if (event.data?.type === 'oauth-success') {
        handleSuccess()
      } else if (event.data?.type === 'oauth-cancelled') {
        cleanup()
      }
    }
    window.addEventListener('message', messageHandlerRef.current)

    // 方式2: 轮询检测弹窗关闭 + session 状态
    // 每 200ms 检查一次，通过 isPollingRef 防止并发请求
    pollRef.current = setInterval(() => {
      // 防止并发轮询
      if (isPollingRef.current) return
      
      // 弹窗关闭时检查 session，确保登录状态同步
      if (popupRef.current?.closed) {
        isPollingRef.current = true
        getSession().then(session => {
          if (session) {
            handleSuccess()
          } else {
            cleanup()
          }
        })
      }
    }, 200)
  }, [cleanup, handleSuccess, onError])

  return { openPopup, isLoading }
}
