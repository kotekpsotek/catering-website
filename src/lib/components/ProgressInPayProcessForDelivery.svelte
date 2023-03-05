<!-- Visualize where user is in way to complete delivery by payment -->
<script lang="ts">
    import { onMount } from "svelte";
    
    type AllStationsList = 1 | 2 | 3;

    // Telling which station should be displaing as actual step in order finalization
    export let isOnWay: AllStationsList;

    // Telling on which station page component has been mounted
    export let actualStation: AllStationsList;

    // Custom width for stripe
    export let customWidth: number = 0;

    // Perform after component render on server side
    onMount(() => {
        // Add html5 "title" attribute with description that user is on this station to actual station page (where in order finalization way user actual is)
        const aggregationWayStationCnt = document.getElementsByClassName("way-station-cnt");

        for (const element of aggregationWayStationCnt) {
            const elementParent = element.parentElement;

            if (elementParent?.classList.contains("user-is-on-this-station")) {
                element.getElementsByClassName("number")[0].setAttribute("title", "You are now on this step/station to order finalization way")
            }
        }
    });
</script>

<div class="way-visualisation" style:width="{customWidth ? customWidth + "px" : "100%"}">
    <h3 class="title">Proggress in order finalization by payment</h3>
    <div class="bar-nst">
        <div class="bar-src">
            <div class="stripe"></div>
            <div class="way-station" id="w1" class:actual={isOnWay >= 1} class:user-is-on-this-station={actualStation == 1}>
                <div class="way-station-cnt">
                    <p class="number">1</p>
                    <p class="desc">Order summary</p>
                </div>
            </div>
            <div class="way-station" id="w2" class:actual={isOnWay >= 2} class:user-is-on-this-station={actualStation == 2}>
                <div class="way-station-cnt">
                    <p class="number">2</p>
                    <p class="desc">Data for delivery and payment</p>
                </div>
            </div>
            <div class="way-station" id="w3" class:actual={isOnWay == 3} class:user-is-on-this-station={actualStation == 3}>
                <div class="way-station-cnt">
                    <p class="number">3</p>
                    <p class="desc">Payment Summary</p>
                </div>
            </div>
        </div>
    </div>
</div>

<style>
    .way-visualisation {
        /* width: 100%; */
        background-color: whitesmoke;
        padding: 10px;
        border: solid 1px black;
        margin-bottom: 15px;
        padding-bottom: 50px;
    }

    .bar-nst {
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        margin-top: 10px;
    }

    .bar-src {
        width: 600px; /* stripe with progress visualisation width for devices with medium and large screen */
        position: relative;
    }

    .stripe {
        content: " ";
        width: 100%;
        height: 20px;
        background-color: rgba(0, 0, 0, 0.45);
        border-radius: 8px;
    }

    .way-station {
        position: absolute;
        top: -10px;
        width: 33.33%;
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
    }

    #w1 {
        left: 0px;
        align-items: flex-start;
    }

    /* More accurate positioning (at the begining of stripe in x axis and in center of y axis) */
    #w1 > .way-station-cnt {
        position: relative;
        right: 45px;
        top: 5px;
    }
    
    #w2 {
        left: 35%;
    }

    /* More accurate positioning (at the center of stipe in y axis and in the center of x axis) */
    #w2 > .way-station-cnt {
        position: relative;
        right: 10px;
        top: 5px;
    }
    
    #w3 {
        right: 0px;
        align-items: flex-end;
    }

    /* More accurate positioning (at the end of stripe in x axis and in the center of y axis) */
    #w3 > .way-station-cnt {
        position: relative;
        left: 55px;
        top: 5px;
    }

    .way-station-cnt {
        display: flex;
        flex-direction: column;
        align-items: center;
    }
    
    .way-station-cnt > .number {
        width: 30px;
        height: 30px;
        border-radius: 50%;
        display: flex;
        align-items: center;
        justify-content: center;
        color: whitesmoke;
    }
    
    .way-station-cnt > .desc {
        text-align: center;
    }
    
    /* Coloring for is different for actual completed and not completed way stations */
    .way-station:not(.actual) .number {
        background-color: rgb(170, 170, 170);
    }
    
    .way-station.actual .number {
        background-color: slateblue;
    }

    /* Actual station (station on which page component has been mounted) has got different (additional supper) style */
    .way-station:is(.user-is-on-this-station) .number {
        border: solid 1px whitesmoke;
    }

    /* Below: Adjusting stripe with progress width for devices with smaller screens */
    @media only screen and (max-width: 728px) {
        .bar-src {
            width: 400px;
        }
    }

    @media only screen and (max-width: 500px) {
        /* Adjusting gap on bottom to don't cause text overflow (describing "way station") in y axis! */
        .way-visualisation {
            padding-bottom: 70px;
        }

        /* Adjusting stripe width (x axis width) */
        .bar-src {
            width: 300px;
        }
    }
</style>
