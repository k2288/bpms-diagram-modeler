import xml2js from "xml2js";

// let canvas = null;
let elementRegistry = null;
// let eventBus = null;
let moddle = null;
let modeling = null;
let bpmnFactory = null;
let elementFactory = null;

function glue2bpmn(glue, modeler) {
  const parser = new xml2js.Parser();
  getModelVariables(modeler);
  parser.parseStringPromise(glue).then((result) => {
    let json = {};

    console.log(result);
    json.child = result["Glue:GlueDiagram"].child.map((j) => {
      const content = j["$"];
      const properties = (j["property"] || []).map((p) => p["$"]);
      content.properties = JSON.stringify(properties);
      return content;
    });
    json.wire = result["Glue:GlueDiagram"].wire.map((j) => j["$"]);

    json.child.map((child) => {
      if (child.input) {
        child.input = child.input
          .split(" ")
          .map((s) => Number(s.replace("//@wire.", "")));
      } else {
        // child.input = [];
      }
      if (child.output) {
        child.output = child.output
          .split(" ")
          .map((s) => Number(s.replace("//@wire.", "")));
      } else {
        // child.output = [];
      }
    });

    json.child.map((child) => {
      (child.input || []).map((input) => (json.wire[input].toId = child.id));
    });
    json.child.map((child) => {
      (child.output || []).map(
        (output) => (json.wire[output].fromId = child.id)
      );
    });
    console.log(json);

    const startEvent = json.child.find(
      (j) => j["xsi:type"] === "Glue:InitialState"
    );
    // console.log(startEvent);
    const process = elementRegistry.get("Process_1");
    drawGlue2Bpmn(startEvent, process, json);

    console.log(json);
  });
}

const drawGlue2Bpmn = function (curTask, process, json, inputTask) {
  const taskDesc = {};
  let taskType;
  // 루프 돌아서 무한 반복 되는걸 방지 하기 위해 이미 그린 것은 제외
  if (curTask.isDraw) return;
  curTask.isDraw = true;

  switch (curTask["xsi:type"]) {
    case "Glue:InitialState":
      taskType = "bpmn:StartEvent";
      break;
    case "Glue:FinalState":
      taskType = "bpmn:EndEvent";
      break;
    case "Glue:RouterActivity":
      taskType = "bpmn:ExclusiveGateway";
      break;
    default:
      taskType = "bpmn:Task";
  }

  // taskDesc.name = curTask.name;
  const locationArr = curTask.location.split(",");
  const xValue =
    Number(locationArr[0]) + Number(curTask.size.split(",")[0] / 2) - 100 / 2;
  const location = {
    x: locationArr[1] * 2,
    y: Number(xValue) * 0.8
  };

  // 신규 diagram shape 생성
  const taskBusinessObject = bpmnFactory.create(taskType, {
    name: curTask.name || ""
  });

  const task = elementFactory.createShape({
    type: taskType,
    businessObject: taskBusinessObject
  });
  curTask.element = task;
  modeling.createShape(task, location, process);
  let myDocEntry = moddle.create("bpmn:Documentation");
  myDocEntry.value = curTask.properties || "";
  modeling.updateProperties(task, { documentation: [myDocEntry] });
  // curTask의 output 배열 중 하나가
  // 다른 task에 input 중 하나가 있으면 다음 생성
  if (curTask.output === undefined || curTask.output.length <= 0) return;
  const wiredTask = curTask.output;

  const next = json.child.filter((otherTask) => {
    if (otherTask.input === undefined || otherTask.input == null) return false;

    return (
      otherTask.input.find((inputEl) => wiredTask.includes(inputEl)) !==
      undefined
    );
  });

  const nextTaskElements = next.map((nextTask) => {
    const nextTaskElement = drawGlue2Bpmn(nextTask, process, json, task);
    const flow = modeling.connect(task, nextTask.element);
    const wire = json.wire
      .filter((fwire) => fwire.fromId == curTask.id)
      .filter((twire) => twire.toId == nextTask.id);
    const flowLabel = wire[0].guardcondition || "";
    wire[0].flow = flow;
    if (flowLabel !== "success")
      modeling.updateProperties(flow, { name: flowLabel });
    // console.log(nextTask);
    return nextTaskElement;
  });
  // console.log(nextTaskElements);

  return task;
};
const getModelVariables = function (modeler) {
  // canvas = modeler.get("canvas");
  elementRegistry = modeler.get("elementRegistry");
  // eventBus = modeler.get("eventBus");
  moddle = modeler.get("moddle");
  modeling = modeler.get("modeling");
  bpmnFactory = modeler.get("bpmnFactory");
  elementFactory = modeler.get("elementFactory");
};

export default glue2bpmn;
