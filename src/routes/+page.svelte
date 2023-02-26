<script lang="ts">
    import FoodWidget from "$lib/components/FoodWidget.svelte";
    import breakfastImg from "../assets/breakfast.jpg"
    import lunchImg from "../assets/lunch.jpg"
    import dinnerImg from "../assets/dinner.jpg"
    import dessertsImg from "../assets/dessert.jpg"
    import drinksImg from "../assets/orange-juice.jpeg"
</script>

<div class="welcome">
    <div class="text">
        <h1>Welcome on catering website</h1>
        <p>Select what food you would like to have delivering from below list</p>
    </div>
</div>

<div class="food-types">
    <div class="title">
        <p>Select meal for specific meal time</p>
    </div>
    <FoodWidget url="/breakfast" name="Breakfast" image={breakfastImg}/>
    <FoodWidget url="/lunch" name="Lunchs" image={lunchImg}/>
    <FoodWidget url="/diner" name="Diners" image={dinnerImg}/>
    <FoodWidget url="/dessert" name="Desserts" image={dessertsImg}/>
    <FoodWidget url="/drinks" name="Drinks" image={drinksImg}/>
</div>

<style>
    .welcome {
        width: 100%;
        height: 450px;
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        background-image: url(/src/assets/main-text-backgroud.jpg);
        background-size: fill;
        background-repeat: no-repeat;
    }
    
    .welcome .text {
        background-color: rgba(0, 0, 0, 0.45);
        text-align: center;
        padding: 20px;
        border-radius: 4px;
    }

    .welcome h1 {
        font-family: Font-Bold;
        color: white;
    }

    .welcome p {
        font-family: Font;
        color: rgb(133, 250, 133);
    }

    .food-types {
        margin-top: 25px;
        margin-bottom: 10px;
        display: flex;
        flex-direction: column;
        align-items: center;
        row-gap: 10px;
    }

    .food-types .title {
        width: 525px;
        text-align: start;
        font-family: Font;
        font-size: 25px;
        color: rgb(25, 149, 25);
    }
</style>
