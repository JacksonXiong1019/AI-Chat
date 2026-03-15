import { AreaChartIcon, BarChartIcon, HashIcon, LineChartIcon, TableIcon, RadarIcon, PieChartIcon } from 'lucide-react'
import { lazy, Suspense } from 'react'

import type { ExecuteQueryResponse, WidgetType } from '@/types/dashboard'
import { BigNumberWidget } from './BigNumberWidget' // 静态引入，优化 LCP

// 懒加载其他重型图表组件
const AreaChartWidget = lazy(() => import('./AreaChartWidget').then(module => ({ default: module.AreaChartWidget })))
const BarChartWidget = lazy(() => import('./BarChartWidget').then(module => ({ default: module.BarChartWidget })))
// BigNumberWidget 已改为静态引入
const LineChartWidget = lazy(() => import('./LineChartWidget').then(module => ({ default: module.LineChartWidget })))
const PieChartWidget = lazy(() => import('./PieChartWidget').then(module => ({ default: module.PieChartWidget })))
const RadarChartWidget = lazy(() => import('./RadarChartWidget').then(module => ({ default: module.RadarChartWidget })))
const TableChartWidget = lazy(() => import('./TableChartWidget').then(module => ({ default: module.TableChartWidget })))
const WebVitalsChartWidget = lazy(() => import('./WebVitalsChartWidget').then(module => ({ default: module.WebVitalsChartWidget })))

interface ChartRendererProps {
    widgetType: WidgetType
    data: ExecuteQueryResponse
}

/**
 * 图表渲染器
 * 根据 widgetType 渲染不同的图表类型
 */
export function ChartRenderer({ widgetType, data }: ChartRendererProps) {
    // 检查是否是 Web Vitals 图表
    const isWebVitals = isWebVitalsChart(data)

    // 根据 widgetType 渲染不同的图表
    return (
        <Suspense
            fallback={<div className="w-full h-full flex items-center justify-center text-muted-foreground text-sm">加载图表...</div>}
        >
            {renderChart()}
        </Suspense>
    )

    function renderChart() {
        switch (widgetType) {
            case 'line':
                // 如果是 Web Vitals 数据,使用专用图表
                if (isWebVitals) {
                    return <WebVitalsChartWidget data={data} />
                }
                return <LineChartWidget data={data} />
            case 'bar':
                return <BarChartWidget data={data} />
            case 'area':
                return <AreaChartWidget data={data} />
            case 'pie':
                return <PieChartWidget data={data} />
            case 'table':
                return <TableChartWidget data={data} />
            case 'big_number':
                return <BigNumberWidget data={data} />
            case 'radar':
                return <RadarChartWidget data={data} />
            default:
                return <div className="text-muted-foreground">不支持的图表类型: {widgetType}</div>
        }
    }
}

/**
 * 判断是否是 Web Vitals 图表
 * 通过检查 title 或 legend 中是否包含 Web Vitals 相关关键词
 */
function isWebVitalsChart(data: ExecuteQueryResponse): boolean {
    // 检查标题
    if (data.title?.toLowerCase().includes('web vitals')) {
        return true
    }

    // 检查是否有多个 Web Vitals 指标
    const webVitalsKeywords = ['lcp', 'fcp', 'ttfb', 'inp', 'fid', 'cls']
    const matchCount = data.results.filter(result => {
        const legend = result.legend?.toLowerCase() || ''
        return webVitalsKeywords.some(keyword => legend.includes(keyword))
    }).length

    // 如果有 2 个或以上的 Web Vitals 指标,认为是 Web Vitals 图表
    return matchCount >= 2
}

/**
 * 获取图表类型图标
 */
export function getChartIcon(widgetType: WidgetType) {
    switch (widgetType) {
        case 'line':
            return LineChartIcon
        case 'bar':
            return BarChartIcon
        case 'area':
            return AreaChartIcon
        case 'pie':
            return PieChartIcon
        case 'table':
            return TableIcon
        case 'big_number':
            return HashIcon
        case 'radar':
            return RadarIcon
        default:
            return LineChartIcon
    }
}
