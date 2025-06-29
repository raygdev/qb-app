import { Queue } from "bullmq";

const customerQueue = new Queue<{ realmId: string, accessToken: string }>(
    'add-customer-list',
    {
        connection: {
            host: 'redis',
            port: 6379
        }
    }
)

customerQueue.on('error', (e) => {
    console.log(`[CUSTOMERQUEUE ERROR]:\n${e}`)
})

customerQueue.on('waiting', () => {
    console.log("CUSTOMERQUEUE WAITING")
})

customerQueue.on('ioredis:close', () => {
    console.log('CUSTOMERQUEUE closed')
})


process.on('SIGTERM', async () => {
    console.log('process stopping [CUSTOMERQUEUE]')
    await customerQueue.close()
    process.exit(0)
})

process.on('SIGINT', async () => {
    console.log('process stopping [CUSTOMERQUEUE]')
    await customerQueue.close()
    process.exit(0)
})

export { customerQueue }