# 🤖 AI Chat

> 一个现代化的全栈 AI 智能助手，支持多模型流畅对话、语音交互与文件上下文理解。

![Next.js](https://img.shields.io/badge/Next.js-16-black?logo=next.js)
![TypeScript](https://img.shields.io/badge/TypeScript-5.0-blue?logo=typescript)
![Prisma](https://img.shields.io/badge/Prisma-ORM-2D3748?logo=prisma)
![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-38B2AC?logo=tailwind-css)
![License](https://img.shields.io/badge/license-MIT-green)

## ✨ 项目特性

### 💬 核心对话体验
- **高性能流式响应**: 基于 Server-Sent Events (SSE) 实现极低延迟的打字机效果。
- **消息状态机管理**: 完善的消息生命周期与状态调度，支持复杂交互场景。
- **多模型无缝切换**: 内置 Qwen / DeepSeek 模型，支持根据任务灵活调度。
- **深度思考模式**: 支持带有推理模型（Reasoning Models）的思考过程可视化呈现。
- **会话管理**: 支持创建、删除、重命名与会话置顶功能。
- **快捷操作**: 一键复制、消息重新生成与内容朗读。

### 🎙️ 语音与多模态
- **语音识别 (ASR)**: 接入 SenseVoice，实现精准的录音转文字。
- **语音合成 (TTS)**: 结合 CosyVoice2 实现自然流畅的文字转语音，并支持用户声音偏好持久化。
- **文档解析**: 支持上传 `.txt` / `.md` 格式文件（最大 1MB），后端自动提取内容并注入对话上下文。

### 🛡️ 架构与工程化
- **全栈架构**: 采用 Next.js 16 (App Router + Turbopack) 构建高性能服务端渲染应用。
- **安全鉴权**: 深度集成 Auth.js v5，支持 Google、GitHub OAuth 第三方登录及邮箱凭证管理。
- **数据持久化**: 结合 PostgreSQL 与 Prisma ORM，实现可靠的数据建模与迁移。
- **现代化 UI**: 采用 Tailwind CSS + shadcn/ui，完美支持深色模式与响应式自适应布局。
- **数据导出**: 支持将精彩对话一键导出为 Markdown 格式。

---

## 🛠️ 技术栈

| 领域 | 技术与工具 |
| :--- | :--- |
| **框架** | Next.js 16 (App Router + Turbopack) |
| **语言** | TypeScript |
| **数据库** | PostgreSQL + Prisma ORM |
| **状态管理**| Zustand |
| **UI/UX** | Tailwind CSS + shadcn/ui + Lucide Icons |
| **认证** | Auth.js v5 |
| **AI 驱动** | 硅基流动 API (SenseVoice, CosyVoice2, LLMs) |

---

## 🚀 快速开始

### 1. 环境要求
确保你的本地开发环境已安装：
- Node.js `v22.20.0` 或以上
- PostgreSQL
- [pnpm](https://pnpm.io/) 

### 2. 克隆与安装
git clone [https://github.com/yourusername/ai-chat.git](https://github.com/yourusername/ai-chat.git)
cd ai-chat
pnpm install

### 3.数据库初始化
# （1）. 生成 Prisma Client 并在数据库中执行表结构迁移
pnpm prisma migrate dev

# （2）. 生成类型声明
pnpm prisma generate

# （3）. (可选) 填充初始测试数据
pnpm db:seed

###4. 启动服务
# 启动本地开发服务器
pnpm dev

###5.生产环境构建
pnpm build
pnpm start

###常用命令脚本
# 日志清理
pnpm run clean:logs          # 预览将被清理的 console.log 语句
pnpm run clean:logs --write  # 执行清理操作并覆盖文件

# 数据库可视化管理
pnpm db:studio               # 启动 Prisma Studio 网页端管理工具

# 数据库维护
pnpm db:seed                 # 运行种子脚本，填充测试数据
pnpm db:reset                # 危险操作：清空并重置整个数据库

###核心目录
├── app/                  # Next.js App Router 路由层
│   ├── api/              # 服务端 API 接口
│   ├── auth/             # 认证相关页面 (登录/注册/错误)
│   └── chat/             # 核心对话主界面
├── components/           # 全局与通用 UI 组件 (shadcn/ui 等)
├── features/             # 核心业务模块 (垂直拆分，高内聚)
│   ├── auth/             # 鉴权逻辑与组件
│   ├── chat/             # 对话输入、消息渲染、状态机
│   ├── conversation/     # 会话列表与历史管理
│   ├── share/            # 对话分享功能
│   └── voice/            # 录音与 TTS 播放逻辑
├── lib/                  # 基础设施与通用工具
│   ├── hooks/            # 自定义 React Hooks
│   ├── services/         # 外部服务接口封装
│   └── utils/            # 纯函数与辅助工具
├── server/               # 纯服务端核心逻辑 (Controller/Service 模式)
│   ├── auth/             # Auth.js 高级配置
│   ├── db/               # 数据库连接实例
│   └── services/         # 后端业务调度 (大模型流式处理等)
└── prisma/               # 数据库 Schema 定义与迁移记录
