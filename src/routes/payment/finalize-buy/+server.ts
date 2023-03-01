import { type RequestHandler, json, error } from "@sveltejs/kit";
import { getPricePerOrder, type OrderedMealReadyToFinalization } from "../../../states/strores";
import type { PurchaseOrder } from "../../../typing";
import crypto from "crypto";
import Stripe from "stripe";
import { STRIPE_API_KEY } from "$env/static/private";

const stripe = new Stripe(STRIPE_API_KEY, {
    apiVersion: "2022-11-15"
});

export const POST = (async ({ request }) => {
    const { first_name, last_name, email, phone_number, city, street, house_number, premises_number, post_code, description, delivery_manner, payment_method, order }: PurchaseOrder & { order: OrderedMealReadyToFinalization } = await request.json();

    const acceptableDeliveryManners = ["to hands", "leave in front of house"];
    const acceptablePaymentMethods = ["blik", "card", "przelewy24"];

    if (first_name.length && last_name.length && (email.includes("@") && email.trim().split("@").length == 2) && phone_number.length > 5 && city.length && street.length && house_number && (post_code.length >= 5 && post_code.length <= 8) && acceptableDeliveryManners.includes(delivery_manner) && acceptablePaymentMethods.includes(payment_method) && order.length) {
        const operationId = crypto.randomUUID();

        const stripeSession = await stripe.checkout.sessions.create({
            line_items: [
                { 
                    price_data: { 
                        currency: "PLN", 
                        product_data: { name: "Order", description: "Your choosen order" },
                        unit_amount: getPricePerOrder(order) * 100 // price * 100 because price is within "grosz" unit
                    },
                    quantity: 1   
                }
            ],
            customer_email: email,
            currency: "PLN",
            mode: "payment",
            payment_method_types: [payment_method != "przelewy24" ? payment_method : "p24"], // supported payment methods are defined here
            success_url: `${request.url}/payment/end?status=success&operationId=${operationId}`, // redirect to this page after successfull payment
            cancel_url: `${request.url}/payment/end?status=failure&operationId=${operationId}` // redirect to this page after payment calcelation by user
        });

        return json({ paymentSessionURL: stripeSession.url });
    }
    else throw error(406); 

}) satisfies RequestHandler;
