import { Job, Processor } from "bullmq"
import { QuickBooksService } from "../services/apis/quickbooks-api"
import { createInvoice } from "../models/invoice"

export interface AddInvoiceJobType {
    realmId: string,
    accessToken: string,
    invoiceId: string
}

export interface AddInvoiceJobReturn {
    message: string,
    success: 'SUCCESS' | 'FAILURE'
}

export const addInvoiceProcessor:Processor = async (job:Job) => {
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
}