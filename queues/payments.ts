import { Queue } from "bullmq";

interface PaymentsJobData {
    realmId: string,
    paymentId: string
}

const paymentsProcessQueue = new Queue<PaymentsJobData>('payments', {
    connection: {
        host: 'redis',
        port: 6379
    },
})


paymentsProcessQueue.on('ioredis:close', () => {
    console.log('closing queue')
})


process.on('SIGTERM', async () => {

    await paymentsProcessQueue.close()
    process.exit(0)
})
process.on('SIGINT', async () => {
    await paymentsProcessQueue.close()
    process.exit(0)
})

export { paymentsProcessQueue as paymentsQueue}