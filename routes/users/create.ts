import { Request, Response, NextFunction } from "express";
import { User } from "../../models/user";

interface NewUserRequestBody {
    password: string, 
    email: string,
    first_name: string,
    last_name: string
}

export const createUser = async (req: Request<{}, {}, NewUserRequestBody>, res: Response) => {
    const { password, email, first_name, last_name } = req.body
    
    const user = await User.create({
        password,
        email,
        first_name,
        last_name
    })

    await user.save()


    res.status(201).json({
        message: 'New user created',
        user: {
            email: user.email,
            first_name: user.first_name,
            last_name: user.last_name,
            id: user.id
        }
    })
}