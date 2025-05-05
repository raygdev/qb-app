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
    redirect_uri: 'https://5333-2601-c2-e01-3b60-f862-8c15-901f-b27a.ngrok-free.app/slack/callback',
    state: 'state',
    token_endpoint: 'https://slack.com/api/oauth.v2.access'
}