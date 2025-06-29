import { Request, Response } from "express";
import { Customer } from "../../models/quickbooks-customer";

interface NotifyRequestBody {
    team_id: string,
    slack_channel_id: string,
    slack_user_id: string
}

export const updateNotify = async (
    req: Request<{ id: string }, {}, NotifyRequestBody>,
    res: Response
) => {
    const { id } = req.params

    const { team_id, slack_channel_id, slack_user_id } = req.body

    if(!team_id || !slack_channel_id || !slack_user_id) {
        res.status(400).send('Fields Required')
        return;
    }

    const customer = await Customer.findById(id)

    if(!customer) {
        res.status(404).send('Not Found')
        return;
    }

    customer.set('notify.team_id', team_id)
    customer.set('notify.slack_user_id', slack_user_id)
    customer.set('notify.slack_channel_id', slack_channel_id)

    await customer.save()

    res.status(200).send({ customer })
}