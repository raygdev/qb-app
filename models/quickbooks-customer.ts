import mongoose from "mongoose";

const QuickbooksCustomerSchema = new mongoose.Schema({
    Id: { type: String, required: true, index: true },
    GivenName: { type: String, required: true },
    FamilyName: { type: String, default: null },
    FullyQualifiedName: { type: String, required: true },
    CompanyName: { type: String, default: null },
    DisplayName: { type: String, required: true },
    realmId: { type: String, required: true, index: true },
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
}

export const Customer = mongoose.model<QuickbooksCustomer>('customer', QuickbooksCustomerSchema)

