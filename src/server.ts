import app from '.'
import { PORT } from './config'

app.listen(PORT, (err: ErrorConstructor) => {
  if (err) throw err
  console.log(`> Running on port ${PORT}`)
})
