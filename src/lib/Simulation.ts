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
        if (n instanceof SternGerlachDevice && n.children.length != 2) return false;
        if (n.children.length == 0) return n instanceof Ender;
        for (let i = 0; i <n.children.length; i++){
            this.isValidHelper(n.children[i]);
        }
        return false;
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