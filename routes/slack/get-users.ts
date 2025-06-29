import { Request, Response, NextFunction } from "express";
import { SlackTeam } from "../../models/slack";
import { SlackService } from "../../services/apis/slack-api";

interface GetSlackUsersRequestParams {
  team_id: string
}

const getSlackUsers = async (
    req: Request<GetSlackUsersRequestParams>,
    res: Response
) => {
    const { team_id } = req.params

    const slackTeam = await SlackTeam.findOne({ team_id })

    if(!slackTeam) {
        res.status(404).send('Not Found')
        return;
    }

    const slack = new SlackService(slackTeam.bot_token)

    const { members } = await slack.getUserList(slackTeam.team_id)

    const users = members.map(member => {
        const { id, profile: { real_name } } = member
        return {
            id,
            real_name
        }
    })
    
    res.status(200).json({ users })
}