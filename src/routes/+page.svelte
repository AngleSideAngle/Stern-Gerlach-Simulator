<script lang="ts">

  import ElementDraggable from '$lib/ElementDraggable.svelte';
  import { Detector, ElementContainer, type Element, Ender, Simulation, Starter, SternGerlachDevice, Wire, Validity, Joiner, ExtensionCord } from '$lib/Simulation';
    import { Complex, StateVector } from '$lib/StateVector';
  import { onMount } from 'svelte';
  import { Stage, Layer, Text, Line, Arrow } from 'svelte-konva';

  let height: number;
  let width: number;
  let zUp: Complex = new Complex(1,0);
  let zDown: Complex = new Complex(0,0);

  let zuNice = zUp.pretty();
  let zdNice = zDown.pretty(); 

  $: zUp = Complex.fromStr(zuNice);
  $: zDown = Complex.fromStr(zdNice);

  onMount(() => {
    height = window.innerHeight;
    width = window.innerWidth;
  });

  function resize() {
    height = window.innerHeight;
    width = window.innerWidth;
  }

  let simulation = new Simulation(new StateVector(zUp,zDown));

  let elementsC: ElementContainer[] = [];
  let wiresC: Wire[] = [];
  let simulationC = new Simulation(new StateVector(zUp,zDown));

  let elements: ElementContainer[] = [];
  let wires: Wire[] = [];
  let el1: ElementContainer | null = null;
  let el2: ElementContainer | null = null;

  let toggledElementType: Element | null;
  let isAdderToggled = false;
  let isWireToggled = false;

  function reset() {
    elements = [];
    wires = [];
    el1 = null;
    el2 = null;
    elements.push(new ElementContainer(new Starter(), 50, 50));
    elementsC.push(new ElementContainer(new Starter(), 50, 50));
    elements = elements;
    isWireToggled = false;
    toggledElementType = null;
    configureSimulation();
  }

  function calculate() {
    let base = elements.find(
      (e) => e.element instanceof SternGerlachDevice,
    )?.element;
    let initState = StateVector.zUp(); // todo generalize

    // base?.children.find((e) => )
    base?.children;
  }

  // function split(input: StateVector): (a: StateVector, b: StateVector) {
  //   return
  // }

  function addToSim(element: Element | null, x: number, y: number) {
    elementsC = JSON.parse(JSON.stringify(elements));
    wiresC = JSON.parse(JSON.stringify(wires));
    if (element) elements.push(new ElementContainer(element, x, y));
    elements = elements;
    simulation = simulation;
  }

  function wireHandler(elCont: ElementContainer): void {
    if (el1 == null){
      el1 = elCont;
      el1.element.lit = true;
    }
    else {
      el1.element.lit = false;
      el2 = elCont;
      if (el1 != el2) {
        elementsC = JSON.parse(JSON.stringify(elements));
        wiresC = JSON.parse(JSON.stringify(wires));
        if (el2.element instanceof Joiner){
            el2.element.addParent(el1.element);
        }
        wires.push(new Wire(el1, el2));
      }
      el1 = null;
      el2 = null;
      wires = wires;

    }
    configureSimulation();
  }

  function refreshWires() {
    for (let i = 0; i < wires.length; i++) {
      wires[i].update();

    }
    wires = wires;
  }

  function configureSimulation() {
    for (let i = 0; i < elements.length; i++) {
      elements[i].element.children = [];
    }
    simulation.head = elements[0].element;
    let n = simulation.head;
    for (let i = 0; i < elements.length; i++) {
      attachChildren(elements[i].element);
    }
    simulation = simulation;
  }

  function attachChildren(parent: Element) {
    for (let i = 0; i < wires.length; i++) {
      if (wires[i].el1.element === parent) {
        parent.children.push(wires[i].el2.element);
      }
    }
    simulation = simulation;
  }

  function unlitAll(){
    for (let i = 0; i < elements.length; i++){
      elements[i].element.lit = false;
    }
  }

  $: isValid = simulation.isValid();
  $: validityColor =
    isValid == Validity.VALID ? "text-green-600" : "text-red-600";
  $: validityText =
    isValid == Validity.VALID
      ? "Setup is valid: " + isValid
      : "Setup is not valid: " + isValid;

  reset();
</script>

<svelte:window on:resize={resize} />

<h1 class="text-3xl ml-2">Stern-Gerlach Simulator</h1>
<p class="ml-2">Created by Gil Friedman and Asa Paparo</p>
<p class="ml-2">It might even work, who knows</p>


<div class="divider" />

<div class="flex w-full">
  <!-- Canvas Screen -->
  <div class="grid flex-grow place-items-center">
    <p class={validityColor}>
      {validityText}
    </p>
    <Stage
      config={{ width: width / 1.5, height: height / 1.5 }}
      class="outline"
      on:click={(e) => {
        if (!isWireToggled) {
          addToSim(
            toggledElementType,
            e.detail.evt.layerX,
            e.detail.evt.layerY,
          ),
            (toggledElementType = null);
        }
      }}
    >
      <Layer>
        {#each elements as elContainer}
          <ElementDraggable
            bind:elCont={elContainer}
            currentlyDraggable={!isWireToggled}
            {wireHandler}
            wireRefresher={refreshWires}
          />
        {/each}
        {#each wires as wire}
          <Arrow
            config={{
              x: wire.start.x,
              y: wire.start.y,
              points: [
                0,
                0,
                wire.end.x - wire.start.x,
                wire.end.y - wire.start.y,
              ],
              tension: 0.5,
              stroke: "black",
            }}
          />
        {/each}
      </Layer>
    </Stage>

    <div class="divider" />

    <!-- Menu -->
    <div class="grid md:grid-cols-3 gap-2">
      <!-- Controller -->
      <div class="grid flex-grow place-items-center">
        <ul class="menu bg-base-200 w-70 rounded-box">
          <li>
            <h2 class="menu-title">Controller</h2>
            <ul class="menu menu-horizontal bg-base-200 rounded-box">
              <li>
                <button on:click={reset}>
                  Reset
                </button>
              </li>
              <li>
                <button
                  on:click={()=>{unlitAll(), simulation.simOnce(new StateVector(zUp,zDown), elements), elements = elements}}>
                  Run Once
                </button>
              </li>
              <li>
                <button
                  on:click={() => {
                  }}
                >
                  Calculate Probaility
                </button>
              </li>
              <li>
                <button
                  on:click={() => {
                    elements = elementsC;
                    wires = wiresC;
                    configureSimulation();
                  }}
                >
                  Undo
                </button>
              </li>
            </ul>
          </li>
        </ul>
      </div>

    <!-- Element Selector -->
    <div class="grid flex-grow place-items-center">
      <ul class="menu bg-base-200 w-70 rounded-box">
        <li>
          <h2 class="menu-title">Add Elements</h2>
          <ul class="menu menu-horizontal bg-base-200 rounded-box">
            <li>
              <button on:click={()=>{toggledElementType = new Ender(), isWireToggled = false;}}>
                <svg class="h-5 w-5" version="1.1" id="_x32_" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" viewBox="0 0 512 512" xml:space="preserve" fill="#000000"><g id="SVGRepo_bgCarrier" stroke-width="0"></g><g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round"></g><g id="SVGRepo_iconCarrier"> <style type="text/css"> .st0{fill:#000000;} </style> <g> <path class="st0" d="M282.475,125.865c-2.794,29.678-5.611,59.35-8.413,89.028c27.967-4.862,55.95-9.799,83.629-11.564 c2.802-29.686,5.596-59.35,8.414-89.029C338.426,116.057,310.45,120.987,282.475,125.865z"></path> <path class="st0" d="M467.75,10.549h-0.014C443.896,2.81,419.821,0,396.042,0c-35.67,0.015-70.786,6.217-104.91,12.125 c-34.139,5.952-67.324,11.632-98.798,11.617c-14.707,0-29.02-1.318-43.038-4.234l1.446-12.64H88.401L30.86,512h62.334 l20.114-176.543c17.092,3.65,34.23,5.203,51.247,5.203c35.661-0.03,70.778-6.233,104.917-12.14 c34.109-5.945,67.28-11.625,98.752-11.61h0.061c21.007,0,41.243,2.476,60.91,8.853l21.886,7.081l2.264-23.795 c8.815-93.209,17.615-186.388,26.438-279.582l0.492-5.286l0.863-9.262L467.75,10.549z M437.943,210.463 c-26.271-7.482-53.11-8.86-80.252-7.134c-2.794,29.535-5.581,59.062-8.383,88.597c-27.581,1.727-55.207,6.49-82.63,11.246 l-0.984,0.197c2.786-29.512,5.573-58.986,8.368-88.476c-27.975,4.854-55.934,9.641-83.591,11.079 c-2.787,29.505-5.559,59.002-8.362,88.499c-5.422,0.296-10.844,0.493-16.228,0.493c-20.364,0-40.35-2.279-59.941-8.05 c1.787-18.819,3.559-37.623,5.339-56.442l3.62-31.754c24.756,6.959,50.035,8.573,75.572,7.254 c2.817-29.701,5.619-59.358,8.436-89.036c-24.969,1.295-49.68-0.265-73.914-6.824l9.943-87.234 c18.516,4.688,37.26,6.558,56.071,6.558c5.392,0,10.799-0.205,16.206-0.485c-2.772,29.33-5.543,58.654-8.307,87.984 c27.626-1.446,55.601-6.218,83.568-11.072c2.772-29.293,5.536-58.578,8.316-87.871c1.038-0.159,2.082-0.348,3.12-0.53 c27.165-4.71,54.087-9.33,80.51-11.034c-2.779,29.285-5.544,58.578-8.316,87.87c27.15-1.718,53.988-0.34,80.26,7.127 C443.57,151.113,440.753,180.784,437.943,210.463z"></path> </g> </g></svg>
              </button>
            <li>
              <button on:click={()=>{toggledElementType = new Detector(), isWireToggled = false;}}>
                <svg class="h-5 w-5" fill="#000000" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><g id="SVGRepo_bgCarrier" stroke-width="0"></g><g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round"></g><g id="SVGRepo_iconCarrier"><title>lightbulb</title><path d="M12,2A7,7,0,0,0,8,14.74V17a1,1,0,0,0,1,1h6a1,1,0,0,0,1-1V14.74A7,7,0,0,0,12,2ZM9,21a1,1,0,0,0,1,1h4a1,1,0,0,0,1-1V20H9Z"></path></g></svg>
              </button>
            </li>
            <li>
              <button on:click={()=>{toggledElementType = new SternGerlachDevice("X"), isWireToggled = false;}}>
                X
                <svg class="h-5 w-5" viewBox="0 0 48 48" xmlns="http://www.w3.org/2000/svg" fill="#000000"><g id="SVGRepo_bgCarrier" stroke-width="0"></g><g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round"></g><g id="SVGRepo_iconCarrier"> <title>split</title> <g id="Layer_2" data-name="Layer 2"> <g id="invisible_box" data-name="invisible box"> <rect width="48" height="48" fill="none"></rect> </g> <g id="icons_Q2" data-name="icons Q2"> <path d="M44,17V6a2,2,0,0,0-2-2H31a2,2,0,0,0-2,2h0a2,2,0,0,0,2,2h6.2l-14,14H6a2,2,0,0,0-2,2H4a2,2,0,0,0,2,2H23.2l14,14H31a2,2,0,0,0-2,2h0a2,2,0,0,0,2,2H42a2,2,0,0,0,2-2V31a2,2,0,0,0-2-2h0a2,2,0,0,0-2,2v6.2L26.8,24,40,10.8V17a2,2,0,0,0,2,2h0A2,2,0,0,0,44,17Z"></path> </g> </g> </g></svg>              </button>
            </li>
            <li>
              <button on:click={()=>{toggledElementType = new SternGerlachDevice("Y"), isWireToggled = false;}}>
                Y
                <svg class="h-5 w-5" viewBox="0 0 48 48" xmlns="http://www.w3.org/2000/svg" fill="#000000"><g id="SVGRepo_bgCarrier" stroke-width="0"></g><g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round"></g><g id="SVGRepo_iconCarrier"> <title>split</title> <g id="Layer_2" data-name="Layer 2"> <g id="invisible_box" data-name="invisible box"> <rect width="48" height="48" fill="none"></rect> </g> <g id="icons_Q2" data-name="icons Q2"> <path d="M44,17V6a2,2,0,0,0-2-2H31a2,2,0,0,0-2,2h0a2,2,0,0,0,2,2h6.2l-14,14H6a2,2,0,0,0-2,2H4a2,2,0,0,0,2,2H23.2l14,14H31a2,2,0,0,0-2,2h0a2,2,0,0,0,2,2H42a2,2,0,0,0,2-2V31a2,2,0,0,0-2-2h0a2,2,0,0,0-2,2v6.2L26.8,24,40,10.8V17a2,2,0,0,0,2,2h0A2,2,0,0,0,44,17Z"></path> </g> </g> </g></svg>              </button>
            </li>
            <li>
              <button on:click={()=>{toggledElementType = new SternGerlachDevice("Z"), isWireToggled = false;}}>
                Z
                <svg class="h-5 w-5" viewBox="0 0 48 48" xmlns="http://www.w3.org/2000/svg" fill="#000000"><g id="SVGRepo_bgCarrier" stroke-width="0"></g><g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round"></g><g id="SVGRepo_iconCarrier"> <title>split</title> <g id="Layer_2" data-name="Layer 2"> <g id="invisible_box" data-name="invisible box"> <rect width="48" height="48" fill="none"></rect> </g> <g id="icons_Q2" data-name="icons Q2"> <path d="M44,17V6a2,2,0,0,0-2-2H31a2,2,0,0,0-2,2h0a2,2,0,0,0,2,2h6.2l-14,14H6a2,2,0,0,0-2,2H4a2,2,0,0,0,2,2H23.2l14,14H31a2,2,0,0,0-2,2h0a2,2,0,0,0,2,2H42a2,2,0,0,0,2-2V31a2,2,0,0,0-2-2h0a2,2,0,0,0-2,2v6.2L26.8,24,40,10.8V17a2,2,0,0,0,2,2h0A2,2,0,0,0,44,17Z"></path> </g> </g> </g></svg>              </button>
            </li>
            <li>
              <button on:click={()=>{toggledElementType = new Joiner(), isWireToggled = false;}}>
                <svg class="h-5 w-5" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><g id="SVGRepo_bgCarrier" stroke-width="0"></g><g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round"></g><g id="SVGRepo_iconCarrier"> <path d="M4.35 17C3.49422 15.597 3 13.9413 3 12.168C3 7.10468 7.02944 3 12 3C16.9706 3 21 7.10468 21 12.168C21 13.9413 20.5058 15.597 19.65 17" stroke="#1C274C" stroke-width="1.5"></path> <path d="M5.63636 22H18.3636C20.3719 22 22 20.3719 22 18.3636C22 17.6105 21.3895 17 20.6364 17H16.8284C16.298 17 15.7893 17.2107 15.4142 17.5858L14.5858 18.4142C14.2107 18.7893 13.702 19 13.1716 19H10.8284C10.298 19 9.78929 18.7893 9.41421 18.4142L8.58579 17.5858C8.21071 17.2107 7.70201 17 7.17157 17H3.36364C2.61052 17 2 17.6105 2 18.3636C2 20.3719 3.62806 22 5.63636 22Z" stroke="#000000" stroke-width="1.5" stroke-linecap="round"></path> </g></svg>
              </li>
              <li>
                <button on:click={()=>{toggledElementType = new ExtensionCord(), isWireToggled = false;}}>
                  <svg class="h-5 w-5" fill="#000000" version="1.1" id="Capa_1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" viewBox="0 0 160.17 160.171" xml:space="preserve"><g id="SVGRepo_bgCarrier" stroke-width="0"></g><g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round"></g><g id="SVGRepo_iconCarrier"> <g> <path d="M143.163,0H17.008C8.314,0,1.239,7.075,1.239,15.769v128.632c0,8.692,7.076,15.77,15.77,15.77h126.154 c8.692,0,15.77-7.077,15.77-15.77V15.769C158.932,7.075,151.855,0,143.163,0z M148.419,144.401c0,2.898-2.358,5.257-5.257,5.257 H17.008c-2.898,0-5.256-2.358-5.256-5.257V15.769c0-2.898,2.358-5.256,5.256-5.256h126.154c2.898,0,5.257,2.358,5.257,5.256 V144.401z"></path> <path d="M80.085,22.778c-31.602,0-57.309,25.708-57.309,57.309c0,31.603,25.707,57.306,57.309,57.306 c31.601,0,57.308-25.707,57.308-57.309S111.686,22.778,80.085,22.778z M80.085,126.88c-25.801,0-46.796-20.991-46.796-46.796 c0-25.805,20.995-46.793,46.796-46.793c25.803,0,46.795,20.992,46.795,46.796S105.888,126.88,80.085,126.88z"></path> <path d="M61.688,72.641c-2.902,0-5.256,2.354-5.256,5.256v3.352c0,2.901,2.354,5.256,5.256,5.256s5.256-2.354,5.256-5.256v-3.352 C66.944,74.991,64.59,72.641,61.688,72.641z"></path> <path d="M100.235,72.641c-2.901,0-5.256,2.354-5.256,5.256v3.352c0,2.901,2.354,5.256,5.256,5.256c2.902,0,5.257-2.354,5.257-5.256 v-3.352C105.492,74.991,103.137,72.641,100.235,72.641z"></path> </g> </g></svg>                </li>
              </ul>
        </li>
      </ul>
    </div>

      <!-- Starter: Mayhaps not neccessary -->
      <div class="grid flex-grow place-items-center">
        <ul class="menu bg-base-200 w-50 rounded-box">
          <li>
            <h2 class="menu-title">Starter (Z Basis)</h2>
          </li>
          <li>
            <label class="input input-bordered flex items-center gap-2">
              Up
            <input type="text" bind:value={zuNice} placeholder="Z+" class="grow"  on:change={()=>simulation.startVector.zUp = zUp}/>
            </label>
          </li>
          <li>
            <label class="input input-bordered flex items-center gap-2">
              Down
            <input type="text" bind:value={zdNice} placeholder="Z-" class="grow" on:change={()=>simulation.startVector.zDown = zDown} /> 
          </label>
          </li>
        </ul>
      </div>
    </div>
  </div>
</div>
