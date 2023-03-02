import { Schema } from "mongoose";

const userInfoSchema = new Schema({
    first_name: String,
    last_name: String,
    email: String,
    phone_number: String,
    city: String,
    street: String,
    house_number: Number,
    premises_number: Number,
    post_code: Number,
});

const orderSchema = new Schema({
    name: String, // name is also unique identifier for meal/ingredient
    price: Number // price in złoty currency
});

const paymentSchema = new Schema({
    operation_id: { type: String, required: true }, // unique id for operation generated as UUID_V4 using node.js crypto module
    payment_status: { type: String, required: true, enum: ["unpaid", "paid"] }, // two status same as two from Stripe Checkout object "payment_status" field
    user_info: {
        type: userInfoSchema,
        required: true
    },
    description: { type: String, maxlength: 2000, required: false },
    delivery_manner: { type: String, enum: ["to_hands", "leave in front of house"], required: true },
    payment_method: { type: String, enum: ["card", "blik", "przelewy24"], required: true },
    price_per_order: { type: Number, required: true }, // price per whole order in złoty currency unit // prices with grosz are presented as floating point numbers
    order: {
        type: [orderSchema],
        required: true
    }
});

export {
    paymentSchema
}
