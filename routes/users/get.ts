import { Request, Response } from "express";
import { User } from "../../models/user";

export const getUser = async (req: Request<{ id: string }>, res: Response) => {
    const { id } = req.params

    const user = await User.findById(id).select('-password')

    if(!user) {
        res.status(404).send('Not Found')
        return;
    }

    res.status(200).json(user)
}