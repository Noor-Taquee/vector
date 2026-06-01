
import { createElement } from "../utils/create-dom.js";
import { area } from "./area.js";
import { Vector } from "./vector.js";

export const info_section = createElement("div", {
  id: "vector-info",
  className: "section unused"
});

function createInputDiv(label: string, input: HTMLElement) {
  const div = createElement("div", { className: "input-div" });
  const p = createElement("p", {
    className: "label",
    textContent: label
  });
  input.classList.add("value", "edit");
  div.append(p, input);
  return div;
}

const nameInput = createElement("input", {
  name: "name",
  autocomplete: "off",
  type: "text"
});
info_section.appendChild(createInputDiv("Name: ", nameInput));

const lengthInput = createElement("input", {
  name: "length",
  type: "number"
});
info_section.appendChild(createInputDiv("Length: ", lengthInput));

const angleInput = createElement("input", {
  name: "angle",
  type: "number"
});
info_section.appendChild(createInputDiv("Angle: ", angleInput));

const colorInput = createElement("input", {
  name: "color",
  type: "color"
});
const colorInputWrapper = createElement("div", { id: "color-input-wrapper" },
  [ colorInput ]
);
info_section.appendChild(createInputDiv("Color: ", colorInputWrapper));

const centerInputWrapper = createElement("div", { className: "input-div-wrapper" });
const centerXinput = createElement("input", {
  name: "x",
  type: "number",
  autocomplete: "off",
  className: "cordinate-input"
});
centerInputWrapper.appendChild(createInputDiv("X: ", centerXinput));

const centerYinput = createElement("input", {
  name: "y",
  type: "number",
  autocomplete: "off",
  className: "cordinate-input"
});
centerInputWrapper.appendChild(createInputDiv("Y: ", centerYinput));

info_section.appendChild(centerInputWrapper);

const updateBtn = createElement("button", {
  id: "update-vector",
  className: "action-btn"
}, [ createElement("p", { textContent: "Update" }) ]);
info_section.appendChild(updateBtn);

updateBtn.addEventListener("click", () => {
  if (info_section.classList.contains("inactive")) return;
  updateVector()
});

function updateInfo() {
  if (!currentVector) {
    info_section.classList.add("unused");
    return;
  }
  info_section.classList.remove("unused");

  nameInput.value = currentVector.name;
  lengthInput.value = String(currentVector.length);
  angleInput.value = String(currentVector.angle);
  colorInput.value = currentVector.color;
  centerXinput.value = String(currentVector.displayCenter.x);
  centerYinput.value = String(currentVector.displayCenter.y);
}

document.addEventListener("new-vector", () => {
  selectVector();
  updateInfo();
  nameInput.focus();
});

let currentVector: Vector|null = null;
document.addEventListener("vector-change", () => {
  selectVector();
  updateInfo();
});

function selectVector() {
  currentVector?.element.removeEventListener("vector-update", updateInfo);
  currentVector = area.focusedVector;
  currentVector?.element.addEventListener("vector-update", updateInfo);
}

document.addEventListener("selection-mode", (e) => {
  const inputs = info_section.querySelectorAll("input");
  if ((e as CustomEvent<{ started: boolean }>).detail.started) {
    info_section.classList.add("inactive");
    inputs.forEach(input => input.readOnly = true);
  }
  else {
    info_section.classList.remove("inactive");
    inputs.forEach(input => input.readOnly = false);
  }
});

function updateVector() {
  if (!currentVector) return;

  currentVector.name = nameInput.value;
  currentVector.length = Number(lengthInput.value);
  currentVector.angle = Number(angleInput.value);
  currentVector.color = colorInput.value;
  currentVector.displayCenter.x = Number(centerXinput.value);
  currentVector.displayCenter.y = Number(centerYinput.value);
  currentVector.updateElement();
  currentVector.configCenter();
  currentVector.calculateComponent();
  currentVector.element.dispatchEvent(new Event("vector-update"));
}
