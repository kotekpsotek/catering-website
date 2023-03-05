<!-- Page to Add data required to perform delivery -->
<script lang="ts">
    import { Need, Home } from "carbon-icons-svelte";
    import { foodOrder, getPricePerOrder, getOrderForFinalizationByPayment } from "../../../states/strores";
    import urlPrzelewy24LogoSVG from "../../../assets/payment_methods/Przelewy24_logo.svg";
    import urlBlikLogoJPG from "../../../assets/payment_methods/BLIK LOGO RGB.jpg";
    import urlCreditCardIconPNG from "../../../assets/payment_methods/credit-card.png";
    import type { PurchaseOrder } from "../../../typing";
    import { goto } from "$app/navigation";
    import ProgressInPayProcessForDelivery from "$lib/components/ProgressInPayProcessForDelivery.svelte";

    // Let get width for stripe with actual way visualisation to finalize ordering meals/ingredients
    let determineDataContainerWidth: number;
    let summarizationContainerWidth: number;

    // Collect delivery data into
    /* const deliveryData: PurchaseOrder = {
        first_name: "",
        last_name: "",
        email: "",
        phone_number: "",
        city: "",
        street: "",
        house_number: undefined as any, // invalid I know
        premises_number: undefined,
        post_code: "",
        description: undefined,
        delivery_manner: undefined as any, // invalid I know
        payment_method: undefined as any // invalid I know
    }; */
    // For test purposes only. Above commented version is ready for release version
    const deliveryData: PurchaseOrder = {
        first_name: "JKSJKSJKSJKD",
        last_name: "chgdhshsdh",
        email: "ja@c.pl",
        phone_number: "1234567",
        city: "Warsaw",
        street: "Glory",
        house_number: 12, // invalid I know
        premises_number: 1,
        post_code: "1234567",
        description: undefined,
        delivery_manner: "leave in front of house", // invalid I know
        payment_method: "przelewy24" // invalid I know
    };

    const deliveryMannerIconsSize = 50 as 24;

    // Check whether user pass all data required to perform delivery
    function deliveryAdressHasBeenPassed(): boolean {
        return deliveryData.city.length > 0 && deliveryData.street.length > 0 && deliveryData.house_number != undefined && (deliveryData.post_code.length >= 5 && deliveryData.post_code.length <= 8)
    }

    // Get delivery address data as a text for GUI
    function getDeliveryAdressDataForGUI(): string {
        return deliveryAdressHasBeenPassed() ? `${deliveryData.city} ${deliveryData.street} ${deliveryData.house_number}${deliveryData.premises_number != undefined ? "/"+deliveryData.premises_number : ""} ${deliveryData.post_code}`.trim() : "Not selected or Invalid"
    }

    // Get full and correct name for selected payment when it has been selected for GUI and return "Not selected" when it hasn't been
    function getSelectedPaymentMethodName(): "Blik" | "Credit Card" | "Przelewy24" | "Not selected" {
        switch(deliveryData.payment_method) {
            case "blik":
                return "Blik";
            case "card":
                return "Credit Card";
            case "przelewy24":
                return "Przelewy24";
            // In default case return "Not selected" (when not selected)
            default:
                return "Not selected";
        }
    }

    // Return selected delivery method name for GUI and return "Not selected" when user doesn't select delivery method already
    function getSelectedDeliveryMethodName(): "Delivery to your hands" | "Leave delivery in front of door" | "Not selected" {
        switch(deliveryData.delivery_manner) {
            case "leave in front of house":
                return "Leave delivery in front of door"
            case "to hands":
                return "Delivery to your hands";
            // In default case return "Not selected" (when not selected)
            default:
                return "Not selected";
        }
    }

    // Return status which refers to whether user give all needed data to go to next step (Payment)
    function userCanGoToPayment(): boolean {
        const { first_name, last_name, email, phone_number, delivery_manner, payment_method } = deliveryData;
        
        return first_name.length > 0 && last_name.length > 0 && (email.includes("@") && email.trim().split("@").length == 2) && phone_number.length > 5 && delivery_manner != undefined && payment_method != undefined
    }

    // When user click on go to payment button when it hasn't got enabled "disabled" attribute
    async function goToPayment(ev: Event) {
        if (userCanGoToPayment()) {
            const dataToFinalization = Object.assign(deliveryData, {
                order: getOrderForFinalizationByPayment()
            });
            const sendOrder = await fetch(document.URL, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(dataToFinalization)
            });
    
            if (sendOrder.status == 200) {
                // Recive payment session to redirect user to it
                const { paymentSessionURL, paymentMethod } = await sendOrder.json();

                // Redirect user to last page where will be showing payment results
                await goto(`/payment/end?payment_url=${paymentSessionURL}&payment_method=${paymentMethod}`);
            }
            else alert("Couldn't redirect you to next step page!" + sendOrder.status + " " + document.URL);
        }
        // This below isn't necessary because enabled "disabled" attribute doesn't afford click event to work
        // else alert("You didn't added all required data to finalize order by payment!")
    }
</script>

{#if $foodOrder.length}
    <div class="enclosing">
        <!-- Attach component with progress in ordering visualisation (with custom width for this element) -->
        <ProgressInPayProcessForDelivery isOnWay={2} actualStation={2} customWidth={determineDataContainerWidth + summarizationContainerWidth - 10}/>
        <div class="on-x">
            <div class="determine-data" bind:clientWidth={determineDataContainerWidth}>
                <h1>Data for Delivery and Payment</h1>
                <div class="input-fields">
                    <h2>Data for delivery</h2>
                    <input type="text" placeholder="Firstname" required bind:value={deliveryData.first_name}>
                    <input type="text" placeholder="Lastname" required bind:value={deliveryData.last_name}>
                    <div class="inputs-inline">
                        <input type="text" placeholder="Email" required bind:value={deliveryData.email}>
                        <input type="text" placeholder="Phone number" required bind:value={deliveryData.phone_number}>
                    </div>
                    <div class="inputs-inline">
                        <input type="text" placeholder="Locality" required bind:value={deliveryData.city}>
                        <input type="text" placeholder="Street" required bind:value={deliveryData.street}>
                        <input type="number" placeholder="House number" required bind:value={deliveryData.house_number}>
                        <input type="number" placeholder="Premise number" bind:value={deliveryData.premises_number}>
                    </div>
                    <input type="text" placeholder="Post code" required bind:value={deliveryData.post_code}>
                </div>
                <div class="additional">
                    <h2>Additional Description</h2>
                    <textarea placeholder="Description" maxlength="2000" bind:value={deliveryData.description}></textarea>
                    <div class="maximum-size">
                        <p>{deliveryData.description?.length || 0}/2000</p>
                    </div>
                </div>
                <div class="delivery-manner">
                    <h2>Delivery Manner</h2>
                    <div class="option">
                        <Need size={deliveryMannerIconsSize}/>
                        <input type="radio" value="to hands" bind:group={deliveryData.delivery_manner}>
                        <p>Delivery to your hands</p>
                    </div>
                    <div class="option">
                        <Home size={deliveryMannerIconsSize}/>
                        <input type="radio" value="leave in front of house" bind:group={deliveryData.delivery_manner}>
                        <p>Leave delivery in front of door</p>
                    </div>
                </div>
                <div class="payment-method">
                    <h2>Payment method for order</h2>
                    <div class="option">
                        <img src="{urlPrzelewy24LogoSVG}" alt="">
                        <input type="radio" value="przelewy24" bind:group={deliveryData.payment_method}>
                        <p>Przelewy24</p>
                    </div>
                    <div class="option">
                        <img src="{urlBlikLogoJPG}" alt="">
                        <input type="radio" value="blik" bind:group={deliveryData.payment_method}>
                        <p>Blik</p>
                    </div>
                    <div class="option">
                        <img src="{urlCreditCardIconPNG}" alt="">
                        <input type="radio" value="card" bind:group={deliveryData.payment_method}>
                        <p>Credit Card</p>
                    </div>
                </div>
                <!-- <button on:click={ev => console.log(deliveryData)}>Click to check passed data for delivery and order</button> -->
            </div>
            <div class="summarization" bind:clientWidth={summarizationContainerWidth}>
                <div class="content">
                    <h1>Summarization</h1>
                    <div class="encounter">
                        {#key deliveryData}
                            <div class="delivery-address">
                                <p>Delivery address:</p>
                                <p class:invalid={getDeliveryAdressDataForGUI() == "Not selected or Invalid"}>{getDeliveryAdressDataForGUI()}</p>
                            </div>
                            <div class="selected-payment-method">
                                <p>Selected delivery manner</p>
                                <p class:invalid={getSelectedDeliveryMethodName() == "Not selected"}>{getSelectedDeliveryMethodName()}</p>
                            </div>
                            <div class="selected-delivery-manner">
                                <p>Selected payment method:</p>
                                <p class:invalid={getSelectedPaymentMethodName() == "Not selected"}>{getSelectedPaymentMethodName()}</p>
                            </div>
                        {/key}
                    </div>
                    <div class="for-payment">
                        <p>For payment:</p>
                        <p class="price">{getPricePerOrder()} zł</p>
                    </div>
                    {#key deliveryData}
                        <button id="go-to-payment" disabled="{!userCanGoToPayment()}" on:click={goToPayment}>Go to payment</button>
                    {/key}
                </div>
            </div>
        </div>
    </div>
{:else}
    <div class="empty-order-list">
        <p>No orders on list!</p>
        <a href="/">Go to prepare your order</a>
    </div>
{/if}

<style>
    .enclosing {
        width: calc(100% - 20px);
        height: 100vh;
        padding: 10px;
        font-family: Font;
        display: flex;
        flex-direction: column;
        align-items: center;
    }
    
    .enclosing .on-x {
        display: flex;
        justify-content: center;
        flex-wrap: wrap;
        gap: 10px;
    }

    .empty-order-list {
        width: 100%;
        height: 100%;
        display: flex;
        gap: 5px;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        color: salmon;
        font-family: Font;
    }

    .empty-order-list a {
        text-decoration: none;
        padding: 5px;
        color: slateblue;
        border: slateblue solid 1px;
        border-radius: 5px;
    }

    h1 {
        font-family: Font-Bold;
    }

    h2 {
        margin-bottom: 5px;
    }

    .determine-data {
        width: 45%;
        padding: 10px;
        background-color: whitesmoke;
        border: solid 1px black;
    }

    .determine-data > .input-fields {
        margin-top: 10px;
        display: flex;
        flex-direction: column;
        gap: 5px;
    }

    /* Style for input with type="text" */
    .input-fields input {
        /* width: 75%; */
        padding: 5px;
        outline: none;
        border: solid 1px black;
        background-color: aliceblue;
        font-family: Font;
        font-size: 16px;
    }

    /* Style for inputs inside .inputs-inline block with inputs, with required inline layout */
    .input-fields .inputs-inline {
        width: 100%;
        display: flex;
        gap: 5px;
    }

    .input-fields .inputs-inline input {
        width: 100%;
    }

    /* Conatainer for additional description */
    .additional {
        margin-top: 10px;
    }

    /* Styling for textarea field with place for attach description for ordered delivery */
    .additional textarea {
        width: calc(100% - 10px);
        height: 150px;
        padding: 5px;
        outline: none;
        border: solid 1px black;
        background-color: aliceblue;
        font-family: Font;
        font-size: 16px;
        resize: none;
    }

    /* Styling for description length counter compare to maximum description size */
    .additional .maximum-size {
        display: flex;
        justify-content: flex-end;
    }

    /* Container to determine delivery order manner */
    .delivery-manner {
        margin-top: 10px;
        display: flex;
        flex-direction: column;
        row-gap: 10px;
    }

    /* Container to determine payment method for order */
    .payment-method {
        margin-top: 10px;
    }

    div.option {
        display: flex;
        align-items: center;
        gap: 5px;
    }

    /* Adjusting width for radio input: Image within div.option block exists only within choosing payment method block so: div.payment-method block */
    div.option input[type=radio] {
        width: 18px;
        height: 18px;
    }
    
    /* Adjusting image size from input radio type */
    div.option img {
        width: 75px;
        height: 50px;
        object-fit: scale-down;
    }

    /* Delivery Stept summarization block by displaying passed data to perform purchase and to send order */
    .summarization > .content {
        width: 450px;
        padding: 10px;
        background-color: whitesmoke;
        border: solid 1px black;
    }

    /* Block with encounter of importand data passed to delivery and to purchase order */
    .summarization > .content .encounter {
        margin-top: 10px;
        display: flex;
        flex-direction: column;
        row-gap: 5px;
    }

    /* Each encountered information element */
    .summarization > .content .encounter div {
        display: flex;
        justify-content: space-between;
    }

    /* Appropriate selected element has got style identyfing it as appropriate passed field (all red text must change to green one) */
    .summarization > .content .encounter div p:nth-of-type(2) {
        color: rgb(25, 149, 25);
    }

    /* Each neccessary invalid not passed data has got different text and style */
    .summarization > .content .encounter div p.invalid {
        color: red;
    }

    /* Block which display price per order to view */
    .for-payment {
        margin-top: 10px;
        display: flex;
        justify-content: space-between;
    }

    /* Price per order has got different style then inline description (which is also into .for-payment block) */
    .for-payment .price {
        color: rgb(217, 186, 8);
        font-family: Font-Bold;
    }

    button#go-to-payment {
        margin-top: 5px;
        width: 100%;
        padding: 5px;
        border: none;
        border-radius: 5px;
        font-family: Font-Bold;
        font-size: 16px;
        cursor: pointer;
        background-color: slateblue;
        color: whitesmoke;
    }

    button[disabled]#go-to-payment {
        opacity: 0.7;
    }
</style>
