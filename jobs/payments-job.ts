import { Job } from "bullmq"
import { QuickBooksService } from "../services/apis/quickbooks-api"
import { findQuickbooksCompany } from "../models/quickbooks"
import { notifyQueue } from "../queues/notify"

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

    notifyQueue.add('notify-user', {
        realmId: job.data.realmId,
        customerId: paymentDetails.CustomerRef.value,
        paymentAmount: paymentDetails.TotalAmt
    })

    return {
        success: "PENDING" as SuccessType,
        message: "NOTIFYING USER IF AVAILABLE"
    }
}