<script lang="ts">

    import ElementDraggable from '$lib/ElementDraggable.svelte';
import { Detector, ElementContainer, type Element, Ender, Simulation, Starter, SternGerlachDevice } from '$lib/Simulation';
    import { onMount } from 'svelte';
  import { Stage, Layer, Text } from 'svelte-konva';

    let height: number;
    let width: number;
    
  onMount(()=>{
    height = window.innerHeight;
    width = window.innerWidth;
  })
  
  function resize(){
    height = window.innerHeight;
    width = window.innerWidth;
  }

  let isDragging = false;




  $: isValid = simulation.isValid();

  let simulation = new Simulation();

  
  let elements: ElementContainer[] = [];
  reset();


  let toggledElementType: Element | null;
  let isAdderToggled = false;
  
  function reset(){
    elements= [];
    elements.push(new ElementContainer(new Starter(),50,50));
  }
  function addToSim(element: Element | null,x: number,y: number){
    if (element) elements.push(new ElementContainer(element,x,y));
    elements = elements;
    simulation = simulation;
  }
</script>

<svelte:window on:resize={resize} />

<h1 class="text-3xl ml-2">Stern-Gerlach Simulator</h1>
<p class="ml-2">Created by Gil Friedman and Asa Paparo</p>

<div class="divider"/>

<div class="flex w-full">

    <!-- Canvas -->
    <div class="grid flex-grow place-items-center">
      <Stage config={{ width: width/1.5, height: height/1.5 }} class="outline" on:click={(e)=>{addToSim(toggledElementType,e.detail.evt.layerX,e.detail.evt.layerY), toggledElementType = null}}>
        <Layer>
          {#each elements as elContainer}
            <ElementDraggable x={elContainer.x} y = {elContainer.y} el = {elContainer.element}/>
          {/each}
        </Layer>
    </Stage>

    <div class="divider"/>
    
    <!-- Buttons -->
    <div class="grid grid-cols-2 gap-4 ">
    <!-- Element Selector -->
    <div class="grid flex-grow place-items-center">
      <ul class="menu bg-base-200 w-70 rounded-box">
        <li>
          <h2 class="menu-title">Add Elements</h2>
          <ul class="menu menu-horizontal bg-base-200 rounded-box">
            <li>
              <button on:click={()=>{toggledElementType = new Ender()}}>
                <svg class="h-5 w-5" version="1.1" id="_x32_" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" viewBox="0 0 512 512" xml:space="preserve" fill="#000000"><g id="SVGRepo_bgCarrier" stroke-width="0"></g><g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round"></g><g id="SVGRepo_iconCarrier"> <style type="text/css"> .st0{fill:#000000;} </style> <g> <path class="st0" d="M282.475,125.865c-2.794,29.678-5.611,59.35-8.413,89.028c27.967-4.862,55.95-9.799,83.629-11.564 c2.802-29.686,5.596-59.35,8.414-89.029C338.426,116.057,310.45,120.987,282.475,125.865z"></path> <path class="st0" d="M467.75,10.549h-0.014C443.896,2.81,419.821,0,396.042,0c-35.67,0.015-70.786,6.217-104.91,12.125 c-34.139,5.952-67.324,11.632-98.798,11.617c-14.707,0-29.02-1.318-43.038-4.234l1.446-12.64H88.401L30.86,512h62.334 l20.114-176.543c17.092,3.65,34.23,5.203,51.247,5.203c35.661-0.03,70.778-6.233,104.917-12.14 c34.109-5.945,67.28-11.625,98.752-11.61h0.061c21.007,0,41.243,2.476,60.91,8.853l21.886,7.081l2.264-23.795 c8.815-93.209,17.615-186.388,26.438-279.582l0.492-5.286l0.863-9.262L467.75,10.549z M437.943,210.463 c-26.271-7.482-53.11-8.86-80.252-7.134c-2.794,29.535-5.581,59.062-8.383,88.597c-27.581,1.727-55.207,6.49-82.63,11.246 l-0.984,0.197c2.786-29.512,5.573-58.986,8.368-88.476c-27.975,4.854-55.934,9.641-83.591,11.079 c-2.787,29.505-5.559,59.002-8.362,88.499c-5.422,0.296-10.844,0.493-16.228,0.493c-20.364,0-40.35-2.279-59.941-8.05 c1.787-18.819,3.559-37.623,5.339-56.442l3.62-31.754c24.756,6.959,50.035,8.573,75.572,7.254 c2.817-29.701,5.619-59.358,8.436-89.036c-24.969,1.295-49.68-0.265-73.914-6.824l9.943-87.234 c18.516,4.688,37.26,6.558,56.071,6.558c5.392,0,10.799-0.205,16.206-0.485c-2.772,29.33-5.543,58.654-8.307,87.984 c27.626-1.446,55.601-6.218,83.568-11.072c2.772-29.293,5.536-58.578,8.316-87.871c1.038-0.159,2.082-0.348,3.12-0.53 c27.165-4.71,54.087-9.33,80.51-11.034c-2.779,29.285-5.544,58.578-8.316,87.87c27.15-1.718,53.988-0.34,80.26,7.127 C443.57,151.113,440.753,180.784,437.943,210.463z"></path> </g> </g></svg>
              </button>
            <li>
              <button on:click={()=>{toggledElementType = new Detector()}}>
                <svg class="h-5 w-5" fill="#000000" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><g id="SVGRepo_bgCarrier" stroke-width="0"></g><g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round"></g><g id="SVGRepo_iconCarrier"><title>lightbulb</title><path d="M12,2A7,7,0,0,0,8,14.74V17a1,1,0,0,0,1,1h6a1,1,0,0,0,1-1V14.74A7,7,0,0,0,12,2ZM9,21a1,1,0,0,0,1,1h4a1,1,0,0,0,1-1V20H9Z"></path></g></svg>
              </button>
            </li>
            <li>
              <button on:click={()=>{toggledElementType = new SternGerlachDevice()}}>
                <svg class="h-5 w-5" viewBox="0 0 48 48" xmlns="http://www.w3.org/2000/svg" fill="#000000"><g id="SVGRepo_bgCarrier" stroke-width="0"></g><g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round"></g><g id="SVGRepo_iconCarrier"> <title>split</title> <g id="Layer_2" data-name="Layer 2"> <g id="invisible_box" data-name="invisible box"> <rect width="48" height="48" fill="none"></rect> </g> <g id="icons_Q2" data-name="icons Q2"> <path d="M44,17V6a2,2,0,0,0-2-2H31a2,2,0,0,0-2,2h0a2,2,0,0,0,2,2h6.2l-14,14H6a2,2,0,0,0-2,2H4a2,2,0,0,0,2,2H23.2l14,14H31a2,2,0,0,0-2,2h0a2,2,0,0,0,2,2H42a2,2,0,0,0,2-2V31a2,2,0,0,0-2-2h0a2,2,0,0,0-2,2v6.2L26.8,24,40,10.8V17a2,2,0,0,0,2,2h0A2,2,0,0,0,44,17Z"></path> </g> </g> </g></svg>              </button>
            </li>
              </ul>
        </li>
      </ul>
    </div>

    <!-- Controls -->
    <div class="grid flex-grow place-items-center">
      <ul class="menu bg-base-200 w-56 rounded-box">
        <li>
          <h2 class="menu-title">Controls</h2>
          <ul class="menu menu-horizontal bg-base-200 rounded-box">
            <li>
              <button>
                <svg class="h-5 w-5" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><g id="SVGRepo_bgCarrier" stroke-width="0"></g><g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round"></g><g id="SVGRepo_iconCarrier"> <path d="M15 5V19M21 5V19M3 7.20608V16.7939C3 17.7996 3 18.3024 3.19886 18.5352C3.37141 18.7373 3.63025 18.8445 3.89512 18.8236C4.20038 18.7996 4.55593 18.4441 5.26704 17.733L10.061 12.939C10.3897 12.6103 10.554 12.446 10.6156 12.2565C10.6697 12.0898 10.6697 11.9102 10.6156 11.7435C10.554 11.554 10.3897 11.3897 10.061 11.061L5.26704 6.26704C4.55593 5.55593 4.20038 5.20038 3.89512 5.17636C3.63025 5.15551 3.37141 5.26273 3.19886 5.46476C3 5.69759 3 6.20042 3 7.20608Z" stroke="#000000" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"></path> </g></svg>
              </button>
            </li>
            <li>
              <button>
                <svg class="h-5 w-5" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" fill="#000000"><g id="SVGRepo_bgCarrier" stroke-width="0"></g><g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round"></g><g id="SVGRepo_iconCarrier"> <title>infinity</title> <rect width="24" height="24" fill="none"></rect> <path d="M18.6,6.62a5.38,5.38,0,1,1-3.82,9.18L12,13.34,9.17,15.85A5.33,5.33,0,0,1,5.4,17.38,5.38,5.38,0,1,1,9.22,8.2L12,10.66l2.83-2.51A5.33,5.33,0,0,1,18.6,6.62M7.8,14.39,10.5,12,7.84,9.65A3.39,3.39,0,1,0,5.4,15.38a3.36,3.36,0,0,0,2.4-1m8.4-4.78L13.5,12l2.66,2.35A3.39,3.39,0,1,0,18.6,8.62,3.36,3.36,0,0,0,16.2,9.61Z"></path> </g></svg>
              </button>
            </li>
            <li>
              <button on:click={reset}>
                <svg class="h-5 w-5" fill="#000000" viewBox="0 0 1920 1920" xmlns="http://www.w3.org/2000/svg"><g id="SVGRepo_bgCarrier" stroke-width="0"></g><g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round"></g><g id="SVGRepo_iconCarrier"> <path d="M960 0v112.941c467.125 0 847.059 379.934 847.059 847.059 0 467.125-379.934 847.059-847.059 847.059-467.125 0-847.059-379.934-847.059-847.059 0-267.106 126.607-515.915 338.824-675.727v393.374h112.94V112.941H0v112.941h342.89C127.058 407.38 0 674.711 0 960c0 529.355 430.645 960 960 960s960-430.645 960-960S1489.355 0 960 0" fill-rule="evenodd"></path> </g></svg>
              </button>
            </li>
          </ul>
        </li>
      </ul>
    </div>
  </div>
  
  
  </div>
</div>




