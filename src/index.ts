import polka from 'polka'
import send from '@polka/send-type'
import { create } from 'zalgo-captcha'

const app: polka.Polka = polka()
app.get('/v1/dummy/:id', (req, res) => {
  const [base64, text] = create()
  send(res, 200, { id: req.params.id, text, base64 })
})

export default app
