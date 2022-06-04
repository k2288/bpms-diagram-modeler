# Custom Elements in bpmn-js

<!-- A powerful feature provided by [bpmn-js](https://github.com/bpmn-io/bpmn-js) is the ability to create _custom elements_. Custom elements are ordinary BPMN 2.0 elements with domain-specific data, look, and feel. Use cases for such elements include: -->

[bpmn-js](https://github.com/bpmn-io/bpmn-js)가 제공하는 강력한 기능은 _custom elements_ 를 만드는 기능입니다. custom element는 도메인 특화 데이터과 룩앤필이 있는 일반 BPMN 2.0 element입니다. 이러한 element의 사용 사례는 다음과 같습니다 :

<!-- * show certain elements in a distinct way
* restrict rules where a user can place elements on the diagram
* add data related to performance analytics such as KPI targets
* display hidden details directly on the diagram
* attach technical information related to model execution -->

- 특정 element를 별개의 방식으로 표시
- 사용자가 다이어그램에 element를 배치 할 수 있는 규칙 제한
- KPI 목표와 같은 성과 분석과 관련된 데이터 추가
- 숨겨진 세부 정보를 다이어그램에 직접 표시
- 모델 실행과 관련된 기술 정보 첨부

<!-- :warning: If your data has a different life-cycle (for example runtime data) or is stored outside the BPMN 2.0 diagram you should consider alternative extension mechanisms such as [:notebook: overlays](https://github.com/bpmn-io/bpmn-js-examples/tree/master/overlays). -->

:경고: 데이터의 수명주기가 다르거나 (예 : 런타임 데이터) BPMN 2.0 다이어그램 외부에 저장된 경우 [:notebook: overlays](https://github.com/bpmn-io/bpmn-js-examples/tree/master/overlays)와 같은 대체 확장 메커니즘을 고려해야 합니다.

## Implementation Techniques

<!-- This page features a number of key techniques to build custom elements: -->

이 페이지에서는 custom element를 구축하기 위한 여러 주요 기술을 제공합니다:

<!-- * [Read custom data from a BPMN 2.0 file](#read-bpmn-20-extensions)
* [Render certain elements differently](#customize-rendering)
* [Create custom editor controls](#customize-editor-controls)

Additional topics, not directly featured here include:

* [Define custom modeling rules](../custom-modeling-rules)
* [Create a properties panel for custom data editing](https://github.com/bpmn-io/bpmn-js-example-react-properties-panel) -->

- [BPMN 2.0 파일에서 custom 데이터 읽기](#read-bpmn-20-extensions)
- [특정 element를 다르게 렌더링](#customize-rendering)
- [custom 편집기 컨트롤 만들기](#customize-editor-controls)

여기에 직접 소개되지 않은 추가 주제는 다음과 같습니다.

- [custom 모델링 규칙 정의](../custom-modeling-rules)
- [custom 데이터 편집을 위한 속성 패널 만들기](https://github.com/bpmn-io/bpmn-js-example-react-properties-panel)

## Read BPMN 2.0 Extensions

<!-- You can use the BPMN 2.0 extension mechanism to add extension attributes and elements in a BPMN 2.0 compatible way. -->

BPMN 2.0 확장 메커니즘을 사용하여 BPMN 2.0 호환 방식으로 확장 attribute 및 element를 추가 할 수 있습니다.

<!-- You can find an example of this approach in our [model extension example](https://github.com/bpmn-io/bpmn-js-example-model-extension). It creates a model extension that allows you to read, modify and write BPMN 2.0 diagrams that contain extension attributes and elements. -->

[model extension example](https://github.com/bpmn-io/bpmn-js-example-model-extension)에서 이 접근 방식의 예제를 찾을 수 있습니다. 확장 속성 및 element를 포함하는 BPMN 2.0 다이어그램을 읽고 수정하고 작성할 수있는 모델 확장을 작성합니다.

![Screenshot model extension](https://github.com/bpmn-io/bpmn-js-examples/blob/master/custom-elements/docs/screenshot-model-extension.png?raw=true)

## Customize Rendering

<!-- If you want to draw certain BPMN 2.0 elements differently, you can create a custom renderer. Usually, you would want to do this to be able to distinct custom elements from other elements. -->

특정 BPMN 2.0 element를 다르게 그리려면 custom 렌더러를 만들 수 있습니다. 일반적으로 custom element를 다른 element와 구별 할 수 있도록 이 작업을 수행 할 수 있습니다.

<!-- There is an example in our [custom rendering example](https://github.com/bpmn-io/bpmn-js-example-custom-rendering). It renders `bpmn:Task` and `bpmn:Event` elements differently. -->

[custom rendering example](https://github.com/bpmn-io/bpmn-js-example-custom-rendering)에 예제가 있습니다. `bpmn:Task` 및 `bpmn:Event` element를 다르게 렌더링합니다.

![Screenshot custom rendering](https://github.com/bpmn-io/bpmn-js-examples/blob/master/custom-elements/docs/screenshot-custom-rendering.png?raw=true)

## Customize Editor Controls

<!-- You can add custom controls so that users can create custom elements through palette and context pad. -->

사용자가 팔레트 및 컨텍스트 패드를 통해 custom element를 만들 수 있도록 custom 컨트롤을 추가 할 수 있습니다.

<!-- You can find an example in our [custom controls example](https://github.com/bpmn-io/bpmn-js-example-custom-controls). It adds controls that allow you to create `bpmn:ServiceTask` elements through both, the palette and the context pad. -->

[custom controls example](https://github.com/bpmn-io/bpmn-js-example-custom-controls)에서 예제를 찾을 수 있습니다. 팔레트와 컨텍스트 패드를 통해 `bpmn:ServiceTask` element를 만들 수 있는 컨트롤을 추가합니다.

![Screenshot custom editor controls](https://github.com/bpmn-io/bpmn-js-examples/blob/master/custom-elements/docs/screenshot-custom-editor-controls.png?raw=true)

## Custom Elements, Complete Demo

<!-- The [custom elements example](https://github.com/bpmn-io/bpmn-js-example-custom-elements) combines all the techniques showcased in the previous sections. It creates a model extension, custom rendering, and custom controls. -->

[custom elements example](https://github.com/bpmn-io/bpmn-js-example-custom-elements)는 이전 섹션에서 소개 한 모든 기술을 결합 합니다. 모델 확장, custom 렌더링 및 custom 컨트롤을 만듭니다.

![Screenshot custom elements](https://github.com/bpmn-io/bpmn-js-examples/raw/master/custom-elements/docs/screenshot-custom-elements.png)

## There Is More

<!-- Of course, you can go even further. Have a look at the following examples: -->

물론 더 멀리 갈 수 있습니다. 다음 예를 살펴보십시오:

<!-- * [Custom rules](https://github.com/bpmn-io/bpmn-js-examples/tree/master/custom-modeling-rules) - Customize diagram modeling rules.
* [Custom properties panel](https://github.com/bpmn-io/bpmn-js-example-react-properties-panel) - Create a properties panel to allow editing of custom data
* [bpmn-js-properties-panel extension](https://github.com/bpmn-io/bpmn-js-examples/tree/master/properties-panel-extension) - Extend our [properties panel](https://github.com/bpmn-io/bpmn-js-properties-panel) to edit custom element properties.
* [Custom shapes](https://github.com/bpmn-io/bpmn-js-example-custom-shapes) - Add any shape to a BPMN 2.0 diagram. -->

- [Custom rules](https://github.com/bpmn-io/bpmn-js-examples/tree/master/custom-modeling-rules) - 다이어그램 모델링 규칙을 custom합니다.
- [Custom properties panel](https://github.com/bpmn-io/bpmn-js-example-react-properties-panel) - custom 데이터를 편집 할 수있는 속성 패널을 만듭니다.
- [bpmn-js-properties-panel extension](https://github.com/bpmn-io/bpmn-js-examples/tree/master/properties-panel-extension) - 속성 패널을 확장하여 custom element 속성을 편집합니다.
- [Custom shapes](https://github.com/bpmn-io/bpmn-js-example-custom-shapes) - BPMN 2.0 다이어그램에 모든 모양을 추가합니다.

## License

MIT
