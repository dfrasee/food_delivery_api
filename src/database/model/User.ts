import { Schema, model, Types} from "mongoose";

export interface IPurchaseHistory {
    dishName: string;
    restaurantName: string;
    transactionAmount: number;
    transactionDate: string;
}

export interface IUser {
  name: string;
  id: number;
  cashBalance: number;
  purchaseHistory: Types.DocumentArray<IPurchaseHistory>;
}

const purchaseHistorySchema = new Schema<IPurchaseHistory>({
    dishName: String,
    restaurantName: String,
    transactionAmount: Number,
    transactionDate: String
  }, { _id : false }
);

const UserSchema = new Schema<IUser>({
  name: { type: String, required: true },
  id: { type: Number, required: true },
  cashBalance: { type: Number },
  purchaseHistory: [purchaseHistorySchema],
});

export const UserModel = model<IUser>("users", UserSchema);