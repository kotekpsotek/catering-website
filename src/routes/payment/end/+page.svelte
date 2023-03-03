<script lang="ts">
    import { onMount } from "svelte";
    import { writable } from "svelte/store";
    import { page } from "$app/stores";
    import { goto } from "$app/navigation";
    
    export let data: import("./$types").PageData;
    const { paymentMethod, paymentUrl, status, operationId, pricePerOrder, orderStatus, failureReason } = data;

    // Storage counting seconds time to redirect user to payment stripe page
    const timerToRedirectSec = writable<number>(5);

    onMount(() => {
        // Redirect user to payment stripe page created when session has been create (only when redirect asction can be performed due to this operation nested context)
        const int = setInterval(() => {
            if (paymentUrl) {
                $timerToRedirectSec -= 1;
        
                if ($timerToRedirectSec == 0) {
                    clearInterval(int);
                    window.location = paymentUrl as any; // "as any" to don't throw an error while type checking
                }
            }
            else clearInterval(int);
        }, 1_000);
    });

    // Event listened when user click on button with selector button#try-again to try again create payment (inside is performed communication with server side)
    async function tryAgainCreatePayment(ev: Event) {
        /* TODO: */
        const acctuallPageUrl = $page.url;
        const goToUrl = `${acctuallPageUrl.pathname}?status=try_create_payment_again&operationId=${operationId}`;        

        goto(goToUrl);
    }
</script>

<div class="enclosing">
    {#if paymentUrl}
        <div class="info">
            <h1 class="waiting-for-payment">Waiting for your payment...</h1>
            <p class="description">Will happen redirect you to <b>Stripe</b> payment system to finalize operation using <span class="payment-method">{paymentMethod}</span> payment method selected prior by you</p>
            <p class="timer">{$timerToRedirectSec} secs</p>
        </div>
    {:else if status}
        <!--  -->
        <div class="result-info">
            {#if status == "success"}
                <h1 class="success">Success. Payment has been created</h1>
                <p class="description">You can now follow state of your order in user panel (Click in below block to go, to user panel)</p>
                <div class="options">
                    <a id="go-to-home" href="/">Go to home</a>
                    <a id="go-to-user-panel" href="/user-panel">Go to user panel</a>
                </div>
            {:else if status == "failure"}
                <h1 class="failure">Failure. Payment couldn't be created</h1>
                <p class="description">You can try again by click on bellow button</p>
                <p class="reason-of-failure">Reason: <span>{failureReason}</span></p>
                <div class="options">
                    <button id="try-again" on:click={tryAgainCreatePayment}>Try again create payment</button>
                </div>
            {/if}
            <!-- Details assigned for each payment order -->
            <div class="details">
                <h2>Payment details:</h2>
                <div class="detail">
                    <p class="t">Price</p>
                    <p class="v">{typeof pricePerOrder == "number" ? `${pricePerOrder} zł` : pricePerOrder}</p>
                </div>
                <div class="detail">
                    <p class="t">Payment status</p>
                    <!-- When payment status is "success" then is "Paid" or in other case when payment status is "failure" then payment status is "Unpaid" -->
                    <p class="v">{status == "success" ? "Paid" : "Unpaid"}</p>
                </div>
                <div class="detail">
                    <p class="t">Order status</p>
                    <p class="v">{orderStatus}</p>
                </div>
                <div class="detail">
                    <p class="t">Order id</p>
                    <p class="v">{operationId}</p>
                </div>
            </div>
        </div>
    {/if}
</div>

<style>
    .enclosing {
        width: 100%;
        height: 100%;
        display: flex;
        justify-content: center;
        padding: 10px;
    }

    h1, h2 {
        font-family: Font-Bold;
    }

    h1.success, h1.waiting-for-payment {
        color: slateblue;
    }

    h1.failure {
        color: red;
    }

    p.description {
        margin-top: 10px;
    }

    p.description span.payment-method {
        font-family: Font-Bold;
        color: green;
    }

    p.timer {
        margin-top: 15px;
        color: green;
        font-family: Font-Bold;
        font-size: 20px;
        text-align: center;
    }

    p.reason-of-failure {
        margin-top: 5px;
    }

    p.reason-of-failure span {
        color: red;
    }

    /* Style for both containers: redirecting user to payment stripe page and with payment status after go back user again to application from stripe payment page */
    .result-info, .info {
        /* height: 300px; */
        padding: 10px;
        width: 550px;
        background-color: whitesmoke;
        border: solid 1px black;
        font-family: Font;
    }

    .result-info .options {
        margin-top: 15px;
        display: flex;
        justify-content: center;
        align-content: center;
        gap: 10px;
    }

    a, button#try-again {
        outline: none; /* Disable from default html5 style for button element */
        border: none; /* Disable from default html5 style for button element */
        text-decoration: none;
        padding: 5px;
        border-radius: 5px;
        font-family: Font-Bold;
        font-size: 16px; /* Set for button because default font size into button is smaller then standard html5 font size */
        cursor: pointer; /* Set cursor for both elements types */
    }

    a#go-to-home {
        border: solid 1px slateblue;
        color: slateblue;
    }

    a#go-to-user-panel, button#try-again {
        color: whitesmoke;
        background-color: slateblue;
    }

    .details {
        margin-top: 15px;
    }

    .details h2 {
        margin-bottom: 5px;
    }

    .details > div.detail {
        height: 35px;
        display: flex;
        align-items: center;
        justify-content: space-between;
        border-bottom: solid 1px black;
    }

    .details > div.detail:last-of-type {
        border-bottom: none;
    }

    .details > div.detail p.v {
        color: green;
    }
</style>
