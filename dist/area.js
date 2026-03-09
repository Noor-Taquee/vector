import { createElement } from "./utils/create-dom.js";
export class Area {
    center = { x: 0, y: 0 };
    element = createElement("div", { className: "area" });
    axes;
    focusedVector = null;
    vectorList = [];
    selectedVectorList = [];
    constructor() {
        window.addEventListener("resize", () => { this.configCenter(); });
        this.axes = {
            x: createElement("div", { className: "axis x" }),
            y: createElement("div", { className: "axis y" })
        };
        this.element.append(this.axes.x, this.axes.y);
    }
    configCenter() {
        if (!this)
            return;
        const rect = this.element.getBoundingClientRect();
        this.center.x = rect.left + rect.width / 2;
        this.center.y = rect.top + rect.height / 2;
        this.element.style.setProperty("--left", `${rect.width / 2}px`);
        this.element.style.setProperty("--bottom", `${rect.height / 2}px`);
        this.element.dispatchEvent(new Event("center-config"));
    }
}
export const area = new Area();
//# sourceMappingURL=area.js.map