<script lang="ts">
    export let url: string;
    export let image: string;
    export let name: string;
</script>

<a href="{url}" class="widget">
    <img src="{image}" alt="">
    <div class="text">
        <p>{name}</p>
    </div>
</a>

<style>
    a.widget {
        width: 450px;
        display: flex;
        text-decoration: none;
        color: black;
        border: solid 1px salmon;
        border-radius: 5px;
        background-color: whitesmoke;
    }

    img {
        width: 275px;
        height: 200px;
        border-radius: 5px;
    }

    .text {
        font-family: 'Font';
        display: flex;
        align-items: flex-end;
        margin-left: 10px;
        font-size: 23px;
        margin-bottom: 5px;
    }
</style>
