export default function AgentCard({ agent, status }) {
  const statusMap = {
    idle: '空闲',
    running: '运行中',
    done: '完成',
  }

  return (
    <div className="agent-card">
      <div className="agent-header">
        <div className="agent-avatar">{agent.avatar}</div>
        <div>
          <div className="agent-name">{agent.name}</div>
          <div className="agent-role">{agent.role}</div>
        </div>
      </div>

      <div className={`agent-status status-${status}`}>
        状态：{statusMap[status] || '空闲'}
      </div>
    </div>
  )
}