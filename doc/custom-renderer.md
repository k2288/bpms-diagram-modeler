<!-- > > This example is part of our [:notebook: custom elements guide](https://github.com/bpmn-io/bpmn-js-examples/tree/master/custom-elements). Checkout the final result [here](https://github.com/bpmn-io/bpmn-js-example-custom-elements). -->

> 이 예제는 [:notebook: custom elements guide](https://github.com/bpmn-io/bpmn-js-examples/tree/master/custom-elements)의 일부입니다. [여기](https://github.com/bpmn-io/bpmn-js-example-custom-elements)에서 최종 결과를 확인하세요.

# bpmn-js Example: Custom Rendering

<!-- An example of creating custom rendering for [bpmn-js](https://github.com/bpmn-io/bpmn-js). Custom rendering allows you to render any shape or connection the way you want. -->

[bpmn-js](https://github.com/bpmn-io/bpmn-js)에 대한 커스텀 렌더링을 만드는 예입니다. 커스텀 렌더링을 사용하면 원하는 방식으로 모양이나 연결을 렌더링 할 수 있습니다.

## About

This example renders `bpmn:Task` and `bpmn:Event` elements differently.

이 예제는 `bpmn:Task` 및 `bpmn:Event` element를 다르게 렌더링합니다.

![Screenshot](https://github.com/bpmn-io/bpmn-js-example-custom-rendering/blob/master/docs/screenshot.png?raw=true)

### Creating a Custom Renderer

<!-- In order to render `bpmn:Task` and `bpmn:Event` elements differently we'll create a custom renderer. By extending [BaseRenderer](https://github.com/bpmn-io/diagram-js/blob/master/lib/draw/BaseRenderer.js) we make sure our renderer will be called whenever a shape or connection is to be rendered. Note that we also specify a priority higher than the default priority of 1000 so our renderer will be called first. -->

`bpmn:Task` 및 `bpmn:Event` element를 다르게 렌더링하기 위해 커스텀 렌더러를 만듭니다. [BaseRenderer](https://github.com/bpmn-io/diagram-js/blob/master/lib/draw/BaseRenderer.js)를 확장하여 모양이나 연결이 렌더링 될 때마다 렌더러가 호출되도록 합니다. 또한 렌더러가 먼저 호출되도록 기본 우선 순위 1000보다 높은 우선 순위를 지정합니다.

```javascript
const HIGH_PRIORITY = 1500;

export default class CustomRenderer extends BaseRenderer {
  constructor(eventBus) {
    super(eventBus, HIGH_PRIORITY);

    ...
  }
  ...
}
```

<!-- Whenever our renderer is called we need to decide whether we want to render an element or if the [default renderer](https://github.com/bpmn-io/bpmn-js/blob/master/lib/draw/BpmnRenderer.js) should render it. We're only interested in rendering `bpmn:Task` and `bpmn:Event` elements: -->

렌더러가 호출 될 때마다 렌더링 되길 원하는 element를 렌더링할 지 아니면 [default renderer](https://github.com/bpmn-io/bpmn-js/blob/master/lib/draw/BpmnRenderer.js)를 렌더링해야 할지 결정이 필요합니다. 여기서는 `bpmn:Task`과 `bpmn:Event` element만 렌더링 하겠습니다.

```javascript
canRender(element) {

  // only render tasks and events (ignore labels)
  return isAny(element, [ 'bpmn:Task', 'bpmn:Event' ]) && !element.labelTarget;
}
```

<!-- Once we've decided to render an element depending on the element's type our renderers `drawShape` or `drawConnection` will be called. Since we only render shapes, we don't need to implement `drawConnection`. We don't want to render tasks and events entirely different, so we'll let the default renderer do the heavy lifting of rendering the shape and then change it afterward: -->

`canRender`로 element를 렌더링하기로 결정하면 렌더러 `drawShape` 또는 `drawConnection`이 호출됩니다.
shape만 렌더링하므로 `drawConnection`을 구현할 필요가 없습니다.
task과 이벤트를 완전히 다르게 렌더링하고 싶지 않기 때문에 default 렌더러가 모양을 렌더링하는 무거운 task을 수행한 다음 나중에 변경하도록 할 것입니다:

```javascript
drawShape(parentNode, element) {
    const shape = this.bpmnRenderer.drawShape(parentNode, element);

    if (is(element, 'bpmn:Task')) {
      const rect = drawRect(parentNode, 100, 80, TASK_BORDER_RADIUS, '#52B415');

      prependTo(rect, parentNode);

      svgRemove(shape);

      return shape;
    }

    const rect = drawRect(parentNode, 30, 20, TASK_BORDER_RADIUS, '#cc0000');

    svgAttr(rect, {
      transform: 'translate(-20, -10)'
    });

    return shape;
  }
```

<!-- If the element is a `bpmn:Task` we render the task first and then replace its rectangle with our own rectangle. Therefore, we don't have to render labels and markers ourselves. -->

element가`bpmn:Task`이면 먼저 task을 렌더링한 다음 사각형을 원하는 모양의 사각형으로 바꿉니다. 따라서 레이블과 마커를 직접 렌더링 할 필요가 없습니다.

<!-- In the case of `bpmn:Event` elements we let the default renderer render the element first before we render an additional rectangle on top of it. -->

`bpmn:Event` element의 경우 default 렌더러에서 먼저 element를 렌더링한 후 그 위에 추가 사각형을 렌더링합니다.

<!-- You can also decide to take care of the rendering entirely on your own without using the default renderer at all. -->

또한 default 렌더러를 전혀 사용하지 않고 직접 렌더링을 처리 할 수도 있습니다.

<!-- Finally, since we are rendering shapes we need to implement a `getShapePath` method which will be called whenever a connection is to be cropped: -->

마지막으로, shape를 렌더링하고 있으므로 연결이 잘릴 때마다 호출되는`getShapePath` 메서드를 구현해야 합니다.

```javascript
getShapePath(shape) {
  if (is(shape, 'bpmn:Task')) {
    return getRoundRectPath(shape, TASK_BORDER_RADIUS);
  }

  return this.bpmnRenderer.getShapePath(shape);
}
```

<!-- See the entire renderer [here](app/custom/CustomRenderer.js). -->

[여기](app/custom/CustomRenderer.js)에서 전체 렌더러를 확인하세요.

<!-- Next, let's add our custom renderer to bpmn-js. -->

다음으로 custom 렌더러를 bpmn-js에 추가해 보겠습니다.

### Adding the Custom Renderer to bpmn-js

<!-- When creating a new instance of bpmn-js we need to add our custom renderer using the `additionalModules` property: -->

bpmn-js의 새 인스턴스를 만들 때 `additionalModules` 속성을 사용하여 커스텀 렌더러를 추가해야합니다:

```javascript
import BpmnModeler from "bpmn-js/lib/Modeler";

import customRendererModule from "./custom";

const bpmnModeler = new BpmnModeler({
  additionalModules: [customRendererModule]
});
```

<!-- Our custom renderer will now render all task and event shapes. -->

커스텀 렌더러는 이제 모든 task 및 이벤트 모양을 렌더링합니다.

## Run the Example

<!-- You need a [NodeJS](http://nodejs.org) development stack with [npm](https://npmjs.org) installed to build the project. -->

프로젝트를 빌드하려면 [npm](https://npmjs.org)이 설치된 [NodeJS](http://nodejs.org) 개발 스택이 필요합니다.

<!-- To install all project dependencies execute -->

모든 프로젝트 종속성을 설치하려면

```sh
npm install
```

<!-- To start the example execute -->

예제를 실행 하려면

```sh
npm start
```

<!-- To build the example into the `public` folder execute -->

예제를 `pubic` 폴더에 빌드 하려면

```sh
npm run all
```

## License

MIT
