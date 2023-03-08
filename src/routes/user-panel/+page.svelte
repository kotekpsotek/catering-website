<script lang="ts">
    // Type describing data returned from server to check delivery and payment status
    interface DataForDeliveryStatus {
        operation_id: string, 
        payment_status: "paid" | "unpaid", 
        delivery_manner: string,
        payment_method: "przelewy24" | "blik" | "card", 
        price_per_order: number, // price in Polish currency that is Złoty 
        payment_finalization_date?: string
    }

    // Assign email/operation_id to check delivery status to this variable
    let checkDeliveryStatusByIdOrEmail: string;
    
    // Assign result of checking delivery status from server to this variable
    let deliveryStatus: DataForDeliveryStatus | null | "incorrect-order-identifier" = null;

    /// Function called when user click on button "Check status" which purpose is to check delivery status. Durning operation result of server call is assigned to "deliveryStatus" variable
    async function checkDeliveryStatus(ev: Event) {
        // Make call to server using REST "POST" http request to try obtain delivery status
        const result = await fetch(document.URL, {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                to_check: checkDeliveryStatusByIdOrEmail
            })
        });

        // Recice Data achived from server
        const resultBody = await result.json();

        // Check whether server send back json data (otherwise value from try is null what means that identifier to search order is incorrect)
        if (resultBody) {
            // Assign data assigned from server as json after transform to POJO to "deliveryStatus" global variable
            deliveryStatus = resultBody;
        }
        // Otherwise when order identifier given by user doesn't match to any order assign appropriate state to variable for order data from server 
        else deliveryStatus = "incorrect-order-identifier";
    }
</script>

<div class="user-panel">
    <!-- User panel is defined within this block -->
    <h1>User panel</h1>
    <!-- Get user delivery status after when user pass delivery id ("operation_id" key value otherwise) or his email given while ordering this delivery -->
    <div class="delivery-status">
        <h2>Get your delivery status</h2>
        <h3>Email or delivery id:</h3>
        <div class="inline-input-and-button">
            <input type="text" bind:value={checkDeliveryStatusByIdOrEmail}>
            <button class="check-delivery-status" on:click={checkDeliveryStatus}>Check status</button>
        </div>
        {#if deliveryStatus && typeof deliveryStatus == "object" && Object.keys(deliveryStatus).length}
            <!-- Display for user hisvorder data after searched it by given identifier order id -->
            <div class="result">
                <h3>Your delivery and payment status:</h3>
                <div class="details">
                    <div class="detail">
                        <p>Order id</p>
                        <p>{deliveryStatus.operation_id}</p>
                    </div>
                    <div class="detail">
                        <p>Price</p>
                        <p>{deliveryStatus.price_per_order}</p>
                    </div>
                    <div class="detail">
                        <p>Payment status</p>
                        <p>{deliveryStatus.payment_status.toLocaleUpperCase()}</p>
                    </div>
                    <div class="detail">
                        <p>Payment method</p>
                        <p>{deliveryStatus.payment_method.toUpperCase()}</p>
                    </div>
                    {#if deliveryStatus.payment_finalization_date}
                        <div class="detail">
                            <p>Payment finalization date</p>
                            <p>{new Date(deliveryStatus.payment_finalization_date).toLocaleString("pl-PL")}</p>
                        </div>
                    {/if}
                </div>
            </div>
        {:else if deliveryStatus == "incorrect-order-identifier"}
            <!-- Indicator that user pass incorrect order identificator -->
            <div class="incorrect-order-identifier" id="incorrect-notifier">
                <p>You pass incorrect order identifier. Please try again!</p>
            </div>
        {/if}
    </div>
</div>

<style>
    .user-panel {
        width: 100vw;
        height: 100vh;
        font-family: Font;
        padding: 15px;
    }

    h1, h2 {
        font-family: Font-Bold;
    }

    .user-panel > div {
        width: fit-content;
        margin-top: 10px;
        background-color: whitesmoke;
        padding: 10px;
        border: solid 1px black;
    }

    .user-panel > div > h2 {
        margin-bottom: 5px;
    }

    .user-panel > div > h3 {
        margin-bottom: 4px;
    }

    .user-panel > div .inline-input-and-button {
        display: flex;
    }

    .inline-input-and-button input {
        width: 350px;
        padding: 5px;
        outline: none;
        border: solid 1px black;
        background-color: aliceblue;
        font-family: Font;
        font-size: 16px;
    }

    .inline-input-and-button button {
        padding: 5px;
        outline: none;
        border: solid 1px black;
        border-left: none;
        background-color: aliceblue;
        color: slateblue;
        font-family: Font;
        font-size: 16px;
    }

    .result {
        margin-top: 5px;
    }

    .result > h3 {
        margin-bottom: 4px;
    }

    .result > .details > div.detail {
        height: 35px;
        display: flex;
        align-items: center;
        justify-content: space-between;
        border-bottom: solid 1px black;;
    }

    .result > .details > div.detail:last-of-type {
        border-bottom: none;
    }

    .result > .details > div.detail p:nth-of-type(2) {
        color: green;
    }

    .incorrect-order-identifier {
        width: 100%;
        height: 100px;
        display: flex;
        align-items: center;
        justify-content: center;
        color: red;
    }
</style>
