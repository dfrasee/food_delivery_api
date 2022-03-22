import { Document, Model, model, Types, Schema, Query } from "mongoose"

export interface IPurchaseHistory {
    dishName: string;
    restaurantName: string;
    transactionAmount: number;
    transactionDate?: Date;
}

export interface IUser {
    name: string;
    id: number;
    cashBalance: number;
    purchaseHistory: Types.DocumentArray<IPurchaseHistory>;
}

const IPurchaseHistorySchema = new Schema<IPurchaseHistory>(
{
    dishName: String,
    restaurantName: String,
    transactionAmount: Number,
    transactionDate: Date,
    }
)

const UserSchema = new Schema<IUser>({
    name: { type: String, required: true },
    id: { type: Number, required: true },
    cashBalance: { type: Number },
    purchaseHistory: [IPurchaseHistorySchema],
});

export default model<IUser>("users", UserSchema)
