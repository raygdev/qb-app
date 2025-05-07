import { Request, Response } from 'express'
import { quickBooksAuth } from '../../../services/auth/qb-auth'

export const quickbooksCallback = async (req: Request<{}, any, any, { code: string, state: string, realmId: string }>, res: Response) => {
   const { code, state, realmId } = req.query

   //TODO: validate state when it comes in (based on an authed user)

   const tokens = await quickBooksAuth.getTokens(code, realmId)
   // TODO: Store tokens with authed user if realmId doesn't already exist
   // redirect back to client application DON'T SEND TOKENS BACK
   res.send(tokens)
    
}