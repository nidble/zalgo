import send from '@polka/send-type'
import { RequestHandler } from 'express'
import { ServerResponse } from 'http'
import { DEFAULT_TTL } from '../../config'
import Capcha from '../../model'

const isValidId = new RegExp(/^[\w-]{21}$/, 'i')
const response = <T>(res: ServerResponse, payload: Record<string, T>, httpStatus = 200, headers = {}) => {
  send(res, httpStatus, payload, headers)
}

export const put: RequestHandler = (_req, res) => {
  const captcha = Capcha.create()

  const expire = new Date()
  expire.setSeconds(expire.getSeconds() + DEFAULT_TTL)

  response(res, captcha, 201, { expire: expire.toUTCString() })
}

export const post: RequestHandler = (req, res) => {
  const id = req.params.id
  if (!isValidId.test(id)) {
    return response(res, { errors: [{ message: 'Uri resource not valid', field: 'id' }] }, 422)
  }

  const captcha = Capcha.get(id)
  if (!captcha) {
    return response(res, { errors: [{ message: 'Captcha not found', field: 'id' }] }, 404)
  }

  if (0 === captcha.attempts) {
    return response(
      res,
      { errors: [{ message: 'Too many attempts, please submit another captcha again.', field: 'attempts' }] },
      422,
    )
  }

  if (captcha.text !== req.body.solution) {
    Capcha.evinct(captcha)
    return response(res, { errors: [{ message: 'The solution is not valid', field: 'solution' }] }, 422)
  }
  return response(res, { id, message: 'Captcha solved' })
}
