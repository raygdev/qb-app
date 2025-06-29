import { Request, Response } from 'express'
import { quickBooksAuth } from '../../../services/auth/qb-auth'
import { findQuickbooksCompany, createQuickBooksCompany, updateQuickBooksCompanyTokens } from '../../../models/quickbooks'
import { convertExpiryToDate } from '../../../utils/date-helpers'
import { customerQueue } from '../../../queues/add-customer-list'

export const quickbooksCallback = async (req: Request<{}, any, any, { code: string, state: string, realmId: string }>, res: Response) => {
   const { code, state, realmId } = req.query

   //TODO: validate state when it comes in (based on an authed user)

   const tokens = await quickBooksAuth.getTokens(code, realmId)
   // TODO: Store tokens with authed user if realmId doesn't already exist
   // redirect back to client application DON'T SEND TOKENS BACK

   const company = await findQuickbooksCompany(tokens.realmId)

   if(!company) {
      const newCompany = await createQuickBooksCompany({
         realmId: tokens.realmId,
         refreshToken: tokens.refresh_token,
         accessToken: tokens.access_token,
         access_expiry: convertExpiryToDate(tokens.expires_in),
         refresh_expiry: convertExpiryToDate(tokens.x_refresh_token_expires_in)
      })

      customerQueue.add('addCustomers', { realmId, accessToken: tokens.access_token})
      res.send(newCompany)
      return
   }

   const updated = await updateQuickBooksCompanyTokens(tokens)

   res.send(updated)
    
}