import Modeler from "bpmn-js/lib/Modeler";

import propertiesPanelModule from "bpmn-js-properties-panel";
import propertiesProviderModule from "bpmn-js-properties-panel/lib/provider/bpmn";
// import propertiesProviderModule from "bpmn-js-properties-panel/lib/provider/camunda";
import minimapModule from "diagram-js-minimap";
// import tokenSimulation from "bpmn-js-token-simulation";

import "bpmn-js/dist/assets/diagram-js.css";
import "bpmn-js/dist/assets/bpmn-font/css/bpmn-embedded.css";
import "bpmn-js-properties-panel/dist/assets/bpmn-js-properties-panel.css";
import "diagram-js-minimap/assets/diagram-js-minimap.css";

import "../css/styles.css";
import $ from "jQuery";

import diagram from "../resources/diagram.bpmn";

// const container = document.getElementById("container");
var container = $("#container");
const modeler = new Modeler({
  container,
  keyboard: {
    bindTo: document
  },
  additionalModules: [
    propertiesPanelModule,
    propertiesProviderModule,
    minimapModule
    // tokenSimulation
  ],
  propertiesPanel: {
    parent: "#properties-panel-parent"
  }
});
let canvas = null;
let elementRegistry = null;
let eventBus = null;
let moddle = null;
let modeling = null;
let bpmnFactory = null;
let elementFactory = null;

// modeler
// .importXML(diagram)

const doDebugFunction1 = async () => {
  const { xml } = await modeler.saveXML({ format: true });
  console.log(xml);
};

const doDebugFunction2 = () => {
  const element = elementRegistry.get("StartEvent_2");
  console.log(element.businessObject);
};
const doDebugFunction3 = () => {};
const doDebugFunction4 = () => {};
const doDebugFunction5 = () => {};
const doDebugFunction6 = () => {};

function createNewDiagram() {
  openDiagram(diagram);
}

async function openDiagram(xml) {
  try {
    await modeler.importXML(xml);
    getModelVariables();
    canvas.zoom("fit-viewport");
    onEventHandler();
    // console.log(diagram);
    // container.removeClass("with-error").addClass("with-diagram");
    modeler.get("minimap").open();
  } catch (err) {
    // container.removeClass("with-diagram").addClass("with-error");
    container.find(".error pre").text(err.message);
    console.error(err);
  }
}

function registerFileDrop(container, callback) {
  function handleFileSelect(e) {
    e.stopPropagation();
    e.preventDefault();

    var files = e.dataTransfer.files;
    var file = files[0];
    var reader = new FileReader();
    reader.onload = function (e) {
      var xml = e.target.result;
      callback(xml);
    };

    reader.readAsText(file);
  }

  function handleDragOver(e) {
    e.stopPropagation();
    e.preventDefault();
    e.dataTransfer.dropEffect = "copy"; // Explicitly show this is a copy.
  }

  container.get(0).addEventListener("dragover", handleDragOver, false);
  container.get(0).addEventListener("drop", handleFileSelect, false);
}

// file drag / drop ///////////////////////

// check file api availability
if (!window.FileList || !window.FileReader) {
  window.alert(
    "Looks like you use an older browser that does not support drag and drop. " +
      "Try using Chrome, Firefox or the Internet Explorer > 10."
  );
} else {
  registerFileDrop(container, openDiagram);
}

$(function () {
  createNewDiagram();
  getModelVariables();
  var downloadLink = $("#js-download-diagram");
  var downloadSvgLink = $("#js-download-svg");
  $(".buttons a").click(function (e) {
    if (!$(this).is(".active")) {
      e.preventDefault();
      e.stopPropagation();
    }
  });

  $(document).on("click", "#js-debug1", doDebugFunction1);
  $(document).on("click", "#js-debug2", doDebugFunction2);
  $(document).on("click", "#js-debug3", doDebugFunction3);
  $(document).on("click", "#js-debug4", doDebugFunction4);
  $(document).on("click", "#js-debug5", doDebugFunction5);
  $(document).on("click", "#js-debug6", doDebugFunction6);
  function setEncoded(link, name, data) {
    var encodedData = encodeURIComponent(data);

    if (data) {
      link.addClass("active").attr({
        href: "data:application/bpmn20-xml;charset=UTF-8," + encodedData,
        download: name
      });
    } else {
      link.removeClass("active");
    }
  }

  var exportArtifacts = debounce(async function () {
    try {
      const { svg } = await modeler.saveSVG();
      setEncoded(downloadSvgLink, "diagram.svg", svg);
    } catch (err) {
      console.error("Error happened saving SVG: ", err);
      setEncoded(downloadSvgLink, "diagram.svg", null);
    }

    try {
      const { xml } = await modeler.saveXML({ format: true });
      setEncoded(downloadLink, "diagram.bpmn", xml);
    } catch (err) {
      console.error("Error happened saving diagram: ", err);
      setEncoded(downloadLink, "diagram.bpmn", null);
    }
  }, 500);

  modeler.on("commandStack.changed", exportArtifacts);
});

// helpers //////////////////////

function debounce(fn, timeout) {
  var timer;

  return function () {
    if (timer) {
      clearTimeout(timer);
    }

    timer = setTimeout(fn, timeout);
  };
}

const onEventHandler = function () {
  // you may hook into any of the following events
  // var events = ["element.click", "element.dblclick"];

  // eventBus.on([...events], function (e) {
  //   // console.log(event, "on", e.element.id, e.gfx);
  //   const taskElement = elementRegistry.get(e.element.id);
  //   let taskBusinessObject = taskElement.businessObject;
  //   console.log(taskBusinessObject.name);
  // });
  const events = [
    // "commandStack.elements.create.postExecuted",
    // "commandStack.elements.delete.postExecuted",
    // "commandStack.elements.move.postExecuted",
    // "elements.changed",
    // "elements.delete",
    "element.changed"
    // "element.click",
    // "element.dblclick"
  ];

  events.forEach(function (event) {
    eventBus.on(event, function (e) {
      // e.element = the model element
      // e.gfx = the graphical element
      // console.log(event, e);
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
};

const getModelVariables = function () {
  canvas = modeler.get("canvas");
  elementRegistry = modeler.get("elementRegistry");
  eventBus = modeler.get("eventBus");
  moddle = modeler.get("moddle");
  modeling = modeler.get("modeling");
  bpmnFactory = modeler.get("bpmnFactory");
  elementFactory = modeler.get("elementFactory");
};
