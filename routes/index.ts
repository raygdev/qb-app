import express from 'express'
import { AuthRoutes } from './auth'

const apiV1Router = express.Router()

new AuthRoutes(apiV1Router)



export { apiV1Router }