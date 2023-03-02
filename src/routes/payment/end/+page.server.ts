import type { PageServerLoad } from "./$types";
import { error } from "@sveltejs/kit";
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

    /* Handle payment operations status obtained after try to finalize order by payment */
    if (status == "success") {
        const paymentDataFromDb = await paymentsModel.findOne({ operation_id: { $eq: operationId } })

        // Check whether in database is saved payment object
        if (paymentDataFromDb) {
            const stripeCreatedPriorSession = await stripe.checkout.sessions.retrieve(paymentDataFromDb.stripe_session_id);
            const { status } = stripeCreatedPriorSession;

            // Check whether session has been really succesfully completed by payment
            if (status == "complete") {
                // Update payment status in application mongodb database from "unpdaid" to "paid" rely on stripe session object payment status information and also setup date when status has been changed to "paid" to "payment_finalization_date" field
                await paymentsModel.updateOne({ operation_id: operationId }, { payment_status: "paid", payment_finalization_date: new Date() }, { new: true })
            }
        } 
        else throw error(401, "Payment hasn't been created!");
    }

    return {
        paymentUrl,
        paymentMethod,
        status,
        operationId
    }
}) satisfies PageServerLoad;
