import { Request, Response, NextFunction } from "express";
import { SlackService } from "../../services/apis/slack-api";

import { SlackTeam } from "../../models/slack";


interface GetChannelListRequestParams {
    team_id: string
}



const getChannelList = async (
    req: Request<GetChannelListRequestParams>,
    res: Response
) => {

    /**
     * @todo grab team_id from requesting user
     */
   const { team_id } = req.params


   /**
    * @todo Change to slack bot token from user
    */

    const slackTeam = await SlackTeam.findOne({ team_id })

    if(!slackTeam) {
        res.status(404).send('Not Found')
        return;
    }


    const slack = new SlackService(slackTeam.bot_token)

    const { channels }  = await slack.getChannelList(slackTeam.team_id)

    res.status(200).json({ channels })
}