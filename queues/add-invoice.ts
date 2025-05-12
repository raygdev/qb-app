import { Queue } from 'bullmq'

const addInvoice = new Queue('add-invoice', {
    connection: {
        host: 'redis',
        port: 6379
    }
})

addInvoice.on('error', (e) => {
    console.log(`[ADDINVOICE ERROR]:\n${e}`)
})

addInvoice.on('ioredis:close', () => {
    console.log('ADD INVOICE QUEUE closed')
})


process.on('SIGKILL', async () => {
    console.log('process stopping')
    await addInvoice.close()
    process.exit(0)
})

process.on('SIGINT', async () => {
    console.log('process stopping')
    await addInvoice.close()
    process.exit(0)
})

export { addInvoice }