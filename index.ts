import express from 'express'
import { config } from 'dotenv'
config()
const app = express()
import { apiV1Router } from './routes'



app.use(express.json())
app.use(express.urlencoded({ extended: false }))

app.use('/api/v1', apiV1Router)

app.listen(3000, () => {
    console.log('app listening on port 3000')
})
