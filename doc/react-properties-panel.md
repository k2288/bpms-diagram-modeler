# React Properties Panel for bpmn-js

<!-- This example demonstrates a custom properties panel for [bpmn-js](https://github.com/bpmn-io/bpmn-js) written in [React](https://reactjs.org/). -->

이 예제는 [React](https://reactjs.org/)로 작성된 [bpmn-js](https://github.com/bpmn-io/bpmn-js)에 대한 사용자 정의 속성 패널을 보여줍니다.

![Demo Screenshot](https://github.com/bpmn-io/bpmn-js-example-react-properties-panel/blob/master/resources/screenshot.png?raw=true)

## About

<!-- The component [`PropertiesView`](https://github.com/bpmn-io/bpmn-js-example-react-properties-panel/blob/master/app/properties-panel/PropertiesView.js) implements the properties panel.  -->

구성 요소 [`PropertiesView`](https://github.com/bpmn-io/bpmn-js-example-react-properties-panel/blob/master/app/properties-panel/PropertiesView.js)는 프로퍼티 패널을 구현합니다.

<!-- The component is mounted via standard React utilities and receives the BPMN modeler instance as props: -->

컴포넌트는 표준 React 유틸리티를 통해 마운트되며 BPMN 모델러 인스턴스를 props로받습니다:

```js
ReactDOM.render(<PropertiesView modeler={modeler} />, container);
```

<!-- As part of its life-cycle hooks it hooks up with bpmn-js change and selection events to react to editor changes: -->

life-cycle hook의 일부로 bpmn-js 변경 및 선택 이벤트와 React에 연결하여 편집기 변경에 반응합니다:

```js
class PropertiesView extends React.Component {

  ...

  componentDidMount() {

    const {
       modeler
    } = this.props;

    modeler.on('selection.changed', (e) => {
      this.setElement(e.newSelection[0]);
    });

    modeler.on('element.changed', (e) => {
      this.setElement(e.element);
    });
  }

}
```

<!-- Rendering the component we may display element properties and apply changes: -->

element property를 렌더링하면 요소 속성을 표시하고 변경 사항을 적용 할 수 있습니다:

```js
class PropertiesView extends React.Component {

  ...

  render() {

    const {
      element
    } = this.state;

    return (
      <div>
        <fieldset>
          <label>id</label>
          <span>{ element.id }</span>
        </fieldset>

        <fieldset>
          <label>name</label>
          <input value={ element.businessObject.name || '' } onChange={ (event) => {
            this.updateName(event.target.value);
          } } />
        </fieldset>
      </div>
    );
  }

  updateName(newName) {

    const {
      element
    } = this.state;

    const {
      modeler
    } = this.props;

    const modeling = modeler.get('modeling');

    modeling.updateLabel(element, newName);
  }
}
```

## Run the Example

```sh
npm install
npm start
```

## License

MIT
