import { config } from "dotenv";
import axios from 'axios'
config()
import { slackConfig } from "../config/slack";

interface SlackTokenResponse {
    ok: boolean,
    access_token: string,
    token_type: string,
    scope: string,
    bot_user_id: string,
    app_id: string
    team: {
        name: string,
        id: string
    },
    enterprise?: {
        name: string,
        id: string
    },
    authed_user: {
        id: string,
        scope?: string,
        access_token?: string,
        token_type?: string
    },
    is_enterprise_install: boolean
}

interface SlackRefreshResponse extends SlackTokenResponse {
    refresh_token: string,
    expires_in: number,
}

interface SlackAuthService {
   buildAuthUrl: () => string
   getAccessToken: (code: string, state: string) => Promise<SlackTokenResponse>
   refreshAccessToken: (refresh_token: string) => Promise<SlackRefreshResponse>
}


class SlackAuth implements SlackAuthService{
    private config: typeof slackConfig;
    constructor() {
        this.config = slackConfig
    }

    buildAuthUrl() {
        const { redirect_uri, authorization_endpoint, client_id, scopes, state } = this.config

        const params = {
            client_id,
            redirect_uri,
            scope: scopes.join(','),
            state
        }

        const query = new URLSearchParams(params).toString()

        const authUrl = `${authorization_endpoint}?${query}`

        return authUrl
    }

    async getAccessToken(code: string, state: string) {

        if(!state || state !== this.config.state) {
            throw new Error('Not Authorized')
        }

        const { token_endpoint, client_id, client_secret } = this.config

        const params = {
            client_id,
            client_secret,
            code
        }

        const headers = {
            'Accept': 'application/json',
            'Content-Type': 'application/x-www-form-urlencoded'
        }

        const query = new URLSearchParams(params).toString()

        const { data } = await axios.post<SlackTokenResponse>(
            token_endpoint,
            query,
            { headers }
        )

        return data

    }

    async refreshAccessToken(refresh_token: string) {
        const { client_id, client_secret, token_endpoint } = this.config

        const params = {
            client_id,
            client_secret,
            refresh_token,
            grant_type: 'refresh_token'
        }

        const body = new URLSearchParams(params).toString()

        const headers = {
            'Content-Type': 'application/x-www-form-urlecoded'
        }

        const { data } = await axios.post<SlackRefreshResponse>(
            token_endpoint,
            body,
            { headers}
        )

        return data
    }

}

export const slackAuth = new SlackAuth()
