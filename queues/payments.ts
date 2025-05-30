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

paymentsProcessQueue.on('error', (e) => {
    console.log(`PAYMENTS QUEUE ERROR:\n ${e}`)
})


paymentsProcessQueue.on('waiting', (job) => {
    console.log(`waiting on job: ${job.name} to complete`)
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