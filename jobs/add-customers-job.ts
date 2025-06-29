import { Job, Processor } from "bullmq"
import { QuickBooksService } from "../services/apis/quickbooks-api"
import { Customer } from "../models/quickbooks-customer"

interface AddCustomerData {
    realmId: string,
    accessToken: string
}

export const addCustomerJob: Processor = async (job: Job<AddCustomerData>) => {
    const { data: { realmId, accessToken } } = job

    const qb = new QuickBooksService(accessToken, realmId)

    try {
        const customers = await qb.getQuickbooksCustomerList()
    
        const allCustomers = customers.map(customer => {
            const { GivenName, FamilyName, CompanyName, FullyQualifiedName, Id, DisplayName } = customer
    
            return {
                realmId,
                GivenName,
                FamilyName: FamilyName || null,
                CompanyName: CompanyName || null,
                FullyQualifiedName,
                DisplayName,
                Id
            }
        })
    
        await Customer.insertMany(allCustomers)

        return { success: true }

    }
    catch(e) {
        console.log('[CUSTOMER PROCESSOR ERROR]\n\n')
        console.dir(e, { depth: null })
        return { success: false }
    }
}