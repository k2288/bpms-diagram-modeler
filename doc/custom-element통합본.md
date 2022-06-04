<!-- > This example combines all aspects of our [:notebook: custom elements guide](https://github.com/bpmn-io/bpmn-js-examples/tree/master/custom-elements). -->

이 예제는 [:notebook: custom elements guide](https://github.com/bpmn-io/bpmn-js-examples/tree/master/custom-elements)의 모든 관점(aspect)을 결합 합니다. --> 예제 다 합침

# Custom Elements in bpmn-js

<!-- An example of how to support custom elements in [bpmn-js](https://github.com/bpmn-io/bpmn-js) while ensuring  -->

BPMN 2.0 호환성을 보장하면서 [bpmn-js](https://github.com/bpmn-io/bpmn-js)에서 사용자 정의 요소를 지원하는 방법의 예입니다.

![Screenshot](https://github.com/bpmn-io/bpmn-js-example-custom-elements/blob/master/docs/screenshot.png?raw=true)

## About

<!-- This example creates a BPMN editor that is aware of some QA related meta-data.  -->

이 예에서는 일부 QA 관련 메타 데이터를 인식하는 BPMN 편집기를 만듭니다.

<!-- By doing so, it combines all prior examples published in our [:notebook: custom elements guide](https://github.com/bpmn-io/bpmn-js-examples/tree/master/custom-elements): -->

[:notebook: custom elements guide](https://github.com/bpmn-io/bpmn-js-examples/tree/master/custom-elements)의 모든 예제 결합 :

<!-- * Model and read data custom elements via a [model extension](https://github.com/bpmn-io/bpmn-js-example-model-extension) -->

- [model extension](https://github.com/bpmn-io/bpmn-js-example-model-extension)을 통해 데이터 custom element 모델링 및 읽기
<!-- * Render custom elements with a [custom shape](https://github.com/bpmn-io/bpmn-js-example-custom-rendering) -->
- [custom shape](https://github.com/bpmn-io/bpmn-js-example-custom-rendering)으로 custom element 렌더링
<!-- * Add [editor controls](https://github.com/bpmn-io/bpmn-js-example-custom-controls) that allow custom elements to be created -->
- custom element를 만들 수있는[editor controls](https://github.com/bpmn-io/bpmn-js-example-custom-controls) 추가

<!-- Read about the details in the following sections: -->

다음의 섹션의 세부사항 참조 :

- [Creating a model extension](#creating-a-model-extension)
- [Creating custom rendering](#creating-custom-rendering)
- [Creating custom editor controls](#creating-custom-editor-controls)

## Creating a Model Extension

<!-- Using a model extension we can read, modify and write BPMN 2.0 diagrams that contain `qa:suitable` extension attributes and `qa:analysisDetails` extension elements. You can set the suitability score of each element. -->

모델 확장으로 `qa:suitable` 확장 attribute 및 `qa:analysisDetails` 확장 element를 포함하는 BPMN 2.0 다이어그램을 read, modify, write할 수 있습니다. 각 element의 적합성 점수(suitability score)를 설정할 수 있습니다.

<!-- The XML of such an element looks something like this: -->

각 element의 XML :

```xml
<bpmn2:task id="Task_1" name="Examine Situation" qa:suitable="70">
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
```

<!-- For more information on creating model extensions head over to the [model extension example](https://github.com/bpmn-io/bpmn-js-example-model-extension). -->

모델 확장의 자세한 내용은 [model extension example](https://github.com/bpmn-io/bpmn-js-example-model-extension) 참조

## Creating Custom Rendering

<!-- Using a custom renderer we can display our custom elements along with their suitability score: -->

custom 랜더러로 적합성 점수와 같이 custom element를 표시:

```javascript
drawShape(parentNode, element) {
  const shape = this.bpmnRenderer.drawShape(parentNode, element);

  const suitabilityScore = this.getSuitabilityScore(element);

  if (!isNil(suitabilityScore)) {
    const color = this.getColor(suitabilityScore);

    const rect = drawRect(parentNode, 50, 20, TASK_BORDER_RADIUS, color);

    svgAttr(rect, {
      transform: 'translate(-20, -10)'
    });

    var text = svgCreate('text');

    svgAttr(text, {
      fill: '#fff',
      transform: 'translate(-15, 5)'
    });

    svgClasses(text).add('djs-label');

    svgAppend(text, document.createTextNode(suitabilityScore));

    svgAppend(parentNode, text);
  }

  return shape;
}
```

<!-- For more information on custom renderers head over to the [custom rendering example](https://github.com/bpmn-io/bpmn-js-example-custom-rendering). -->

커스텀 렌더러의 자세한 정보는 [custom rendering example](https://github.com/bpmn-io/bpmn-js-example-custom-rendering)참조

## Creating Custom Editor Controls

<!-- By adding custom controls to the palette and context pad our users can create extended `bpmn:ServiceTask` in a streamlined fashion. -->

custom 컨트롤을 팔레트와 컨텍스트 패드에 추가하여 간소화된 방식으로 확장된 `bpmn:ServiceTask` 만들 수 있습니다.

#### Palette

<!-- First, let's add the ability to create elements with different suitability scores through the palette: -->

먼저 팔레트로 다른 적합성 점수를 가진 element를 생성하는 기능 추가 (팔래트 내에 적합성 점수에 따라 색깔이 다른 3개의 element 추가):

```javascript
'create.low-task': {
  group: 'activity',
  className: 'bpmn-icon-task red',
  title: translate('Create Task with low suitability score'),
  action: {
    dragstart: createTask(SUITABILITY_SCORE_LOW),
    click: createTask(SUITABILITY_SCORE_LOW)
  }
},
'create.average-task': {
  group: 'activity',
  className: 'bpmn-icon-task yellow',
  title: translate('Create Task with average suitability score'),
  action: {
    dragstart: createTask(SUITABILITY_SCORE_AVERGE),
    click: createTask(SUITABILITY_SCORE_AVERGE)
  }
},
'create.high-task': {
  group: 'activity',
  className: 'bpmn-icon-task green',
  title: translate('Create Task with high suitability score'),
  action: {
    dragstart: createTask(SUITABILITY_SCORE_HIGH),
    click: createTask(SUITABILITY_SCORE_HIGH)
  }
}
```

<!-- See the entire palette [here](app/custom/CustomPalette.js). -->

[전체 팔레트 보기](https://github.com/bpmn-io/bpmn-js-example-custom-elements/blob/master/app/custom/CustomContextPad.js),
[bpmn.js의 팔레트 보기](https://github.com/bpmn-io/bpmn-js/blob/develop/lib/features/context-pad/ContextPadProvider.js)

#### Context Pad

<!-- The [context pad](./app/emoji/EmojiContextPadProvider.js) contains an additional entry, too: -->

[context pad](https://github.com/bpmn-io/bpmn-js-example-custom-elements/blob/master/app/emoji/EmojiContextPadProvider.js)에 추가항목도 포함(github 자원에 없음)

```javascript
'append.append-emoji-task': {
  group: 'model',
  className: 'icon-emoji',
  title: translate('Append Emoji Task'),
  action: {
    dragstart: appendEmojiTaskStart,
    click: appendEmojiTask
  }
},
```

<!-- See the entire context pad [here](app/custom/CustomContextPad.js). -->

[전체 context pad 보기](https://github.com/bpmn-io/bpmn-js-example-custom-elements/blob/master/app/custom/CustomContextPad.js)

<!-- For more information on creating custom editor controls head over to the [custom controls example](https://github.com/bpmn-io/bpmn-js-example-custom-controls). -->

커스텀 에디터 컨트롤의 자세한 정보는
[custom controls example](https://github.com/bpmn-io/bpmn-js-example-custom-controls) 참조

## Run the Example

<!-- You need a [NodeJS](http://nodejs.org) development stack with [npm](https://npmjs.org) installed to build the project. -->

프로젝트를 빌드하려면 [npm](https://npmjs.org)이 설치된 [NodeJS](http://nodejs.org) 개발 스택이 필요합니다.

<!-- To install all project dependencies execute -->

모든 프로젝트 종속성을 설치 하려면

```sh
npm install
```

<!-- To start the example execute -->

예제 시작 하려면

```sh
npm start
```

<!-- To build the example into the `public` folder execute -->

`public` 폴더에 빌드 하려면

```sh
npm run all
```

## License

MIT
