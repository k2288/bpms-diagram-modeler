# bpmn-js interaction example

[bpmn-js](https://github.com/bpmn-io/bpmn-js)를 사용하여 BPMN 다이어그램과 사용자 상호 작용을 가능하게하는 다양한 방법을 보여주는 예제입니다.

[**Try out**](https://cdn.staticaly.com/gh/bpmn-io/bpmn-js-examples/master/interaction/index.html).

## About

임베드된 BPMN뷰어는 BPMN 2.0 다이어그램을 열고 user interaction을 기록합니다.

## Usage summary

You may attach interaction event listeners to a BPMN viewer/modeler as soon as it has a diagram loaded:

다이어그램이 로드되는 즉시 BPMN 뷰어/모델러에 interaction 이벤트 리스너를 attach 할 수 있습니다.

```javascript
var viewer = new BpmnJS({ container: SOME_CONTAINER });

try {
  await viewer.importXML(diagramXM);

  // diagram is loaded, add interaction to it now
  // see below for options
  // ...
} catch (err) {
  console.error("Error happened: ", err);
}
```

다이어그램을 상호작용하도록 만들기 위한 두 가지 옵션이 있습니다.

### Hook into diagram events

`element.*` 상호 작용 이벤트에 연결하기 위해 `eventBus` service를 사용합니다.

[bpmn-js](https://github.com/bpmn-io/bpmn-js)는 사용자가 터치 장치에서 작업하더라도 이벤트가 제대로 전달되는지 확인합니다.

```javascript
var eventBus = viewer.get("eventBus");

// you may hook into any of the following events
var events = [
  "element.hover",
  "element.out",
  "element.click",
  "element.dblclick",
  "element.mousedown",
  "element.mouseup"
];

events.forEach(function (event) {
  eventBus.on(event, function (e) {
    // e.element = the model element
    // e.gfx = the graphical element

    log(event, "on", e.element.id);
  });
});
```

### Directly attach listener to DOM

기본 DOM (예: HTML/SVG) 노드에 리스너를 직접 연결하여 주소를 지정하려는 요소를 더 많이 제어 할 수 있습니다.

`[data-element-id=ID_OF_ELEMENT]` 같은 selector로 검색하여 수행 할 수 있습니다:

```javascript
// each model element a data-element-id attribute attached to
// it in HTML

// select the end event
var endEventNode = document.querySelector("[data-element-id=END_EVENT]");
endEventNode.addEventListener("click", function (e) {
  alert("clicked the end event!");
});
```

두 옵션 모두 다이어그램과의 user interaction을 intercept해서 적절하게 처리 할 수 있습니다.

## Run this Example

Download and open the [example HTML page](https://cdn.staticaly.com/gh/bpmn-io/bpmn-js-examples/master/interaction/index.html).
