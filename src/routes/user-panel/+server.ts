import { json } from "@sveltejs/kit";
import { paymentsModel } from "$lib/server/database/mongodb";

/* Return delivery status or null when delivery with given email/operation_id doesn't exists */
export const POST = (async ({ request }) => {
    const checkBy = await request.json();
    const { to_check } = checkBy;

    const resultCheckIntoDatabase = (await paymentsModel.aggregate([
        { $match: { $or: [{ "user_info.email": to_check }, { operation_id: to_check }] } },
        { $project: { _id: false, operation_id: true, payment_status: true, delivery_manner: true, payment_method: true, price_per_order: true, payment_finalization_date: true } }
    ]))[0] || null;
    
    return json(resultCheckIntoDatabase);
}) satisfies import("./$types").RequestHandler;
