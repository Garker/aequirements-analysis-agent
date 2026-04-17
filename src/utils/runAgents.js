async function callAgent({ systemPrompt, userPrompt, model = 'qwen-plus' }) {
  const res = await fetch('http://localhost:3001/api/agent/chat', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      systemPrompt,
      userPrompt,
      model,
    }),
  })

  const data = await res.json()

  if (!res.ok || !data.success) {
    throw new Error(data.message || 'Agent 调用失败')
  }

  return data.content
}

export async function runAgents(task, onLog, onStatusChange) {
  onStatusChange('planner', 'running')
  onLog({
    agent: 'Planner',
    content: `收到任务：${task}`,
    type: 'info',
  })

  const plannerOutput = await callAgent({
    systemPrompt:
      '你是一个任务拆解专家。请把用户需求拆成清晰步骤，输出简洁、结构化、中文内容。',
    userPrompt: task,
  })

  onLog({
    agent: 'Planner',
    content: plannerOutput,
    type: 'success',
  })
  onStatusChange('planner', 'done')

  onStatusChange('researcher', 'running')
  onLog({
    agent: 'Researcher',
    content: '正在分析 Planner 输出并补充实现要点...',
    type: 'info',
  })

  const researcherOutput = await callAgent({
    systemPrompt:
      '你是一个信息分析助手。请基于用户任务和任务拆解，补充关键点、风险点、实现建议，中文输出。',
    userPrompt: `用户任务：${task}\n\nPlanner 输出：${plannerOutput}`,
  })

  onLog({
    agent: 'Researcher',
    content: researcherOutput,
    type: 'success',
  })
  onStatusChange('researcher', 'done')

  onStatusChange('writer', 'running')
  onLog({
    agent: 'Writer',
    content: '正在整合前面两个 agent 的结果...',
    type: 'info',
  })

  const finalAnswer = await callAgent({
    systemPrompt:
      '你是最终答复生成助手。请整合上下文，输出一份清晰、可执行、中文的最终结果。',
    userPrompt: `用户任务：${task}\n\nPlanner 输出：${plannerOutput}\n\nResearcher 输出：${researcherOutput}`,
  })

  onLog({
    agent: 'Writer',
    content: '最终结果已生成',
    type: 'success',
  })
  onStatusChange('writer', 'done')

  return {
    plannerOutput,
    researchOutput: researcherOutput,
    finalAnswer,
  }
}