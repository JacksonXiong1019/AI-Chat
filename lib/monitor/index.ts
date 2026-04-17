/**
 * Monitor 单例模块
 *
 * 提供全局唯一的 Monitor 实例，配置所有插件
 */

'use client'

import {
  init,
  browserTracingIntegration,
  Errors,
  SamplingIntegration,
  DeduplicationIntegration,
  SessionIntegration,
  PerformanceIntegration
} from '@jerry_aurora/sky-monitor-sdk'

type MonitorInstance = Awaited<ReturnType<typeof init>>

let monitoring: MonitorInstance | null = null
let isInitializing = false

/**
 * 初始化 Monitor 实例
 */
async function initMonitor() {
  const isDev = process.env.NODE_ENV === 'development'
  const endpoint = '/api/monitor'

  // 使用正确的 SDK API 初始化
  const instance = await init({
    dsn: endpoint,
    integrations: [
      browserTracingIntegration(),
      new Errors(),
      new SamplingIntegration({}),
      new DeduplicationIntegration(),
      new SessionIntegration(),
      new PerformanceIntegration()
    ],
    environment: isDev ? 'development' : 'production',
    appId: 'sky-chat-app'
  })

  return instance
}

/**
 * 获取 Monitor 实例
 */
export async function getMonitor() {
  if (!monitoring && !isInitializing) {
    isInitializing = true
    try {
      monitoring = await initMonitor()
    } catch (error) {
      console.error('Failed to initialize monitor:', error)
      // 回退到空实现
      monitoring = {
        track: () => {},
        captureError: () => {},
        captureMessage: () => {},
        setUser: () => {},
        setTag: () => {}
      } as unknown as MonitorInstance
    } finally {
      isInitializing = false
    }
  }
  return monitoring
}

/**
 * 销毁 Monitor 实例
 */
export function destroyMonitor() {
  monitoring = null
}
