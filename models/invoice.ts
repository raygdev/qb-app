import mongoose from "mongoose";

import { QuickBooksInvoiceResponse } from "../lib/types/quickbooks-types";

const InvoiceSchema = new mongoose.Schema({
    realmId: { type: String, required: true, index: true },
    notifiable_user: {
        type: mongoose.Schema.Types.Mixed,
        default: null
    },
    invoice_data: {
        type: mongoose.Schema.Types.Mixed,
        required: true
    },
    invoiceId: { type: String, required: true, index: true }
}, {
    toObject: { virtuals: true },
    toJSON: { virtuals: true },
    autoIndex: true
})

interface NotifiableUser {
    userId: mongoose.Types.ObjectId,
    slack_team_id: string,
    slack_channel_id: string
}

interface Invoice  {
    realmId: string,
    notifiable_user: NotifiableUser | null,
    invoice_data: Partial<QuickBooksInvoiceResponse['Invoice']>
    invoiceId: string
    id: string
    _id: mongoose.Types.ObjectId
}


export const Invoice = mongoose.model<Invoice>('invoice', InvoiceSchema)

export const findInvoice = async(invoiceId: string, realmId: string) => {
    const invoice = await Invoice.findOne({ invoiceId, realmId })

    return invoice
}

export const createOrUpdateInvoice = async (data: Omit<Invoice, 'id' | '_id'>) => {
    const invoice = await Invoice.findOneAndUpdate({
      realmId: data.realmId,
      invoiceId: data.invoiceId
    },
    data, 
    { 
      upsert: true 
    })

    await invoice?.save()

    return invoice as Invoice
}

export const updateInvoice = async (data: Omit<Invoice, 'id' | '_id'>) => {
    const keys = Object.keys(data)
    const invoice = await Invoice.findOne({ realmId: data.realmId, invoiceId: data.invoiceId })

    keys.forEach((key) => {
        invoice?.set(key, data[key as keyof typeof data])
    })

    await invoice?.save()

    return invoice
}