import app from '.'

app.listen(3000, (err: ErrorConstructor) => {
  if (err) throw err
  console.log('> Running on localhost:3000')
})

