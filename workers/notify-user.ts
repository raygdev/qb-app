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