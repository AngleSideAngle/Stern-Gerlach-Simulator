import { hypot } from "mathjs";

export class Complex{
    r: number;
    i: number;
    constructor(r: number,i: number){
        this.r = r;
        this.i = i;
    }
    magnitude(): number{
        return hypot(this.r,this.i);
    }


}

export class StateVector {

    zUp: Complex;
    zDown: Complex;

    constructor(zUp: Complex, zDown: Complex) {
        this.zUp = zUp;
        this.zDown = zDown;
    }

    static fromXComponents(xUp: Complex, xDown: Complex): StateVector {
        const zUp = new Complex(
            xUp.r / Math.sqrt(2), 
            xUp.i / Math.sqrt(2)
            );
        const zDown = new Complex(
            xDown.r / Math.sqrt(2), 
            xDown.i / Math.sqrt(2)
            );
        return new StateVector(zUp, zDown);
    }


    static fromYComponents(yUp: Complex, yDown: Complex): StateVector {
        const zUp = new Complex(
            (yUp.r + yDown.r) / Math.sqrt(2),
            (yUp.i + yDown.i) / Math.sqrt(2)
        );
        const zDown = new Complex(
            (yUp.i - yDown.i) / Math.sqrt(2),
            -(yUp.r - yDown.r) / Math.sqrt(2)
        );

        return new StateVector(zUp, zDown);
    }

    static magnitude(s: StateVector): number {
        return Math.hypot(s.zUp.magnitude(), s.zUp.magnitude());
    }

    static innerProduct(s1: StateVector, s2: StateVector): StateVector {
        const zUpProduct = new Complex(
            s1.zUp.r * s2.zUp.r + s1.zUp.i * s2.zUp.i,
            s1.zUp.r * s2.zUp.i - s1.zUp.i * s2.zUp.r
        );

        const zDownProduct = new Complex(
            s1.zDown.r * s2.zDown.r + s1.zDown.i * s2.zDown.i,
            s1.zDown.r * s2.zDown.i - s1.zDown.i * s2.zDown.r
        );

        return new StateVector(zUpProduct, zDownProduct);
    }

    static conjugate(s: StateVector){
        return new StateVector(new Complex(s.zUp.r,-s.zUp.i), new Complex(s.zDown.r,-s.zDown.i));
    }

}