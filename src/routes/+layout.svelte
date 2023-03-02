<script lang="ts">
    import { TableOfContents, Home, Add } from "carbon-icons-svelte"
    import { page } from "$app/stores";
    import { foodOrder } from "../states/strores";
    import OrderList from "$lib/components/OrderList.svelte";
    import { onDestroy, onMount } from "svelte";
    import OrderBasket from "$lib/orderBasket";

    // Determine whether order list should be displaying
    let displayOrderList: boolean = false;

    // Click to display menu with e.g: order list
    function clickOnMenu(ev: Event) {
        displayOrderList = !displayOrderList;
    }

    // Actions which will be performing while component is mounted to application GUI
    onMount(() => {
        // Load order state saved into window.localStorage to foodOrder svelte storage
        OrderBasket.load();
    })

    // Actions which will be performing while component destroying
    onDestroy(() => {
        // Save foodOrder state within window.localStorage
        OrderBasket.save();
    });
</script>

<div class="info-stripe">
    {#if $page.url.pathname != "/"}
        <a class="to-home" href="/">
            <Home size={24}/>
            <p>Back to home</p>
        </a>
    {:else}
        <p></p>
    {/if}
    <a class="brand-name" href="/">Amazing Catering</a>
    <button class="menu" on:click={clickOnMenu} title="Click to display orders list">
        <TableOfContents size={24}/>
        {#if $foodOrder.length}
            <div class="something-is-in-delivery">
                <Add fill="white"/>
            </div>
        {/if}
    </button>
</div>

<!-- Display whole order list in menu -->
{#if displayOrderList}
    <!-- Closing order list menu is also possible from orders list menu -->
    <OrderList on:close-order-list={clickOnMenu}/>
{/if}

<slot></slot>

<footer>
    <p>
        Created by 
        <a href="https://github.com/kotekpsotek">kotekspotek</a>
        2023
    </p>
</footer>

<style>
    .info-stripe {
        width: 100vw;
        height: 50px;
        display: flex;
        align-items: center;
        border-bottom: solid 1px black;
    }

    .info-stripe > * {
        width: calc(100% / 3);
    }

    .info-stripe a.to-home {
        padding-left: 10px;
        display: flex;
        align-items: center;
        column-gap: 5px;
        font-family: Font;
        font-size: 15px;
        text-decoration: none;
        color: black;
    }

    .info-stripe .brand-name {
        text-align: center;
        font-family: Font-Regular-Italic;
        text-decoration: none;
        color: black;
    }

    .info-stripe button {
        padding-right: 20px;
        border: none;
        background-color: transparent;
        display: flex;
        align-items: center;
        justify-content: flex-end;
        cursor: pointer;
        position: relative;
    }

    .info-stripe button.menu .something-is-in-delivery {
        width: 18px;
        height: 18px;
        border-radius: 50%;
        background-color: salmon;
        display: flex;
        align-items: center;
        justify-content:center;
        position: absolute;
        top: -10px;
        right: 30px;
    }

    footer {
        margin-top: 20px;
        width: 100%;
        height: 140px;
        display: flex;
        align-items: flex-end;
        justify-content: center;
        background-color: whitesmoke;
        border-top: solid 1px rgb(133, 250, 133);
        font-size: 20px;
        font-family: Font;
    }

    footer p:first-of-type {
        margin-bottom: 25px; /* Attach responsible position for text */
    }

    footer a {
        text-decoration: none !important;
        color: salmon;
    }
</style>
