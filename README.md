# Agents

一个基于 **React 19 + Vite + Yarn** 构建的 Agent 小 demo。  
前端负责展示 Agent 状态、执行日志和最终结果，后端通过 **Node.js + Express** 代理请求 **阿里云百炼** 大模型接口，实现一个最小可运行的多 Agent 编排示例。

---

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