# bpmn properties

<!-- This example shows how to use [bpmn-js](https://github.com/bpmn-io/bpmn-js) to access BPMN properties behind certain diagram elements. -->

이 예에서는 [bpmn-js](https://github.com/bpmn-io/bpmn-js)를 사용하여 특정 diagram element의 BPMN 프로퍼티에 액세스하는 방법을 보여줍니다.

## About

<!-- Each diagram element stores a reference to the underlying BPMN element via the `businessObject` property. The business object is the actual element that gets imported from BPMN 2.0 XML and serialized during export. Use the business object to read and write BPMN specific properties. -->

각 diagram element는`businessObject` property를 통해 기본 BPMN element에 대한 참조를 저장합니다.
business object는 BPMN 2.0 XML에서 가져 와서 export하는 동안 직렬화되는 실제 element입니다.
비즈니스 오브젝트를 사용하여 BPMN 특정 특성을 읽고 씁니다.

#### Reading BPMN Properties

<!-- To read BPMN properties, obtain a reference to a diagram elements business object. -->

BPMN 특성을 읽으려면 다이어그램 요소 business object에 대한 참조를 얻으십시오.

```javascript
var elementRegistry = bpmnJS.get("elementRegistry");

var sequenceFlowElement = elementRegistry.get("SequenceFlow_1"),
  sequenceFlow = sequenceFlowElement.businessObject;

sequenceFlow.name; // 'YES'
sequenceFlow.conditionExpression; // ModdleElement { $type: 'bpmn:FormalExpression', ... }
```

#### Writing BPMN properties

<!-- To write a BPMN property, simply set it on the business object. -->

BPMN 속성을 write하려면 business object에서 설정하기 만하면됩니다.

<!-- > Check out the [`bpmn.json` meta-model descriptor](https://github.com/bpmn-io/bpmn-moddle/blob/master/resources/bpmn/json/bpmn.json) to learn about BPMN types, their properties and relationships. -->

> BPMN type, property 및 관계에 대해 알아 보려면 [`bpmn.json` meta-model descriptor](https://github.com/bpmn-io/bpmn-moddle/blob/master/resources/bpmn/json/bpmn.json)를 확인하십시오.

```javascript
var moddle = bpmnJS.get("moddle");

// create a BPMN element that can be serialized to XML during export
var newCondition = moddle.create("bpmn:FormalExpression", {
  body: "${ value > 100 }"
});

// write property, no undo support
sequenceFlow.conditionExpression = newCondition;
```

<!-- In order to get undo/redo support you need to dispatch the property update through our modeling stack: -->

실행 undo/redo 지원을 받으려면 modeling stack을 통해 property update를 전달해야합니다:

```javascript
var modeling = bpmnJS.get("modeling");

modeling.updateProperties(sequenceFlowElement, {
  conditionExpression: newCondition
});
```

<!-- > Implement your own [`CommandHandler`](https://github.com/bpmn-io/diagram-js/blob/master/lib/command/CommandHandler.js) to perform more advanced atomic updates. -->

> 더 향상된 atomic update 업데이트를 수행하기 위해 자체 [`CommandHandler`](https://github.com/bpmn-io/diagram-js/blob/master/lib/command/CommandHandler.js)를 구현하세요.

<!-- Both ways will eventually serialize the condition to XML. -->

두 가지 방법 모두 결국 조건을 XML로 직렬화합니다.

<!-- To learn more, check out [an example diagram](./test/spec/diagram.bpmn) and the accompanying [test cases](./test/spec/BpmnPropertiesSpec.js). -->

자세한 내용은 [예제 다이어그램](https://github.com/bpmn-io/bpmn-js-examples/blob/master/bpmn-properties/test/spec/diagram.bpmn)과 함께 제공되는 [test case](https://github.com/bpmn-io/bpmn-js-examples/blob/master/bpmn-properties/test/spec/BpmnPropertiesSpec.js)를 확인하세요.

## Building

One time installation of all dependencies via [npm](https://npmjs.org):

```
npm install
```

Execute the test suite to spin up the example in your browser:

```
npm run dev
```

Go to [localhost:9876/debug.html](http://localhost:9876/debug.html) to inspect the example in your Browser.

## License

MIT
