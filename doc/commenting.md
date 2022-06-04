# A simple discussion app

<!-- [bpmn-js](https://github.com/bpmn-io/bpmn-js) is the BPMN 2.0 diagram modeling and rendering toolkit that powers [bpmn.io](http://bpmn.io). -->

[bpmn-js](https://github.com/bpmn-io/bpmn-js)는 [bpmn.io](http://bpmn.io)를 지원하는 BPMN 2.0 다이어그램 모델링 및 렌더링 툴킷입니다.

This example showcases how to build a simple discussion app based on [bpmn-js](https://github.com/bpmn-io/bpmn-js) and the [bpmn-js-embedded-comments](https://github.com/bpmn-io/bpmn-js-embedded-comments) extension.

## About

<!-- This example uses bpmn-js to embed the [pizza collaboration](http://demo.bpmn.io/s/pizza-collaboration) diagram into a web application and add the ability to put comments on individual tasks. -->

이 예제는 bpmn-js를 사용하여 [pizza collaboration](http://demo.bpmn.io/s/pizza-collaboration) diagram을 웹 애플리케이션에 임베드하고 개별 작업에 주석을 추가하는 기능을 추가합니다.

![demo application screenshot](https://raw.githubusercontent.com/bpmn-io/bpmn-js-examples/master/commenting/docs/screenshot.png "Screenshot of the example application")

<!-- The comments are added to an elements `<bpmn:documentation>` tag and may be downloaded along with the element. -->

comment는 element`<bpmn:documentation>` tag에 추가되어 지고 element와 함께 다운로드 할 수 있습니다.

## Building

One time installation of all dependencies via [npm](https://npmjs.org):

```
npm install
```

Building the app into the `dist` directory and opening it in a browser:

```
npm run dev
```

## License

MIT
