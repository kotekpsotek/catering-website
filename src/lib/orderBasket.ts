// Save, Update, Destroy order basket state into/from browswer window.localStorage
import { foodOrder } from "../states/strores";

export default class OrderBasket {
    static KEY_NAME = "order-basket";
    
    // Save basket state into browswer window.localStorage
    static save() {
        foodOrder.update(ordersList => {
            if (ordersList) {
                const serialized = JSON.stringify(ordersList);
                window.localStorage.setItem(OrderBasket.KEY_NAME, serialized);
            };

            return ordersList;
        })
    }

    // Load saved state into window.localStorage to svelte storage
    static load() {
        const windowLocalStorageKeyData = window.localStorage.getItem(OrderBasket.KEY_NAME);

        if (windowLocalStorageKeyData) {
            foodOrder.update(ordersList => {
                const deserialized = JSON.parse(windowLocalStorageKeyData);
                
                ordersList = deserialized;
                
                return ordersList;
            })
        }
    }

    // Destroy saved order state from window.localStorage
    static destroy() {
        const keyExists = window.localStorage.getItem(OrderBasket.KEY_NAME);

        if (keyExists) {
            window.localStorage.removeItem(OrderBasket.KEY_NAME);
        }
    }
}
