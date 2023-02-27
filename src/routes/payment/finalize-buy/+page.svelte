<!-- Page to Add data required to perform delivery -->
<script lang="ts">
    interface PurchaseOrder {
        first_name: string, // ordering user first name
        last_name: string, // ordering user last name
        email: string, // ordering user email address
        phone_number: string, // ordering user phone number
        city: string, // city for delivery
        street: string, // street for delivery
        house_number: number, // house number for delivery
        premises_number?: number, // optional! premises number for delivery
        post_code: string, // post code for delivery
        description?: string // optional description attached to delivery order
        delivery_manner: "to hands" | "leave in front of house", // delivery manner
        payment_method: "blik" | "card" | "przelewy24" // required payment method
    }

    // Collect delivery data into
    const deliveryData: PurchaseOrder = {
        first_name: "",
        last_name: "",
        email: "",
        phone_number: "",
        city: "",
        street: "",
        house_number: 0,
        premises_number: undefined,
        post_code: "",
        description: undefined,
        delivery_manner: undefined as any, // invalid I know
        payment_method: undefined as any // invalid I know
    };
</script>

