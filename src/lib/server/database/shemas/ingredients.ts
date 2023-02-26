/* MongoDB schema for ingredients */
import { Schema } from "mongoose";

const ingredientsSchema = new Schema({
    img_url: { type: Schema.Types.String, required: true },
    name: { type: Schema.Types.String, required: true },
    ingredients: { type: Schema.Types.Array, required: true },
    price: { type: Schema.Types.Number, required: true },
    lunch_time: { type: Schema.Types.String, enum: ["breakfast", "lunch", "dinner", "dessert", "drinks"], required: true }
});

export {
    ingredientsSchema
}