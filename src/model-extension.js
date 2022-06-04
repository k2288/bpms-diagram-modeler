import Modeler from "bpmn-js/lib/Modeler";

import propertiesPanelModule from "bpmn-js-properties-panel";
import propertiesProviderModule from "bpmn-js-properties-panel/lib/provider/camunda";
import { getBusinessObject } from "bpmn-js/lib/util/ModelUtil";

import "bpmn-js/dist/assets/diagram-js.css";
import "bpmn-js/dist/assets/bpmn-font/css/bpmn-embedded.css";
import "bpmn-js-properties-panel/dist/assets/bpmn-js-properties-panel.css";

import "../css/styles.css";
import $ from "jQuery";
import qaExtension from "../resources/model/qa";
import oasisExtension from "../resources/model/oasis";
import diagram from "../resources/model-extension-oasis.bpmn";

const container = document.getElementById("container");

// const containerEl = document.getElementById("container");
const qualityAssuranceEl = document.getElementById("quality-assurance");
const suitabilityScoreEl = document.getElementById("suitability-score");
const lastCheckedEl = document.getElementById("last-checked");
const okayEl = document.getElementById("okay");
const formEl = document.getElementById("form");
const warningEl = document.getElementById("warning");

let canvas = null;
let moddle = null;
let modeling = null;
// let bpmnFactory = null;
// let elementRegistry = null;
// let eventBus = null;
// let elementFactory = null;
const HIGH_PRIORITY = 1500;

window.addEventListener("click", (event) => {
  const { target } = event;

  if (target === qualityAssuranceEl || qualityAssuranceEl.contains(target)) {
    return;
  }

  qualityAssuranceEl.classList.add("hidden");
});

const modeler = new Modeler({
  container,
  keyboard: {
    bindTo: document
  },
  additionalModules: [propertiesPanelModule, propertiesProviderModule],
  propertiesPanel: {
    parent: "#properties-panel-parent"
  },
  moddleExtensions: {
    // qa: qaExtension,
    oasis: oasisExtension
  }
});

modeler
  .importXML(diagram)
  .then(({ warnings }) => {
    if (warnings.length) {
      console.log(warnings);
    }
    console.log(diagram);

    canvas = modeler.get("canvas");
    moddle = modeler.get("moddle");
    modeling = modeler.get("modeling");
    // bpmnFactory = modeler.get("bpmnFactory");
    // elementRegistry = modeler.get("elementRegistry");
    // eventBus = modeler.get("eventBus");
    // elementFactory = modeler.get("elementFactory");
    canvas.zoom("fit-viewport");

    let analysisDetails;
    let businessObject;
    let element;
    let suitabilityScore;

    // validate suitability score
    function validate() {
      const { value } = suitabilityScoreEl;

      if (isNaN(value)) {
        warningEl.classList.remove("hidden");
        okayEl.disabled = true;
      } else {
        warningEl.classList.add("hidden");
        okayEl.disabled = false;
      }
    }

    // open quality assurance if user right clicks on element
    // 오른쪽 버튼을 클릭하면 뜬다!!
    modeler.on("element.contextmenu", HIGH_PRIORITY, (event) => {
      // console.log(event);
      event.originalEvent.preventDefault();
      // event.originalEvent.stopPropagation();

      qualityAssuranceEl.classList.remove("hidden");

      ({ element } = event);

      // ignore root element
      if (!element.parent) {
        return;
      }

      businessObject = getBusinessObject(element);

      let { suitable } = businessObject;

      suitabilityScoreEl.value = suitable ? suitable : "";

      suitabilityScoreEl.focus();

      analysisDetails = getExtensionElement(
        businessObject,
        "oasis:AnalysisDetails"
      );

      lastCheckedEl.textContent = analysisDetails
        ? analysisDetails.lastChecked
        : "-";

      validate();
    });

    // set suitability core and last checked if user submits
    formEl.addEventListener("submit", (event) => {
      event.preventDefault();
      event.stopPropagation();

      suitabilityScore = Number(suitabilityScoreEl.value);

      if (isNaN(suitabilityScore)) {
        return;
      }

      const extensionElements =
        businessObject.extensionElements ||
        moddle.create("bpmn:ExtensionElements");

      if (!analysisDetails) {
        analysisDetails = moddle.create("oasis:AnalysisDetails");

        extensionElements.get("values").push(analysisDetails);
      }

      analysisDetails.lastChecked = new Date().toISOString();

      modeling.updateProperties(element, {
        extensionElements,
        suitable: suitabilityScore
      });

      qualityAssuranceEl.classList.add("hidden");
    });

    // close quality assurance if user presses escape
    formEl.addEventListener("keydown", (event) => {
      if (event.key === "Escape") {
        qualityAssuranceEl.classList.add("hidden");
      }
    });

    // validate suitability score if user inputs value
    suitabilityScoreEl.addEventListener("input", validate);
  })
  .catch((err) => {
    console.log(err);
  });

function getExtensionElement(element, type) {
  if (!element.extensionElements) {
    return;
  }

  return element.extensionElements.values.filter((extensionElement) => {
    return extensionElement.$instanceOf(type);
  })[0];
}

const doDebugFunction1 = async () => {
  const { xml } = await modeler.saveXML({ format: true });
  console.log(xml);
};
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
