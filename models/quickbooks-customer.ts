import mongoose from "mongoose";

const QuickbooksCustomerSchema = new mongoose.Schema({
    Id: { type: String, required: true, index: true },
    GivenName: { type: String, required: true },
    FamilyName: { type: String, default: null },
    FullyQualifiedName: { type: String, required: true },
    CompanyName: { type: String, default: null },
    DisplayName: { type: String, required: true },
    realmId: { type: String, required: true, index: true },
    notify: {
        type: mongoose.Schema.Types.Mixed,
        default: { team_id: '', slack_channel_id: '', slack_user_id: ''}
    }
}, {
    toJSON: { virtuals: true },
    toObject: { virtuals: true }
})

interface QuickbooksCustomer {
    Id: string
    GivenName: string
    FamilyName?: string
    FullyQualifiedName: string
    CompanyName?: string
    DisplayName: string
    realmId: string
    notify: {
        slack_channel_id: string,
        slack_user_id: string,
        team_id: string
    }
}

export const Customer = mongoose.model<QuickbooksCustomer>('customer', QuickbooksCustomerSchema)

