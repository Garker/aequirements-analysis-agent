import express from 'express'
import cors from 'cors'
import dotenv from 'dotenv'
import OpenAI from 'openai'

dotenv.config()

const app = express()
app.use(cors())
app.use(express.json())

const client = new OpenAI({
  apiKey: process.env.DASHSCOPE_API_KEY,
  baseURL: 'https://dashscope.aliyuncs.com/compatible-mode/v1',
})

app.get('/api/ping', (req, res) => {
  res.json({ ok: true })
})

app.post('/api/agent/chat', async (req, res) => {
  try {
    const {
      systemPrompt,
      userPrompt,
      model = 'qwen-plus',
      temperature = 0.7,
    } = req.body

    const completion = await client.chat.completions.create({
      model,
      temperature,
      messages: [
        { role: 'system', content: systemPrompt },
        { role: 'user', content: userPrompt },
      ],
    })

    const content = completion.choices?.[0]?.message?.content || ''

    res.json({
      success: true,
      content,
      usage: completion.usage || null,
    })
  } catch (error) {
    console.error('Bailian API error:', error)
    res.status(500).json({
      success: false,
      message: error?.message || '请求失败',
    })
  }
})

const PORT = process.env.PORT || 3001
app.listen(PORT, () => {
  console.log(`server running at http://localhost:${PORT}`)
})