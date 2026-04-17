## 项目说明

本项目是一个基于 **React 19 + Vite + Yarn** 的多 Agent 演示应用。

用户在前端输入任务后，系统会按顺序触发 3 个 Agent：

- **Planner**：负责理解用户需求并拆解任务
- **Researcher**：负责补充实现要点、风险点和关键信息
- **Writer**：负责整合前面两个 Agent 的输出，生成最终答复

## 功能特点

- 基于 React + Vite 的轻量前端
- 3 个基础 Agent 串行协作
  - **Planner**：任务拆解
  - **Researcher**：信息补充
  - **Writer**：最终生成结果
- 实时展示 Agent 执行状态
- 实时展示执行日志
- 后端代理调用阿里云百炼，避免在前端暴露 API Key

---

## 技术栈

### 前端
- React 19
- Vite
- Yarn

### 后端
- Node.js
- Express
- CORS
- dotenv
- OpenAI SDK（用于兼容调用阿里云百炼接口）

---

前端主要负责：

- 展示 Agent 列表和运行状态
- 展示执行日志
- 展示最终结果
- 提供任务输入入口

后端主要负责：

- 接收前端发来的 Agent 请求
- 代理调用阿里云百炼大模型接口
- 返回模型生成内容给前端

整个流程采用最简单的 **串行编排模式**，便于理解多 Agent 协作的基本思路。

---

## 执行流程图

```mermaid
flowchart TD
    A[用户输入任务] --> B[前端触发 runAgents]
    B --> C[Planner Agent]
    C --> D[调用后端 /api/agent/chat]
    D --> E[阿里云百炼模型返回 Planner 结果]
    E --> F[前端记录 Planner 日志并更新状态]

    F --> G[Researcher Agent]
    G --> H[调用后端 /api/agent/chat]
    H --> I[阿里云百炼模型返回 Researcher 结果]
    I --> J[前端记录 Researcher 日志并更新状态]

    J --> K[Writer Agent]
    K --> L[调用后端 /api/agent/chat]
    L --> M[阿里云百炼模型返回最终结果]
    M --> N[前端展示最终结果]

## 项目结构

```bash
agents-demo
├─ public
├─ src
│  ├─ components
│  │  ├─ AgentCard.jsx
│  │  ├─ ChatInput.jsx
│  │  ├─ FinalAnswer.jsx
│  │  └─ LogPanel.jsx
│  ├─ data
│  │  └─ agents.js
│  ├─ utils
│  │  └─ runAgents.js
│  ├─ App.jsx
│  ├─ main.jsx
│  └─ index.css
├─ .env
├─ server.js
├─ package.json
└─ README.md