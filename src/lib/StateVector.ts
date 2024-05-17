import { hypot } from "mathjs";


export class Complex {
    r: number;
    i: number;
    constructor(r: number,i: number){
        this.r = r;
        this.i = i;
    }
    magnitude(): number{
        return hypot(this.r,this.i);
    }
    pretty(): string{
        return "" + this.r + "," + this.i + "i"; 
    }

    static fromStr(str: string): Complex{
        let v = str.slice(0,-1).split(',');

        return new Complex(parseFloat(v[0]), parseFloat(v[1]));
    }
}

export type dir = "bra" | "ket";
export class StateVector {

    zUp: Complex;
    zDown: Complex;
    dir: dir;
    constructor(zUp: Complex, zDown: Complex,dir: dir) {
        this.zUp = zUp;
        this.zDown = zDown;
        this.dir = dir;
    }

    transpose(): StateVector {
        return new StateVector(new Complex(this.zUp.r, this.zUp.i *-1), new Complex(this.zDown.r, this.zDown.i *-1), "ket");        
    }

    static zUp(): StateVector {
        return new StateVector(new Complex(1, 0), new Complex(0, 0), "ket");
    }

    static zDown(): StateVector {
        return new StateVector(new Complex(0, 0), new Complex(1, 0), "ket");
    }

    static yUp(): StateVector {
        return new StateVector(new Complex(1/Math.sqrt(2), 0), new Complex(0,1/Math.sqrt(2)), "ket");
    }
    
    static yDown(): StateVector{
        return new StateVector(new Complex(1/Math.sqrt(2), 0), new Complex(0,-1/Math.sqrt(2)), "ket");
    }

    static xUp(): StateVector {
        return new StateVector(new Complex(1/Math.sqrt(2), 0), new Complex(1/Math.sqrt(2),0), "ket");
    }
    
    static xDown(): StateVector{
        return new StateVector(new Complex(1/Math.sqrt(2), 0), new Complex(-1/Math.sqrt(2),0), "ket");
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
        return new StateVector(zUp, zDown, "ket");
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

        return new StateVector(zUp, zDown, "ket");
    }

    static magnitude(s: StateVector): number {
        return Math.hypot(s.zUp.magnitude(), s.zUp.magnitude());
    }

    static innerProduct(s1: StateVector, s2: StateVector): StateVector {

        let zUpProduct: Complex;
        let zDownProduct: Complex;
        if (s1.dir == "ket" && s2.dir == "ket"){

            s1 = s1.transpose();
            
            zUpProduct = new Complex(
                s1.zUp.r * s2.zUp.r + s1.zUp.i * s2.zUp.i,
                s1.zUp.r * s2.zUp.i - s1.zUp.i * s2.zUp.r
            );

            zDownProduct = new Complex(
                s1.zDown.r * s2.zDown.r + s1.zDown.i * s2.zDown.i,
                s1.zDown.r * s2.zDown.i - s1.zDown.i * s2.zDown.r
            );

        }
        else {
            zUpProduct = new Complex(
                s1.zUp.r * s2.zUp.r + s1.zUp.i * s2.zUp.i,
                s1.zUp.r * s2.zUp.i - s1.zUp.i * s2.zUp.r
            );

            zDownProduct = new Complex(
                s1.zDown.r * s2.zDown.r + s1.zDown.i * s2.zDown.i,
                s1.zDown.r * s2.zDown.i - s1.zDown.i * s2.zDown.r
            );
        }

        return new StateVector(zUpProduct, zDownProduct, "ket"); 
    }

    static conjugate(s: StateVector){
        return new StateVector(new Complex(s.zUp.r,-s.zUp.i), new Complex(s.zDown.r,-s.zDown.i), "ket");
    }

    static toXBasis(vec: StateVector): StateVector {
        const xUp = new Complex(
            (vec.zUp.r + vec.zDown.r) / Math.sqrt(2),
            (vec.zUp.i + vec.zDown.i) / Math.sqrt(2)
        );
        const xDown = new Complex(
            (vec.zUp.r - vec.zDown.r) / Math.sqrt(2),
            (vec.zUp.i - vec.zDown.i) / Math.sqrt(2)
        );
        return new StateVector(xUp, xDown, "ket");
    }

    static toYBasis(vec: StateVector): StateVector {
        const yUp = new Complex(
            (vec.zUp.r + vec.zDown.i) / Math.sqrt(2),
            (vec.zUp.i - vec.zDown.r) / Math.sqrt(2)
        );
        const yDown = new Complex(
            (vec.zUp.r - vec.zDown.i) / Math.sqrt(2),
            (vec.zUp.i + vec.zDown.r) / Math.sqrt(2)
        );
        return new StateVector(yUp,yDown, "ket");
    }

}