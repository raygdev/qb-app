import { Job } from "bullmq"
import { QuickBooksService } from "../services/apis/quickbooks-api"
import { findQuickbooksCompany } from "../models/quickbooks"
import { addInvoice } from "../queues/add-invoice"

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

export const paymentProcessor = async (job : Job<ProcessPaymentJobData, ProcessPaymentReturnData>) => {
    console.log('hit worker for payment processing')
    const company = await findQuickbooksCompany(job.data.realmId)

    // if we've received a payment in a webhook, a user authorized the app already
    // so company should exist
    const qb = new QuickBooksService(company!.accessToken, company!.realmId)

    const paymentDetails = await qb.getPaymentById(job.data.paymentId)

    // find all lines where the txn type is Invoice and return all ids for
    // all invoices that the payment is tied to.
    const invoiceIds = paymentDetails.Line.flatMap(
      line => line.LinkedTxn.filter(txn => txn.TxnType === 'Invoice').map(txn => txn.TxnId)
    )

    // push each invoice id to the add-invoice queue
    invoiceIds.forEach(invoiceId => {
        addInvoice.add('add-invoice', {
            realmId: company!.realmId,
            accessToken: company!.accessToken,
            invoiceId
        })
    })

    return { 
        success: "PENDING" as SuccessType,
        message: `adding invoices with ${invoiceIds.length === 1 ? 'id' : 'ids'}: [${invoiceIds.join(' ')}]. `
    }
}