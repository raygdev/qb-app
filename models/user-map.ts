import mongoose from "mongoose";

const UserMapSchema = new mongoose.Schema({
    slack_team_id: { type: String },
    quickbooks_realm_id: { type: String },
    userId: { type: mongoose.Types.ObjectId, required: true, ref: 'user' },
    qb_token: { type: String },
    slack_bot_token: { type: mongoose.Types.ObjectId, required: true, ref: 'tokens' }
}, {
    toJSON: { virtuals: true },
    toObject: { virtuals: true }
})

export const UserMap = mongoose.model('user-map', UserMapSchema)
