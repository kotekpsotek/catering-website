/* File contains Svelte stores which contains app states */

import { writable, type Writable } from "svelte/store";

export interface OrderedMeal {
    imageUrl: string,
    name: string,
    price: number
}

// Contains foods list to order. Each item is meal name threat as identifier
export const foodOrder: Writable<OrderedMeal[]> = writable([]);

// Add meal name to meal names list
export function addFoodToOrder(mealName: string, price: number, imageUrl: string) {
    foodOrder.update(list => {
        list.push({ name: mealName, price, imageUrl });
        
        return list;
    })
};

// Remove entered meal name from meal order list
export function removeFoodFromOrder(mealName: string) {
    foodOrder.update(list => {
        const id =  list.findIndex(mealFromList => mealFromList.name == mealName);
        list.splice(id, 1);

        return list;
    })
}

// Check whether meal is in order
export function isMealInFoodOrder(mealName: string): boolean {
    let result = false;

    foodOrder.update(list => {
        result = list.some(mealFromList => mealFromList.name == mealName);
        return list;
    })
    
    return result;
}

// Get price per whole order
export function getPricePerOrder(): number {
    // When order list is empty then 0 always will be returned
    let result: number = 0;

    foodOrder.update(listOrders => {
        listOrders.forEach(orderOne => {
            result += orderOne.price;
        });
        
        return listOrders;
    });

    return result;
}

