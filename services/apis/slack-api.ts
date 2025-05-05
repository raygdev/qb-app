import axios, { Axios } from 'axios'
import { config } from 'dotenv'
import { UserListResponse, ChannelListResponse } from '../../lib/types/slack-types';
config()

const slackClient = axios.create({
    baseURL: 'https://slack.com/api',
    headers: {
        'Authorization': `Bearer ${process.env.SLACK_BOT_TOKEN}`,
        'Content-Type': 'application/x-www-form-urlencoded'
    } 
})

interface ISlackService {
    getUserList: (team_id: string) => Promise<UserListResponse>
    getChannelList: (team_id: string) => Promise<ChannelListResponse>
}


class SlackService implements ISlackService {
    private client: Axios;

    constructor() {
        this.client = slackClient
    }

    async getUserList(team_id: string) {
        const params = {
            team_id
        }

        const body = new URLSearchParams(params)

        const { data } = await this.client.get<UserListResponse>('/users.list', { data: body })

        return data

    }

    async getChannelList(team_id: string) {

        const params = {
            team_id
        }

        const body = new URLSearchParams(params).toString()

        const { data } = await this.client.get<ChannelListResponse>(
            "/conversations.list",
            { data: body }
        )

        return data

    }
}

export const slackService = new SlackService()
