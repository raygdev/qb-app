import express, { Request } from 'express'
import { config } from 'dotenv'
config()
import { quickBooksAuth } from './auth/qb-auth'
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