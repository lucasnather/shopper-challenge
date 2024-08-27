import zod, { z } from 'zod'

const envSchema = z.object({
    GEMINI_API_KEY: z.string()
})

const _env = envSchema.safeParse(process.env)

if(!_env.data) throw new Error("Environment Variable Error")

export const env = _env.data