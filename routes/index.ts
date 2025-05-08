import express from 'express'
import { AuthRoutes } from './auth'
import { QuickBooksRoutes } from './quickbooks'

const apiV1Router = express.Router()

new AuthRoutes(apiV1Router)
new QuickBooksRoutes(apiV1Router)



export { apiV1Router }