export default function LogPanel({ logs }) {
  return (
    <div className="panel">
      <div className="panel-title">执行日志</div>
      <div className="log-list">
        {logs.length === 0 ? (
          <div className="empty">暂无日志</div>
        ) : (
          logs.map((log, index) => (
            <div key={index} className={`log-item log-${log.type}`}>
              <div className="log-agent">{log.agent}</div>
              <div className="log-content">{log.content}</div>
            </div>
          ))
        )}
      </div>
    </div>
  )
}