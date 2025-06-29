import { addInvoice } from "./add-invoice";
import mongoose from "mongoose";
import { payments } from "./process-payment";
import { bulkAddCustomerWorker } from "./add-customer";

/**
 * @todo
 * make sure to clean this connection up and try to start the workers in the same connection
 */

mongoose.connect(`mongodb://root:rootpassword@mongo:27017/test?authSource=admin&retryWrites=true&w=majority`)
.then(() => {
    console.log('successfully connected mongodb')
    console.log('starting add invoice worker')
    addInvoice.run()
    console.log('running add invoice worker')
    payments.run()
    console.log('running payments worker')
    bulkAddCustomerWorker.run()
    console.log('running bulk add worker')

}).catch(e => {
    console.log(`[ERROR CONNECTION IN WORKERS]:\n${e}`)
})