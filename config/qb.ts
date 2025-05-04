export const qbConfig = {
    client_id: process.env.QB_CLIENT_ID!,
    client_secret: process.env.QB_CLIENT_SECRET!,
    scopes: [
        'openid',
        'profile',
        'email',
        'phone',
        'address',
        'com.intuit.quickbooks.accounting',
        'com.intuit.quickbooks.payment'
    ],
    authorization_endpoint: 'https://appcenter.intuit.com/connect/oauth2',
    token_endpoint: 'https://oauth.platform.intuit.com/oauth2/v1/tokens/bearer',
    userinfo_endpoint: process.env.QB_USERINFO_ENDPOINT!,
    revocation_endpoint: 'https://developer.api.intuit.com/v2/oauth2/tokens/revoke',
    jwks_uri: 'https://oauth.platform.intuit.com/op/v1/jwks',
    redirect_uri: process.env.QB_REDIRECT_URI!
}
