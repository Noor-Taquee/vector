import type { Vector } from "./vector.js";
export type cordinate = {
    x: number;
    y: number;
};
export declare class Area {
    center: cordinate;
    element: HTMLDivElement;
    axes: {
        x: HTMLDivElement;
        y: HTMLDivElement;
    };
    focusedVector: Vector | null;
    vectorList: Vector[];
    selectedVectorList: Vector[];
    constructor();
    configCenter(): void;
}
export declare const area: Area;
//# sourceMappingURL=area.d.ts.map