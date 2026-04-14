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
```bash
git clone [https://github.com/yourusername/ai-chat.git](https://github.com/yourusername/ai-chat.git)
cd ai-chat
pnpm install

