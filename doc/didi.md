# `didi`

[![Build Status](https://img.shields.io/github/workflow/status/nikku/didi/ci)](https://github.com/nikku/didi/actions?query=workflow%3Aci)

<!-- A tiny [dependency injection](https://en.wikipedia.org/wiki/Dependency_injection) / [inversion of control](https://en.wikipedia.org/wiki/Inversion_of_control) container for JavaScript. -->

자바 스크립트 컨테이너를 위한 tiny [dependency injection[1]](https://ko.wikipedia.org/wiki/%EC%9D%98%EC%A1%B4%EC%84%B1_%EC%A3%BC%EC%9E%85)[[2]](https://en.wikipedia.org/wiki/Dependency_injection)/ [inversion of control[1]](https://ko.wikipedia.org/wiki/%EC%A0%9C%EC%96%B4_%EB%B0%98%EC%A0%84)[[2]](https://en.wikipedia.org/wiki/Inversion_of_control).

## About

<!-- [Dependency injection](https://en.wikipedia.org/wiki/Dependency_injection) decouples component and component dependency instantiation from component behavior. That benefits your applications in the following ways: -->

[Dependency injection](https://en.wikipedia.org/wiki/Dependency_injection) 은 컴포넌트와 컴포넌트 간 동작에서 인스턴스의 종속성을 분리합니다. 이는 다음과 같은 방식으로 애플리케이션에 도움이 됩니다.

<!-- - **explicit dependencies** - all dependencies are passed in as constructor arguments, which makes it easy to understand how particular object depends on the rest of the environment -->
<!-- - **code reuse** - such a component is much easier to reuse in other environments because it is not coupled to a specific implementation of its dependencies -->
<!-- - **much easier to test** - component dependencies can be mocked trivially / overridden for testing -->

- **명시적 종속성** - 모든 종속성이 생성자 인수로 전달되므로 특정 개체가 나머지 환경에 어떻게 의존하는지 쉽게 이해할 수 있습니다.
- **코드 재사용** - 이러한 구성 요소는 종속성의 특정 구현과 결합되지 않기 때문에 다른 환경에서 재사용하기가 훨씬 쉽습니다.
- **더욱 쉬운 테스트** - 컴포넌트 종속성을 mock으로 무시 하거나 테스트를 위해 재정의 할 수 있습니다.

<!-- Following this pattern without a framework, you typically end up with some nasty `main()` method, where you instantiate all the objects and wire them together. -->

프레임 워크없이 이 패턴을 따르면 일반적으로 모든 객체를 인스턴스화하고 함께 연결하는 약간의 `main ()`메서드가 사용됩니다.

<!-- `didi` is a dependency injection container that saves you from this boilerplate. **It makes wiring the application declarative rather than imperative.** Each component declares its dependencies, and the framework does transitively resolve these dependencies. -->

`didi`는 이 재사용하는 코드에서 당신을 구하는 의존성 주입 컨테이너입니다. 응용 프로그램을 명령적이지 않고 선언적으로 연결합니다. 각 구성 요소는 종속성을 선언하고 프레임 워크는 이러한 종속성을 전이하여 해결합니다.

## Example

```js
function Car(engine) {
  this.start = function () {
    engine.start();
  };
}

function createPetrolEngine(power) {
  return {
    start: function () {
      console.log("Starting engine with " + power + "hp");
    }
  };
}

// a module is just a plain JavaScript object
// it is a recipe for the injector, how to instantiate stuff
const carModule = {
  // if an object asks for 'car', the injector will call new Car(...) to produce it
  car: ["type", Car],
  // if an object asks for 'engine', the injector will call createPetrolEngine(...) to produce it
  engine: ["factory", createPetrolEngine],
  // if an object asks for 'power', the injector will give it number 1184
  power: ["value", 1184] // probably Bugatti Veyron
};

const { Injector } = require("didi");
const injector = new Injector([carModule]);

injector.invoke(function (car) {
  car.start();
});
```

<!-- For more examples, check out [the tests](https://github.com/nikku/didi/blob/master/test/injector.spec.js). -->

예제를 더 보려면 [the tests](https://github.com/nikku/didi/blob/master/test/injector.spec.js)

<!-- You can also check out [Karma](https://github.com/karma-runner/karma) or [diagram-js](https://github.com/bpmn-io/diagram-js), two libraries that heavily use dependency injection at its core. -->

핵심에서 종속성 주입을 많이 사용하는 두 라이브러리 인 [Karma](https://github.com/karma-runner/karma)와 [diagram-js](https://github.com/bpmn-io/diagram-js)를 볼수 있습니다.

## Usage

### On the Web

<!-- Use the minification save array notation to declare types or factories and their respective dependencies: -->

축약 저장 배열 표기법(minification save array notation)로 type, factory, 그 각각의 종속성을 선언하는데 사용하십시오.

```javascript
const carModule = {
  'car': ['type', [ 'engine', Car ]],
  ...
};

const {
  Injector
} = require('didi');

const injector = new Injector([
  carModule
])

injector.invoke(['car', function(car) {
  car.start();
}]);
```

### Registering Stuff

#### `type(token, Constructor)`

<!-- To produce the instance, `Constructor` will be called with `new` operator. -->

인스턴스를 생성하기 위해 `new`를 사용하여 `Constructor` 호출됩니다.

```js
const module = {
  engine: ["type", DieselEngine]
};
```

#### `factory(token, factoryFn)`

<!-- To produce the instance, `factoryFn` is called without any context. The factories return value will be used. -->

인스턴스를 생성하기 위해 어떤 컨텍스트도 없이 `factoryFn`를 호출됩니다. factory 리턴값이 사용 됩니다.

```js
const module = {
  engine: ["factory", createDieselEngine]
};
```

#### `value(token, value)`

<!-- Register the final value. -->

최종 value를 등록하세요.

```js
const module = {
  power: ["value", 1184]
};
```

### Annotation

<!-- The injector looks up tokens based on argument names: -->

injector 아규먼트 이름을 기반으로 토큰을 찾습니다.

```js
function Car(engine, license) {
  // will inject objects bound to 'engine' and 'license' tokens
}
```

<!-- You can also use comments: -->

주석 사용도 가능합니다.

```js
function Car(/* engine */ e, /* x._weird */ x) {
  // will inject objects bound to 'engine' and 'x._weird' tokens
}
```

<!-- You can also the minification save array notation known from [AngularJS][angularjs]: -->

[AngularJS][angularjs]에서 알려진 축약 저장 배열 표기법(minification save array notation)도 가능합니다.

```js
const Car = [
  "engine",
  "trunk",
  function (e, t) {
    // will inject objects bound to 'engine' and 'trunk'
  }
];
```

<!-- Sometimes it is helpful to inject only a specific property of some object: -->

때로는 특정 객체의 특정 property만 주입하는 것이 도움이됩니다.

```js
function Engine(/* config.engine.power */ power) {
  // will inject 1184 (config.engine.power),
  // assuming there is no direct binding for 'config.engine.power' token
}

const engineModule = {
  config: ["value", { engine: { power: 1184 }, other: {} }]
};
```

## Credits

This library is built on top of the (now unmaintained) [node-di][node-di] library. `didi` is a maintained fork that adds support for ES6, the minification save array notation and other features.
이 라이브러리는(현재는 유지되지 않는) [node-di][node-di] 라이브러리 위에 구축됩니다. `didi`는 축약 저장 배열 표기법 및 기타 기능이 있는 ES6을 지원하는 유지 관리되는 fork입니다.

## Differences to...

#### [node-di][node-di]

- support for array notation
- supports [ES2015](http://babeljs.io/learn-es2015/)

#### Angular DI

- no config/runtime phases (configuration happens by injecting a config object)
- no global module register
- comment annotation
- no decorators
- service -> type
- child injectors
- private modules

## License

MIT

[angularjs]: http://angularjs.org/
[node-di]: https://github.com/vojtajina/node-di
