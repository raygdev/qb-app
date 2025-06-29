import { Router } from "express";
import { createUser } from "./create";
import { updateUser } from "./update";
import { getUser } from "./get";

export class UserRouter {
    constructor(router: Router) {
        router.post('/user', createUser)
        router.put('/user/:id', updateUser)
        router.get('/user/:id', getUser)
    }
}