import { useState } from 'react'

export default function ChatInput({ onSubmit, loading }) {
  const [value, setValue] = useState('帮我生成一个客服 agents demo 方案')

  const handleSubmit = (e) => {
    e.preventDefault()
    if (!value.trim() || loading) return
    onSubmit(value.trim())
  }

  return (
    <form className="chat-input-wrap" onSubmit={handleSubmit}>
      <textarea
        className="chat-textarea"
        rows={4}
        value={value}
        onChange={(e) => setValue(e.target.value)}
        placeholder="输入你的任务..."
      />
      <button className="submit-btn" type="submit" disabled={loading}>
        {loading ? '运行中...' : 'Run Agents'}
      </button>
    </form>
  )
}