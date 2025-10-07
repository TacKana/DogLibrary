import { defineConfig } from 'drizzle-kit'
import 'dotenv/config'

export default defineConfig({
  out: './resources',
  schema: './src/main/services/cache/schema/cache.ts',
  dialect: 'sqlite',
  // dbCredentials: {
  //   url: process.env.DB_FILE_NAME!,
  // },
})
