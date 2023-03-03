import type { PageServerLoad } from "./$types";
import { error, redirect } from "@sveltejs/kit";
import { paymentsModel } from "$lib/server/database/mongodb";
import { stripe } from "$lib/server/globals";

export const load = (async ({ url }) => {
    /* Parameters recived from url when user is redirected to this url to perform pay operation using for this stripe (TLDR: prior payment) */
    // Payment url
    let paymentUrl = url.searchParams.get("payment_url");
    // If payment url query param was found then decode it from base64url it base encoding form to utf-8 again
    if (paymentUrl) {
        paymentUrl = Buffer.from(paymentUrl, "base64url").toString("utf-8");
    };

    // Payment method
    const paymentMethod = url.searchParams.get("payment_method");

    /* Parameters recived from url after when user perform pay operation using stripe with any effect */
    // Status recived after each performed payment operation with all kinds of results
    const status = url.searchParams.get("status") as "success" | "failure" | null;

    // Generated on server side operation id assigned to created payment checkout session created using stripe. It is saved into application database
    const operationId = url.searchParams.get("operationId");

    // Price per order
    let pricePerOrder: number | "Couldn't determine" = "Couldn't determine";

    // Order status assigned to each order
    let orderStatus: "waiting for payment" | "in preparation" | "ready to send" | "in way to you" = "in preparation";

    // Reason of failure // is only attached to pages url with query "status" param setup as "failure" thus in other cases this variable exist within assigned "null" (without in string = same null) value
    let failureReason = url.searchParams.get("reason");
    if (failureReason) {
        failureReason = Buffer.from(failureReason, "base64url").toString("utf-8");
    }

    // Get url address without query section
    const getUrl = () => {
        return `${url.origin}${url.pathname}`;
    }

    /* Handle payment operations status obtained after try to finalize order by payment */
    if (status == "success" && operationId) {
        const paymentDataFromDb = await paymentsModel.findOne({ operation_id: { $eq: operationId } })

        // Check whether in database is saved payment object
        if (paymentDataFromDb) {
            // Assign price to response value
            pricePerOrder = paymentDataFromDb.price_per_order;

            // Obtain stripe session and data from it
            const stripeCreatedPriorSession = await stripe.checkout.sessions.retrieve(paymentDataFromDb.stripe_session_id);
            const { status } = stripeCreatedPriorSession;

            // Check whether session has been really succesfully completed by payment and update payment database object only when into database status is set as "unpaid" when payment operation ends with successfull payment
            if (status == "complete" && paymentDataFromDb.payment_status == "unpaid") {
                // Update payment status in application mongodb database from "unpdaid" to "paid" rely on stripe session object payment status information and also setup date when status has been changed to "paid" to "payment_finalization_date" field
                await paymentsModel.updateOne({ operation_id: operationId }, { payment_status: "paid", payment_finalization_date: new Date() }, { new: true })
            }
            else if (status != "complete") {
                // When payment status is different then complete redirect user to "failure" page version
                const failureReason = Buffer.from("Incomplete payment operation per order", "utf-8").toString("base64url");
                const url = `${getUrl()}?status=failure&operationId=${operationId}&reason=${failureReason}`;
                
                throw redirect(303, url);
            }
        }
        else throw error(401, "Payment hasn't been created!");
    } 
    else if (status == "failure") {
        if (operationId) {
            const paymentDataFromDb = await paymentsModel.findOne({ operation_id: { $eq: operationId } });

            // Check whether in database is saved payment object
            if (paymentDataFromDb) {
                // Obtain stripe session and data from it
                const stripeCreatedPriorSession = await stripe.checkout.sessions.retrieve(paymentDataFromDb.stripe_session_id);
                const { status } = stripeCreatedPriorSession;

                // When payment status is "complete" then redirect user to success page version
                if (status == "complete") {
                    const url = `${getUrl()}?status=success&operationId=${operationId}`;

                    throw redirect(303, url);
                };

                // Assign price to response value
                pricePerOrder = paymentDataFromDb.price_per_order;

                // Assign order status to order payment finalization page (last page)
                orderStatus = "waiting for payment";
            }
            else throw error(401, "Payment hasn't been created!");
        }
        else throw error(401, "Payment id is required into url query params");
    } 
    else if (!paymentUrl) throw error(404, "Unrecognized payment status"); // when paymentUrl isn't specified and above conditions hasn't been fullfilled then do this action

    return {
        paymentUrl,
        paymentMethod,
        status,
        operationId,
        pricePerOrder,
        orderStatus,
        failureReason
    }
}) satisfies PageServerLoad;
