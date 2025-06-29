import { Worker } from "bullmq";
import { notifyUserJob, NotifyJobData, NotifyJobReturn } from "../jobs/notify-job";

export const notifyWorker = new Worker<
NotifyJobData,
NotifyJobReturn,
'notify-user'
>(
    'notify',
     notifyUserJob,
    {
        connection: {
            host: 'redis',
        },
        concurrency: 1000,
        autorun: false
    }
)

notifyWorker.on('closed', () => {
    console.log('closing notify worker')
})

notifyWorker.on('error', (e) =>{
     console.log(`ERROR: ${e}`)
 })

 notifyWorker.on('completed', async (job) => {
    console.log(job.returnvalue)
 })

 notifyWorker.on('ready', () => {
    console.log('notify worker started')
 })


process.on('SIGTERM', async () => {
    await notifyWorker.close()
    process.exit(0)
})
process.on('SIGINT', async () => {
    await notifyWorker.close()
    process.exit(0)
})