/* MongoDB schema for meals */
import { Schema } from "mongoose";

const mealSchema = new Schema({
    img_url: { type: Schema.Types.String, required: true },
    name: { type: Schema.Types.String, required: true },
    factors: { type: Schema.Types.Array, required: true },
    price: { type: Schema.Types.Number, required: true },
    lunch_time: { type: Schema.Types.String, enum: ["breakfast", "lunch", "dinner", "dessert"], required: true } 
});

export {
    mealSchema
}
