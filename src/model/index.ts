import { nanoid } from 'nanoid'
import NodeCache from 'node-cache'
import zalgoCaptcha from 'zalgo-captcha'
import { CACHE_PREFIX, DEFAULT_ATTEMPTS, DEFAULT_TTL } from '../config'

type Captcha = { id: string; attempts: number; text: string }
type Augmented = ReturnType<typeof augment>

const cache = new NodeCache({ stdTTL: DEFAULT_TTL })

const augment = (c: Captcha) => ({
  isStale: () => 0 === c.attempts,
  evinct: () => cache.set(`${CACHE_PREFIX}${c.id}`, { ...c, attempts: --c.attempts }),
  check: (solution: string) => c.text === solution,
})

const create = (): Captcha => {
  const [base64, text] = zalgoCaptcha.create()
  const captcha = { text, base64, id: nanoid(), attempts: DEFAULT_ATTEMPTS }
  cache.set(`${CACHE_PREFIX}${captcha.id}`, captcha)

  return captcha
}

const get = (id: string): Augmented | undefined => {
  const captcha = cache.get<Captcha>(`${CACHE_PREFIX}${id}`)
  return captcha ? augment(captcha) : undefined
}

export default { create, get }
