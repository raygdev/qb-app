import { Router } from "express";

import { quickbooksRedirect, quickbooksRefresh, quickbooksRevoke, quickbooksCallback } from "./quickbooks";
import { slackRedirect, slackRefresh, slackRevoke, slackCallback } from "./slack";
import { login } from "./login";
import { register } from "./register";
import { verify } from "./verify";

export class AuthRoutes {
    constructor(router: Router) {
        router.get('/auth/quickbooks/redirect', quickbooksRedirect)
        router.post('/auth/quickbooks/refresh', quickbooksRefresh)
        router.post('/auth/quickbooks/revoke', quickbooksRevoke)
        router.get('/auth/quickbooks/callback', quickbooksCallback)
        router.get('/auth/slack/redirect', slackRedirect)
        router.post('/auth/slack/refresh', slackRefresh)
        router.post('/auth/slack/revoke',slackRevoke)
        router.get('/auth/slack/callback',slackCallback)
        router.post('/auth/login', login)
        router.post('/auth/register', register)
        router.post('/auth/verify', verify)
    }
}