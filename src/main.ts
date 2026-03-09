
import { area } from "./area.js";

import { controller } from "./controller.js";

const app = document.getElementById("app") as HTMLDivElement;

app?.append(area.element, controller);

area.configCenter();
