/* Global values and application interfaces to usage in whole application server side */
import Stripe from "stripe";
import { STRIPE_API_KEY } from "$env/static/private";

const stripe = new Stripe(STRIPE_API_KEY, {
    apiVersion: "2022-11-15"
});

export {
    stripe
}
