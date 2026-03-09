import { createElement } from "./utils/create-dom.js";
import { Vector } from "./vector.js";
import { info_section } from "./info.js";
import { list_section } from "./vector-list.js";
import { area } from "./area.js";
const showBtn = createElement("button", { id: "show-controller" });
showBtn.addEventListener("click", showController);
export function showController() {
    controller.classList.remove("hidden");
    showBtn.classList.add("hidden");
}
export const controller = createElement("div", { id: "controller" });
const controller_header = createElement("div", {
    id: "action-tools",
    className: "section"
});
const header = createElement("p", {
    className: "header",
    textContent: "Info"
});
const hideBtn = createElement("button", { id: "hide-controller" });
hideBtn.addEventListener("click", hideController);
function hideController() {
    controller.classList.add("hidden");
    showBtn.classList.remove("hidden");
}
controller_header.appendChild(header);
const addVectorBtn = createElement("button", {
    id: "add-vector",
    className: "action-btn"
}, [
    createElement("i", { className: "ph-bold ph-plus" }),
    createElement("p", { textContent: "Add Vector" })
]);
addVectorBtn.addEventListener("click", addVector);
function addVector() {
    if (addVectorBtn.classList.contains("inactive"))
        return;
    const newVector = new Vector(area, "", 0, 0, "#ff0000");
    area.focusedVector = newVector;
    document.dispatchEvent(new Event("new-vector"));
}
document.addEventListener("selection-mode", (e) => {
    if (e.detail.started) {
        addVectorBtn.classList.add("inactive");
    }
    else {
        addVectorBtn.classList.remove("inactive");
    }
});
controller.append(controller_header, info_section, list_section, addVectorBtn);
//# sourceMappingURL=controller.js.map