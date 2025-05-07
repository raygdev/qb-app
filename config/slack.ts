export const slackConfig = {
    client_id: process.env.SLACK_CLIENT_ID!,
    client_secret: process.env.SLACK_CLIENT_SECRET!,
    authorization_endpoint: 'https://slack.com/oauth/v2/authorize',
    scopes: [
        'chat:write',
        'chat:write.public',
        'users:read',
        'channels:read'
    ],
    redirect_uri: process.env.SLACK_REDIRECT_URI!,
    state: 'state',
    token_endpoint: 'https://slack.com/api/oauth.v2.access',
    revocation_endpoint: 'https://slack.com/api/auth.revoke'
}