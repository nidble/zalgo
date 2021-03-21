import { Level } from 'pino'

export const DEFAULT_TTL = 60 * 2 // 2 minutes
export const CACHE_PREFIX = 'captcha.'
export const DEFAULT_ATTEMPTS = 5
export const PORT = process.env.PORT || 3000
export const LOG_LEVEL: Level = (process.env.LOG_LEVEL as Level) || 'silent'
