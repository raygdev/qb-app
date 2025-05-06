import { config } from 'dotenv'
config()
import { qbConfig } from '../../config/qb'
import axios from 'axios'
import { QuickBooksJwksResponse, QuickBooksRevokedTokenResponse, QuickBooksTokensResponse } from '../../lib/types/quickbooks-types'

interface QuickBooksAuthService {
    buildAuthUrl: () => string
    getBase64EncodedIdAndSecret: () => string
    getTokens: (code: string, realmId: string) => Promise<QuickBooksTokensResponse>
    revokeToken: (token: string) => Promise<QuickBooksRevokedTokenResponse>
    refreshAccessToken: (refresh_token: string) => Promise<Omit<QuickBooksTokensResponse, 'realmId' | 'id_token'>>
    isValidUserIdToken: (token: string) => Promise<boolean>
}





export class QuickBooksAuth implements QuickBooksAuthService {
    private config: typeof qbConfig;
    constructor() {
        this.config = qbConfig
    }


    buildAuthUrl() {
        const { client_id, redirect_uri, scopes, } = this.config

        const params = {
            client_id,
            scope: scopes.join(' '),
            response_type: 'code',
            state: 'state', //TODO: Change hardcoded value later
            redirect_uri
        }

        const query = new URLSearchParams(params).toString()

        const authUrl = `${this.config.authorization_endpoint}?${query}`

        return authUrl
    }

    getBase64EncodedIdAndSecret() {
        const { client_id, client_secret } = this.config

        const basicAuthEncoded = Buffer.from(`${client_id}:${client_secret}`).toString('base64')

        return basicAuthEncoded
    }

    async getTokens(code:string, realmId:string) {

        const { redirect_uri, token_endpoint } = this.config
        
        const basicAuthEncoded = this.getBase64EncodedIdAndSecret()

        const headers = {
            'Content-Type': 'application/x-www-form-urlencoded',
            'Accepts': 'application/json',
            'Authorization': `Basic ${basicAuthEncoded}`
        }
        const params = {
            code,
            grant_type: 'authorization_code',
            redirect_uri
        }

        const body = new URLSearchParams(params).toString()

     
        const { data } = await axios.post<Omit<QuickBooksTokensResponse, 'realmId'>>(
            token_endpoint,
            body,
            { headers }
        )


        return {
            ...data,
            realmId
        }

    }

    async revokeToken(token: string) {
        const { revocation_endpoint } = this.config
        const basicAuthEncoded = this.getBase64EncodedIdAndSecret()
        const headers = {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
            'Authorization': `Basic ${basicAuthEncoded}`
        }
        const { status } = await axios.post(
            revocation_endpoint,
            { token },
            { headers }
        )

        const revoked = {
            token,
            revoke: true,
            message: 'token successfully revoked',
            status
        }

        return revoked
    }

    async refreshAccessToken(refresh_token: string) {
        const basicAuthEncoded = this.getBase64EncodedIdAndSecret()
        const { token_endpoint } = this.config

        const headers = {
            'Content-Type': 'application/x-www-form-urlencoded',
            'Accept': 'application/json',
            'Authorization': `Basic ${basicAuthEncoded}`
        }

        const params = {
            grant_type: 'refresh_token',
            refresh_token
        }

        const body = new URLSearchParams(params).toString()

        const { data } = await axios.post<Omit<QuickBooksTokensResponse, 'realmId' | 'id_token'>>(
            token_endpoint,
            body,
            { headers }
        )

        return data
    }

    async isValidUserIdToken(id_token: string) {
        const [header] = id_token.split('.')
        const basicAuthEncoded = this.getBase64EncodedIdAndSecret()

        const decodedHeader = JSON.parse(Buffer.from(header, 'base64').toString('utf-8')) as { kid: string, alg: string }

        const { data } = await axios.get<QuickBooksJwksResponse>(
            this.config.jwks_uri,
            {
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/x-www-form-urlencoded',
                    'Authorization': `Basic ${basicAuthEncoded}`
                }
            }
        )
        const isValid = data.keys.some((key) => key.kid === decodedHeader.kid)
        
        return isValid
    
    }

}

export const quickBooksAuth = new QuickBooksAuth()
