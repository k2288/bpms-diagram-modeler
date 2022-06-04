import Modeler from "bpmn-js/lib/Modeler";

import propertiesPanelModule from "bpmn-js-properties-panel";
import propertiesProviderModule from "bpmn-js-properties-panel/lib/provider/camunda";

import "bpmn-js/dist/assets/diagram-js.css";
import "bpmn-js/dist/assets/bpmn-font/css/bpmn-embedded.css";
import "bpmn-js-properties-panel/dist/assets/bpmn-js-properties-panel.css";

import "../css/styles.css";
import $ from "jQuery";

import diagram from "../resources/diagram.bpmn";
import customRendererModule from "./custom";

const container = document.getElementById("container");

const modeler = new Modeler({
  container,
  keyboard: {
    bindTo: document
  },
  additionalModules: [
    propertiesPanelModule,
    propertiesProviderModule,
    customRendererModule
  ],
  propertiesPanel: {
    parent: "#properties-panel-parent"
  }
});
let canvas = null;
let moddle = null;
let modeling = null;
let bpmnFactory = null;
let elementRegistry = null;
let eventBus = null;
let elementFactory = null;

modeler
  .importXML(diagram)
  .then(({ warnings }) => {
    if (warnings.length) {
      console.log(warnings);
    }

    canvas = modeler.get("canvas");
    moddle = modeler.get("moddle");
    modeling = modeler.get("modeling");
    bpmnFactory = modeler.get("bpmnFactory");
    elementRegistry = modeler.get("elementRegistry");
    eventBus = modeler.get("eventBus");
    elementFactory = modeler.get("elementFactory");

    canvas.zoom("fit-viewport");
    console.log(diagram);

    const events = ["element.changed"];

    events.forEach(function (event) {
      eventBus.on(event, function (e) {
        const taskElement = elementRegistry.get(e.element.id);
        if (taskElement) {
          let taskBusinessObject = taskElement.businessObject;
          console.log(
            e.element.id + "는 변경 또는 추가 하시오.",
            taskBusinessObject,
            e.gfx
          );
        } else {
          console.log(e.element.id + "는 삭제 하시오.");
        }
      });
    });
  })
  .catch((err) => {
    console.log(err);
  });

const doDebugFunction1 = () => {};
const doDebugFunction2 = () => {};
const doDebugFunction3 = () => {};
const doDebugFunction4 = () => {};
const doDebugFunction5 = () => {};
const doDebugFunction6 = () => {};

$(function () {
  $(document).on("click", "#js-debug1", doDebugFunction1);
  $(document).on("click", "#js-debug2", doDebugFunction2);
  $(document).on("click", "#js-debug3", doDebugFunction3);
  $(document).on("click", "#js-debug4", doDebugFunction4);
  $(document).on("click", "#js-debug5", doDebugFunction5);
  $(document).on("click", "#js-debug6", doDebugFunction6);
});
