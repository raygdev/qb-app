import { Request, Response } from 'express'
import { slackAuth } from '../../../services/auth/slack-auth'

interface SlackAuthQuery {
    code?: string,
    state?: string
}

export const slackCallback = async (req: Request<{}, any, any, SlackAuthQuery>, res: Response) => {
    const { code, state } = req.query

    if(!code || !state) {
      res.status(401).send('Forbidden')
      return;
    }

    /**
     * @todo validate state (user token). If it fails, respond with 401
     */

    const tokens = await slackAuth.getAccessToken(code, state)

    /**
     * @todo don't send tokens back. Store them in their own team schema
     * Check that a team exists
     *      If it doesn't exist
     *          create a new team and add token
     *          associate the requesting user to the team token
     *      If the team does exist...
     *        If the user doesn't already have a team token assigned
     *          assign the user a reference (id) to the team token schema
     * 
     * redirect back to client application
     */

    res.send(tokens)
}