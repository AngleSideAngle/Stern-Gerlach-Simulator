import {  complex, type Complex, Matrix, hypot } from "mathjs";

export class StateVector {

    zUp: Complex;
    zDown: Complex;

    constructor(zUp: Complex, zDown: Complex) {
        this.zUp = zUp;
        this.zDown = zDown;
    }

    static fromXComponents(xUp: Complex, xDown: Complex): StateVector {
        return StateVector();
    }


    static fromYComponents(yUp: Complex, yDown: Complex): StateVector {
        return StateVector();
    }

    static magnitude(s: StateVector): number {
        return hypot(hypot(s.zUp.im, s.zUp.re), hypot(s.zDown.im, s.zDown.re));
    }

    static innerProduct(s1: StateVector, s2: StateVector): StateVector{
        return StateVector();
    }

    static conjugate(s: StateVector){
        return StateVector(s.zDown.
    }

}