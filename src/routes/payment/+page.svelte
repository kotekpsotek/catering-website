<!-- Page with order summarization and giving attemt to continue ordering or finalize order by purchase it -->
<script lang="ts">
    import { foodOrder, getPricePerOrder } from "../../states/strores";
    import { goto } from "$app/navigation";
    import ProgressInPayProcessForDelivery from "$lib/components/ProgressInPayProcessForDelivery.svelte";

    // Continue ordering by go back to previous page before /payment from window.history
    function continueOrdering(ev: Event) {
        window.history.back()
    }

    // Finalize order by purchase it but before it user is redirected to /payment/finalize-buy page using "goto" function from sveltekit routing
    function purchaseOrder(ev: Event) {
        // "replaceState" property is setup as false for keep in window history this page to allow to go back to it when it is necessary. Function can also be using without this explicity setting because it's her default behaviour
        goto("/payment/finalize-buy", { replaceState: false });
    }
</script>

<div class="summary">
    <ProgressInPayProcessForDelivery isOnWay={1} actualStation={1}/>
    <div class="nested">
        <div class="t-box">
            <h1>Summary and Payment</h1>
        </div>
        <h2 class="title">Order summary:</h2>
        <div class="orders">
            {#if $foodOrder.length}
                <div class="list">
                    {#each $foodOrder as { imageUrl, name, price }, i}
                        <div class="order" class:first-order-item={i == 0}>
                            <p class="number">{i + 1}</p>
                            <img src="{imageUrl}" alt="">
                            <p class="name">{name}</p>
                            <p class="price">{price} zł</p>
                        </div>
                    {/each}
                    <div class="bottom-stripe">
                        <p class="total"><span>{$foodOrder.length}</span> element/s</p>
                        <div class="price">
                            <p>Total Price: <span>{getPricePerOrder()} zł</span></p>
                        </div>
                    </div>
                </div>
            {:else}
                <div class="empty-order">
                    <p>Your order is empty!</p>
                </div>
            {/if}
        </div>
        <div class="next-action-choose">
            <button id="continue-ordering" on:click={continueOrdering}>Continue</button>
            {#if $foodOrder.length}
                <button id="purchase" on:click={purchaseOrder}>Buy</button>
            {/if}
        </div>
    </div>
</div>

<style>
    .summary {
        width: calc(100% - 20px);
        height: 100vh;
        padding: 10px;
        font-family: Font;
    }

    .summary .nested {
        background-color: white;
        border: black solid 1px;
        padding: 5px;
    }

    .t-box {
        width: 100%;
        height: 250px;
        display: flex;
        align-items: center;
        justify-content: center;
        background-image: url(/src/assets/payment-page.png);
    }

    .t-box > h1 {
        background-color: rgba(0, 0, 0, 0.45);
        text-align: center;
        padding: 20px;
        border-radius: 4px;
        font-family: Font-Bold;
        color: white;
    }

    .title {
        margin-top: 10px;
        font-family: Font-Bold;
    }

    .orders {
        margin-top: 10px;
    }

    /* Communication about empty order list */
    .orders .empty-order {
        width: 100%;
        height: 100px;
        display: flex;
        align-items: center;
        justify-content: center;
        color: salmon;
    }

    /* List with choosen items pulled to orders list */
    .orders > .list {
        display: flex;
        flex-direction: column;
        max-height: calc(50px * 10); /* on list can be maximum 10 items without overflow on y-axis */
        overflow-y: auto;
    }

    /* Each order living into list with orders */
    .list > .order {
        --number-width: 50px;
        --image-width: 100px;
        --name-width: calc(100% - (var(--number-width) + var(--image-width) + var(--price-width)));
        --price-width: 75px;
        height: 50px;
        width: 100%;
        display: flex;
        /* column-gap: 5px; */
        border-top: solid 1px black;
    }

    .list > .order.first-order-item {
        border-top: none;
    }

    .order :is(.number, .name, .price) {
        display: flex;
        align-items: center;
    }

    .order .number {
        width: var(--number-width);
        display: flex;
        align-items: center;
        justify-content: center;
        border-right: solid 1px black;
    }

    .order img {
        width: var(--image-width);
        height: 100%;
        object-fit: contain;
        background-color: black;
    }

    .order .name {
        padding-left: 5px;
        padding-right: 5px;
        width: var(--name-width);
    }

    .order .price {
        width: var(--price-width);
        justify-content: center;
    }

    .list > .bottom-stripe {
        margin-top: 5px;
        display: flex;
        justify-content: space-between;
    }

    .bottom-stripe > .price span {
        font-family: Font-Bold;
        color: rgb(217, 186, 8);
    }

    .next-action-choose {
        margin-top: 10px;
        display: flex;
        gap: 5px;
        justify-content: flex-end;
    }

    .next-action-choose > button {
        /* Disable default button style from HTML5 */
        outline: none;
        border: none;
        background-color: transparent;
        /* Custom styles */
        padding: 5px;
        font-family: Font;
        font-size: 16px;
        cursor: pointer;
        border-radius: 5px;
    }

    .next-action-choose button#continue-ordering {
        color: slateblue;
        border: slateblue solid 1px;
    }
    
    .next-action-choose button#purchase {
        color: whitesmoke;
        background-color: slateblue;
        border: slateblue solid 1px;
    }
</style>
