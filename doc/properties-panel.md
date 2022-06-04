# bpmn-js Modeler + Properties Panel Example

<!-- This example uses [bpmn-js](https://github.com/bpmn-io/bpmn-js) and [bpmn-js-properties-panel](https://github.com/bpmn-io/bpmn-js-properties-panel). It implements a BPMN 2.0 modeler that allows you to edit execution related properties via a properties panel. -->

이 예에서는 [bpmn-js](https://github.com/bpmn-io/bpmn-js) 및 [bpmn-js-properties-panel](https://github.com/bpmn-io/bpmn-js-properties-panel)을 사용 합니다. 속성 패널을 통해 실행에 관련된 속성을 편집 할 수있는 BPMN 2.0 모델러를 구현합니다.

## About

<!-- This example is a node-style web application that builds a user interface around the bpmn-js BPMN 2.0 modeler. -->

이 예제는 bpmn-js BPMN 2.0 모델러를 중심으로 사용자 인터페이스를 구축하는 node-style 웹 애플리케이션입니다.

![demo application screenshot](https://raw.githubusercontent.com/bpmn-io/bpmn-js-examples/master/properties-panel/docs/screenshot.png "Screenshot of the modeler + properties panel example")

## Usage

<!-- Add the [properties panel](https://github.com/bpmn-io/bpmn-js-properties-panel) to your project: -->

프로젝트에 [properties panel](https://github.com/bpmn-io/bpmn-js-properties-panel) 을 추가합니다 :

```
npm install --save bpmn-js-properties-panel
```

<!-- Additionally, if you'd like to use [Camunda BPM](https://camunda.org) execution related properties, include the [camunda-bpmn-moddle](https://github.com/camunda/camunda-bpmn-moddle) dependency which tells the modeler about `camunda:XXX` extension properties: -->

또한 [Camunda BPM](https://camunda.org) 실행 관련 속성을 사용하려면 `camunda:XXX` 확장 property에 대해 모델러에게 알려주는 [camunda-bpmn-moddle](https://github.com/camunda/camunda-bpmn-moddle)종속성을 포함합니다.

```
npm install --save camunda-bpmn-moddle
```

<!-- Now extend the [bpmn-js](https://github.com/bpmn-io/bpmn-js) modeler with two properties panel related modules, the panel itself and a provider module that controls which properties are visible for each element. Additionally you must pass an element via `propertiesPanel.parent` into which the properties panel will be rendered (cf. [`app/index.js`](https://github.com/bpmn-io/bpmn-js-examples/blob/master/properties-panel/app/index.js#L16) for details). -->

이제 두 개의 속성 패널 관련 모듈 인 패널 자체와 각 요소에 대해 표시되는 속성을 제어하는 공급자 모듈을 사용하여 [bpmn-js](https://github.com/bpmn-io/bpmn-js)모델러를 확장합니다. 또한 속성 패널이 렌더링 될 `propertiesPanel.parent`를 통해 요소를 전달해야합니다 (자세한 내용은 [`app/index.js`](https://github.com/bpmn-io/bpmn-js-examples/blob/master/properties-panel/app/index.js#L16) 참조).

```javascript
var propertiesPanelModule = require("bpmn-js-properties-panel"),
  // providing camunda executable properties, too
  propertiesProviderModule = require("bpmn-js-properties-panel/lib/provider/camunda"),
  camundaModdleDescriptor = require("camunda-bpmn-moddle/resources/camunda");

var bpmnModeler = new BpmnModeler({
  container: "#js-canvas",
  propertiesPanel: {
    parent: "#js-properties-panel"
  },
  additionalModules: [propertiesPanelModule, propertiesProviderModule],
  // needed if you'd like to maintain camunda:XXX properties in the properties panel
  moddleExtensions: {
    camunda: camundaModdleDescriptor
  }
});
```

## Building the Example

<!-- You need a [NodeJS](http://nodejs.org) development stack with [npm](https://npmjs.org) and installed to build the project. -->

프로젝트를 빌드하려면 [npm](https://npmjs.org)이 포함 된 [NodeJS](http://nodejs.org) development stack이 필요합니다.

<!-- To install all project dependencies execute -->

모든 프로젝트 종속성을 설치하려면

```
npm install
```

<!-- Build the example using [browserify](http://browserify.org) via -->

다음 [browserify](http://browserify.org)를 사용하여 예제 빌드

```
npm run all
```

<!-- You may also spawn a development setup by executing -->

다음을 실행하여 개발 설정을 생성 할 수도 있습니다.

```
npm run dev
```

<!-- Both tasks generate the distribution ready client-side modeler application into the `dist` folder. -->

<!-- Serve the application locally or via a web server (nginx, apache, embedded). -->

두 작업 모두 배포 준비가 된 클라이언트 측 모델러 애플리케이션을 `dist` 폴더에 생성합니다.

로컬로 또는 웹 서버 (nginx, apache, embedded)를 통해 애플리케이션을 제공합니다.
