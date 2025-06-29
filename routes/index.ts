import express from 'express'
import { AuthRoutes } from './auth'
import { QuickBooksRoutes } from './quickbooks'
import { UserRouter } from './users'
import { SlackRoutes } from './slack'

const apiV1Router = express.Router()

new AuthRoutes(apiV1Router)
new QuickBooksRoutes(apiV1Router)
new UserRouter(apiV1Router)
new SlackRoutes(apiV1Router)



export { apiV1Router }