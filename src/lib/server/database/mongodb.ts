import { createConnection } from "mongoose";
import { mealSchema } from "./shemas/meals";
import { ingredientsSchema } from "./shemas/ingredients";
import { paymentSchema } from "./shemas/payments";

// MongoDB connection for general rules
const generalConnection = createConnection("mongodb://127.0.0.1:27017/cateringWebsite");

/* MongoDB models */
// Meals model
const mealsModel = generalConnection.model("mealsModel", mealSchema, "mealsList");

// Ingredients model
const ingredientsModel = generalConnection.model("ingredientsModel", ingredientsSchema, "ingredientsList");

// Payments model
const paymentsModel = generalConnection.model("paymentsModel", paymentSchema, "payments");

export {
    mealsModel,
    ingredientsModel,
    paymentsModel
}
