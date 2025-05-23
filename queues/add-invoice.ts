import { Queue } from 'bullmq'

// extract type into named job type
const addInvoice = new Queue<{ accessToken: string, realmId: string, invoiceId: string }>('add-invoice', {
    connection: {
        host: 'redis',
        port: 6379
    }
})

addInvoice.on('error', (e) => {
    console.log(`[ADDINVOICE ERROR]:\n${e}`)
})

addInvoice.on('waiting', () => {
    console.log("ADD INVOICE WAITING")
})

addInvoice.on('ioredis:close', () => {
    console.log('ADD INVOICE QUEUE closed')
})


process.on('SIGTERM', async () => {
    console.log('process stopping [ADDINVOICE]')
    await addInvoice.close()
    process.exit(0)
})

process.on('SIGINT', async () => {
    console.log('process stopping [ADDINVOICE]')
    await addInvoice.close()
    process.exit(0)
})

export { addInvoice }