import { createElement } from "./utils/create-dom.js";
import { generateId } from "./utils/logic/id.js";
import { Area, area } from "./area.js";
export class Vector {
    id;
    name;
    /** Angle measured in **degrees** anti-clockwise from the x-axis */
    angle;
    length;
    /** Color of vector in **hex** */
    color;
    /** Offset from the origin */
    displayCenter = { x: 0, y: 0 };
    /** Calculated center from viewport for pointer calculations */
    center = { x: 0, y: 0 };
    /** component of the vector on axes */
    component = { i: 0, j: 0 };
    element;
    /** The vector originated from */ parents = [];
    area;
    onPointerMove = (e) => handleMove(e, this);
    constructor(area, name, angle, length, color) {
        this.id = generateId();
        this.area = area;
        this.name = name;
        this.angle = angle;
        this.length = length;
        this.color = color;
        area.element.addEventListener("center-config", () => { this.configCenter(); });
        this.element = createElement("div", { className: "vector" });
        this.element.addEventListener("pointerdown", (e) => {
            e.stopPropagation();
            this.element.classList.add("moving");
            if (area.focusedVector != this) {
                area.focusedVector = this;
                document.dispatchEvent(new Event("focus-change"));
            }
            window.addEventListener("pointermove", this.onPointerMove);
            const cleanUp = () => {
                this.element.classList.remove("moving");
                window.removeEventListener("pointermove", this.onPointerMove);
                window.removeEventListener("pointerup", cleanUp);
            };
            window.addEventListener("pointerup", cleanUp);
            window.addEventListener("pointercancel", cleanUp);
        });
        area.element.appendChild(this.element);
        area.vectorList.push(this);
        document.dispatchEvent(new Event("list-update"));
        this.configCenter();
        this.calculateComponent();
        this.updateElement();
    }
    updateElement() {
        this.element.style.setProperty("--angle", `${this.angle}deg`);
        this.element.style.setProperty("--length", `${this.length}px`);
        this.element.style.setProperty("--color", `${this.color}`);
        this.element.style.setProperty("--i-left", `${this.displayCenter.x}px`);
        this.element.style.setProperty("--i-bottom", `${this.displayCenter.y}px`);
    }
    delete() {
        this.area.focusedVector = null;
        this.element.remove();
        this.area.vectorList.splice(this.area.vectorList.indexOf(this), 1);
        document.dispatchEvent(new Event("list-update"));
        document.dispatchEvent(new Event("vector-change"));
    }
    configCenter() {
        this.center = {
            x: this.area.center.x + this.displayCenter.x,
            y: this.area.center.y - this.displayCenter.y
        };
    }
    calculateComponent() {
        this.component.i = this.length * Math.cos(this.angle * (Math.PI / 180));
        this.component.j = this.length * Math.sin(this.angle * (Math.PI / 180));
    }
    addParent(vector) {
        this.parents.push(vector);
        vector.element.addEventListener("vector-update", () => { this.getResultant(); });
        this.getResultant();
    }
    removeParent(vector) {
        const i = this.parents.indexOf(vector);
        if (i === -1)
            return;
        this.parents.splice(i, 1);
        this.getResultant();
    }
    getResultant() {
        let x = 0;
        let y = 0;
        this.parents.forEach(vector => {
            x += vector.component.i;
            y += vector.component.j;
        });
        this.angle = Math.atan2(y, x) * (180 / Math.PI);
        this.length = Math.sqrt(x * x + y * y);
        this.element.classList.add("moving");
        this.updateElement();
        requestAnimationFrame(() => this.element.classList.remove("moving"));
        this.element.dispatchEvent(new Event("vector-update"));
    }
}
function handleMove(e, vector) {
    let dx = e.clientX - vector.center.x;
    let dy = e.clientY - vector.center.y;
    let radians = Math.atan2(-dy, dx);
    vector.angle = radians * (180 / Math.PI);
    vector.calculateComponent();
    requestAnimationFrame(() => {
        vector.updateElement();
        vector.element.dispatchEvent(new Event("vector-update"));
    });
}
export function findResultant(vectorList) {
    if (vectorList.length < 2)
        return;
    const newVector = new Vector(area, "resultant", 0, 0, "#00eeff");
    vectorList.forEach(vector => { newVector.addParent(vector); });
    return newVector;
}
//# sourceMappingURL=vector.js.map