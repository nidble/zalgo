import { nanoid } from 'nanoid'
import NodeCache from 'node-cache'
import zalgoCaptcha from 'zalgo-captcha'
import { CACHE_PREFIX, DEFAULT_ATTEMPTS, DEFAULT_TTL } from '../config'

const cache = new NodeCache({ stdTTL: DEFAULT_TTL })
type Captcha = { id: string; attempts: number; text: string }

const create = (): Captcha => {
  const [base64, text] = zalgoCaptcha.create()
  const captcha = { text, base64, id: nanoid(), attempts: DEFAULT_ATTEMPTS }
  cache.set(`${CACHE_PREFIX}${captcha.id}`, captcha)

  return captcha
}

const get = (id: string): Captcha | undefined => cache.get(`${CACHE_PREFIX}${id}`)

const evinct = (captcha: Captcha) =>
  cache.set(`${CACHE_PREFIX}${captcha.id}`, { ...captcha, attempts: --captcha.attempts })

export default { create, get, evinct }
