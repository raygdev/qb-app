import { Job, Worker } from "bullmq";
import { findInvoice } from "../models/invoice";
import { findQuickbooksCompany } from "../models/quickbooks";
import { addInvoice } from "../queues/add-invoice";
import { QuickBooksService } from "../services/apis/quickbooks-api";

interface ProcessPaymentJobData {
    realmId: string,
    paymentId: string,
    invoiceId: string
}

interface ProcessPaymentReturnData {
    success: 'PENDING' | 'SUCCESS' | 'FAILURE',
    message: string
}
// @ts-ignore
const payments = new Worker('payments', async (job : Job<ProcessPaymentJobData, ProcessPaymentReturnData, 'processPayments'>) => {
        const company = await findQuickbooksCompany(job.data.realmId)

        // if we've received a payment in a webhook, a user authorized the app already
        // so company should exist
        const qb = new QuickBooksService(company!.accessToken, company!.realmId)

        const paymentDetails = await qb.getPaymentById(job.data.paymentId)

        const invoiceIds = paymentDetails.Line.flatMap(
          line => line.LinkedTxn.filter(txn => txn.TxnType === 'Invoice').map(txn => txn.TxnId)
        )

        invoiceIds.forEach(invoiceId => {
            
        })

        return { success: 'PENDING', message: 'SUCCESS'}
}, {
    connection: {
        host: 'redis'
    },
    concurrency: 100
})


// payments.on('')


payments.on('closed', () => {
    console.log('closing worker')
})

payments.on('error', (e) =>{
     console.log(`ERROR: ${e}`)
 })

 payments.on('completed', async (job) => {
    console.log(job.returnvalue)
 })


process.on('SIGTERM', async () => {
    await payments.close()
    process.exit(0)
})
process.on('SIGINT', async () => {
    await payments.close()
    process.exit(0)
})