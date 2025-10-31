import express from 'express'
import path from 'path'

export async function pageHttpServer(relativeStaticDir: string): Promise<number> {
  const app = express()
  const staticDir = path.join(__dirname, relativeStaticDir)
  app.use(express.static(staticDir))
  app.get('*splat', (_, res) => {
    res.sendFile(path.join(staticDir, 'index.html'))
  })
  const server = app.listen(0, 'localhost')
  await new Promise((resolve) => server.once('listening', resolve))
  console.log(server.address())
  const address = server.address()
  if (!address) {
    throw new Error('服务器地址为空')
  }
  if (typeof address === 'string') {
    throw new Error(`服务器地址为字符串: ${address}`)
  }
  const port = address.port
  return port
}
