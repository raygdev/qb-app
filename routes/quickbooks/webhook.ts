import { Request, Response } from 'express'
import { QuickBooksDataChangeEvent } from '../../lib/types/quickbooks-types'
import crypto from 'node:crypto'
import { paymentsQueue } from '../../queues/payments'

export const quickbooksWebhooks = async (req: Request<{}, any, QuickBooksDataChangeEvent | null | undefined, {}>, res: Response) => {
    const webhookPayload = JSON.stringify(req.body)
    const signature = req.get('intuit-signature')
   
    if(!signature) {
        res.status(401).send("Forbidden")
        return;
    }
    if(!webhookPayload || !req.body) {
      // if no payload, respond with 200 anyway
      res.status(200).send('success')
      return;
    }
    
    // verify the payload and signature
    const hash = crypto
      .createHmac('sha256', process.env.QB_WEBHOOK_VERIFIER!)
      .update(webhookPayload).digest('base64')

    if(hash !== signature) {
      res.status(401).send("Forbidden")
      return;
    }
    const paymentEvents: { realmId: string, paymentId: string }[] = []

    req.body.eventNotifications.forEach(notification => {
      const realmId = notification.realmId

      notification.dataChangeEvent.entities.forEach(entity => {
        if(entity.name === 'Payment') {
          paymentEvents.push({
            realmId,
            paymentId: entity.id
          })
        }
      })
    })

    paymentEvents.forEach(payment => {
      paymentsQueue.add('newPayment', payment)
    })
    
    console.log(req.body.eventNotifications[0].dataChangeEvent)
    res.status(200).send('success')
}