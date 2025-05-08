import { Request, Response } from 'express'
import crypto from 'node:crypto'

//TODO: Type the request body for the event notifications.

export const quickbooksWebhooks = async (req: Request, res: Response) => {
    const webhookPayload = JSON.stringify(req.body)
    const signature = req.get('intuit-signature')
   
    if(!signature) {
        res.status(401).send("Forbidden")
        return;
    }
    if(!webhookPayload) {
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

    
    //TODO: pass the data to a worker to offload and respond quickly
    console.log(req.body.eventNotifications[0].dataChangeEvent)
    res.status(200).send('success')
}