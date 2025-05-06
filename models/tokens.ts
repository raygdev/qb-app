import mongoose from "mongoose";

const TokensSchema = new mongoose.Schema({
    slack_team_id: { type: String, required: true },
    slack_bot_token: { type: String, required: true }
}, {
    toObject: { virtuals: true },
    toJSON: { virtuals: true },
})

export const Tokens = mongoose.model('tokens', TokensSchema)
