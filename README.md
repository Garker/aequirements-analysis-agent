# Agents Demo

一个基于 **React 19 + Vite + Yarn** 构建的多 Agent 演示项目。

前端负责展示 Agent 状态、执行日志和最终结果，后端通过 **Node.js + Express** 代理调用 **阿里云百炼** 大模型接口，实现一个最小可运行的多 Agent 编排示例。

---

## 项目简介

本项目用于演示一个简单的 **Agents 协作流程**。

用户在页面输入一个任务后，系统会按顺序触发 3 个 Agent：

- **Planner**：负责理解任务并拆解需求
- **Researcher**：负责补充关键信息、实现要点和风险点
- **Writer**：负责整合前面两个 Agent 的输出，生成最终结果

整个流程采用最简单的 **串行编排模式**，便于理解多 Agent 的基本协作方式。

---

## 功能特点

- 基于 React + Vite 的轻量前端
- 3 个基础 Agent 串行执行
- 展示 Agent 当前运行状态
- 展示执行日志
- 展示最终生成结果
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
- OpenAI SDK（兼容调用阿里云百炼接口）

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
```

## 页面说明

页面主要分为四个区域：

### 1. Agents 区域

展示当前参与执行的 Agent 和状态：

- 空闲
- 运行中
- 完成

### 2. 任务输入区域

用户输入任务后，点击按钮启动整个 Agent 流程。

### 3. 执行日志区域

展示每个 Agent 的执行过程和关键信息。

### 4. 最终结果区域

展示 Writer 汇总后的最终答复。

该区域支持滚动，内容较多时不会撑开页面。

---

## 执行流程图

```
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
```

---

## 流程说明

### 1. 用户输入任务

用户在页面输入一个任务，例如：

- 帮我设计一个客服 agents demo
- 帮我输出一个业务沟通助手方案

### 2. 前端启动 Agent 编排

前端调用 `runAgents()`，开始按顺序执行多个 Agent。

### 3. Planner 执行

Planner 读取用户任务，对任务进行拆解，输出初步执行方案。

### 4. Researcher 执行

Researcher 基于：

- 用户原始任务
- Planner 输出结果

继续补充实现建议、注意事项和风险点。

### 5. Writer 执行

Writer 整合：

- 用户任务
- Planner 输出
- Researcher 输出

最终生成一份结构化答复。

### 6. 前端展示结果

前端展示：

- Agent 执行状态
- 执行日志
- 最终结果

---

## 架构流程图

```
flowchart LR
    A[React 前端] --> B[Node / Express 后端]
    B --> C[阿里云百炼 API]
    C --> B
    B --> A
```

---

## 架构说明

### React 前端

负责：

- 输入任务
- 展示 Agent 状态
- 展示日志
- 展示最终结果

### Node / Express 后端

负责：

- 接收前端请求
- 拼接 system prompt 和 user prompt
- 调用阿里云百炼接口
- 返回模型结果给前端

### 阿里云百炼 API

负责真正的大模型推理能力，为每个 Agent 提供生成内容。

---

## 环境准备

请确保本地已安装：

- Node.js
- Yarn

可以先确认版本：

```
node-v
yarn-v
```

---

## 安装依赖

在项目根目录执行：

```
yarn
```

如果相关依赖还未安装，可以执行：

```
yarn add openai express cors dotenv
yarn add-D concurrently
```

---

## 环境变量配置

在项目根目录创建 `.env` 文件：

```
DASHSCOPE_API_KEY=你的阿里云百炼Key
PORT=3001
```

---

## 启动项目

### 方式一：分别启动前后端

启动后端：

```
node server.js
```

启动前端：

```
yarn dev
```

---

### 方式二：前后端一起启动

确保 `package.json` 中包含以下脚本：

```
{
  "scripts": {
    "dev":"vite",
    "server":"node server.js",
    "start":"concurrently \"yarn server\" \"yarn dev\""
  }
}
```

然后执行：

```
yarnstart
```

---

## 后端接口说明

### 健康检查接口

```
GET /api/ping
```

返回：

```
{
  "ok":true
}
```

---

### Agent 对话接口

```
POST /api/agent/chat
```

请求体：

```
{
  "systemPrompt":"你是一个任务拆解专家",
  "userPrompt":"帮我设计一个客服 agents demo",
  "model":"qwen-plus",
  "temperature":0.7
}
```

返回：

```
{
  "success":true,
  "content":"模型返回内容",
  "usage": {}
}
```

---

## 前端调用逻辑

前端通过 `src/utils/runAgents.js` 统一编排 Agent 执行流程。

### 核心函数

- `callAgent()`
向后端 `/api/agent/chat` 发起请求
- `runAgents()`
依次执行：
    - Planner
    - Researcher
    - Writer