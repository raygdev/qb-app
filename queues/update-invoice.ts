import { Queue } from 'bullmq'

const updateInvoice = new Queue('update-invoice', {
    connection: {
        host: 'redis',
        port: 6379
    }
})

updateInvoice.on('error', (e) => {
    console.log(`[UPDATEINVOICE ERROR]:\n${e}`)
})

updateInvoice.on('ioredis:close', () => {
    console.log('UPDATE INVOICE QUEUE closed')
})

process.on('SIGTERM', async () => {
    console.log('process stopping')
    await updateInvoice.close()
    process.exit(0)
})

process.on('SIGINT', async () => {
    console.log('process stopping')
    await updateInvoice.close()
    process.exit(0)
})