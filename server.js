import express from 'express'
import cors from 'cors'
import dotenv from 'dotenv'
import { ChatOpenAI } from '@langchain/openai'
import { ChatPromptTemplate } from '@langchain/core/prompts'
import { StringOutputParser } from '@langchain/core/output_parsers'

dotenv.config()

const app = express()
app.use(cors())
app.use(express.json())

const model = new ChatOpenAI({
  model: process.env.MODEL_NAME || 'qwen-plus',
  temperature: 0.7,
  apiKey: process.env.DASHSCOPE_API_KEY,
  configuration: {
    baseURL: 'https://dashscope.aliyuncs.com/compatible-mode/v1',
  },
})

app.get('/api/ping', (req, res) => {
  res.json({ ok: true })
})

app.post('/api/agent/chat', async (req, res) => {
  try {
    const {
      systemPrompt,
      userPrompt,
      model: requestModel,
      temperature = 0.7,
    } = req.body

    const llm = new ChatOpenAI({
      model: requestModel || process.env.MODEL_NAME || 'qwen-plus',
      temperature,
      apiKey: process.env.DASHSCOPE_API_KEY,
      configuration: {
        baseURL: 'https://dashscope.aliyuncs.com/compatible-mode/v1',
      },
    })

    const prompt = ChatPromptTemplate.fromMessages([
      ['system', '{systemPrompt}'],
      ['human', '{userPrompt}'],
    ])

    const chain = prompt.pipe(llm).pipe(new StringOutputParser())

    const content = await chain.invoke({
      systemPrompt,
      userPrompt,
    })

    res.json({
      success: true,
      content,
    })
  } catch (error) {
    console.error('LangChain/Bailian error:', error)
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