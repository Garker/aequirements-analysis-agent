export default function FinalAnswer({ content }) {
  return (
    <div className="panel final-answer">
      <div className="panel-title">最终结果</div>
      <pre>{content || '运行后将在这里展示最终结果'}</pre>
    </div>
  )
}