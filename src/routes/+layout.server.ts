import type { ServerLoad } from "@sveltejs/kit"
import { mealsModel, ingredientsModel } from "$lib/server/database/mongodb"
import type { MealsAndIngredientsLook } from "../typing";

const pathNamesForMealsLoading = ["/breakfast", "/dessert", "/dinner", "/lunch"]
const pathNamesForIngredients = ["/drinks"].concat(pathNamesForMealsLoading);

// Function to obtain many resources in simple manner
async function getResourcesFromDatabase(resourceType: "meals" | "ingredients", additionalOption: any): Promise<any[]> {
    let model: import("mongoose").Model<any>;

    // Models distinguish between function use-cases
    switch(resourceType) {
        case "meals":
            model = mealsModel;
        break;
        
        case "ingredients":
            model = ingredientsModel
        break;

        default: throw new Error("Couldn't determine model!")
    }
    
    // Fetch resources from database using aggregation pipeline request
    const aggregationFetch = await model.aggregate([
        { $match: { lunch_time: additionalOption as string } },
        { $project: { lunch_time: false, _id: false } } // id must be removed because it's not serializable by sveltekit
    ]);

    // Return array nested within Promise
    return aggregationFetch
}

// Load result from server side (durning server side rendering) and return it to access from client side when conditions were meet
export const load = (async ({ request: { url } }) => {
    const furl = new URL(url);
    
    // Loading meals and ingredients is performing only for specific path names
    let meals: MealsAndIngredientsLook[] = [];
    let ingredients: MealsAndIngredientsLook[] = [];

    // Loading meals from database
    const pathname = furl.pathname.replaceAll("/__data.json", ""); // this is presented as tailing part of url durning navigation between app pages
    if (pathNamesForMealsLoading.includes(pathname)) {
        const fetchDb = await getResourcesFromDatabase("meals", pathname.replaceAll("/", ""))

        // console.log("Meals results for (" + furl.pathname + ") are:", fetchDb.length ? fetchDb : "Empty results list")
        meals = fetchDb;
    }

    // Loading ingredients from database
    if (pathNamesForIngredients.includes(pathname)) {
        const fetchDb = await getResourcesFromDatabase("ingredients", pathname.replaceAll("/", ""))
        
        // console.log("Ingredients results for (" + furl.pathname + ") are:", fetchDb.length ? fetchDb : "Empty results list")
        ingredients = fetchDb;
    }

    // console.log(meals, ingredients)
    // Return result to access from application client side
    return {
        meals, // Empty or enrolled
        ingredients // Empty or enrolled
    }
}) satisfies ServerLoad
