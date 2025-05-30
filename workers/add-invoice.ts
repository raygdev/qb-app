import { Worker } from "bullmq";
import { addInvoiceProcessor, AddInvoiceJobReturn, AddInvoiceJobType } from "../jobs/add-invoice-job";

export const addInvoice = new Worker<AddInvoiceJobType, AddInvoiceJobReturn, 'add-invoice'>(
    'add-invoice',
    addInvoiceProcessor,
    {
        connection: {
            host: 'redis',
        },
        concurrency: 100,
        autorun: false
    }
)


addInvoice.on('completed', (job) => {
    const message = job.returnvalue.message
    const success = job.returnvalue.success

    console.log(`Status of job: ${job.id} is ${success} and message:\n${message}`)
})

addInvoice.on('active', (job) => {
    console.log(`add-invoice worker is active ${job.id + " with invoice id " + JSON.stringify(job.data.invoiceId)}`)
})

addInvoice.on('ready', () => {
    console.log('add invoice worker is ready')
})

addInvoice.on('error', (e) => {
    console.log(`[ERROR ADD INVOICE WORKER]:\n${e}`)
})