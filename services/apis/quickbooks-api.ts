import { config } from "dotenv";
config()
import axios, { Axios } from 'axios'
import { QuickBooksInvoiceResponse, QuickBooksPaymentResponse } from "../../lib/types/quickbooks-types";

const quickbooksClient = axios.create({
    baseURL: 'https://sandbox-quickbooks.api.intuit.com',
})

interface IQuickBooksService {
    getInvoiceById: (invoiceId: string) => Promise<QuickBooksInvoiceResponse['Invoice']>
    getPaymentById: (paymentId: string) => Promise<QuickBooksPaymentResponse['Payment']>
}

export class QuickBooksService implements IQuickBooksService {
  private client: Axios;
  private token: string;
  private realmId: string;
  constructor(token: string, realmId: string) {
    this.client = quickbooksClient
    this.token = token
    this.realmId = realmId
  }

  async getInvoiceById(invoiceId: string) {
    const { data } = await this.client.get<QuickBooksInvoiceResponse>(
        `/v3/company/${this.realmId}/invoice/${invoiceId}?minorversion=75`,
        { headers: {
            'Authorization': `Bearer ${this.token}`
        }}
    )

    const  { Invoice }  = data 

    return Invoice
  }

  async getPaymentById(paymentId: string) {
        const { data } = await this.client.get<QuickBooksPaymentResponse>(
            `/v3/company/${this.realmId}/payment/${paymentId}?minorversion=75`,
            {
                headers: {
                    Authorization: `Bearer ${this.token}`
                }
            }
        )

        const { Payment } = data

        return Payment
  }
}
