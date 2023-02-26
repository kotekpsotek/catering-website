<script lang="ts">
    import { invalidateAll } from "$app/navigation";
    import { navigating, page } from "$app/stores";
    import WidgetList from "./WidgetList.svelte";
    import { scale } from "svelte/transition";

    export let mealTimeName: "Breakfasts" | "Lunchs" | "Dinners" | "Desserts" | "Drinks";
    export let displayIngConfig: {
        mealsList: boolean,
        ingredientsList: boolean
    } = { mealsList: true, ingredientsList: true }; // Let possible to determine which list should be displayed in variable way

    // Vunerable to inside values change variable for annotate change into components to spawn new with new refreshed/updated meals list
    // Update to new results must wait for get data from server (data are sended from server using REST API and are pasted to $page.data)
    $: readyMealsList = $page.data.meals; // Empty or enrolled
    $: mekalsList = $page.data.ingredients; // Empty or enrolled

    let invalidationProcess: Promise<any> = Promise.resolve();

    // Load new data from layout.server.ts during navigation to new page with meals
    if ($navigating) {
        invalidationProcess = invalidateAll();
    }
</script>

<div class="first-glance {mealTimeName}">
    <div class="text">
        <h1>{mealTimeName}</h1>
    </div>
</div>

<!-- Wait for update data from layout.server.ts and display responsible gui to each process stage -->
{#await invalidationProcess}
    <!-- Displaying waiting screen -->
    <div class="waiting-for-new-data" transition:scale={{ duration: 25 }}>
        <p>Waiting for new data...</p>
    </div>
{:then}
    <!-- Displaying new updated ingredients/meals items lists -->
    {#if displayIngConfig.mealsList}
        <WidgetList widgetType={"ready meals"} mekalsList={readyMealsList} categoryName={mealTimeName.toLocaleLowerCase()}/>
    {/if}
    {#if displayIngConfig.ingredientsList}
        <WidgetList widgetType={"ingredinets"} {mekalsList} categoryName={mealTimeName.toLocaleLowerCase()}/>
    {/if}
{/await}


<style>
    .first-glance {
        height: 450px;
        display: flex;
        align-items: center;
        justify-content: center;
        background-repeat: no-repeat;
        background-size: contain;
        background-position: center;
        background-color: black;
    }

    /* Each meal has got specific image for specific meal time */
    .first-glance.Breakfasts {
        background-image: url(/src/assets/breakfast.jpg);
    }

    .first-glance.Lunchs {
        background-image: url(/src/assets/lunch.jpg);
    }

    .first-glance.Dinners {
        background-image: url(/src/assets/dinner.jpg);
    }

    .first-glance.Desserts {
        background-image: url(/src/assets/dessert.jpg);
    }

    .first-glance.Drinks {
        background-image: url(/src/assets/orange-juice.jpeg);
    }

    .first-glance .text {
        background-color: rgba(0, 0, 0, 0.45);
        text-align: center;
        padding: 20px;
        border-radius: 4px;
        font-family: Font-Bold;
        color: white;
    }

    /* Waiting for update data for meals and ingredients actual displaying for actual page - performing durning navigation */
    .waiting-for-new-data {
        height: 400px;
        width: 100%;
        display: flex;
        align-items: center;
        justify-content: center;
        font-family: Font;
        font-size: 18px;
    }
</style>
