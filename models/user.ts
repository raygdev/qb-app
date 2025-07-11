import mongoose from "mongoose";
import bcrypt from 'bcrypt'

const UserSchema = new mongoose.Schema({
    password: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    realmId: { type: String, default: '' },
    slack_team: { type: String, default: '' },
    first_name: { type: String, required: true },
    last_name: { type: String, required: true }
}, {
    toObject: { virtuals: true },
    toJSON: { virtuals: true }
})

UserSchema.pre('save',function() {
    const password = bcrypt.hashSync(this.password, 10) 

    this.password = password
    return this
})

export const User = mongoose.model('user', UserSchema)