import app from '../src'
import request from 'supertest'


it('handle healthcheck', async (done) => {
  const result = await request(app.handler).get('/v1/dummy/123').send()

  expect(result.status).toBe(200)
  expect(result.body.id).toBe('123')
  expect(result.body).toHaveProperty('text')
  expect(result.body).toHaveProperty('base64')
  done()
})
