<script lang='ts'>
    import { Stage, Layer, Text } from 'svelte-konva';
    import { Detector, ElementContainer, type Element, Ender, Simulation, Starter, SternGerlachDevice } from '$lib/Simulation';
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
    };

    $:config.draggable = currentlyDraggable;
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
        console.log("here");
        wireHandler(elCont);
        }}
/>