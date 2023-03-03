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
}, { _id: false }); // _id: false - because we don't won't to have _id field on nested object into main schema

const orderSchema = new Schema({
    name: String, // name is also unique identifier for meal/ingredient
    price: Number // price in złoty currency
}, { _id: false }); // _id: false - because we don't won't to have _id field on nested object into main schema

const paymentSchema = new Schema({
    operation_id: { type: String, required: true }, // unique id for operation generated as UUID_V4 using node.js crypto module
    stripe_session_id: { type: String, required: true }, // id which is using to obtain stripe session object and manage created stripe session while payment database object has been created
    payment_status: { type: String, required: true, enum: ["unpaid", "paid"] }, // two status same as two from Stripe Checkout object "payment_status" field
    payment_finalization_date: { type: Schema.Types.Date }, // determine when status from field "payment_status" has been changed from base status "unpaid" to "paid". Exists only when payment status from "paymet_status" field is set up as: "paid"
    user_info: {
        type: userInfoSchema,
        required: true
    },
    description: { type: String, maxlength: 2000, required: false },
    delivery_manner: { type: String, enum: ["to_hands", "leave in front of house"], required: true },
    payment_method: { type: String, enum: ["card", "blik", "przelewy24"], required: true },
    price_per_order: { type: Number, required: true }, // price per whole order in złoty currency unit // prices with grosz are presented as floating point numbers
    creation_date: { type: Schema.Types.Date, required: true }, // determine when object has been saved into database
    order: {
        type: [orderSchema],
        required: true
    },
    expired_stripe_payment_sessions: { type: [{ op_id: { type: String }, stripe_session_id: { type: String } }], required: false }
});

export {
    paymentSchema
}
