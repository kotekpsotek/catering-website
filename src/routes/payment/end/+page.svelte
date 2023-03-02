<script lang="ts">
    import { onMount } from "svelte";
    import { writable } from "svelte/store";
    
    export let data: import("./$types").PageData;
    const { paymentMethod, paymentUrl, status, operationId } = data;

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
    }
</script>

<div class="enclosing">
    {#if paymentUrl}
        <h1>Waiting for your payment...</h1>
        <p class="description">Will happen redirect you to Stripe payment system to finalize operation using <span class="payment-method">{paymentMethod}</span> payment method selected prior by you</p>
        <p class="timer">{$timerToRedirectSec} secs</p>
    {:else if status}
        <!--  -->
        <div class="result-info">
            {#if status == "success"}
                <h1>Success. Payment has been created</h1>
                <p class="description">You can now follow state of your order in user panel (Click in below block to go, to user panel)</p>
                <div class="options">
                    <a href="/">Go to home</a>
                    <a href="/user-panel">Go to user panel</a>
                </div>
            {:else if status == "failure"}
                <h1>Failure. Payment couldn't be created</h1>
                <p class="description">You can try again by click on bellow button</p>
                <div class="options">
                    <button id="try-again" on:click={tryAgainCreatePayment}>Try again create payment</button>
                </div>
            {/if}
        </div>
    {/if}
</div>
