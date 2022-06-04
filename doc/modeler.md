# bpmn-js Modeler Example

<!-- This example uses [bpmn-js](https://github.com/bpmn-io/bpmn-js) to implement a modeler for BPMN 2.0 process diagrams. It serves as the basis of the bpmn-js demo application available at [demo.bpmn.io](http://demo.bpmn.io). -->

이 예제는 [bpmn-js](https://github.com/bpmn-io/bpmn-js)를 사용하여 BPMN 2.0 프로세스 다이어그램을위한 모델러를 구현합니다. [demo.bpmn.io](http://demo.bpmn.io)에서 제공되는 bpmn-js 데모 애플리케이션의 기반으로 사용됩니다.

## About

<!-- This example is a node-style web application that builds a user interface around the bpmn-js BPMN 2.0 modeler. -->

이 예제는 bpmn-js BPMN 2.0 모델러를 중심으로 사용자 인터페이스를 구축하는 노드 스타일 웹 애플리케이션입니다.

![demo application screenshot](https://raw.githubusercontent.com/bpmn-io/bpmn-js-examples/master/modeler/docs/screenshot.png "Screenshot of the example application")

## Building

<!-- You need a [NodeJS](http://nodejs.org) development stack with [npm](https://npmjs.org) installed to build the project. -->

프로젝트를 빌드하려면 [npm](https://npmjs.org)이 설치된 [NodeJS](http://nodejs.org) 개발 스택이 필요합니다.

<!-- To install all project dependencies execute -->

모든 프로젝트 종속성을 설치하기 위해 실행하세요.

```
npm install
```

Build the application (including [bpmn-js](https://github.com/bpmn-io/bpmn-js)) via

```
npm run all
```

You may also spawn a development setup by executing

```
npm run dev
```

<!-- Both tasks generate the distribution ready client-side modeler application into the `public` folder. -->

두 작업 모두 배포 준비된 클라이언트 쪽 모델러 응용 프로그램을 `public` 폴더에 생성합니다

<!-- Serve the application locally or via a web server (nginx, apache, embedded). -->

로컬로 또는 웹 서버 (nginx, apache, embedded)를 통해 애플리케이션을 제공합니다.
