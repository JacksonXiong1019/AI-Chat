/**
 * 应用主布局
 */

import { useEffect } from 'react'
import { Outlet, useNavigate } from 'react-router-dom'
import { Sidebar } from './Sidebar'
import { Header } from './Header'
import { useUIStore } from '@/stores/ui.store'
import { globalChannel } from '@/utils/channel'
import { useAuthStore } from '@/stores/auth.store'
import { useAppStore } from '@/stores/app.store'
import { useToast } from '@/hooks/use-toast'
import { ROUTES } from '@/utils/constants'

export function AppLayout() {
    const sidebarCollapsed = useUIStore(state => state.sidebarCollapsed)
    const { clearAuth } = useAuthStore()
    const { setCurrentAppId } = useAppStore()
    const navigate = useNavigate()
    const { toast } = useToast()

    // 监听跨标签消息
    useEffect(() => {
        const unsubscribe = globalChannel.subscribe(msg => {
            switch (msg.type) {
                case 'LOGOUT':
                    // 收到登出消息，只清理状态不再次广播（避免死循环）
                    clearAuth(false)
                    navigate(ROUTES.LOGIN)
                    toast({
                        title: '会话已结束',
                        description: '您已在其他窗口退出登录',
                        variant: 'destructive',
                    })
                    break

                case 'APP_CHANGE':
                    // 同步应用切换
                    if (msg.payload?.appId) {
                        setCurrentAppId(msg.payload.appId)
                        toast({
                            title: '应用已切换',
                            description: `已同步切换到应用: ${msg.payload.appId}`,
                        })
                    }
                    break
            }
        })

        return () => unsubscribe()
    }, [clearAuth, navigate, setCurrentAppId, toast])

    return (
        <div className="flex h-screen bg-background overflow-hidden">
            {/* 侧边栏 */}
            <Sidebar collapsed={sidebarCollapsed} />

            {/* 主内容区 */}
            <div className="flex-1 flex flex-col overflow-hidden">
                {/* 顶部栏 */}
                <Header />

                {/* 页面内容 */}
                <main className="flex-1 overflow-y-auto p-6">
                    <Outlet />
                </main>
            </div>
        </div>
    )
}
