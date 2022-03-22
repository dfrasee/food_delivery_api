import { Schema, model, Document,Types } from 'mongoose';

export interface IMenu extends Document {
    dishName: string;
    price: number;
}

export default interface IRestaurant extends Document {
    restaurantName: string;
    cashBalance: number;
    openingHours: string;
    menu: Types.DocumentArray<IMenu>;   
}

const RestaurantSchema = new Schema(
  {
    restaurantName: {
      type: Schema.Types.String,
      required: true,
      trim: true,
    },
    cashBalance: {
      type: Schema.Types.Number,
      default: 0.00,
    },
    openingHours: {
        type: Schema.Types.String,
        required: true,
        trim: true,
    },
    menu: [{
        dishName: Schema.Types.String,
        price: Schema.Types.Number,
    }],
  }
).index({"restaurantName": "text", "menu.dishName":"text"})

export const RestaurantModel = model<IRestaurant>('restaurants', RestaurantSchema);
