import { config } from "dotenv";
config()
import axios, { Axios } from 'axios'
import { QuickBooksInvoiceResponse, QuickBooksPaymentResponse } from "../../lib/types/quickbooks-types";

const quickbooksClient = axios.create({
    baseURL: 'https://sandbox-quickbooks.api.intuit.com',
})

interface IQuickBooksService {
    getInvoiceById: (realmId: number, token: string, invoiceId: number) => Promise<QuickBooksInvoiceResponse['Invoice']>
    getPaymentById: (realmId: number, token: string, paymentId: string) => Promise<QuickBooksPaymentResponse['Payment']>
}

class QuickBooksService implements IQuickBooksService {
  private client: Axios;

  constructor() {
    this.client = quickbooksClient
  }

  async getInvoiceById(realmId: number, token: string, invoiceId: number) {
    const { data } = await this.client.get<QuickBooksInvoiceResponse>(
        `/v3/company/${realmId}/invoice/${invoiceId}?minorversion=75`,
        { headers: {
            'Authorization': `Bearer ${token}`
        }}
    )

    const  { Invoice }  = data 

    return Invoice
  }

  async getPaymentById(realmId: number, token: string, paymentId: string) {
        const { data } = await this.client.get<QuickBooksPaymentResponse>(
            `/v3/company/${realmId}/payment/${paymentId}?minorversion=75`,
            {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            }
        )

        const { Payment } = data

        return Payment
  }
}

export const quickbooksService = new QuickBooksService()
