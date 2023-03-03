/* Global values and application interfaces to usage in whole application server side */
import Stripe from "stripe";
import { STRIPE_API_KEY } from "$env/static/private";

const stripe = new Stripe(STRIPE_API_KEY, {
    apiVersion: "2022-11-15"
});

export async function generateStripeSession(price_per_order: number, email: string, payment_method: any, url: URL) {
    const operationId = crypto.randomUUID();

    const stripeSession = await stripe.checkout.sessions.create({
        line_items: [
            { 
                price_data: { 
                    currency: "PLN", 
                    product_data: { name: "Order", description: "Your choosen order" },
                    unit_amount: price_per_order * 100 // price * 100 because price is within "grosz" unit
                },
                quantity: 1   
            }
        ],
        customer_email: email,
        currency: "PLN",
        mode: "payment",
        payment_method_types: [payment_method != "przelewy24" ? payment_method : "p24"], // supported payment methods are defined here
        success_url: `${url.origin}/payment/end?status=success&operationId=${operationId}`, // redirect to this page after successfull payment
        cancel_url: `${url.origin}/payment/end?status=failure&operationId=${operationId}&reason=${Buffer.from("User resigne manually from payment", "utf-8").toString("base64url")}` // redirect to this page after payment calcelation by user
    });

    return {
        operationId,
        stripeSession
    }
}

export {
    stripe
}
