import mongoose from 'mongoose'

const SlackTeamSchema = new mongoose.Schema({
    team_id: { type: String, required: true, index: true },
    bot_token: { type: String, required: true }

}, {
    toObject: { virtuals: true },
    toJSON: { virtuals: true }
})