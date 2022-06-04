<!-- > This example is part of our [:notebook: custom elements guide](https://github.com/bpmn-io/bpmn-js-examples/tree/master/custom-elements). Checkout the final result [here](https://github.com/bpmn-io/bpmn-js-example-custom-elements). -->

> 이 예는 [:notebook: custom elements guide](https://github.com/bpmn-io/bpmn-js-examples/tree/master/custom-elements)의 일부입니다. 최종 결과는 [여기](https://github.com/bpmn-io/bpmn-js-example-custom-elements)에서 확인하세요.

# bpmn-js Example: Model Extension

<!-- An example of creating a model extension for [bpmn-js](https://github.com/bpmn-io/bpmn-js). Model extensions allow you to read, modify and write BPMN 2.0 diagrams that contain extension attributes and elements. -->

[bpmn-js](https://github.com/bpmn-io/bpmn-js)에 대한 모델 확장을 만드는 예 입니다. 모델 확장을 사용하면 확장 attribute 및 element를 포함하는 BPMN 2.0 다이어그램을 읽고 수정하고 작성할 수 있습니다.

## About

<!-- This example allows you to read, modify and write BPMN 2.0 diagrams that contain `qa:suitable` extension attributes and `qa:analysisDetails` extension elements. You can set the suitability score of each element. -->

이 예제에서는`qa:suitable` 확장 attribute과`qa:analysisDetails` 확장 element가 포함 된 BPMN 2.0 다이어그램을 읽고, 수정하고, 쓸 수 있습니다. 각 element의 적합성 점수를 설정할 수 있습니다.

![Screenshot](https://raw.githubusercontent.com/bpmn-io/bpmn-js-example-model-extension/master/docs/screenshot.png)

Here's an example of a diagram:

```xml
<?xml version="1.0" encoding="UTF-8"?>
<bpmn2:definitions xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
                   xmlns:bpmn2="http://www.omg.org/spec/BPMN/20100524/MODEL"
                   xmlns:bpmndi="http://www.omg.org/spec/BPMN/20100524/DI"
                   xmlns:dc="http://www.omg.org/spec/DD/20100524/DC"
                   xmlns:di="http://www.omg.org/spec/DD/20100524/DI"
                   xmlns:qa="http://some-company/schema/bpmn/qa"
                   targetNamespace="http://activiti.org/bpmn"
                   id="ErrorHandling">
  <bpmn2:process id="Process_1">
    <bpmn2:task id="Task_1" name="Examine Situation" qa:suitable="0.7">
      <bpmn2:outgoing>SequenceFlow_1</bpmn2:outgoing>
      <bpmn2:extensionElements>
        <qa:analysisDetails lastChecked="2015-01-20" nextCheck="2015-07-15">
          <qa:comment author="Klaus">
            Our operators always have a hard time to figure out, what they need to do here.
          </qa:comment>
          <qa:comment author="Walter">
            I believe this can be split up in a number of activities and partly automated.
          </qa:comment>
        </qa:analysisDetails>
      </bpmn2:extensionElements>
    </bpmn2:task>
    ...
  </bpmn2:process>
  <bpmndi:BPMNDiagram id="BPMNDiagram_1">
    ...
  </bpmndi:BPMNDiagram>
</bpmn2:definitions>
```

Check out the entire diagram [here](https://github.com/bpmn-io/bpmn-js-example-model-extension/blob/master/resources/diagram.bpmn).

### Creating a Model Extension

<!-- Our extension of BPMN 2.0 will be defined in a JSON file: -->

BPMN 2.0의 확장은 JSON 파일에 정의됩니다:

```json
{
  "name": "QualityAssurance",
  "uri": "http://some-company/schema/bpmn/qa",
  "prefix": "qa",
  "xml": {
    "tagAlias": "lowerCase"
  },
  "types": [
    {
      "name": "AnalyzedNode",
      "extends": [
        "bpmn:FlowNode"
      ],
      "properties": [
        {
          "name": "suitable",
          "isAttr": true,
          "type": "Float"
        }
      ]
    },
    {
      "name": "AnalysisDetails",
      "superClass": [ "Element" ],
      "properties": [
        {
          "name": "lastChecked",
          "isAttr": true,
          "type": "String"
        },
        {
          "name": "nextCheck",
          "isAttr": true,
          "type": "String"
        },
        {
          "name": "comments",
          "isMany": true,
          "type": "Comment"
        }
      ]
    },
    ...
  ],
  ...
}
```

<!-- Check out the entire extension [here](resources/qa.json). -->

전체 확장 확인 [여기](https://github.com/bpmn-io/bpmn-js-example-model-extension/blob/master/resources/qa.json).

<!-- A few things are worth noting here: -->

몇 가지 주목할 것:

<!-- * You can extend existing types using the `"extends"` property.
* If you want to add extension elements to `bpmn:ExtensionElements` they have to have `"superClass": [ "Element" ]`. -->

- `"extends"`property을 사용하여 기존 유형을 확장 할 수 있습니다.
- `bpmn:ExtensionElements`에 확장 element를 추가하려면`"superClass": [ "Element" ]`가 있어야 합니다.

<!-- For more information about model extensions head over to [moddle](https://github.com/bpmn-io/moddle). -->

모델 확장에 대한 자세한 내용은 [moddle](https://github.com/bpmn-io/moddle)을 참조하세요.

<!-- Next, let's add our model extension to bpmn-js. -->

다음으로 bpmn-js에 모델 확장을 추가해 보겠습니다.

### Adding the Model Extension to bpmn-js

<!-- When creating a new instance of bpmn-js we need to add our model extension using the `moddleExtenions` property: -->

bpmn-js의 새 인스턴스를 만들 때`moddleExtenions` property를 사용하여 모델 확장을 추가해야합니다

```javascript
import BpmnModeler from "bpmn-js/lib/Modeler";

import qaExtension from "../resources/qaPackage.json";

const bpmnModeler = new BpmnModeler({
  moddleExtensions: {
    qa: qaExtension
  }
});
```

<!-- Our model extension will be used by [bpmn-moddle](https://github.com/bpmn-io/bpmn-moddle) which is part of bpmn-js. -->

모델 확장은 bpmn-js의 일부인 [bpmn-moddle](https://github.com/bpmn-io/bpmn-moddle)에서 사용됩니다

### Modifying Extension Attributes and Elements

<!-- bpmn-js can now read, modify and write extension attributes and elements that we defined in our model extension. -->

bpmn-js는 이제 모델 확장에서 정의한 확장 attribute 및 element를 읽고 수정하고 쓸 수 있습니다.

<!-- After importing a diagram you could for instance read `qa:AnalysisDetails` extension elements of BPMN 2.0 elements: -->

다이어그램을 가져온 후 예를 들어 BPMN 2.0 element의`qa:AnalysisDetails` 확장 element를 읽을 수 있습니다.

```javascript
function getExtensionElement(element, type) {
  if (!element.extensionElements) {
    return;
  }

  return element.extensionElements.values.filter((extensionElement) => {
    return extensionElement.$instanceOf(type);
  })[0];
}

const businessObject = getBusinessObject(element);

const analysisDetails = getExtensionElement(
  businessObject,
  "qa:AnalysisDetails"
);
```

<!-- In our example we can set the suitability score of each element: -->

이 예에서는 각 element의 적합성 점수(suitability score)를 설정할 수 있습니다:

```javascript
const suitabilityScoreEl = document.getElementById("suitability-score");

const suitabilityScore = Number(suitabilityScoreEl.value);

if (isNaN(suitabilityScore)) {
  return;
}

const extensionElements =
  businessObject.extensionElements || moddle.create("bpmn:ExtensionElements");

let analysisDetails = getExtensionElement(businessObject, "qa:AnalysisDetails");

if (!analysisDetails) {
  analysisDetails = moddle.create("qa:AnalysisDetails");

  extensionElements.get("values").push(analysisDetails);
}

analysisDetails.lastChecked = new Date().toISOString();

const modeling = bpmnModeler.get("modeling");

modeling.updateProperties(element, {
  extensionElements,
  suitable: suitabilityScore
});
```

<!-- Check out the entire code [here](app/app.js). -->

전체 코드는 [여기](<[app/app.js](https://github.com/bpmn-io/bpmn-js-example-model-extension/blob/master/app/app.js)>)에서 확인하세요.

## Run the Example

<!-- You need a [NodeJS](http://nodejs.org) development stack with [npm](https://npmjs.org) installed to build the project. -->

프로젝트를 빌드하려면 [npm](https://npmjs.org)이 설치된 [NodeJS](http://nodejs.org) 개발 스택이 필요합니다.

<!-- To install all project dependencies execute -->

모든 프로젝트 종attribute을 설치하려면

```sh
npm install
```

<!-- To start the example execute -->

예제 실행하려면

```sh
npm start
```

<!-- To build the example into the `public` folder execute -->

예제를`public` 폴더에 빌드하려면 다음을 실행하십시오.

```sh
npm run all
```

## License

MIT
