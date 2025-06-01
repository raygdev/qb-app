import mongoose from 'mongoose'
import { quickBooksAuth } from '../services/auth/qb-auth'
import { convertExpiryToDate } from '../utils/date-helpers'
import { AxiosError } from 'axios'
import { QuickBooksTokensResponse } from '../lib/types/quickbooks-types'

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

CompanySchema.post('findOne', async function(doc,next) {

    if(!doc) return next()

    const currentTime = new Date()

    if(currentTime >= doc.access_expiry) {
        console.log('token expired')
        try {
            const tokens = await quickBooksAuth.refreshAccessToken(doc.refreshToken)

            doc.set('refreshToken', tokens.refresh_token)
            doc.set('accessToken', tokens.access_token)
            doc.set('refresh_expiry', convertExpiryToDate(tokens.x_refresh_token_expires_in))
            doc.set('access_expiry', convertExpiryToDate(tokens.expires_in))
            await doc.save()
        }
        catch (e) {
            if(e instanceof mongoose.Error) {
              return next(e)
            }
            if(e instanceof AxiosError) {
              console.log(`ERROR GENERATING TOKENS IN PRE FIND COMPANY:\n${e}`)
              return next(e)
            }

            const genericError = new Error('Unknown error occurred in company pre findOne')
            return next(genericError)
        }
    }

    next()
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

export const updateQuickBooksCompanyTokens = async (tokens: QuickBooksTokensResponse) => {
    const { x_refresh_token_expires_in, expires_in, access_token, refresh_token } = tokens
    
    const company = await QuickbooksCompany.findOneAndUpdate(
        { realmId: tokens.realmId },
        {
          accessToken: access_token,
          refreshToken: refresh_token,
          access_expiry: convertExpiryToDate(expires_in),
          refresh_expiry: convertExpiryToDate(x_refresh_token_expires_in)
        },
        { returnDocument: 'after' }
    )

    await company?.save()

    return company
}

export const createQuickBooksCompany = async (data: Omit<Company, 'id' | '_id'>) => {
    const company = await QuickbooksCompany.create(data)
    await company.save()
    return company
}