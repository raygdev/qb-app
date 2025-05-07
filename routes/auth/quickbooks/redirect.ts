import { Request, Response } from 'express'
import { quickBooksAuth } from '../../../services/auth/qb-auth'

// TODO: Make this an authenticated route for an app level user
// buildAuth url should take in the token as state to authenticate in the callback

export const quickbooksRedirect = (req: Request, res: Response) => {

    const authUrl = quickBooksAuth.buildAuthUrl()

    res.redirect(authUrl)
}