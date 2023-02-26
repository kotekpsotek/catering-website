import { createConnection } from "mongoose";
import { mealSchema } from "./shemas/meals";
import { ingredientsSchema } from "./shemas/ingredients";

// MongoDB connection for general rules
const generalConnection = createConnection("mongodb://127.0.0.1:27017/cateringWebsite");

/* MongoDB models */
// Meals model
const mealsModel = generalConnection.model("mealsModel", mealSchema, "mealsList");

// Ingredients model
const ingredientsModel = generalConnection.model("ingredientsModel", ingredientsSchema, "ingredientsList");

export {
    mealsModel,
    ingredientsModel
}
