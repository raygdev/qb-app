import { Request, Response } from 'express'
import { slackAuth } from '../../../services/auth/slack-auth'

export const slackRedirect = (req: Request, res: Response) => {

    /**
     * @todo 
     * append token to state for verification in callback or generate
     * token here from a user id? maybe signed token is more secure?
     */

    const authUrl = slackAuth.buildAuthUrl()

    res.redirect(authUrl)
}