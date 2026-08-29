import ZAI from 'z-ai-web-dev-sdk'
import { mkdirSync, writeFileSync } from 'node:fs'

const TASKS = [
  {
    file: 'public/images/delivery.png',
    size: '1152x864',
    prompt:
      'White delivery van with single bright orange horizontal stripe, rear doors open, parked on driveway in front of a suburban house, neatly stacked cardboard boxes and a wrapped door slab visible near the open trunk, warm evening light, overcast sky, photorealistic, professional commercial photography, clean composition, no people, no text, no logos',
  },
]

mkdirSync('public/images', { recursive: true })

for (const task of TASKS) {
  for (let attempt = 1; attempt <= 3; attempt++) {
    try {
      const zai = await ZAI.create()
      const res = await zai.images.generations.create({
        prompt: task.prompt,
        size: task.size,
      })
      const base64 = res.data?.[0]?.base64
      if (!base64) throw new Error('empty response')
      writeFileSync(task.file, Buffer.from(base64, 'base64'))
      console.log(`OK  ${task.file} (${attempt} try)`)
      break
    } catch (err) {
      console.error(`FAIL ${task.file} (try ${attempt}):`, err.message)
      if (attempt === 3) process.exitCode = 1
      else await new Promise((r) => setTimeout(r, 2500))
    }
  }
}
