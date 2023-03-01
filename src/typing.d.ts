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

// Interface with all data required to purchase order and for delivery finalization. Is used in: "/payment/finalization" route "+page.svelte" and "+page.server.ts"
export interface PurchaseOrder {
    first_name: string, // ordering user first name
    last_name: string, // ordering user last name
    email: string, // ordering user email address
    phone_number: string, // ordering user phone number
    city: string, // city for delivery
    street: string, // street for delivery
    house_number: number, // house number for delivery
    premises_number?: number, // optional! premises number for delivery
    post_code: string, // post code for delivery
    description?: string // optional description attached to delivery order
    delivery_manner: "to hands" | "leave in front of house", // delivery manner
    payment_method: "blik" | "card" | "przelewy24" // required payment method
}
