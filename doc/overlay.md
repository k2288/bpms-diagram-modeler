# bpmn-js overlays example

이 예제는 [bpmn-js](https://github.com/bpmn-io/bpmn-js)의 [overlays API](https://github.com/bpmn-io/diagram-js/blob/master/lib/features/overlays/Overlays.js)를 사용하여 HTML 오버레이를 BPMN 2.0 다이어그램에 attach하는 방법을 보여줍니다.

## About

이 예제에서는 QR 코드 처리 방법에 대한 프로세스 다이어그램을 로드하고 [`overlays`](https://github.com/bpmn-io/diagram-js/blob/master/lib/features/overlays/Overlays.js) 서비스를 사용하여 메모를 첨부합니다.

![QR-CODE workflow process](https://github.com/bpmn-io/bpmn-js-examples/raw/master/overlays/docs/qr-code.gif "Screencast of overlays in action.")

## Usage summary

`bpmnViewer.get('overlays')`를 통해 [`overlays`](https://github.com/bpmn-io/diagram-js/blob/master/lib/features/overlays/Overlays.js) 서비스에 액세스하고 `Overlays#add` 메소드를 사용하는 id로 overlays에 element를 추가합니다.

```javascript
var overlays = bpmnViewer.get("overlays");

// attach an overlay to a node
overlays.add("SCAN_OK", {
  position: {
    bottom: 0,
    right: 0
  },
  html: "<div>Mixed up the labels?</div>"
});
```

<!-- The method `Overlays#add` receives two important parameters: -->

메소드 `Overlays#add`는 두 가지 중요한 parameter를 받습니다:

- element 또는 elementId
- overlay descriptor

<!-- The overlay descriptor must contain a `html` element you want to attach as the overlay as well as a `position` that indicates where you want the overlay to be added on the element. Use `top`, `left`, `bottom`, `right` to control the attachment. -->

overlay descriptor에는 overlay로 첨부할 `html` element와 element에 overlay를 추가 할 위치를 나타내는 `position`이 포함되어야합니다.
부착되는 위치를 제어하기 위해 `top`, `left`, `bottom`, `right`을 사용하세요.

<!-- Checkout [the example](https://github.com/bpmn-io/bpmn-js-examples/blob/master/overlays/app/app.js) for additional configuration options such as conditional scaling and showing of overlays. -->

조건부 확장 및 오버레이 표시와 같은 추가 configuration option에 대한 [example](https://github.com/bpmn-io/bpmn-js-examples/blob/master/overlays/app/app.js)을 확인하세요.

### Interacting with Overlays

<!-- Instead of adding an HTML string, you can pass a JQuery object or plain DOM element via the overlay descriptor, too. This way you can register events with it, thus making it interactive. -->

HTML 문자열을 추가하는 대신 overlay descriptor를 통해 JQuery 객체 또는 일반 DOM element를 전달할 수도 있습니다. 이렇게 하면 이벤트를 등록 할 수 있으므로 대화 형으로 만들 수 있습니다.

```javascript
var overlayHtml = $("<div>Mixed up the labels?</div>");

overlayHtml.click(function (e) {
  alert("someone clicked me");
});

// attach the overlayHtml to a node
overlays.add("SCAN_OK", {
  position: {
    bottom: 0,
    right: 0
  },
  html: overlayHtml
});
```

### Removing Overlays

<!-- Overlays may be removed via `Overlays#remove`, passing the overlay id or a complex element/type selector:
 -->

overlay는 overlay id 또는 복잡한 element/type selector를 전달하는 `Overlays#remove`를 통해 제거 할 수 있습니다.

```javascript
// remove by id
var overlayId = overlays.add(...);
overlays.remove(overlayId);

// remove by element and/or type
overlays.remove({ element: 'SCAN_OK' });
```

## Setting up bpmn-js

<!-- Grab [bpmn-js](https://github.com/bpmn-io/bpmn-js) [pre-packaged](../pre-packaged) or [via npm](../bundling): -->

[pre-packaged](../pre-packaged) 또는 [npm](../bundling) 을 통해 [bpmn-js](https://github.com/bpmn-io/bpmn-js)를 가져옵니다:

<!-- To use `overlays` and other services provided by bpmn-js instantiate bpmn-js (this time the viewer) via -->

bpmn-js에서 제공하는 `overlays` 및 기타 서비스를 사용하기 위해 bpmn-js (이번에는 뷰어)를 인스턴스화합니다.

```javascript
var bpmnViewer = new BpmnViewer({
  container: "#canvas",
  width: "100%",
  height: "100%"
});
```

<!-- Import a BPMN 2.0 diagram and add the overlays in the `done` callback: -->

BPMN 2.0 다이어그램을 import하고 `done` 콜백에 오버레이를 추가합니다.:

```javascript
await bpmnViewer.importXML(diagramXML);

// retrieve services and work with them
bpmnViewer.get('overlays').add(...);
```

## Building the Project

Initialize the project dependencies via

```
npm install
```

To create the sample distribution in the `dist` folder run

```
npm run all
```

To bootstrap a development setup that spawns a small webserver and rebuilds your app on changes run

```
npm run dev
```

## License

MIT
