import { Request, Response, NextFunction } from "express";
import { User } from "../../models/user";

interface UpdateUserRequestBody {
    email?: string,
    first_name?: string,
    last_name?: string,
    realmId?: string,
    slack_team?: string
}


export const updateUser = async (req:Request<{ id: string }, {}, UpdateUserRequestBody>, res: Response) => {
     const { id } = req.params

    const user = await User.findById(id)

    if(!user) {
        res.status(404).send('Not Found')
        return;
    }

    const keys = Object.keys(req.body)

    if(!keys.length) {
        res.status(400).send({
            message: 'A valid value must be present to update this user'
        })
        return;
    }

    keys.forEach((key) => {
        user.set(key, req.body[key as keyof UpdateUserRequestBody])
    })

    await user.save()

    res.status(200).json({
        message: 'User updated successfully'
    })
}