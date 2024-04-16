<script lang='ts'>
    import { Stage, Layer, Text, Shape } from 'svelte-konva';
    import { Detector, ElementContainer, type Element, Ender, Simulation, Starter, SternGerlachDevice, Validity } from '$lib/Simulation';
    export let isDragging = false;
    export let elCont: ElementContainer;
    export let currentlyDraggable = true;
    export let wireHandler: (elCont: ElementContainer) => void;
    export let wireRefresher: () =>void;
    let svgpath: Path2D;
    let config = {
        text: elCont.element.name,
        x: elCont.x,
        y: elCont.y,
        draggable: true,
        fill: "black"
    };

    $:config.draggable = currentlyDraggable;
    $: config.fill = elCont.element.lit == true ? "green" : "black";

    switch (elCont.element.name) {
        case "starter":
            svgpath = new Path2D("M26.530,31.994 C26.222,31.994 25.915,31.903 25.619,31.722 L2.000,17.205 L2.000,31.000 C2.000,31.553 1.552,32.000 1.000,32.000 C0.448,32.000 -0.000,31.553 -0.000,31.000 L-0.000,1.006 C-0.000,0.453 0.448,0.006 1.000,0.006 C1.552,0.006 2.000,0.453 2.000,1.006 L2.000,13.855 L25.628,0.248 C25.917,0.083 26.211,-0.000 26.507,-0.000 C27.372,-0.000 28.000,0.689 28.000,1.639 L28.000,30.367 C28.000,31.435 27.260,31.994 26.530,31.994 ZM3.097,15.531 L26.000,29.608 L26.000,2.341 L3.097,15.531 Z")
            break;
        case "detector":
            svgpath = new Path2D("M12,2A7,7,0,0,0,8,14.74V17a1,1,0,0,0,1,1h6a1,1,0,0,0,1-1V14.74A7,7,0,0,0,12,2ZM9,21a1,1,0,0,0,1,1h4a1,1,0,0,0,1-1V20H9Z")
            break;


        //to be completed
        case "X: stern gerlach device":
        
            break

        default:
            break;
    }

    
</script>


<!-- <Shape config={{ //This works. Just not all paths implemented.
    x: elCont.x,
    y: elCont.y,
    fill: '#00D2FF',
    width: 50,
    height: 50,
    sceneFunc: function (context, shape) {
      context.beginPath();
    context.fill(svgpath);
      context.fillStrokeShape(shape);
    }
  }}>
</Shape> -->

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
