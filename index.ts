import express, { Request } from 'express'
import { config } from 'dotenv'
config()
import { quickBooksAuth } from './auth/qb-auth'
import { slackAuth } from './auth/slack-auth'
import axios from 'axios'
const app = express()

interface QueryParams {
    code: string,
    realmId: string
}

interface CallbackQuery extends Request<{}, any, any, QueryParams>{}



app.get('/', (req, res) => {

    const authUrl = quickBooksAuth.buildAuthUrl()

    res.redirect(authUrl)

})

app.get('/callback', async (req: CallbackQuery, res) => {
    const { code, realmId } = req.query

    try {
        const info = await quickBooksAuth.getTokens(code ,realmId)

        res.json({ message:'success', ...info })

    } catch(e: any) {
        console.log(e.response.data)

        res.end()
    }
    
})

app.get('/slack', (req, res) => {
    const authUrl = slackAuth.buildAuthUrl()

    res.redirect(authUrl)
})

app.get('/slack/callback', async (req: Request<{}, any, any, {code: string, state: string}>, res) => {
    const { code, state } = req.query

    if(!state) {
        res.end()
        return
    }

    const tokens = await slackAuth.getAccessToken(code,state)

    res.send(tokens)
})

app.get('/user', async (req,res) => {

    let token;
    try {
        const { data }  = await axios.get(process.env.QB_USERINFO_ENDPOINT!, {
            headers: {
                "Authorization": `Bearer ${token}`
            }
        })

        res.send(data)
    } catch(e) {
        console.log(e)

        res.end()
    }
})

app.listen(3000, () => {
    console.log('app listening on port 3000')
})