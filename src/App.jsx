import { useMemo, useState } from 'react'
import { agents } from './data/agents'
import { runAgents } from './utils/runAgents'
import AgentCard from './components/AgentCard'
import ChatInput from './components/ChatInput'
import LogPanel from './components/LogPanel'
import FinalAnswer from './components/FinalAnswer'

function App() {
  const [logs, setLogs] = useState([])
  const [loading, setLoading] = useState(false)
  const [finalAnswer, setFinalAnswer] = useState('')

  const [agentStatus, setAgentStatus] = useState({
    planner: 'idle',
    researcher: 'idle',
    writer: 'idle',
  })

  const resetStatus = () => {
    setAgentStatus({
      planner: 'idle',
      researcher: 'idle',
      writer: 'idle',
    })
  }

  const handleStatusChange = (agentId, status) => {
    setAgentStatus((prev) => ({
      ...prev,
      [agentId]: status,
    }))
  }

  const handleAddLog = (log) => {
    setLogs((prev) => [
      ...prev,
      {
        ...log,
        time: Date.now(),
      },
    ])
  }

  const handleRun = async (task) => {
    setLoading(true)
    setLogs([])
    setFinalAnswer('')
    resetStatus()

    try {
      const result = await runAgents(task, handleAddLog, handleStatusChange)
      setFinalAnswer(result.finalAnswer)
    } catch (error) {
      handleAddLog({
        agent: 'System',
        content: `执行失败：${error.message}`,
        type: 'error',
      })
    } finally {
      setLoading(false)
    }
  }

  const doneCount = useMemo(() => {
    return Object.values(agentStatus).filter((s) => s === 'done').length
  }, [agentStatus])

  return (
    <div className="app">
      <header className="topbar">
        <div>
          <h1>需求拆分</h1>
        </div>
        <div className="progress">已完成 {doneCount} / 3</div>
      </header>

      <main className="layout">
        <section className="left-column">
          <div className="panel">
            <div className="panel-title">Agents</div>
            <div className="agents-grid">
              {agents.map((agent) => (
                <AgentCard
                  key={agent.id}
                  agent={agent}
                  status={agentStatus[agent.id]}
                />
              ))}
            </div>
          </div>

          <div className="panel">
            <div className="panel-title">任务输入</div>
            <ChatInput onSubmit={handleRun} loading={loading} />
          </div>
        </section>

        <section className="right-column">
          <LogPanel logs={logs} />
          <FinalAnswer content={finalAnswer} />
        </section>
      </main>
    </div>
  )
}

export default App