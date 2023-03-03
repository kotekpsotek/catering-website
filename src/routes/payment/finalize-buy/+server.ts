import { type RequestHandler, json, error } from "@sveltejs/kit";
import { getPricePerOrder, type OrderedMealReadyToFinalization } from "../../../states/strores";
import type { PurchaseOrder } from "../../../typing";
import crypto from "crypto";
import { paymentsModel } from "$lib/server/database/mongodb";
import { generateStripeSession, stripe } from "$lib/server/globals";

export const POST = (async ({ request, url }) => {
    const { first_name, last_name, email, phone_number, city, street, house_number, premises_number, post_code, description, delivery_manner, payment_method, order }: PurchaseOrder & { order: OrderedMealReadyToFinalization } = await request.json();

    // Acceptable values for field definition
    const acceptableDeliveryManners = ["to hands", "leave in front of house"];
    const acceptablePaymentMethods = ["blik", "card", "przelewy24"];

    // Obtain price per whole order
    const price_per_order = getPricePerOrder(order);

    if (first_name.length && last_name.length && (email.includes("@") && email.trim().split("@").length == 2) && phone_number.length > 5 && city.length && street.length && house_number && (post_code.length >= 5 && post_code.length <= 8) && acceptableDeliveryManners.includes(delivery_manner) && acceptablePaymentMethods.includes(payment_method) && order.length) {
        const { stripeSession, operationId } = await generateStripeSession(price_per_order, email, payment_method, url);

        // Save created session into database
        await paymentsModel.create({
            operation_id: operationId,
            stripe_session_id: stripeSession.id, // unique stripe session identifier
            payment_status: stripeSession.payment_status,
            user_info: {
                first_name,
                last_name,
                email,
                phone_number,
                city,
                street,
                house_number,
                premises_number,
                post_code
            },
            price_per_order, // price per order in złoty currency unit // price with grosz are presented as floating point numbers
            description,
            delivery_manner,
            payment_method,
            creation_date: new Date(),
            order
        });

        // Response will be returning to client only when server recives checkout session url from stripe api else client gets 401 http error status code
        if (stripeSession.url) {
            // Return to client side url to perform payment using stripe. URL is encoded using base64 (url sub-version) from subsequent reasons
            // To client is also returned payment method selected by him prior
            return json({ paymentSessionURL: Buffer.from(stripeSession.url, "utf-8").toString("base64url"), paymentMethod: payment_method });
        }
        else throw error(401);
    }
    else throw error(406); 

}) satisfies RequestHandler;
