import path from 'node:path'

import react from '@vitejs/plugin-react'
import { defineConfig } from 'vitest/config'
import { visualizer } from 'rollup-plugin-visualizer'
import viteCompression from 'vite-plugin-compression'
import { PluginOption } from 'vite'

// https://vitejs.dev/config/
export default defineConfig({
    plugins: [
        react(),
        // Gzip 压缩
        viteCompression({
            verbose: true,
            disable: false,
            threshold: 10240,
            algorithm: 'gzip',
            ext: '.gz',
        }),
        // Brotli 压缩 (现代浏览器支持更好)
        viteCompression({
            verbose: true,
            disable: false,
            threshold: 10240,
            algorithm: 'brotliCompress',
            ext: '.br',
        }),
        visualizer({
            open: true, // 构建完成后自动在浏览器打开分析图
            filename: 'stats.html', // 生成的文件名
            gzipSize: true, // 显示 gzip 压缩后的大小
            brotliSize: true,
        }) as PluginOption,
    ],
    resolve: {
        alias: {
            '@': path.resolve(__dirname, './src'),
        },
    },
    server: {
        proxy: {
            '/api': {
                target: 'http://localhost:8081',
                changeOrigin: true,
            },
        },
    },
    build: {
        minify: 'esbuild',
        rollupOptions: {
            output: {
                manualChunks: {
                    'vendor-react': ['react', 'react-dom', 'react-router-dom', 'zustand', '@tanstack/react-query'],
                    'vendor-ui': [
                        '@radix-ui/react-dialog',
                        '@radix-ui/react-slot',
                        '@radix-ui/react-toast',
                        'lucide-react',
                        'clsx',
                        'tailwind-merge',
                    ],
                    // 移除 vendor-charts 手动分包，让 Vite 自动分析引用，确保 recharts 只在 lazy 组件中加载
                    // 'vendor-charts': ['recharts'],
                    'vendor-editor': ['@codemirror/view', '@codemirror/state', '@uiw/react-codemirror'],
                    'vendor-grid': ['react-grid-layout'],
                },
                // 实验性：控制 chunkFileNames，虽然这不直接影响加载策略，但有助于调试
                chunkFileNames: 'assets/[name]-[hash].js',
            },
        },
        // 关键优化：禁用 modulePreload，防止未使用 chunk 抢占带宽
        modulePreload: {
            polyfill: false,
            resolveDependencies: (_filename, deps) => {
                // 只保留核心依赖的预加载，剔除重型图表和编辑器的预加载
                return deps.filter(dep => !dep.includes('vendor-charts') && !dep.includes('vendor-editor'))
            },
        },
    },
    esbuild: {
        drop: process.env.NODE_ENV === 'production' ? ['console', 'debugger'] : [],
    },
    test: {
        globals: true,
        environment: 'jsdom',
        setupFiles: './src/__tests__/setup.ts',
        css: true,
    },
})
