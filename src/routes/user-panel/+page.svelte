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
    let deliveryStatus: DataForDeliveryStatus | null = null;

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

        // Assign data assigned from server as json after transform to POJO to "deliveryStatus" global variable
        deliveryStatus = resultBody;
    }
</script>

<div class="use-panel">
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
        {#if deliveryStatus && Object.keys(deliveryStatus).length}
            <div class="result">
                <h2>Your delivery and payment status:</h2>
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
        {/if}
    </div>
</div>
