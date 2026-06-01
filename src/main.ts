import "./index.css";

import { app } from "./app.js";
import { area } from "./core/area.js";

import { controller } from "./core/controller.js";

app?.append(area.element, controller);

area.configCenter();
