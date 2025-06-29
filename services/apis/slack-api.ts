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
    sendInvoicePaidMessage: (message:string, team_id:string, channelId: string) => Promise<{success: boolean}>
}


export class SlackService implements ISlackService {
    private client: Axios;

    constructor(botToken: string) {
        this.client = axios.create({
            baseURL: 'https://slack.com/api',
            headers: {
                'Authorization': `Bearer ${botToken}`,
                'Content-Type': 'application/x-www-form-urlencoded'
            } 
        })
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

    async sendInvoicePaidMessage(message: string, team_id: string, channelId: string) {

        const data = {
            channel: channelId,
            text: message
        }

        const messageSent = await this.client.post<{ ok: boolean, message: { text: string }}>(
            '/chat.postMessage',
            data,
            { headers: { 'Content-Type': 'application/json; charset=utf-8'}},
        )

        return { success: messageSent.data.ok }
    }
}