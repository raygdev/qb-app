import { Queue } from "bullmq";

export const notifyQueue = new Queue<{ realmId: string, customerId: string, paymentAmount: number }>(
    'notify',
    {
        connection: {
            host: 'redis',
            port: 6379
        }
    }
)

notifyQueue.on('error', (e) => {
    console.log(`[NOTIFYQUEUE ERROR]:\n${e}`)
})

notifyQueue.on('waiting', () => {
    console.log("NOTIFY QUEUE WAITING")
})

notifyQueue.on('ioredis:close', () => {
    console.log('NOTIFY QUEUE closed')
})


process.on('SIGTERM', async () => {
    console.log('process stopping [NOTIFYQUEUE]')
    await notifyQueue.close()
    process.exit(0)
})

process.on('SIGINT', async () => {
    console.log('process stopping [NOTIFYQUEUE]')
    await notifyQueue.close()
    process.exit(0)
})
