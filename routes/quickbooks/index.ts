import { Router } from 'express'
import { quickbooksWebhooks } from './webhook'

export class QuickBooksRoutes {
    constructor(router: Router) {
        router.post('/quickbooks/webhook', quickbooksWebhooks)
    }
}