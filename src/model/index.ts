import { nanoid } from 'nanoid'
import NodeCache from 'node-cache'
import zalgoCaptcha from 'zalgo-captcha'
import { CACHE_PREFIX, DEFAULT_ATTEMPTS, DEFAULT_TTL } from '../config'

type Captcha = { id: string; attempts: number; solution: string; base64: string }
type AugmentedCaptcha = ReturnType<typeof decorate>

const cache = new NodeCache({ stdTTL: DEFAULT_TTL })

const decorate = (instance: Captcha) => ({
  isStale: () => 0 === instance.attempts,
  decrAttempts: () => cache.set(`${CACHE_PREFIX}${instance.id}`, { ...instance, attempts: --instance.attempts }),
  check: (solution: string) => instance.solution === solution,
  instance,
})

const create = (): Omit<Captcha, 'solution'> => {
  const id = nanoid()
  const [base64, solution] = zalgoCaptcha.create()
  const captcha = { base64, id, attempts: DEFAULT_ATTEMPTS }
  cache.set(`${CACHE_PREFIX}${captcha.id}`, { ...captcha, solution })

  return captcha
}

const get = (id: string): AugmentedCaptcha | undefined => {
  const captcha = cache.get<Captcha>(`${CACHE_PREFIX}${id}`)
  return captcha ? decorate(captcha) : undefined
}

export default { create, get }
