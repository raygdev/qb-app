import { config } from "dotenv";
config()
import axios, { Axios } from 'axios'
import { QuickBooksInvoiceResponse } from "../../lib/types/quickbooks-types";

const quickbooksClient = axios.create({
    baseURL: 'https://sandbox-quickbooks.api.intuit.com',
})

interface IQuickBooksService {
    getInvoiceById: (realmId: number, token: string, invoiceId: number) => Promise<QuickBooksInvoiceResponse['Invoice']>
}

class QuickBooksService implements IQuickBooksService {
  private client: Axios;

  constructor() {
    this.client = quickbooksClient
  }

  async getInvoiceById(realmId: number, token: string, invoiceId: number) {
    const { data } = await this.client.get<QuickBooksInvoiceResponse>(
        `/v3/company/${realmId}/invoice/${invoiceId}`,
        { headers: {
            'Authorization': `Bearer ${token}`
        }}
    )

    const  { Invoice }  = data 

    return Invoice
  }
}

export const quickbooksService = new QuickBooksService()
