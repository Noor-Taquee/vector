import { Area, type cordinate } from "./area.js";
export declare class Vector {
    id: string;
    name: string;
    /** Angle measured in **degrees** anti-clockwise from the x-axis */
    angle: number;
    length: number;
    /** Color of vector in **hex** */
    color: string;
    /** Offset from the origin */
    displayCenter: cordinate;
    /** Calculated center from viewport for pointer calculations */
    center: cordinate;
    /** component of the vector on axes */
    component: {
        i: number;
        j: number;
    };
    element: HTMLDivElement;
    /** The vector originated from */ parents: Vector[];
    area: Area;
    onPointerMove: (e: PointerEvent) => void;
    constructor(area: Area, name: string, angle: number, length: number, color: string);
    updateElement(): void;
    delete(): void;
    configCenter(): void;
    calculateComponent(): void;
    addParent(vector: Vector): void;
    removeParent(vector: Vector): void;
    getResultant(): void;
}
export declare function findResultant(vectorList: Vector[]): Vector | void;
//# sourceMappingURL=vector.d.ts.map