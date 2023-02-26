<!-- Widget is for two types, so: ingredients list, meals list -->
<script lang="ts">
    import { DeliveryAdd, Delivery } from "carbon-icons-svelte";
    import { foodOrder, addFoodToOrder, removeFoodFromOrder, isMealInFoodOrder } from "../../states/strores";
    import type { MealsAndIngredientsLook } from "../../typing";

    export let widgetType: "ingredinets" | "ready meals";
    export let mekalsList: MealsAndIngredientsLook[];
    export let categoryName: string;

    // List with interacted elements using mouse
    let ShowInteraction: number[] = [];

    // Add element id to interacted elements list using mouse
    function mouseOnMeal(id: number) {
        return (ev: Event) => {
            ShowInteraction.push(id);
            ShowInteraction = ShowInteraction;
        }
    }

    // Remove element id from interacted elements list using mouse
    function mouseLeaveMeal(id: number) {
        return (ev: Event) => {
            const indexINlist: number = ShowInteraction.findIndex(el => el == id);
            ShowInteraction.splice(indexINlist, 1);
            ShowInteraction = ShowInteraction;
        }
    }

    // Add or Remove meal from order after click on meal card
    function clickOnMealManage(mealName: string, mealPrice: number, imageUrl: string) {
        return (ev: Event) => {
            if (isMealInFoodOrder(mealName)) {
                removeFoodFromOrder(mealName)
            } else {
                addFoodToOrder(mealName, mealPrice, imageUrl);
            }
        }
    }
</script>

<div class="meals-list">
    <h2 class="title">{widgetType == "ingredinets" ? "Ingredients" : "Ready meals"} for <span>{categoryName}</span> list:</h2>
    <div class="list" class:ingredients-list={widgetType == "ingredinets"} class:ready-meals-list={widgetType == "ready meals"}>
        <!-- Checke whether list to create isn't empty and display empty list description or meals/ingredients list -->
        {#if mekalsList.length}
            <!-- Meals/Ingredients spawning -->
            {#each mekalsList as { img_url, name, ingredients, factors, price }, el_id}
                <button class="meal" on:mouseenter={mouseOnMeal(el_id)} on:mouseleave={mouseLeaveMeal(el_id)} on:click={clickOnMealManage(name, price, img_url)}>
                    {#key $foodOrder}
                        {#if ShowInteraction.includes(el_id) && !$foodOrder.some(meal => meal.name == name)}
                            <div class="interaction">
                                <!-- When meal isn't in delivery -->
                                <p>Click in order add to delivery</p>
                                <DeliveryAdd/>
                            </div>
                        {:else if $foodOrder.some(meal => meal.name == name)}
                            <!-- When meal is in delivery order -->
                            <div class="interaction in-delivery">
                                <p>Click to remove from delivery</p>
                                <Delivery/>
                            </div>
                        {/if}
                    {/key}
                    <img src="{img_url}" alt="">
                    <p class="name">{name}</p>
                    <div class="ingredients">
                        <p class="ingr-tit">{widgetType == "ingredinets" ? "Ingredients:" : "Factors:"}</p>
                        {#if ingredients?.length || factors?.length}
                            <ol>
                                {#each ingredients || factors as ingredient}
                                    <li>{ingredient}</li>
                                {/each}
                            </ol>
                        {:else}
                            <p>{widgetType == "ingredinets" ? "Ingredients" : "Factors"} list isn't specified. Give us some time to specify it</p>
                        {/if}
                    </div>
                    <div class="price">
                        <p>{price} zł</p>
                    </div>
                </button>
            {/each}
        {:else}
            <!-- Empty list description -->
            <div class="empty-list-description">
                <p>{widgetType == "ingredinets" ? "Ingredients" : "Factors"} list is empty</p>
            </div>
        {/if}
    </div>
</div>

<style>
    .meals-list {
        width: 100%;
        padding: 10px;
    }
    
    .title {
        margin-top: 10px;
        margin-bottom: 10px;
        font-family: Font;
        color: black;
    }

    .title span {
        color: rgb(25, 149, 25);
    }

    .list {
        width: 100%;
        padding: 10px;
        display: flex;
        flex-wrap: wrap;
        gap: 10px;
    }

    /* Empty list description */
    .empty-list-description {
        width: 100%;
        height: 200px;
        display: flex;
        align-items: center;
        justify-content: center;
        font-family: Font;
        font-size: 18px;
    }

    /* Adjust widget size for ready meals */
    .list.ready-meals-list .meal {
        width: 300px; /* Same as image width */
    }
    
    .list.ready-meals-list .meal img {
        height: 210px;
        width: 300px;
    }

    /* Adjust widget size for ingredients list */
    .list.ingredients-list .meal img {
        width: 250px;
        height: 200px;
    }

    .list.ingredients-list .meal {
        width: 250px; /* Same as image width */
    }

    .meal {
        position: relative;
        display: flex;
        flex-direction: column;
        align-items: center;
        background-color: whitesmoke;
        border-radius: 5px;
        padding-bottom: 5px;
        border: solid 1px black;
        cursor: pointer;
    }

    .meal img {
        object-fit: contain;
        background-color: black;
        border-top-left-radius: 5px;
        border-top-right-radius: 5px;
    }

    .meal .name {
        margin-top: 5px;
        word-wrap: break-word;
        text-align: center;
        font-family: Font-Bold;
        font-size: 18px;
        color: rgb(95, 95, 95);
    }

    .meal .ingredients {
        margin-top: 5px;
        width: 100%;
        display: flex;
        flex-direction: column;
        font-family: Font;
    }

    .ingredients .ingr-tit {
        font-size: 17px;
        /* color: salmon; */
        color: rgb(25, 149, 25);
        margin-top: 5px;
        padding-left: 5px;
        font-family: Font-Bold;
    }
    
    ol {
        margin-top: 5px;
        display: flex;
        flex-direction: column;
        align-items: flex-start;
        padding-left: 25px;
        gap: 5px;
        margin-bottom: 25px; /* Create place for element with price per meal */
    }
    
    ol li {
        /* width: 100%; */
        padding-right: 5px;
        font-size: 15px;
        display: list-item;
        word-break: break-all;
        text-align: start;
    }

    .price {
        width: calc(100% - 10px * 2);
        height: 25px;
        position: absolute;
        bottom: 0px;
        padding-left: 10px;
        padding-right: 10px;
        display: flex;
        justify-content: flex-end;
        font-size: 18px;
        font-family: Font-Bold;
        color: rgb(217, 186, 8);
    }

    .interaction {
        --padding-size: 5px;
        height: 35px;
        width: calc(100% - var(--padding-size) * 2); /* calc() function is because "padding" property causes overflow from meal element */
        padding-left: var(--padding-size);
        padding-right: var(--padding-size);
        position: absolute;
        top: 0px;
        right: 0px;
        display: flex;
        justify-content: flex-end;
        align-items: center;
        column-gap: 5px;
        background-color: white;
        border-top-right-radius: 5px;
        border-top-left-radius: 5px;
        border-bottom: solid 1px black;
        border-left: solid 1px black;
        border-right: solid 1px black;
    }

    .interaction.in-delivery {
        color: rgb(25, 149, 25);
    }

</style>
