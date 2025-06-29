import { Worker, Job } from "bullmq";
import { addCustomerJob } from "../jobs/add-customers-job";

const bulkAddCustomerWorker = new Worker<{ realmId: string, accessToken: string }, { success: boolean }, 'addCustomers'>(
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