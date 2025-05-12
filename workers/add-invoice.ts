import { Worker } from "bullmq";
import { QuickBooksService } from "../services/apis/quickbooks-api";
import { createInvoice } from "../models/invoice";

interface AddInvoiceJobType {
    realmId: string,
    accessToken: string,
    invoiceId: string
}

interface AddInvoiceJobReturn {
    message: string,
    success: 'SUCCESS' | 'FAILURE'
}

export const addInvoice = new Worker<AddInvoiceJobType, AddInvoiceJobReturn>('add-invoice', async (job) => {
    const { data: { realmId, accessToken, invoiceId } } = job

    const qb = new QuickBooksService(accessToken, realmId)

    const invoice = await qb.getInvoiceById(invoiceId)

    const newInvoice = await createInvoice({
        invoiceId: invoice.Id,
        invoice_data: invoice,
        notifiable_user: null,
        realmId
    })

    return {
        message: `New invoice registered from a payment`,
        success: "SUCCESS"
    }
}, {
    connection: {
        host: 'redis',
    },
    concurrency: 100,
    autorun: false
})


addInvoice.on('completed', (job) => {
    const message = job.returnvalue.message
    const success = job.returnvalue.success

    console.log(`Status of job: ${job.id} is ${success} and message:\n${message}`)
})

addInvoice.on('active', (job) => {
    console.log(`add-invoice worker is active ${job.id + " " + JSON.stringify(job.data)}`)
})

addInvoice.on('error', (e) => {
    console.log(`[ERROR ADD INVOICE WORKER]:\n${e}`)
})