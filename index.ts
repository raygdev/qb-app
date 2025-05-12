import express from 'express'
import { config } from 'dotenv'
import mongoose from 'mongoose'
config()
const app = express()
import { apiV1Router } from './routes'



app.use(express.json())
app.use(express.urlencoded({ extended: false }))

app.use('/api/v1', apiV1Router)

const dbUser = process.env.DB_USERNAME
const dbPass = process.env.DB_PASSWORD

const uri = `mongodb://${dbUser}:${dbPass}@mongo:27017/test?authSource=admin&retryWrites=true&w=majority`

mongoose.connect(uri)
 .then(() => {
    console.log('connected successfully')
    app.listen(3000, () => {
        console.log('app listening on port 3000')
    })
 })
 .catch(e => {
    console.log(`ERROR CONNECTING: ${e}`)
 })

