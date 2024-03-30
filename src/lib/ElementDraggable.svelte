<script lang='ts'>
    import { Stage, Layer, Text } from 'svelte-konva';
    import { Detector, ElementContainer, type Element, Ender, Simulation, Starter, SternGerlachDevice } from '$lib/Simulation';
    export let isDragging = false;
    export let x;
    export let y;
    export let el: Element;
    let config = {
        text: el.name,
        x: x,
        y: y,
        draggable: true,
    };
</script>

<Text
    {config}
    on:dragstart={() => (isDragging = true)}
    on:dragend={() => {
        isDragging = false;
    }}
/>