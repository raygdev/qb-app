import { Job, Worker } from "bullmq";
import { findQuickbooksCompany } from "../models/quickbooks";
import { addInvoice } from "../queues/add-invoice";
import { QuickBooksService } from "../services/apis/quickbooks-api";
import { addInvoice as addInvoiceWorker } from "./add-invoice";
import mongoose from "mongoose";

interface ProcessPaymentJobData {
    realmId: string,
    paymentId: string,
    invoiceId: string
}

interface ProcessPaymentReturnData {
    success: 'PENDING' | 'SUCCESS' | 'FAILURE',
    message: string
}

/**
 * @todo
 * make sure to clean this connection up and try to start the workers in the same connection
 */

mongoose.connect(`mongodb://root:rootpassword@mongo:27017/test?authSource=admin&retryWrites=true&w=majority`)
.then(() => {
    console.log('successfully connected with web worker')
})
// @ts-ignore
const payments = new Worker('payments', async (job : Job<ProcessPaymentJobData, ProcessPaymentReturnData>) => {
        const company = await findQuickbooksCompany(job.data.realmId)

        // if we've received a payment in a webhook, a user authorized the app already
        // so company should exist
        const qb = new QuickBooksService(company!.accessToken, company!.realmId)

        const paymentDetails = await qb.getPaymentById(job.data.paymentId)

        const invoiceIds = paymentDetails.Line.flatMap(
          line => line.LinkedTxn.filter(txn => txn.TxnType === 'Invoice').map(txn => txn.TxnId)
        )

        invoiceIds.forEach(invoiceId => {
            addInvoice.add('add-invoice', {
                realmId: company!.realmId,
                accessToken: company!.accessToken,
                invoiceId
            })
        })

        return { 
            success: 'PENDING',
            message: `adding invoices with ${invoiceIds.length === 1 ? 'id' : 'ids'}: [${invoiceIds.join(' ')}]. `
        }
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