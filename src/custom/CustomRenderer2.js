import BaseRanderer from "diagram-js/lib/draw/BaseRanderer";

import {
  append as svgAppend,
  attr as svgAttr,
  classes as svgClasses,
  create as svgCreate,
  remove as svgRemove
} from "tiny-svg";

import { getRoundRecPath } from "bpmn-js/lib/draw/BpmnRenderUtil";

import { is } from "bpmn-js/lib/util/ModelUtil";
import { isAny } from "bpmn-js/lib/features/modeling/util/ModelingUtil";

const HIGH_PRIORITY = 1500;
const TASK_BORDER_RADIUS = 2;

export default class CustomRender extends BaseRanderer {
  constructor(eventBus, bpmnRenderer) {
    super(eventBus, bpmnRenderer);
    this.bpmnRenderer = bpmnRenderer;
  }

  canRender(element) {
    // task와 evnet만 처리하고 나머지는 무시
    return isAny(element, ["bpmn:Task", "bpmn:Event"] && !element.labelTarget);
  }

  drawShape(parentNode, element) {
    const shape = this.bpmnRenderer.drawShape(parentNode, element);

    if (is(element, "bpmn:Task")) {
      const rect = drawRect(parentNode, 100, 80, TASK_BORDER_RADIUS, "#52B415");
      prependTo(rect, parentNode);
      svgRemove(shape);
      return shape;
    }
    const rect = drawRect(parentNode, 20, 20, TASK_BORDER_RADIUS, "#cc0000");

    svgAttr(rect, { transfor: "translate(-30, -10)" });
    return shape;
  }
  getShapePath(shape) {
    if (is(shape, "bpmn:Task")) {
      return getRoundRecPath(shape, TASK_BORDER_RADIUS);
    }
    return this.bpmnRenderer.getShapePath(shape);
  }
}

CustomRender.$inject = ["evnetBus", "bpmnRenderer"];

function drawRect(parentNode, width, height, borderRadius, strokeColor) {
  const rect = svgCreate("rect");

  svgAttr(rect, {
    width,
    height,
    rx: borderRadius,
    ry: borderRadius,
    stroke: strokeColor || "#000",
    strokeWidth: 2,
    fill: "#fff"
  });

  svgAppend(parentNode, rect);

  return rect;
}

function prependTo(newNode, parentNode, siblingNode) {
  parentNode.insertBefore(newNode, siblingNode || parentNode.firstChild);
}
