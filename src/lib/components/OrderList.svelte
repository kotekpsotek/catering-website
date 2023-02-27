<script lang="ts">
    import { Close, TrashCan } from "carbon-icons-svelte";
    import { getPricePerOrder, foodOrder, removeFoodFromOrder } from "../../states/strores";
    import { createEventDispatcher, onDestroy } from "svelte";
    import { afterNavigate } from "$app/navigation";

    const evDispatcher = createEventDispatcher();

    // Register when user put mouse on ordered meal from orders list
    let mouseInteractions: string[] = [];

    // Close orders list menu
    function closeOrderList(ev: Event) {
        evDispatcher("close-order-list");
    }

    // After when user is redirected to other url specified url in application navigation then "orders list menu" is always closing
    afterNavigate(afterNavigationRsc => {
        if (afterNavigationRsc.to?.route.id == "/payment") {
            evDispatcher("close-order-list");
        }
    });

    // Remove meal from meals order after click on it
    function removeMealFromOrder(mealName: string) {
        return (ev: Event) => {
            removeFoodFromOrder(mealName);
        }
    }

    // Infrom user about possiblity of deletion order by click on it
    function mouseIsOnOrder(mealName: string) {
        return (ev: Event) => {
            mouseInteractions.push(mealName);
            mouseInteractions = mouseInteractions; // notify svelte reactivity system
        }
    }

    // Hide information about possiblity of deletion meal from order
    // It's performed using deletion meal name from 'mouseInteractions' variable
    function mouseLeaveMealOrder(mealName: string) {
        return (ev: Event) => {
            const position = mouseInteractions.findIndex(name => name == mealName);

            if (position >= 0) {
                mouseInteractions.splice(position, 1);
                mouseInteractions = mouseInteractions; // notify svelte reactivity system
            }
        }
    }

    // Reset mouse interactions local storage
    const unSub = foodOrder.subscribe(orderList => {
        mouseInteractions = [];
    });

    // Clear subscription listener after component utilization in deletion
    onDestroy(() => unSub());
</script>

<div class="order-list">
    <p>Order List</p>
    <div class="orders">
        {#if $foodOrder.length}
            {#each $foodOrder as { name, price, imageUrl }}
                <button class="ordered" on:click={removeMealFromOrder(name)} on:mouseenter={mouseIsOnOrder(name)} on:mouseleave={mouseLeaveMealOrder(name)}>
                    <!-- Display information about possibility of delete order from orders list -->
                    {#if mouseInteractions.includes(name)}
                        <div class="info-deletion-possibility">
                            <TrashCan/>
                            <p>Click on to delete</p>
                        </div>
                    {/if}
                    <img src="{imageUrl}" alt="">
                    <p class="name">{name}</p>
                    <p class="price">{price} zł</p>
                </button>
            {/each}
        {:else}
            <div class="empty-orders-list">
                <p>No orders on list!</p>
            </div>
        {/if}
    </div>
    <div class="price-per-order">
        <p>Summary:</p>
        <p class="unit">
           <!-- Refresh summary order price while each order has been added/remove to/from orders list -->
            {#key $foodOrder.length}
                {getPricePerOrder()} zł
            {/key}
        </p>
    </div>
    <div class="buttons">
        <button class="close-order" title="Close order list" on:click={closeOrderList}>
            <Close fill="red"/>
        </button>
        <!-- Display finalization order button only when on orders list are orders -->
        {#if $foodOrder.length}
            <a class="finalize-order" href="/payment">Buy</a>
        {/if}
    </div>
</div>

<style>
    .order-list {
        width: 300px;
        position: fixed;
        top: 55px; /* To be under the top bar */
        right: 10px; /* To be on right side with small border */
        background-color: whitesmoke;
        border: solid 1px black;
        padding: 5px;
        font-family: Font;
        z-index: 2;
    }

    /* Title of orders menu */
    .order-list > p:first-of-type {
        font-size: 18px;
        font-family: Font-Bold;
    }

    .orders {
        --ordered-height: 50px;
        max-height: calc(var(--ordered-height) * 5 + 5px * 4 + 5px * 5); /* list can have possible maximum 5 elements without visible overflow */ /* Second math equation is add do summary result gap value between ordered elements */ /* third calculation is for attach to summary result each ordered element bottom padding */
        overflow-y: auto;
        display: flex;
        flex-direction: column;
        gap: 5px;
    }

    .orders > .empty-orders-list {
        width: 100%;
        height: 100px;
        display: flex;
        align-items: center;
        justify-content: center;
        color: salmon;
    }

    .orders > .ordered {
        height: var(--ordered-height);
        font-family: Font;
        font-size: 16px;
        display: flex;
        padding-bottom: 5px;
        background-color: transparent;
        border: none;
        border-bottom: solid 1px black;
        outline: none;
        cursor: pointer;
        display: flex;
        align-items: center;
        justify-content: center;
        position: relative;
    }

    .orders > .ordered:first-of-type {
        margin-top: 5px;
    }

    .orders > .ordered:last-of-type {
        border-bottom: none;
    }

    .ordered img {
        width: 75px;
        height: 100%;
        object-fit: contain;
        background-color: black;
    }

    .ordered .name {
        width: 50%;
        height: 100%;
        padding-left: 10px;
        display: flex;
        align-items: center;
        justify-content: flex-start;
        text-align: center;
        overflow: hidden;
    }

    .ordered .price {
        width: calc(100% - (50% + 75px));
        height: 100%;
        padding-right: 10px;
        display: flex;
        align-items: center;
        justify-content: flex-end;
    }

    .ordered .info-deletion-possibility {
        position: absolute;
        width: 100%;
        height: 100%;
        display: flex;
        align-items: center;
        justify-content: center;
        background-color: rgba(0, 0, 0, 0.6);
        gap: 4px;
        color: white;
        font-family: Font-Bold;
    }

    .price-per-order {
        margin-top: 5px;
        display: flex;
        justify-content: space-between;
    }

    /* Container with order menu close button and order finalization button */
    div.buttons {
        display: flex;
        justify-content: center;
    }

    div.buttons > button {
        outline: none;
        border: none;
        background-color: transparent;
        cursor: pointer;
        display: flex;
        justify-content: center;
        align-items: center;
    }

    a.finalize-order {
        font-family: Font-Bold;
        font-size: 13px;
        text-decoration: none;
        color: slateblue;
    }

    button.close-order {
        width: 100px;
    }
</style>
