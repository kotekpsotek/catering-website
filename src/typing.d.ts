type MealsTypes = "Breakfast" | "Lunch" | "Dinner" | "Dessert" | "Drinks"

// Interface defining how resources looks after fetching from database. Ready to usage from application server side and client side
export interface MealsAndIngredientsLook {
    img_url: string,
    name: string,
    // "factors" and "ingredients" cannot be annotated as optional using "?" character due to svelte type checking in #each block
    factors: string[], // this exists or "ingredients" exits one from both must exists
    ingredients: string[], // this exists or "ingredients" exits one from both must exists
    price: number,
    lunch_time: "breakfast" | "lunch" | "dinner" | "dessert" | "drinks",
}
