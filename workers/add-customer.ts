import { Worker, Job } from "bullmq";
import { addCustomerJob } from "../jobs/add-customers-job";

export const bulkAddCustomerWorker = new Worker<{ realmId: string, accessToken: string }, { success: boolean }, 'addCustomers'>(
    'add-customer-list',
    addCustomerJob,
    {
        connection: {
            host: 'redis',
        },
        concurrency: 1000,
        autorun: false
    }
)

bulkAddCustomerWorker.on('completed', (job) => {
    const success = job.returnvalue.success

    console.log(`Status of job: ${job.id} is ${success ? 'completed' : 'failed' }`)
})

bulkAddCustomerWorker.on('active', (job) => {
    console.log(`add-customer worker is active with job id ${job.id}`)
})

bulkAddCustomerWorker.on('ready', () => {
    console.log('add invoice worker is ready')
})

bulkAddCustomerWorker.on('error', (e) => {
    console.log(`[ERROR ADD INVOICE WORKER]:\n${e}`)
})