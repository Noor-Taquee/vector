import { createElement } from "./utils/create-dom.js";

import { area } from "./area.js";
import { findResultant, Vector } from "./vector.js";

export const list_section = createElement("div", {
  id: "vector-list-wrapper",
  className: "section unused",
});

// MARK: Header
const listSection_header = createElement("div", {
  className: "list-header-bar"
});

const selectAllBtn = createElement("button", {
  title: "Select All",
  className: "utility-btn",
}, [ createElement("i", { className: "ph-bold ph-selection-all" }) ]
);
selectAllBtn.addEventListener("click", () => {
  if (!list_section.classList.contains("selection")) enterSelection();
  area.selectedVectorList = area.vectorList;
  listEl.querySelectorAll<HTMLButtonElement>(".vector-btn").forEach(btn => {
    btn.classList.add("checked");
    updateIcon(btn);
  });
});

const deleteAllBtn = createElement("button", {
  title: "Delete All",
  className: "utility-btn",
}, [ createElement("i", { className: "ph-bold ph-trash" }) ]
);
deleteAllBtn.addEventListener("click", () => {
  if (!list_section.classList.contains("selection")) return;
  area.selectedVectorList.forEach(vector => vector.delete());
  exitSelection();
  updateList();
});

const resultantBtn = createElement("button", {
  title: "Resultant",
  className: "utility-btn",
}, [ createElement("i", { className: "ph-bold ph-arrows-merge" }) ]
);
resultantBtn.addEventListener("click", () => {
  findResultant(area.selectedVectorList);
  exitSelection();
});

listSection_header.append(selectAllBtn, deleteAllBtn, resultantBtn);

//#region List
const listEl = createElement("div", {
  id: "vector-list",
});

list_section.append(listSection_header, listEl);

//#region Functions
function createVectorBtn(vector: Vector) {
  const btn = createElement("button", {
    id: vector.id,
    className: "vector-btn"
  });

  if (list_section.classList.contains("selection")) {
    if (area.selectedVectorList.includes(vector))
    btn.classList.add("checked");
  }

  const nameDiv = createElement("div", { className: "name-div" });
    const p = createElement("p", { textContent: vector.name });
    const span = createElement("span", { className: "color" });
    span.style.background = vector.color;
  nameDiv.append(p, span);

  vector.element.addEventListener("vector-update", () => {
    p.textContent = vector.name;
    span.style.background = vector.color;
  });

  const utility_tools = createElement("div", { className: "utility-tools" });
    const deleteBtn = createElement("button", {
      className: "delete-btn"
    }, [createElement("i", { className: "ph-bold ph-trash" })]);
    deleteBtn.addEventListener("click", () => vector.delete());
  
    const selectionBtn = createElement("button", { className: "selection-div" },
      [createElement("i", { className: "ph-bold ph-circle" })]
    );
  utility_tools.append(deleteBtn, selectionBtn);

  btn.append(nameDiv, utility_tools);

  btn.addEventListener("click", () => {
    if (list_section.classList.contains("selection")) {
      btn.classList.toggle("checked");
      updateIcon(btn);
      if (btn.classList.contains("checked")) {
        if (!area.selectedVectorList.includes(vector)) {
          area.selectedVectorList.push(vector);
        }
      } else {
        area.selectedVectorList.splice( area.selectedVectorList.indexOf(vector), 1);
      }

      checkSelection();
      return;
    }
    
    area.focusedVector = vector;
    document.dispatchEvent(new Event("vector-change"));
  });

  btn.addEventListener("pointerdown", (e: PointerEvent) => {
    if (btn.classList.contains("checked")) return;
  
    const startX = e.clientX;
    const startY = e.clientY;
  
    const delay = setTimeout(() => {
      enterSelection();
      area.selectedVectorList.push(vector);
      btn.classList.add("checked");
      updateIcon(btn);
      cleanup();
    }, 1000);
  
    const onMove = (moveEvent: PointerEvent) => {
      const tolerance = 5;
      const dx = Math.abs(moveEvent.clientX - startX);
      const dy = Math.abs(moveEvent.clientY - startY);
  
      if (dx > tolerance || dy > tolerance) cleanup();
    };
  
    const cleanup = () => {
      clearTimeout(delay);
      btn.removeEventListener("pointermove", onMove);
    };
  
    btn.addEventListener("pointermove", onMove);
    
    btn.addEventListener("pointerup", cleanup, { once: true });
    btn.addEventListener("pointercancel", cleanup, { once: true });
  });
  return btn;
}

function updateIcon(btn: HTMLButtonElement) {
  const icon = btn.querySelector(".selection-div i");
  if (!icon) return;
  
  if (btn.classList.contains("checked")) {
    icon.className = "ph-fill ph-radio-button";
  } else {
    icon.className = "ph-bold ph-circle";
  }
}

function checkSelection() {
  if (area.selectedVectorList.length == 0) {
    exitSelection();
  }
}

function exitSelection() {
  list_section.classList.remove("selection");
  area.selectedVectorList = [];
  document.dispatchEvent(new CustomEvent("selection-mode", { detail: { started: false } }));
}

function enterSelection() {
  list_section.classList.add("selection");
  document.dispatchEvent(new CustomEvent("selection-mode", { detail: { started: true} }));
}
//#endregion Functions

function updateList() {
  listEl.innerHTML = "";
  if (area.vectorList.length == 0) {
    list_section.classList.add("unused");
    return;
  }
  list_section.classList.remove("unused");
  
  area.vectorList.forEach(vector => {
    listEl.appendChild(createVectorBtn(vector));
  });
}

document.addEventListener("list-update", updateList);
document.addEventListener("new-vector", updateList);
//#endregion List
