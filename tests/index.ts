import app from '../src'
import request from 'supertest'
import { DEFAULT_TTL, DEFAULT_ATTEMPTS } from '../src/config'

const attempts = [...new Array(DEFAULT_ATTEMPTS)]

describe('Heathcheck Api', () => {
  it('response with 200', async () => {
    const result = await request(app.handler).get('/healthcheck').send()
    expect(result.status).toBe(200)
  })
})
describe('Captcha Api', () => {
  it('handle resource creation', async () => {
    const result = await request(app.handler).put('/v1/captcha').send()

    expect(result.body.attempts).toBe(DEFAULT_ATTEMPTS)
    expect(result.body).toHaveProperty('id')
    expect(result.body).toHaveProperty('text')
    expect(result.body).toHaveProperty('base64')

    expect(result.headers).toHaveProperty('expire')
    expect(result.headers['content-type']).toBe('application/json;charset=utf-8')

    const { expire, date } = result.headers
    const diffTime = (new Date(expire).getTime() - new Date(date).getTime()) / 1000
    expect(diffTime).toBe(DEFAULT_TTL)

    expect(result.status).toBe(201)
  })

  it('handle resource positive validation', async () => {
    const { body: captcha } = await request(app.handler).put('/v1/captcha').send()
    const result = await request(app.handler).post(`/v1/captcha/${captcha.id}`).send({ solution: captcha.text })

    expect(result.status).toBe(200)
  })

  it('handle invalid ID ', async () => {
    const result = await request(app.handler).post('/v1/captcha/123456890').send({ solution: 'john' })

    expect(result.status).toBe(422)
  })

  it('handle missing resource', async () => {
    const result = await request(app.handler).post('/v1/captcha/V35L8bbOuG8lYPYbzzHey').send({ solution: 'john' })

    expect(result.status).toBe(404)
  })

  it('handle a finite number of attempts', async () => {
    const { body: captcha } = await request(app.handler).put('/v1/captcha').send()
    const lazyRequest = () => request(app.handler).post(`/v1/captcha/${captcha.id}`).send({ solution: 'fake solution' })
    const expectAndRequestSeq = ({ body }: request.Response) => {
      expect(body.errors[0].message).toBe('The solution is not valid')
      return lazyRequest()
    }
    attempts.reduce(() => lazyRequest().then(expectAndRequestSeq), Promise.resolve())

    const result = await request(app.handler).post(`/v1/captcha/${captcha.id}`).send({ solution: 'fake solution' })
    expect(result.body.errors[0].message).toBe('Too many attempts, please submit another captcha again.')
    expect(result.status).toBe(422)
  })
})
