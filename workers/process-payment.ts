import { Worker } from "bullmq"
import { paymentProcessor } from "../jobs/payments-job"

interface ProcessPaymentJobData {
    realmId: string,
    paymentId: string,
    invoiceId: string
}

type SuccessType = "PENDING" | "SUCCESS" | "FAILURE"

interface ProcessPaymentReturnData {
    success: SuccessType,
    message: string
}


export const payments = new Worker<ProcessPaymentJobData, ProcessPaymentReturnData>(
    'payments',
    paymentProcessor,
    {
        connection: {
            host: 'redis'
        },
        concurrency: 100,
        autorun: false
   }
)

payments.on('closed', () => {
    console.log('closing worker')
})

payments.on('error', (e) =>{
     console.log(`ERROR: ${e}`)
 })

 payments.on('completed', async (job) => {
    console.log(job.returnvalue)
 })

 payments.on('ready', () => {
    console.log('payments worker started')
 })


process.on('SIGTERM', async () => {
    await payments.close()
    process.exit(0)
})
process.on('SIGINT', async () => {
    await payments.close()
    process.exit(0)
})