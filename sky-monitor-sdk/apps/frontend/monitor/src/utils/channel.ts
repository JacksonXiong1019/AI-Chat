type MessageType = 'LOGOUT' | 'THEME_CHANGE' | 'DASHBOARD_REFRESH' | 'APP_CHANGE'

export interface ChannelMessage {
    type: MessageType
    payload?: any
    _ts?: number // 时间戳，用于 storage 降级方案去重
}

export class CrossTabChannel {
    private channel: BroadcastChannel | null = null
    private channelName: string
    private listeners: ((msg: ChannelMessage) => void)[] = []

    constructor(name: string = 'sky-monitor-channel') {
        this.channelName = name

        // 1. 优先使用 BroadcastChannel
        if (typeof window !== 'undefined' && 'BroadcastChannel' in window) {
            this.channel = new BroadcastChannel(name)
            this.channel.onmessage = event => {
                this.notify(event.data)
            }
        }
        // 2. 降级方案：监听 storage 事件
        else if (typeof window !== 'undefined') {
            ;(window as any).addEventListener('storage', (event: StorageEvent) => {
                if (event.key === this.channelName && event.newValue) {
                    try {
                        const msg = JSON.parse(event.newValue)
                        // 忽略自己发出的消息（storage 事件只会在其他窗口触发，但为了保险）
                        this.notify(msg)
                    } catch (e) {
                        console.error('Parse storage message failed', e)
                    }
                }
            })
        }
    }

    /**
     * 发送消息
     */
    postMessage(msg: ChannelMessage) {
        const messageWithTs = { ...msg, _ts: Date.now() }

        if (this.channel) {
            this.channel.postMessage(messageWithTs)
        } else if (typeof localStorage !== 'undefined') {
            // 降级方案：写入 localStorage 触发 storage 事件
            try {
                const storageMsg = JSON.stringify(messageWithTs)
                localStorage.setItem(this.channelName, storageMsg)
                // 立即清除，保持干净，同时不影响 event 触发
                // 注意：storage 事件触发机制是 key 值改变。如果短时间多次 setItem 相同值可能不触发，加了 _ts 可以避免。
                setTimeout(() => localStorage.removeItem(this.channelName), 100)
            } catch (e) {
                console.error('Post storage message failed', e)
            }
        }
    }

    /**
     * 订阅消息
     */
    subscribe(callback: (msg: ChannelMessage) => void) {
        this.listeners.push(callback)
        // 返回取消订阅函数
        return () => {
            this.listeners = this.listeners.filter(l => l !== callback)
        }
    }

    private notify(msg: ChannelMessage) {
        this.listeners.forEach(callback => callback(msg))
    }

    /**
     * 关闭通道
     */
    close() {
        if (this.channel) {
            this.channel.close()
        }
        this.listeners = []
    }
}

// 单例导出
export const globalChannel = new CrossTabChannel()
