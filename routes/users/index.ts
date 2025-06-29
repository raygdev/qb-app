import { Router } from "express";
import { createUser } from "./create";
import { updateUser } from "./update";

export class UserRouter {
    constructor(router: Router) {
        router.post('/user', createUser)
        router.put('/user/:id', updateUser)
    }
}