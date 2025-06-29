import { Job, Processor } from "bullmq";
import { Customer } from "../models/quickbooks-customer";
import { SlackTeam } from "../models/slack";
import { SlackService } from "../services/apis/slack-api";

export interface NotifyJobData {
    realmId: string,
    customerId: string,
    paymentAmount: number
}

export interface NotifyJobReturn {
    success: boolean
}

export const notifyUserJob: Processor<NotifyJobData, NotifyJobReturn, 'notify-user'> = async (job: Job) => {
    const { realmId, customerId, paymentAmount } = job.data
    
    try {
        const customer = await Customer.findOne({ realmId, Id: customerId })
        if(!customer || !customer.notify.slack_user_id) {
            return { success: false }
        }
        const slackTeam = await SlackTeam.findOne({ team_id: customer.notify.team_id })
        if(!slackTeam) {
            console.log('no slack team found')
            return { success: false }
        }

        const slack = new SlackService(slackTeam.bot_token)

        const message = 
        `Hello <@${customer.notify.slack_user_id}>! A payment was made from ${customer.DisplayName} in the amount of $${paymentAmount}.`

        const notify = await slack.sendInvoicePaidMessage(
            message,
            customer.notify.team_id,
            customer.notify.slack_channel_id
        )

        return { success: notify.success }
    } catch(e) {
        console.log('ERROR IN NOTIFY JOB\n\n')
        console.dir(e, { depth: null })
        return { success: false }
    }


}