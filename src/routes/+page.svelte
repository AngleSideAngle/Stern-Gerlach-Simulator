<script>
    import { onMount } from 'svelte';
  import { Stage, Layer, Rect, Text } from 'svelte-konva';
  export const ssr = false;
    /**
     * @type {number}
     */
    let height;
    /**
     * @type {number}
     */
    let width;
  onMount(()=>{
    height = window.innerHeight;
    width = window.innerWidth;
  })

  let isDragging = false;

    let config = {
        text: "Draggable Text",
        x: 50,
        y: 50,
        draggable: true,
    };

   // @ts-ignore
     $: config.fill = isDragging ? "green" : "black";
</script>

<h1 class="text-3xl">Welcome to SvelteKit</h1>
<p>Visit <a href="https://kit.svelte.dev">kit.svelte.dev</a> to read the documentation</p>

<Stage config={{ width: width, height: height }}>
    <Layer>
        <Text
            {config}
            on:dragstart={() => (isDragging = true)}
            on:dragend={() => {
                isDragging = false;
                console.log(config.x);
            }}
        />
      <!-- <Rect config={{ x: 100, y: 100, width: 400, height: 200, fill: 'blue' }} /> -->
    </Layer>
  </Stage>

<style lang="postcss">
    :global(html) {
      background-color: theme(colors.gray.100);
    }
</style>