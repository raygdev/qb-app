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
    }
}

interface SlackAuthService {
   buildAuthUrl: () => string
   getAccessToken: (code: string, state: string) => Promise<SlackTokenResponse | undefined>
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

        try {
            const { data } = await axios.post<SlackTokenResponse>(
                token_endpoint,
                query,
                { headers }
            )
    
            return data

        } catch(e:any) {
            console.log(e.response)
        }

    }
}

export const slackAuth = new SlackAuth()
