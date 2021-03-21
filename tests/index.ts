import app from '../src'
import request from 'supertest'
import { DEFAULT_TTL, DEFAULT_ATTEMPTS } from '../src/config'
import Captcha from '../src/model'

const attempts = [...new Array(DEFAULT_ATTEMPTS)]

describe('Heathcheck Api', () => {
  it('handle response with 200', async () => {
    const result = await request(app.handler).get('/healthcheck').send()
    expect(result.status).toBe(200)
  })

  it('handle preflight with 200', async () => {
    const result = await request(app.handler).options('/healthcheck').send()
    expect(result.status).toBe(200)
  })
})
describe('Captcha Api', () => {
  it('handle resource creation', async () => {
    const result = await request(app.handler).put('/v1/captcha').send()
    const captcha = Captcha.get(result.body.data.id) || { instance: { attempts: 999, base64: '42', id: 999 } }
    const { attempts, base64, id } = captcha.instance

    expect(result.body.data).toStrictEqual({ attempts, base64, id })
    expect(result.headers['content-type']).toBe('application/json;charset=utf-8')

    const { expire, date } = result.headers
    const diffTime = (new Date(expire).getTime() - new Date(date).getTime()) / 1000
    expect(diffTime).toBe(DEFAULT_TTL)

    expect(result.status).toBe(201)
  })

  it('handle resource positive validation', async () => {
    const { body: response } = await request(app.handler).put('/v1/captcha').send()
    const captcha = Captcha.get(response.data.id)
    const result = await request(app.handler)
      .post(`/v1/captcha/${response.data.id}`)
      .send({ solution: captcha?.instance.solution })

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
    const { body: { data: captcha } } = await request(app.handler).put('/v1/captcha').send()
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
