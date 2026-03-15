import { useMutation, useQueryClient } from '@tanstack/react-query'
import { useQuery } from '@tanstack/react-query'
import { widgetTemplateApi } from '@/api/widget-template'
import type { CreateWidgetFromTemplateDto, TemplateCategory, TemplateListResponse } from '@/types/dashboard'

/**
 * 获取 Widget 模版列表
 */
export function useWidgetTemplates(category?: TemplateCategory) {
    return useQuery<TemplateListResponse>({
        queryKey: ['widget-templates', category],
        queryFn: async () => {
            const response = await widgetTemplateApi.getTemplates()
            if (category) {
                return {
                    templates: response.templates.filter(t => t.category === category),
                }
            }
            return response
        },
        // 模版数据很少变动，可以缓存久一点
        staleTime: 5 * 60 * 1000,
    })
}

/**
 * 从模版创建Widget
 * 简化版本 - 只支持大数字模版
 */
export function useCreateWidgetFromTemplate() {
    const queryClient = useQueryClient()

    return useMutation({
        mutationFn: (data: CreateWidgetFromTemplateDto) => widgetTemplateApi.createWidgetFromTemplate(data),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['dashboards'] })
        },
    })
}
