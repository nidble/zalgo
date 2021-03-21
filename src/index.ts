import polka from 'polka'
import { json, cors, logger } from './middleware'
import { post, put } from './api/v1/captcha'

const app: polka.Polka = polka()

app.use(logger, json, cors)

app.get('healthcheck', (_req, res) => res.end())

app.put('/v1/captcha', put)

app.post('/v1/captcha/:id', post)

export default app
