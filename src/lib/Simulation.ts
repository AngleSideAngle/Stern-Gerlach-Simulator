import { e, string } from "mathjs";
import { StateVector } from "./StateVector";

export class Simulation{
    head: Starter;
    constructor(){
        this.head = new Starter();
    }
    public isValid(): boolean{
        let n = this.head;
        if (n instanceof Starter){
            return this.isValidHelper(n);
        }
        return false;
    }
    private isValidHelper(n: Element): boolean{
        if (n instanceof SternGerlachDevice && n.children.length != 2){
            console.log("bad gerlach");
            return false;
        }
        if (n.children.length == 0) {
            return n instanceof Ender;
        }
        for (let i = 0; i <n.children.length; i++){
            if (this.isValidHelper(n.children[i]) == false){
                return false;
            }
        }
        return true;
    }
}

export interface Element{
    children: Element[];
    name: string
}

export class Starter implements Element{
    children: Element[];
    name: string;
    constructor(){
        this.children = [];
        this.name = "starter";
    }
}

export class SternGerlachDevice implements Element{
    children: Element[];
    name: string;
    constructor(){
        this.children = [];
        this.name = "stern gerlach device";
    }

}

export class Detector implements Element{
    children: Element[];
    name: string;
    constructor(){
        this.children = [];
        this.name = "detector";
    }

}

export class Ender implements Element{
    children: Element[];
    name: string;
    constructor(){
        this.children = [];
        this.name = "ender";
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