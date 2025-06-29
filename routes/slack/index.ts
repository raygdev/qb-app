import { Router } from "express";
import { getChannelList } from "./get-channels";
import { getSlackUsers } from "./get-users";

export class SlackRoutes {
    constructor(router: Router) {
        router.get('/slack/channels/:team_id', getChannelList)
        router.get('/slack/users/:team_id', getSlackUsers)
    }
}