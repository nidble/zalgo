import polka from 'polka'
import { json as bodyParser } from 'body-parser'
import pino from 'pino-http'
import { LOG_LEVEL } from '../config'

export const logger = pino({ useLevel: LOG_LEVEL })

export const cors: polka.Middleware = (req, res, next) => {
  // TODO:
  // restrict CORS headers to best fit project needs
  res.setHeader('Access-Control-Allow-Origin', '*')
  res.setHeader('Access-Control-Request-Method', '*')
  res.setHeader('Access-Control-Allow-Methods', 'OPTIONS, GET, POST, PUT')
  res.setHeader('Access-Control-Allow-Headers', '*')
  /* istanbul ignore if */ if (req.method === 'OPTIONS') {
    res.writeHead(200)
    res.end()
    return
  }

  next()
}

export const json = bodyParser()
