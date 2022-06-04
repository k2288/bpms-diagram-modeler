## 한 번에 한 단계 씩 bpmn-js에 익숙해집니다.

이 문서는 진행중인 작업입니다. [개선 할 수 있도록 도와주세요](https://github.com/bpmn-io/bpmn.io/edit/master/src/pages/toolkit/bpmn-js/walkthrough/walkthrough.md).

# A Quick Introduction

[bpmn-js](https://github.com/bpmn-io/bpmn-js)는 BPMN 2.0 렌더링 툴킷 및 웹 모델러입니다. JavaScript로 작성되고 BPMN 2.0 다이어그램을 최신 브라우저에 포함하며 서버 백엔드가 필요하지 않습니다. 이를 통해 모든 웹 애플리케이션에 쉽게 임베드 할 수 있습니다.

라이브러리는 뷰어 및 웹 모델러가 될 수 있는 방식으로 구축됩니다. [뷰어](https://github.com/bpmn-io/bpmn-js-examples/tree/master/url-viewer)를 사용하여 BPMN 2.0을 애플리케이션에 임베드하고 [데이터로 보강](https://github.com/bpmn-io/bpmn-js-examples/tree/master/overlays)하십시오. [모델러](https://github.com/bpmn-io/bpmn-js-examples/tree/master/modeler)를 사용하여 애플리케이션 내부에 BPMN 2.0 다이어그램을 작성하십시오.

이 연습에서는 라이브러리 사용 방법에 대한 소개와 내부에 대한 몇 가지 통찰력, 즉 고도로 모듈화되고 확장 가능한 구조에 기여하는 컴포넌트에 대한 정보를 제공합니다.

## Contents

---

- [Library 이용](#using-the-library)

  - [뷰어 포함(사전 패키지)](#Embed-the-Pre-Packaged-Viewer)
  - [나만의 Modeler 롤 (npm)](#Roll-Your-Own-Modeler)

- [bpmn-js 내부 이해](#Understanding-bpmn-js-Internals)
  - [다이어그램 상호 작용 / 모델링 (diagram-js)](<#Diagram-Interaction-/-Modeling-(diagram-js)>)
  - [BPMN 메타 모델 (bpmn-moddle)](<#BPMN-Meta-Model-(bpmn-moddle)>)
  - [함께 연결하기 (bpmn-js)](<#Plugging-Things-Together-(bpmn-js)>)
- [더 나아 가기](#going-further)

# Using the Library

애플리케이션에서 [bpmn-js](https://github.com/bpmn-io/bpmn-js)를 사용하는 방법에는 두 가지가 있습니다. 라이브러리의 올인원 사전 패키지 버전을 사용하면 모든 웹 사이트에 BPMN을 빠르게 추가 할 수 있습니다. [npm](https://www.npmjs.com/) 버전은 설정하기가 더 복잡하지만 개별 라이브러리 구성 컴포넌트에 대한 액세스를 제공하고 더 쉽게 확장 할 수 있습니다.

이 섹션에서는 두 가지 접근 방식에 대한 개요를 제공합니다. BPMN 뷰어의 사전 패키지 버전을 웹 사이트에 포함하는 방법에 대한 소개부터 시작합니다. 다음으로 bpmn-js를 애플리케이션과 번들로 묶어 웹 기반 BPMN 편집기를 만드는 방법을 보여줍니다.

## Embed the Pre-Packaged Viewer

bpmn-js의 [사전 패키지 버전](https://github.com/bpmn-io/bpmn-js-examples/tree/master/pre-packaged)을 사용하면 간단한 스크립트로 BPMN을 웹 사이트에 포함 할 수 있습니다.

렌더링 된 다이어그램의 컨테이너를 올리기 위한 HTML 태크를 웹 사이트에 추가하고 라이브러리를 페이지에 포함합니다.

```html
<!--BPMN 다이어그램 컨테이너-->
<div id="canvas"></div>

<!-- CDN URL을 로컬 bpmn-js 경로로 대체 -->
<script src="https://unpkg.com/bpmn-js/dist/bpmn-viewer.development.js"></script>
```

포함 된 스크립트는 BpmnJS 변수를 통해 뷰어를 사용할 수 있도록합니다. 아래와 같이 JavaScript를 통해 액세스 할 수 있습니다.

```javascript
  // bpmn 다이어그램 저장 변수(파일에서 import 필요)
  const bpmnXML;

  // The BPMN viewer instance
  const 뷰어 ​​= new BpmnJS ({container : '#canvas'});

  // import a BPMN 2.0 diagram
  // 여기서 파일 등에서 읽어야 함

  {
    // 성공
    await viewer.importXML (bpmnXML);
    viewer.get ( 'canvas'). zoom ( 'fit-viewport');

  } catch (err) {
    // 가져 오기 실패 :-(
  }
```

스니펫은 [Viewer#importXML](https://github.com/bpmn-io/bpmn-js/blob/master/lib/BaseViewer.js#L109) API를 사용하여 사전로드 된 BPMN 2.0 다이어그램을 표시합니다. 다이어그램 가져 오기는 비동기식이며 완료되면 뷰어가 결과에 대한 콜백을 통해 알려줍니다.

가져온 후 [Viewer#get](https://github.com/bpmn-io/bpmn-js/blob/master/lib/BaseViewer.js#L486)을 통해 다양한 다이어그램 서비스에 액세스 할 수 있습니다. 위의 스니펫에서 현재 사용 가능한 뷰포트 크기에 다이어그램을 맞추기 위해 [Canvas](https://github.com/bpmn-io/diagram-js/blob/master/lib/core/Canvas.js)와 상호 작용합니다.

```javascript
var canvas = viewer.get("canvas");
var elementRegistry = viewer.get("elementRegistry");
```

종종 AJAX를 통해 BPMN 2.0 다이어그램을 동적으로 로드하는 것이 더 실용적입니다. 이는 일반 JavaScript (아래 참조)를 사용하거나 보다 편리한 API를 제공하는 [jQuery](https://api.jquery.com/jQuery.get)와 같은 유틸리티 라이브러리를 통해 수행 할 수 있습니다.

```javascript
function fetchDiagram(url) {
  return fetch(url).then((response) => response.text());
}

async function run() {
  const diagram = await fetchDiagram("path-to-diagram.bpmn");

  try {
    await viewer.importXML(diagram);
    // ...
  } catch (err) {
    // ...
  }
}

run();
```

자세한 내용은 [pre-packaged 예제](https://github.com/bpmn-io/bpmn-js-examples/tree/master/pre-packaged)와 [starter 예제](https://github.com/bpmn-io/bpmn-js-examples/tree/master/starter)를 확인하십시오.

## Roll Your Own Modeler

라이브러리에 대한 사용자 정의를 빌드하려면 [npm](https://www.npmjs.com/)을 통해 bpmn-js를 사용하십시오. 이 접근 방식에는 개별 라이브러리 구성 컴포넌트에 대한 액세스와 같은 다양한 이점이 있습니다. 또한 뷰어 / 모델러의 일부로 패키징 할 항목을 더 많이 제어 할 수 있습니다. 그러나 [Webpack](https://webpack.js.org/)과 같은 ES 모듈 인식 번들러를 사용하여 bpmn-js를 애플리케이션과 번들로 묶어야 합니다.

> JavaScript 번들링의 세계에 익숙하지 않은 경우 [번들링 예제](https://github.com/bpmn-io/bpmn-js-examples/tree/master/bundling)를 따르십시오.

이 섹션의 나머지 부분에서는 [모델러 예제](https://github.com/bpmn-io/bpmn-js-examples/tree/master/modeler)를 느슨하게 따라 웹 기반 BPMN 편집기를 만듭니다.

### Include the Library

먼저 [npm](https://www.npmjs.com/)을 통해 bpmn-js를 설치:

```bash
npm install bpmn-js
```

다음 ES `import`를 통해 BPMN 모델러액세스 :

```javascript
import Modeler from "bpmn-js/lib/Modeler";

// create a modeler
const modeler = new Modeler({ container: "#canvas" });

// import diagram
try {
  await modeler.importXML(bpmnXML);
  // ...
} catch (err) {
  // err...
}
```

<!-- Again, this assumes you provide an element with the id canvas as part of your HTML for the modeler to render into. -->

다시 말하지만, 모델러가 렌더링 할 HTML의 일부로 id 캔버스가 있는 element를 제공한다고 가정합니다.

<!-- Add Stylesheets -->

## 스타일 시트 추가

<!-- When embedding the modeler into a webpage, include the diagram-js stylesheet as well as the BPMN icon font with it. Both are shipped with the bpmn-js distribution under the dist/assets folder. -->

모델러를 웹 페이지에 임베드 할 때 [diagram-js](https://github.com/bpmn-io/diagram-js) stylesheet와 함께 [BPMN icon font](https://github.com/bpmn-io/bpmn-font)을 포함하십시오. 둘 다 [dist/assets](https://unpkg.com/bpmn-js/dist/assets/) 폴더 아래에 bpmn-js 배포판과 함께 제공됩니다.

```html
<link rel="stylesheet" href="bpmn-js/dist/assets/diagram-js.css" />
<link rel="stylesheet" href="bpmn-js/dist/assets/bpmn-font/css/bpmn.css" />
```

<!-- Adding the stylesheets ensures diagram elements receive proper styling as well as context pad and palette entries show BPMN symbols. -->

스타일 시트를 추가하면 다이어그램 element가 적절한 스타일을 받을 수 있을 뿐만 아니라 컨텍스트 패드 및 팔레트 항목이 BPMN 기호를 표시 할 수 있습니다.

## Bundle for the Browser

<!-- bpmn-js and its dependencies distribute ES modules. Use an ES module aware bundler to pack bpmn-js along with your application. Learn more by following along with the bundling example. -->

bpmn-js 및 해당 종속성은 [ES 모듈](http://exploringjs.com/es6/ch_modules.html#sec_basics-of-es6-modules)을 배포합니다. ES 모듈 인식 번들러를 사용하여 애플리케이션과 함께 bpmn-js를 압축합니다. [번들링 예제](https://github.com/bpmn-io/bpmn-js-examples/tree/master/bundling)와 함께 자세히 알아보십시오.

## Hook into Life-Cycle Events

<!-- Events allow you to hook into the life-cycle of the modeler as well as diagram interaction. The following snippet shows how changed elements and modeling operations in general can be captured. -->

이벤트는 모델러의 라이프 사이클뿐만 아니라 다이어그램의 상호 작용에 연결(hook) 할 수 있습니다. 다음 스니펫은 변경된 element 및 모델링 작업을 일반적으로 캡처 할 수 있는 방법을 보여줍니다.

```javascript
modeler.on("commandStack.changed", () => {
  // user modeled something or
  // performed an undo/redo operation
});

modeler.on("element.changed", (event) => {
  const element = event.element;

  // the element was changed by the user
});
```

<!-- Use Viewer#on to register for events or the EventBus inside extension modules. Stop listening for events using the Viewer#off method. Check out the interaction example to see listening for events in action. -->

[Viewer#on](https://github.com/bpmn-io/bpmn-js/blob/master/lib/BaseViewer.js#L569)을 사용하여 확장 모듈 내부의 이벤트 또는 [EventBus](https://github.com/bpmn-io/diagram-js/blob/master/lib/core/EventBus.js)에 등록하십시오. [Viewer#off](https://github.com/bpmn-io/bpmn-js/blob/master/lib/BaseViewer.js#L579) 메서드를 사용하여 이벤트 수신을 중지합니다. 실제 이벤트 수신을 확인하려면 [상호 작용 예제](https://github.com/bpmn-io/bpmn-js-examples/tree/master/interaction)를 확인하십시오.

## Extend the Modeler

<!-- You may use the additionalModules option to extend the Viewer and Modeler on creation. This allows you to pass custom modules that amend or replace existing functionality. -->

`additionalModules` 옵션을 사용하여 생성시 `Viewer` 및 [Modeler](https://github.com/bpmn-io/bpmn-js/blob/master/lib/Modeler.js)를 확장 할 수 있습니다. 이를 통해 기존 기능을 수정하거나 대체하는 custom *module*을 전달할 수 있습니다.

```javascript
import OriginModule from "diagram-js-origin";

// create a modeler
const modeler = new Modeler({
  container: "#canvas",
  additionalModules: [
    OriginModule,
    require("./custom-rules"),
    require("./custom-context-pad")
  ]
});
```

<!-- A module (cf. Module System section) is a unit that defines one or more named services. These services configure bpmn-js or provide additional functionality, i.e. by hooking into the diagram life-cycle. -->

모듈 ([모듈 시스템 섹션 참조](https://bpmn.io/toolkit/bpmn-js/walkthrough/#module-system))은 하나 이상의 명명 된 서비스를 정의하는 단위입니다. 이러한 서비스는 bpmn-js를 구성하거나 다이어그램 수명주기에 연결하여 추가 기능을 제공합니다.

<!-- Some modules, such as diagram-js-origin or diagram-js-minimap, provide generic user interface additions. Built-in bpmn-js modules, such as bpmn rules or modeling, provide highly BPMN-specific functionality. -->

[diagram-js-origin](https://github.com/bpmn-io/diagram-js-origin) 또는 [diagram-js-minimap](https://github.com/bpmn-io/diagram-js-minimap)과 같은 일부 모듈은 일반 사용자 인터페이스 추가를 제공합니다. [bpmn 규칙](https://github.com/bpmn-io/bpmn-js/blob/master/lib/features/rules) 또는 [모델링](https://github.com/bpmn-io/bpmn-js/tree/master/lib/features/modeling)과 같은 내장 bpmn-js 모듈은 높은 BPMN 관련 기능을 제공합니다.

<!-- One common way to extend the BPMN modeler is to add custom modeling rules. In doing so, you can limit or extend the modeling operations allowed by the user. -->

BPMN 모델러를 확장하는 일반적인 방법 중 하나는 [커스텀 모델링 규칙](https://github.com/bpmn-io/bpmn-js-examples/tree/master/custom-modeling-rules)을 추가하는 것입니다. 이렇게하면 사용자가 허용하는 모델링 작업을 제한하거나 확장 할 수 있습니다.

<!-- Other examples for extensions are: -->

확장의 다른 예:

- [custom elements 추가](https://github.com/bpmn-io/bpmn-js-examples/tree/master/custom-elements)
- [Custom palette / context pad](https://github.com/bpmn-io/bpmn-js-nyan)
- [Custom shape rendering](https://github.com/bpmn-io/bpmn-js-nyan)

<!-- Check out the bpmn-js-examples project for many more toolkit extension show cases. -->

더 많은 툴킷 확장 쇼 케이스는 [bpmn-js-examples 프로젝트](https://github.com/bpmn-io/bpmn-js-examples)를 확인하십시오.

## Build a Custom Distribution

<!-- If you would like to create your own pre-packaged version of your custom modeler or viewer, refer to the custom-bundle example. This could make sense if you carried out heavy customizations that you would like to ship to your users in simple way. -->

커스텀 모델러 또는 뷰어의 사전 패키지 버전을 직접 만들고 싶다면 [커스텀 번들 예제](https://github.com/bpmn-io/bpmn-js-examples/tree/master/custom-bundle)를 참조하세요. 이는 간단한 방법으로 사용자에게 제공하려는 무거운 사용자 정의를 수행 한 경우에 적합 할 수 있습니다.

# Understanding bpmn-js Internals

<!-- This section explores some bpmn-js internals. -->

이 섹션에서는 몇 가지 [bpmn-js](https://github.com/bpmn-io/bpmn-js) 내부를 살펴 봅니다.

<!-- As depicted in the architecture diagram below, bpmn-js builds on top of two important libraries: diagram-js and bpmn-moddle. -->

아래 아키텍처 다이어그램에 설명 된대로 bpmn-js는 [diagram-js](https://github.com/bpmn-io/diagram-js) 및 [bpmn-moddle](https://github.com/bpmn-io/bpmn-moddle)이라는 두 가지 중요한 라이브러리를 기반으로 빌드됩니다.

![screenshot](https://bpmn.io/assets/img/toolkit/bpmn-js/walkthrough/overview.svg "bpmn-js Architecture: Parts and Responsibilities")
[[잘안보이면 여기](https://bpmn.io/toolkit/bpmn-js/walkthrough/#bpmn-js-internals)]

<!-- We use [diagram-js](https://github.com/bpmn-io/diagram-js) to draw shapes and connections. It provides us with ways to interact with these graphical elements as well as additional tools such as overlays that help users to build powerful BPMN viewers. For advanced use cases such as modeling it contributes the context pad, palette and facilities like redo/undo. -->

[diagram-js](https://github.com/bpmn-io/diagram-js)를 사용하여 모양과 연결을 그립니다. 사용자가 강력한 BPMN 뷰어를 구축하는 데 도움이 되는 오버레이와 같은 추가 도구뿐만 아니라 이러한 그래픽 element와 상호 작용하는 방법을 제공합니다. 모델링과 같은 고급 사용 사례의 경우 컨텍스트 패드, 팔레트 및 다시 실행, 실행 취소와 같은 기능을 제공합니다.

<!-- bpmn-moddle knows about the BPMN 2.0 meta-model defined in the BPMN 2.0 standard. It allows us to read and write BPMN 2.0 schema-compliant XML documents and access BPMN-related information behind shapes and connections drawn on the diagram. -->

[bpmn-moddle](https://github.com/bpmn-io/bpmn-moddle)은 [BPMN 2.0 표준](http://www.omg.org/spec/BPMN/2.0/)에 정의 된 BPMN 2.0 메타 모델에 대해 알고 있습니다. 이를 통해 BPMN 2.0 스키마 호환 XML 문서를 읽고 쓸 수 있으며 다이어그램에 그려진 모양 및 연결 뒤에있는 BPMN 관련 정보에 액세스 할 수 있습니다.

<!-- On top of these two libraries, bpmn-js defines the BPMN specifics such as look and feel, modeling rules and tooling (i.e. palette). We will go into detail about the individual components in the following paragraphs. -->

이 두 라이브러리 위에 bpmn-js는 룩앤필, 모델링 규칙 및 도구 (예: 팔레트)와 같은 BPMN 세부 사항을 정의합니다. 다음 단락에서 개별 컴포넌트에 대해 자세히 설명합니다.

## Diagram Interaction / Modeling (diagram-js)

<!-- diagram-js is a toolbox for displaying and modifying diagrams on the web. It allows us to render visual elements and build interactive experiences on top of them. -->

[diagram-js](https://github.com/bpmn-io/diagram-js)는 웹에서 다이어그램을 표시하고 수정하기 위한 도구 상자입니다. 이를 통해 시각적 element를 렌더링하고 그 위에 인터랙티브 한 경험을 구축 할 수 있습니다.

<!-- It provides us with a very simple module system for building features and dependency injection for service discovery. This system also provides a number of core services that implement the diagram essentials. -->

기능을 구축하기 위한 매우 간단한 모듈 시스템과 서비스 검색을 위한 종속성 주입을 제공합니다. 이 시스템은 또한 다이어그램 필수 사항을 구현하는 여러 핵심 서비스를 제공합니다.

<!-- Additionally, diagram-js defines a data model for graphical elements and their relationships. -->

또한 diagram-js는 그래픽 element와 그 관계에 대한 데이터 모델을 정의합니다.

### Module System

<!-- Under the hood, diagram-js employs dependency injection (DI) to wire and discover diagram components. This mechanism is built on top of didi. -->

내부적으로 [diagram-js](https://github.com/bpmn-io/diagram-js)는 DI (종속성 주입)를 사용하여 다이어그램 컴포넌트를 연결하고 검색합니다. 이 메커니즘은 [didi](https://github.com/nikku/didi) 위에 구축되었습니다.

<!-- When talking about modules in the context of diagram-js, we refer to units that provide named services along with their implementation. A service in that sense is a function or instance that may consume other services to do stuff in the context of the diagram. -->

diagram-js의 context에서 *모듈*은, 그 구현과 함께 명명된 서비스를 제공하는 단위를 말합니다. 그런 의미에서 *서비스*는 다이어그램의 컨텍스트에서 작업을 수행하기 위해 다른 서비스를 사용할 수 있는 함수 또는 인스턴스입니다.

<!-- The following shows a service that hooks into life-cycle events. It does so by registering an event via the eventBus, another well-known service: -->

다음은 [수명주기(life-cycle) 이벤트](#Hook-into-Life-Cycle-Events)에 연결되는 서비스를 보여줍니다. 또 다른 잘 알려진 서비스인 eventBus를 통해 이벤트를 등록하면 됩니다:

```javascript
const MyLoggingPlugin = (eventBus) => {
  eventBus.on("element.changed", (event) => {
    console.log("element ", event.element, " changed");
  });
};
// ensure the dependency names are still available after minification
MyLoggingPlugin.$inject = ["eventBus"];
```

<!-- We must publish the service under a unique name using a module definition: -->

모듈 정의를 사용하여 고유 한 이름으로 서비스를 게시해야합니다.

```javascript
import CoreModule from "diagram-js/lib/core";

// export as module
export default {
  __depends__: [CoreModule], // {2}
  __init__: ["myLoggingPlugin"], // {3}
  myLoggingPlugin: ["type", MyLoggingPlugin] // {1}
};
```

<!-- The definition tells the DI infrastructure that the service is called myLoggingPlugin {1}, that it depends on the diagram-js core module {2} and that the service should be initialized upon diagram creation {3}. For more details have a look at the didi documentation. -->

위 정의는 DI 구조에 다음과 같은 사항을 알려줍니다.

- 서비스의 이름이 myLoggingPlugin 임을 알려줍니다. {1}
- 이 서비스는 diagram-js core module에 종속되어 있는 것을 알려줍니다. {2}
- 다이어그램 생성 시 초기화 해야 하는 것을 알려줍니다. {3}

자세한 내용은 [didi 문서](infrastructure)를 참조하십시오.

<!-- We may now bootstrap diagram-js, passing our custom module: -->

이제 diagram-js를 부트 스트랩하여 custom module을 전달:

```javascript
import MyLoggingModule from "path-to-my-logging-module";

const diagram = new Diagram({
  modules: [MyLoggingModule]
});
```

<!-- To plug in the module into bpmn-js, you would use the additionalModules option as shown in the Extend the Modeler section. -->

모듈을 [bpmn-js]()에 연결하려면 [Extend the Modeler section](#extend-the-modeler)에 표시된대로 `additionalModules` 옵션을 사용합니다.

### [Core Services](https://github.com/bpmn-io/diagram-js/tree/master/lib/core)

<!-- The diagram-js core is built around a number of essential services: -->

[diagram-js 코어](https://github.com/bpmn-io/diagram-js/tree/master/lib/core)는 여러 필수 서비스를 중심으로 구축:

<!-- * [Canvas](https://github.com/bpmn-io/diagram-js/blob/master/lib/core/Canvas.js) - provides APIs for adding and removing graphical elements; deals with element life cycle and provides APIs to zoom and scroll. -->

- [Canvas](https://github.com/bpmn-io/diagram-js/blob/master/lib/core/Canvas.js)-그래픽 element를 추가하고 제거하기 위한 API를 제공합니다. element 수명주기를 다루고 확대, 축소 및 스크롤 할 수있는 API를 제공합니다.

<!-- * EventBus - the library's global communication channel with a fire and forget policy. Interested parties can subscribe to various events and act upon them once they are emitted. The event bus helps us to decouple concerns and to modularize functionality so that new features can hook up easily with existing behavior. -->

- [EventBus](https://github.com/bpmn-io/diagram-js/blob/master/lib/core/EventBus.js) - 이 라이브러리는 [fire and forget](https://namu.wiki/w/Fire%20%26%20Forget) (이벤트 발생 후 잊어도 알아서 잘 처리)정책을 지원하는 글로벌 커뮤니케이션 채널이다. 이해 관계자는 다양한 이벤트를 구독하고 이벤트가 발생하면 조치를 취할 수 있습니다. 이벤트 버스는 새로운 기능이 기존 동작과 쉽게 연결될 수 있도록 관심 사항을 분리하고 기능을 모듈화하는 데 도움이됩니다.

<!-- * [ElementFactory](https://github.com/bpmn-io/diagram-js/blob/master/lib/core/ElementFactory.js) - a factory for creating shapes and connections according to diagram-js' internal data model. -->

- [ElementFactory](https://github.com/bpmn-io/diagram-js/blob/master/lib/core/ElementFactory.js) - diagram-js의 내부 데이터 모델에 따라 모양과 연결을 생성하는 팩토리입니다.

<!-- * [ElementRegistry](https://github.com/bpmn-io/diagram-js/blob/master/lib/core/ElementRegistry.js) - knows all elements added to the diagram and provides APIs to retrieve the elements and their graphical representation by id. -->

- [ElementRegistry](https://github.com/bpmn-io/diagram-js/blob/master/lib/core/ElementRegistry.js) - 다이어그램에 추가된 모든 element를 알고 있으며 ID로 element 및 그래픽 표현을 검색하는 API를 제공합니다.

<!-- * [GraphicsFactory](https://github.com/bpmn-io/diagram-js/blob/master/lib/core/GraphicsFactory.js) - responsible for creating graphical representations of shapes and connections. The actual look and feel is defined by renderers, i.e. the DefaultRenderer inside the draw module. -->

- [GraphicsFactory](https://github.com/bpmn-io/diagram-js/blob/master/lib/core/GraphicsFactory.js) - 모양과 연결의 그래픽 표현을 생성합니다. 실제 룩앤필은 렌더러, 즉 [draw 모듈](https://github.com/bpmn-io/diagram-js/tree/master/lib/draw) 내부의 [DefaultRenderer](https://github.com/bpmn-io/diagram-js/blob/master/lib/draw/DefaultRenderer.js)에 의해 정의됩니다.

### Data Model

<!-- Under the hood, diagram-js implements a simple data model consisting of shapes and connections. -->

내부적으로 diagram-js는 shape과 connection으로 구성된 간단한 데이터 모델을 구현합니다.

![screenshot](https://bpmn.io/assets/img/toolkit/bpmn-js/walkthrough/data-model.png "Data Model Essentials: Shapes and Connections")
diagram-js data model: shapes and connections

<!-- A shape has a parent, a list of children as well as a list of incoming and outgoing connections. -->

셰이프에는 parent, children 목록, incoming, outgoing 연결 목록이 있습니다.

<!-- A connection has a parent as well as a source and target, pointing to a shape. -->

연결에는 셰이프를 가리키는 parent와 source 및 target이 있습니다.

<!-- The ElementRegistry is responsible for creating shapes and connections according to that model. During modeling, element relationships will be updated according to user operations by the Modeling service. -->

[ElementRegistry](https://github.com/bpmn-io/diagram-js/blob/master/lib/core/ElementRegistry.js)는 [해당 모델](https://github.com/bpmn-io/diagram-js/blob/master/lib/model/index.js)에 따라 모양과 연결을 만드는 역할을합니다. 모델링 중에 element 관계는 모델링 서비스의 사용자 작업에 따라 업데이트됩니다.

### Auxiliary Services (i.e. the Toolbox)

<!-- Aside from the data model and its core services, diagram-js provides a rich toolbox of additional helpers. -->

데이터 모델 및 핵심 서비스 외에도 diagram-js는 추가 helper의 rich toolbox를 제공합니다.

<!-- - CommandStack - responsible for redo and undo during modeling. -->

- [CommandStack](https://github.com/bpmn-io/diagram-js/blob/master/lib/command/CommandStack.js) - 모델링 중 redo, undo를 담당
<!-- - ContextPad - provides contextual actions around an element. -->
- [ContextPad](https://github.com/bpmn-io/diagram-js/blob/master/lib/features/context-pad/ContextPad.js) - element에 대한 상황 별 action을 제공
<!-- - Overlays - provides APIs for attaching additional information to diagram elements. -->
- [Overlays](https://github.com/bpmn-io/diagram-js/blob/master/lib/features/overlays/Overlays.js) - 다이어그램 element에 추가 정보를 첨부하기위한 API를 제공
<!-- - Modeling - provides APIs for updating elements on the canvas (moving, deleting) -->
- [Modeling](https://github.com/bpmn-io/diagram-js/blob/master/lib/features/modeling/Modeling.js) - 캔버스에서 element 업데이트 (이동, 삭제)를 위한 API 제공
<!-- - Palette -->
- [Palette](https://github.com/bpmn-io/diagram-js/blob/master/lib/features/palette/Palette.js)
- ...

<!-- Let's move on to the BPMN magic that is happening behind the scenes. -->

이면에서 일어나고 있는 BPMN 마법에 대해 살펴 보겠습니다.

## BPMN Meta-Model (bpmn-moddle)

<!-- bpmn-moddle encapsulates the BPMN 2.0 meta-model and provides us with facilities to read and write BPMN 2.0 XML documents.  -->

[bpmn-moddle](https://github.com/bpmn-io/bpmn-moddle)은 BPMN 2.0 메타 모델을 캡슐화하고 BPMN 2.0 XML 문서를 읽고 쓸 수있는 기능을 제공합니다.

<!-- On import, it parses the XML document into a JavaScript object tree.  -->

import할 때 XML 문서를 JavaScript 개체 트리로 구문 분석합니다.

<!-- That tree is edited and validated during modeling and then exported back to BPMN 2.0 XML once the user wishes to save the diagram.  -->

이 트리는 모델링 중에 편집 및 유효성이 검증 된 다음 사용자가 다이어그램을 저장하기를 원하면 BPMN 2.0 XML로 다시 내 보냅니다.

<!-- Because bpmn-moddle encapsulates knowledge about BPMN, we are able to validate during import and modeling. -->

bpmn-moddle은 BPMN에 대한 모델정보를 캡슐화하므로 가져오기 및 모델링 중에 유효성을 검증 할 수 있습니다.

<!-- Based on the results, we can constrain certain modeling actions and output helpful error messages and warnings to the user. -->

결과에 따라 특정 모델링 작업을 제한하고 유용한 오류 메시지와 경고를 사용자에게 출력 할 수 있습니다.

<!-- Much like bpmn-js, the foundations of bpmn-moddle are built on top of two libraries: -->

[bpmn-js](https://github.com/bpmn-io/bpmn-js)와 매우 유사하게 [bpmn-moddle](https://github.com/bpmn-io/bpmn-moddle)의 기반은 두 개의 라이브러리 위에 구축됩니다.

<!-- - moddle which offers a concise way to define meta-models in JavaScript -->

- 자바 스크립트에서 [메타 모델](https://en.wikipedia.org/wiki/Metamodeling)을 정의하는 간결한 방법을 제공하는 [moddle](https://github.com/bpmn-io/moddle)
<!-- - moddle-xml which reads and writes XML documents based on moddle -->
- [moddle](https://github.com/bpmn-io/moddle) 기반으로 XML 문서를 읽고 쓰는 [moddle-xml](https://github.com/bpmn-io/moddle-xml)

<!-- In essence bpmn-moddle adds the BPMN spec as a meta-model and offers a simple interface for BPMN schema validation. From the library perspective it provides the following API: -->

본질적으로 [bpmn-moddle](https://github.com/bpmn-io/bpmn-moddle)은 BPMN 사양을 메타 모델로 추가하고 BPMN 스키마 유효성 검사를 위한 간단한 인터페이스를 제공합니다. 라이브러리 관점에서 다음 API를 제공합니다.

<!-- - [fromXML](https://github.com/bpmn-io/bpmn-moddle/blob/master/lib/bpmn-moddle.js#L38) - create a BPMN tree from a given XML string -->

- [fromXML](https://github.com/bpmn-io/bpmn-moddle/blob/master/lib/bpmn-moddle.js#L38) - 주어진 XML 문자열에서 BPMN 트리 생성
- toXML - write a BPMN object tree to BPMN 2.0 XML
- [toXML](https://github.com/bpmn-io/bpmn-moddle/blob/master/lib/bpmn-moddle.js#L65) - BPMN 2.0 XML에 BPMN 객체 트리 작성

<!-- The BPMN meta-model is essential for bpmn-js, as it allows us to validate BPMN 2.0 documents we consume, provide proper modeling rules and export valid BPMN documents that all compliant BPMN modelers can understand. -->

BPMN 메타 모델은 우리가 사용하는 BPMN 2.0 문서의 유효성을 검사하고 적절한 모델링 규칙을 제공하며 `모든` 호환 BPMN 모델러가 이해할 수있는 유효한 BPMN 문서를 내보낼 수 있도록 하므로 bpmn-js에 필수적입니다.

## Plugging Things Together (bpmn-js)

<!-- We learned bpmn-js is built on top of diagram-js and bpmn-moddle. It ties both together and adds the BPMN look and feel. This includes a BPMN palette, BPMN context pad as well as BPMN 2.0 specific rules. In this section, we'll be explaining how that works in different phases of modeling. -->

우리는 [bpmn-js](https://github.com/bpmn-io/bpmn-js)가 [diagram-js](https://github.com/bpmn-io/diagram-js) 및 [bpmn-moddle](https://github.com/bpmn-io/bpmn-moddle) 위에 빌드된다는 것을 배웠습니다. 두 가지를 함께 연결하고 BPMN 룩앤필을 추가합니다. 여기에는 BPMN 팔레트, BPMN 컨텍스트 패드 및 BPMN 2.0 특정 규칙이 포함됩니다. 이 섹션에서는 모델링의 여러 단계에서 어떻게 작동하는지 설명합니다.

<!-- When we import a BPMN 2.0 document, it is parsed from XML into an object tree by bpmn-moddle. bpmn-js renders all visible elements of that tree, i.e. it creates the respective shapes and connections on the canvas. Thereby it ties both the BPMN elements and the graphical elements together. This results in a structure, as shown below, for a start event shape. -->

BPMN 2.0 문서를 가져올 때 [bpmn-moddle](https://github.com/bpmn-io/bpmn-moddle)에 의해 XML에서 객체 트리로 구문 분석됩니다. bpmn-js는 해당 트리의 모든 보이는 element를 렌더링합니다. 즉, 캔버스에 각각의 shape와 connection을 만듭니다. 따라서 BPMN element와 그래픽 element를 함께 묶습니다. 그러면 아래와 같이 시작 이벤트 형태에 대한 구조가 생성됩니다.

```json
{
  id: 'StartEvent_1',
  x: 100,
  y: 100,
  width: 50,
  height: 50,
  businessObject: {
    $attrs: Object
    $parent: {
      $attrs: Object
      $parent: ModdleElement
      $type: 'bpmn:Process'
      flowElements: Array[1]
      id: 'Process_1'
      isExecutable: false
    }
    $type: 'bpmn:StartEvent'
    id: 'StartEvent_1'
  }
}
```

<!-- You may access the underlying BPMN type from each graphical element via the businessObject property. -->

businessObject property를 통해 각 그래픽 element에서 기본 BPMN 유형에 액세스 할 수 있습니다.

<!-- bpmn-js also knows how each BPMN element looks like thanks to the BpmnRenderer. By plugging into the render cycle, you may also define custom representations of individual BPMN elements. -->

[bpmn-js](https://github.com/bpmn-io/bpmn-js)는 또한 [BpmnRenderer](https://github.com/bpmn-io/bpmn-js/blob/master/lib/draw/BpmnRenderer.js) 덕분에 각 BPMN element가 어떻게 보이는지 알고 있습니다. render cycle에 연결(plugging)하여 개별 BPMN element의 커스텀 표현을 정의할 수도 있습니다.

<!-- We can start modeling once the importing is done. We use rules to allow or disallow certain modeling operations. These rules are defined by BpmnRules. We base these rules on the BPMN 2.0 standard as defined by the OMG. However as mentioned earlier, others may also hook up with the rule evaluation to contribute different behavior. -->

임포팅이 완료되면 모델링을 시작할 수 있습니다. 특정 모델링 작업을 허용하거나 금지하는 규칙을 사용합니다. 이러한 규칙은 [BpmnRules](https://github.com/bpmn-io/bpmn-js/blob/master/lib/features/rules/BpmnRules.js)에 의해 정의됩니다. 이러한 규칙은 [OMG](http://www.omg.org/)에서 정의한 BPMN 2.0 표준을 기반으로 합니다. 그러나 앞서 언급했듯이 다른 사람들도 규칙 평가에 연결하여 다른 동작을 제공 할 수 있습니다.

<!-- The modeling module bundles BPMN 2.0 related modeling functionality. It adds BPMN 2.0 specific modeling behaviors and is responsible for updating the BPMN 2.0 document tree with every modeling operation carried out by the user (cf. BpmnUpdater). Check it out to get a deeper insight into rules, behaviors and the BPMN update cycle. -->

[모델링 모듈](https://github.com/bpmn-io/bpmn-js/tree/master/lib/features/modeling)은 BPMN 2.0 관련 모델링 기능을 번들로 제공합니다. BPMN 2.0 특정 모델링 동작을 추가하고 사용자가 수행하는 모든 모델링 작업으로 BPMN 2.0 문서 트리를 업데이트합니다 ([BpmnUpdater](https://github.com/bpmn-io/bpmn-js/blob/master/lib/features/modeling/BpmnUpdater.js) 참조). 규칙, 동작 및 BPMN 업데이트 주기에 대한 더 깊은 통찰력을 얻으려면 여기를 확인하십시오.

<!-- When looking at bpmn-js purely from the library perspective, it's worth mentioning it can be used in three variants: -->

순수하게 라이브러리 관점에서 bpmn-js를 살펴볼 때 세 가지 변형으로 사용할 수 있다는 점을 언급 할 가치가 있습니다.

<!-- - Viewer to display diagrams -->

- 다이어그램을 표시하는 [뷰어](https://github.com/bpmn-io/bpmn-js/blob/master/lib/Viewer.js)
<!-- - NavigatedViewer to display and navigate BPMN diagrams -->
- BPMN 다이어그램을 표시하고 탐색하는 [NavigatedViewer](https://github.com/bpmn-io/bpmn-js/blob/master/lib/NavigatedViewer.js)
<!-- - Modeler to model BPMN diagrams -->
- BPMN 다이어그램을 모델링하는 [Modeler](https://github.com/bpmn-io/bpmn-js/blob/master/lib/Modeler.js)

<!-- The only difference between the versions is that they bundle a different set of functionality. The NavigatedViewer adds modules for navigating the canvas and the Modeler adds a whole lot of functionality for creating, editing and interacting with elements on the canvas. -->

버전 간의 유일한 차이점은 다른 기능 세트를 번들로 제공한다는 것입니다. [NavigatedViewer](https://github.com/bpmn-io/bpmn-js/blob/master/lib/NavigatedViewer.js)는 캔버스를 탐색하기 위한 모듈을 추가하고 Modeler는 캔버스에서 element를 생성, 편집 및 상호 작용하기위한 많은 기능을 추가합니다.

# Going Further

<!-- In the first part of this walkthrough, we focused on using bpmn-js as a BPMN viewer as well as a modeler. This should have given you a good understanding of the toolkit from the library perspective. -->

이 연습의 첫 번째 부분에서는 bpmn-js를 BPMN 뷰어 및 모델러로 사용하는 데 중점을 두었습니다. 이것은 라이브러리 관점에서 툴킷에 대한 좋은 이해를 제공했을 것입니다.

<!-- In the second part, we focused on bpmn-js internals. We presented diagram-js as well as bpmn-moddle, the two foundations bpmn-js is built upon and gave you an overview of how bpmn-js plugs all of these together. -->

두 번째 부분에서는 bpmn-js 내부에 집중했습니다. 우리는 diagram-js와 bpmn-moddle을 제시했습니다. bpmn-js의 두 가지 기반은 bpmn-js가이 모든 것을 하나로 연결하는 방법에 대한 개요를 제공했습니다.

<!-- There exists a number of additional resources that allow you to progress further: -->

더 발전할 수 있는 여러 가지 추가 리소스가 있습니다.

<!-- - Examples - numerous examples that showcase how to embed and extend bpmn-js. -->

- [예제](https://github.com/bpmn-io/bpmn-js-examples) - bpmn-js를 삽입하고 확장하는 방법을 보여주는 수많은 예.
<!-- - 소스코드 ([bpmn-js](), [diagram-js()]) - mostly well documented; should give you great insights into the library's internals. -->
- Source Code ([bpmn-js](https://github.com/bpmn-io/bpmn-js), [diagram-js](https://github.com/bpmn-io/diagram-js)) - 대부분 잘 문서화되었습니다. 도서관 내부에 대한 훌륭한 통찰력을 제공해야합니다.
<!-- - Forum - a good place to get help for using and extending bpmn-js. -->
- [Forum](https://forum.bpmn.io/c/developers) - bpmn-js 사용 및 확장에 대한 도움을 받을 수있는 좋은 장소입니다.

<!-- Was there anything that we could have explained better / you got stuck with? Propose an improvement to this document or tell us about it in our forums. -->

우리가 더 잘 설명 할 수있는 것이 있었습니까? 이 문서에 대한 [개선을 제안](https://github.com/bpmn-io/bpmn.io/edit/master/src/pages/toolkit/bpmn-js/walkthrough/walkthrough.md)하거나 [포럼](https://forum.bpmn.io/)에서 이에 대해 알려주십시오.
