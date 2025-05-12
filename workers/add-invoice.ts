import { Worker } from "bullmq";
import { QuickBooksService } from "../services/apis/quickbooks-api";
import { createInvoice } from "../models/invoice";

interface AddInvoiceJobType {
    realmId: string,
    accessToken: string,
    invoiceId: string
}

const addInvoice = new Worker<AddInvoiceJobType>('add-invoice', async (job) => {
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
    concurrency: 100
})