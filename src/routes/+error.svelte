<!-- Display that something went wrong and display http error description -->
<script lang="ts">
    import { page } from "$app/stores";
</script>

<p>Something went wrong! (HTTP Error Description: <span>{"_  " + $page.error?.message}</span>)</p>

<style>
    p {
        width: 100%;
        height: 100%;
        display: flex;
        align-items: center;
        justify-content: center;
        font-family: Font-Bold;
        color: red;
        font-size: 28px;
        text-transform: uppercase;
        
    }

    p span {
        text-decoration: underline;
    }
</style>
