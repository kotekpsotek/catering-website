import type { PageServerLoad } from "./$types";
import { error, redirect } from "@sveltejs/kit";
import { paymentsModel } from "$lib/server/database/mongodb";
import { generateStripeSession, stripe, mailer } from "$lib/server/globals";
import ejs from "ejs";

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
    const status = url.searchParams.get("status") as "success" | "failure" | "try_create_payment_again" | null;

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
    if (status == "success" && operationId) { // operationId is required durning processing this status
        // Status recived when payment end successfull thus by send money per order
        const paymentDataFromDb = await paymentsModel.findOne({ operation_id: { $eq: operationId } })

        // Check whether in database is saved payment object
        if (paymentDataFromDb) {
            // Assign price to response value
            pricePerOrder = paymentDataFromDb.price_per_order;

            // Obtain stripe session and data from it
            const stripeCreatedPriorSession = await stripe.checkout.sessions.retrieve(paymentDataFromDb.stripe_session_id);
            const { status } = stripeCreatedPriorSession;

            // Check whether session has been really succesfully completed by payment, send email to given by user address and update payment database object only when into database status is set as "unpaid" when payment operation ends with successfull payment
            if (status == "complete" && paymentDataFromDb.payment_status == "unpaid") {
                // Send email to client with congratulations for successfull purchased order
                const _emailSendedStatus = await mailer.sendMail({
                    to: paymentDataFromDb.user_info.email,
                    from: "amazingcatering@noreply.com",
                    subject: "Successfull payment for order notification",
                    html: await ejs.renderFile("./src/lib/emails/successfullpayment.ejs", { userPanelUrl: url.origin + "/user-panel", orderId: paymentDataFromDb.operation_id })
                });

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
        // Status recived when in payment has been created failure thus payment doesn't end successfully
        if (operationId) { // operation id is required durning processing this status
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
    else if (status == "try_create_payment_again") {
        // Status recived when user would like to retry create payment after "failure" in payment
        if (operationId) {
            const paymentDataFromDb = await paymentsModel.findOne({ operation_id: { $eq: operationId } });
            
            // Check whether in database is saved payment object
            if (paymentDataFromDb) {
                // Obtain stripe session and data from it
                const stripeCreatedPriorSession = await stripe.checkout.sessions.retrieve(paymentDataFromDb.stripe_session_id);
                const { status } = stripeCreatedPriorSession;

                // Do appropriate action per stripe session status
                if (status == "complete") {
                    // When payment status is equal to complete then redirect user to "success" (url with query param "status" setup as "success") version of last application payment page
                    const url = `${getUrl()}?status=success&operationId=${operationId}`;

                    throw redirect(303, url);
                }
                else if (status == "open") {
                    // Redirect user to stripe session url which is still open (session not exipred)
                    throw redirect(303, stripeCreatedPriorSession.url as string); // I assume that in this scenario stripe session url value is always not empty string and not null value
                }
                else if (status == "expired" && paymentDataFromDb.payment_status == "unpaid") {
                    // Create/Regenerate old stripe checkout session and redirect user to it
                    // Create new stripe session
                    const { stripeSession, operationId: newOperationId } = await generateStripeSession(paymentDataFromDb.price_per_order, paymentDataFromDb.user_info.email as string, paymentDataFromDb.payment_method, url);

                    // Update old payment object from database using new stripe checkout session genreated data
                    await paymentsModel.updateOne({ operation_id: operationId }, {
                        operation_id: newOperationId, // assign new genreated operation id without using old
                        stripe_session_id: stripeSession.id, // assign new generated stripe session id without using old which will cause inconsistent data and probably errors
                        $push: {
                            expired_stripe_payment_sessions: { // Attach old stripe_session_id and operation_id to history collection located within document
                                op_id: operationId,
                                stripe_session_id: paymentDataFromDb.stripe_session_id
                            }
                        }
                    });

                    // Redirect user to new payment stripe page
                    throw redirect(303, stripeSession.url as string); // I assume that in this place url is always not empty string and also not null value
                }
                else throw error(401, "Payment has been successfully completed (You already paid!)"); // When above conditions don't match log to user that he paid for order already as an red text error
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
