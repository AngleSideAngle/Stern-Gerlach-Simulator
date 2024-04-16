<script lang='ts'>
    import { Stage, Layer, Text } from 'svelte-konva';
    import { Detector, ElementContainer, type Element, Ender, Simulation, Starter, SternGerlachDevice, Validity } from '$lib/Simulation';
    export let isDragging = false;
    export let elCont: ElementContainer;
    export let currentlyDraggable = true;
    export let wireHandler: (elCont: ElementContainer) => void;
    export let wireRefresher: () =>void;
    let config = {
        text: elCont.element.name,
        x: elCont.x,
        y: elCont.y,
        draggable: true,
        fill: "black"
    };

    $:config.draggable = currentlyDraggable;
    $: config.fill = elCont.element.lit == true ? "green" : "black";

    
</script>

<Text
    {config}
    on:dragstart={() => {
        isDragging = true;
        elCont.x = config.x;
        elCont.y = config.y
        elCont = elCont
    }}

    on:dragend={() => {
        isDragging = false;
        elCont.x = config.x;
        elCont.y = config.y
        elCont = elCont;
        wireRefresher();

    }}
    on:click={()=>{
        wireHandler(elCont);
        }}
/>