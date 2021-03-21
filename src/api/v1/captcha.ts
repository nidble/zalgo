import send from '@polka/send-type'
import { RequestHandler } from 'express'
import { ServerResponse } from 'http'
import { DEFAULT_TTL } from '../../config'
import Captcha from '../../model'
import { ResponsePayload } from '../../../types'

const isValidId = new RegExp(/^[\w-]{21}$/, 'i')

const response = (res: ServerResponse, payload: ResponsePayload, httpStatus = 200, headers = {}) => {
  send(res, httpStatus, payload, headers)
}

export const put: RequestHandler = (_req, res) => {
  const captcha = Captcha.create()

  const expire = new Date()
  expire.setSeconds(expire.getSeconds() + DEFAULT_TTL)

  response(res, { type: 'Success', ...captcha }, 201, { expire: expire.toUTCString() })
}

export const post: RequestHandler = (req, res) => {
  const id = req.params.id
  if (!isValidId.test(id)) {
    return response(res, { type: 'Error', errors: [{ message: 'Uri resource not valid', field: 'id' }] }, 422)
  }

  const captcha = Captcha.get(id)
  if (!captcha) {
    return response(res, { type: 'Error', errors: [{ message: 'Captcha not found', field: 'id' }] }, 404)
  }

  if (captcha.isStale()) {
    const message = 'Too many attempts, please submit another captcha again.'
    return response(res, { type: 'Error', errors: [{ message, field: 'attempts' }] }, 422)
  }

  if (!captcha.check(req.body.solution)) {
    captcha.decrAttemps()
    return response(res, { type: 'Error', errors: [{ message: 'The solution is not valid', field: 'solution' }] }, 422)
  }

  return response(res, { type: 'Success', id, message: 'Captcha solved' })
}
