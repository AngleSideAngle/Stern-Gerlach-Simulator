import { count, e, random, re, sqrt, string } from "mathjs";
import { Complex, StateVector } from "./StateVector";


type Direction = "+" | "-" | null;

export class Simulation {
    head: Starter;
    startVector: StateVector;
    static visitedChildren = new Set<string>();
    static bsCounter = 0;
    constructor(startVector: StateVector){
        this.head = new Starter();
        this.startVector = startVector;
    }
    
    public isValid(): Validity{
        Simulation.visitedChildren = new Set<string>();
        Simulation.bsCounter = 0;
        let n = this.head;
        if (isNaN(this.startVector.zUp.r) || isNaN(this.startVector.zUp.i) || isNaN(this.startVector.zDown.i) || isNaN(this.startVector.zDown.r)){
            return Validity.BADSTARTER;
        }
        if (n instanceof Starter){
            return this.isValidHelper(n);
        }
        return Validity.HEADNOTSTARTER;
    }
    private isValidHelper(n: Element): Validity{
        if (Simulation.visitedChildren.has(n.id)){
            Simulation.bsCounter++;
            if (Simulation.bsCounter > 100){
                return Validity.LOOP;
            }
        }

        Simulation.visitedChildren.add(n.id);

        if (n instanceof Ender && n.children.length != 0) return Validity.BADENDER;

        if (n instanceof SternGerlachDevice && n.children.length != 2) return Validity.BADSG;

        if ((!(n instanceof SternGerlachDevice) && !(n instanceof Ender)) && n.children.length != 1) return Validity.TWOPATHS;


        if (n.children.length == 0){

            if (n instanceof Ender){
                return Validity.VALID;
            }
            else {
                return Validity.NOENDER;
            }
        }

        for (let i = 0; i <n.children.length; i++){
            let validity = this.isValidHelper(n.children[i]);
            if (validity != Validity.VALID){
                return validity;
            }
        }
        return Validity.VALID;
    }




    public simOnce(initialState:StateVector = StateVector.zUp(),elements: ElementContainer[]): any{


        let state = initialState;
        let lastMeasuredType: Spin = "Z";
        let lastDirection: Direction = null;
        let currentElement: Element = this.head;
        while (!(currentElement instanceof Ender)){

            if (currentElement instanceof SternGerlachDevice){
                //creates a superposition
                lastMeasuredType = currentElement.spinType;
                console.log(lastMeasuredType);

                //this is wrong bc it should be with Sz/Sx/Sy operators. Cringe. Does innerproduct even work?
                if (currentElement.spinType === "Z") console.log(StateVector.innerProduct(StateVector.zUp(),state));
                if (currentElement.spinType === "Y") console.log(StateVector.innerProduct(StateVector.yUp(),state));
                if (currentElement.spinType === "X") console.log(StateVector.innerProduct(StateVector.xUp(),state));

                currentElement = currentElement.children[Math.floor(Math.random()*2)];
            }

            else {
                if (currentElement instanceof Starter){
                    //intentionally passes

                }
                else if (currentElement instanceof ExtensionCord){
                    //intentionally passes

                }
    
                else if (currentElement instanceof Joiner){
                    //ends the superposition
                    let p1;
                    let p2;
                    for (let i = 0; i<elements.length; i++){
                        if (elements[i].element.id == currentElement.parents[0]){
                            p1 = elements[i].element;
                        }
                        if (elements[i].element.id == currentElement.parents[1]){
                            p2 = elements[i].element;
                            
                        }
                    }
                    console.log(currentElement.parents);
    
                }
    
                else if (currentElement instanceof Detector){
                    //collapses the superposition
                    if (lastDirection == "+"){
                        if (lastMeasuredType == "Z"){
                            state = StateVector.zUp();
                        }
                        if (lastMeasuredType == "X"){
                            state = StateVector.xUp();

                        }
                        if (lastMeasuredType == "Y"){
                            state = StateVector.yUp();
                        }
                    }

                    if (lastDirection == "-"){
                        if (lastMeasuredType == "Z"){
                            state = StateVector.zDown();
                        }
                        if (lastMeasuredType == "X"){
                            state = StateVector.xDown();
                        }
                        if (lastMeasuredType == "Y"){
                            state = StateVector.yDown();
                        }
                    }
                    currentElement.lit = true;

                }
                currentElement = currentElement.children[0];
            }

 
        }

        
    }

    public calculateProb(initialState:StateVector = StateVector.zUp()){
        
    }
}



export enum Validity{
    LOOP = "Loop Detected",
    OTHER = "Unknown Error",
    BADENDER = "Ender is in the wrong position",
    HEADNOTSTARTER = "Head of simulation must be a starter",
    TWOPATHS = "All elements besides Stern-Gerlach devices must have one output.",
    BADJOINER = "Joiners must have one output",
    BADSG = "Stern-Gerlach devices must have two outputs",
    NOENDER = "All paths must finish with an ender",
    VALID = "All Clear!",
    BADSTARTER = "Set the starting spin in the correct format."
}

export interface Element{
    children: Element[];
    name: string;
    id: string;
    lit: boolean;
}

export class Starter implements Element{
    children: Element[];
    name: string;
    id: string;
    lit = false;
    constructor(){
        this.children = [];
        this.name = "starter";
        this.id = "s" + Math.random();
    }
}

export class SternGerlachDevice implements Element{
    children: Element[];
    name: string;
    id: string;
    spinType: Spin;
    lit:false = false;
    constructor(spinType: Spin){
        this.children = [];
        this.name = spinType + ": stern gerlach device";
        this.id = "sg" + Math.random();
        this.spinType = spinType;
    }

}



export type Spin = "X" | "Y" | "Z";

export class Detector implements Element{
    children: Element[];
    name: string;
    id: string;
    lit: boolean;
    constructor(){
        this.children = [];
        this.name = "detector";
        this.lit = false;
        this.id = "d" + Math.random();
    }

}

export class ExtensionCord implements Element {
    children: Element[];
    name: string;
    id: string;
    lit = false;
    constructor(){
        this.children = [];
        this.name = "Extension Coord";
        this.id = "e" + Math.random();
    }
}

export class Joiner implements Element{
    children: Element[];
    parents: string[]; //has to be ids because json doesn't support circular definitions. cringe.
    name: string;
    id: string;
    lit = false;
    constructor(){
        this.children = [];
        this.name = "joiner";
        this.id = "j" + Math.random();
        this.parents = [];
    }
    addParent(el: Element){
        if (this.parents.length == 1){
            if (this.parents[0] != el.id){
                this.parents.push(el.id);
            }
        }
        if (this.parents.length == 0){
            this.parents.push(el.id);
        }
    }
}

export class Ender implements Element{
    children: Element[];
    name: string;
    id: string;
    lit = false;
    constructor(){
        this.children = [];
        this.name = "ender";
        this.id = "e" + Math.random();
    }

}



export class ElementContainer{
    element: Element;
    x: number;
    y: number;
    constructor(element: Element, x: number, y: number){
        this.element = element;
        this.x = x;
        this.y = y;
    }
}



export class Wire{
    start: {x: number, y:number}
    end: {x: number, y:number}
    el1: ElementContainer;
    el2: ElementContainer;
    constructor(elementContainer1: ElementContainer, elementContainer2: ElementContainer){
        this.el1 = elementContainer1;
        this.el2 = elementContainer2;
        this.start = {x: elementContainer1.x, y: elementContainer1.y}
        this.end = {x: elementContainer2.x, y: elementContainer2.y}
    }
    update(){
        this.start = {x: this.el1.x, y: this.el1.y}
        this.end = {x: this.el2.x, y: this.el2.y}
    }
}