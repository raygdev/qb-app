import { Router } from 'express'
import { quickbooksWebhooks } from './webhook'
import { getCustomers } from './customers'
import { getCustomer } from './get-customer'
import { updateNotify } from './update-notify'

export class QuickBooksRoutes {
    constructor(router: Router) {
        router.post('/quickbooks/webhook', quickbooksWebhooks)
        router.get('/quickbooks/customers/:realmId', getCustomers)
        router.get('/quickbooks/customer/:id', getCustomer)
        router.put('/quickbooks/customer/notify/:id', updateNotify)
    }
}