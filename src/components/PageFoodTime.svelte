<script lang="ts">
    import WidgetList from "./WidgetList.svelte";

    export let mealTimeName: "Breakfasts" | "Lunchs" | "Dinners" | "Desserts" | "Drinks";
    export let displayIngConfig: {
        mealsList: boolean,
        ingredientsList: boolean
    } = { mealsList: true, ingredientsList: true }; // Let possible to determine which list should be displayed in variable way

    const readyMealsList = [
        {
            img_url: "src/assets/meals_images/breakfast-hot-start.jpg",
            name: "Hot start",
            ingredients: [
                "Sandwitch with jalapeno",
                "Juice from tomato, pepper and hot pepper",
                "Fresh tea",
                "Lemon"
            ],
            price: 12
        }
    ];
    const mekalsList = [
        {
            img_url: "src/assets/meals_images/tomato-sandwitch.webp", 
            name: "Tomato and Onion Sandwitch", 
            ingredients: [
                "Tomato",
                "Butter",
                "Onion",
                "Cucumber",
                "Lettuce"
            ],
            price: 6
        },
        {
            img_url: "src/assets/meals_images/tomato-sandwitch.webp", 
            name: "Tomato and Onion Sandwitchxx", 
            ingredients: [
                "Tomato",
                "Butter",
                "Onion",
                "Cucumber",
                "Lettuce"
            ],
            price: 8
        },
        {
            img_url: "src/assets/meals_images/tomato-sandwitch.webp", 
            name: "Tomato and Onion Sanhhdwitch", 
            ingredients: [
                "Tomato",
                "Butter",
                "Onion",
                "Cucumber",
                "Lettuce"
            ],
            price: 10
        },
        {
            img_url: "src/assets/meals_images/tomato-sandwitch.webp", 
            name: "Tomato and Onion Sanhhdwitchxxxxxxehehw", 
            ingredients: [
                "Tomato",
                "Butter",
                "Onion",
                "Cucumber",
                "Lettuce"
            ],
            price: 10
        }
    ]
</script>

<div class="first-glance {mealTimeName}">
    <div class="text">
        <h1>{mealTimeName}</h1>
    </div>
</div>

{#if displayIngConfig.mealsList}
    <WidgetList widgetType={"ready meals"} mekalsList={readyMealsList} categoryName={mealTimeName.toLocaleLowerCase()}/>
{/if}
{#if displayIngConfig.ingredientsList}
    <WidgetList widgetType={"ingredinets"} {mekalsList} categoryName={mealTimeName.toLocaleLowerCase()}/>
{/if}

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
</style>
