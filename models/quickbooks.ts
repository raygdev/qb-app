import mongoose from 'mongoose' 

const CompanySchema = new mongoose.Schema({
    realmId: { type: String, required: true, index: true },
    refreshToken: { type: String, required: true },
    accessToken: { type: String, required: true },
    access_expiry: { type: Date, required: true },
    refresh_expiry: { type: Date, required: true }
}, {
    toObject: { virtuals: true },
    toJSON: { virtuals: true }
})

interface Company {
    realmId: string,
    refreshToken: string,
    _id: mongoose.Types.ObjectId,
    id: string,
    accessToken: string,
    access_expiry: Date,
    refresh_expiry: Date
}

export const QuickbooksCompany = mongoose.model<Company>('quickbooks', CompanySchema)

export const findQuickbooksCompany = async (realmId: string) => {
    const company = await QuickbooksCompany.findOne({ realmId })

    return company
}

export const updateQuickBooksCompanyTokens = async (data: Omit<Company, 'id' | '_id'>) => {
    const company = await QuickbooksCompany.findOne(
        { realmId: data.realmId }
    )

    company?.set('refreshToken', data.refreshToken)
    company?.set('accessToken', data.accessToken)

    await company?.save()

    return company
}

export const createQuickBooksCompany = async (data: Omit<Company, 'id' | '_id'>) => {
    const company = await QuickbooksCompany.create(data)
    await company.save()
    return company
}