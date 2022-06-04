import { isFunction, isArray, isNumber, bind, assign } from "min-dash";

var FN_REF = "__fn";

var DEFAULT_PRIORITY = 1000;

var slice = Array.prototype.slice;

/**
 * 범용 이벤트 버스.
 * 이 구component는 다이어그램 인스턴스에서 통신하는 데 사용됩니다.
 * 다이어그램의 다른 부분은 이벤트를 듣고 브로드 캐스트하는 데 사용할 수 있습니다.
 *
 * ## 이벤트를 위한 등록
 * 이벤트 버스는 이벤트 등록을위한 EventBus#on 및 EventBus#once 메소드를 제공합니다.
 * EventBus#off를 사용하여 이벤트 등록을 제거 할 수 있습니다.
 * 리스너는 Event 인스턴스를 첫 번째 인수로받습니다. 이를 통해 이벤트 실행에 연결할 수 있습니다.
 * 
 * This component is used to communicate across a diagram instance.
 * Other parts of a diagram can use it to listen to and broadcast events.

 *
 * ## Registering for Events
 *
 * The event bus provides the {@link EventBus#on} and {@link EventBus#once}
 * methods to register for events. {@link EventBus#off} can be used to
 * remove event registrations. Listeners receive an instance of {@link Event}
 * as the first argument. It allows them to hook into the event execution.
 * 
 * ```javascript
 *
 * // listen for event
 * eventBus.on('foo', function(event) {
 *
 *   // access event type
 *   event.type; // 'foo'
 *
 *   // stop propagation to other listeners
 *   // 다른 리스너에게 전파 중지
 *   event.stopPropagation();
 *
 *   // prevent event default
 *   // 이벤트 기본 처리 중지
 *   event.preventDefault();
 * });
 *
 * // listen for event with custom payload
 * // 커스텀 페이로드로 이벤트 수신
 * eventBus.on('bar', function(event, payload) {
 *   console.log(payload);
 * });
 *
 * // listen for event returning value
 * // 이벤트 리턴값 수신
 * eventBus.on('foobar', function(event) {
 *
 *   // stop event propagation + prevent default
 *   return false;
 *
 *   // stop event propagation + return custom result
 *   return {
 *     complex: 'listening result'
 *   };
 * });
 *
 *
 * // listen with custom priority (default=1000, higher is better)
 * eventBus.on('priorityfoo', 1500, function(event) {
 *   console.log('invoked first!');
 * });
 *
 *
 * // listen for event and pass the context (`this`)
 * eventBus.on('foobar', function(event) {
 *   this.foo();
 * }, this);
 * ```
 *
 *
 * ## Emitting Events (이벤트 발생)
 * 
 * Events can be emitted via the event bus using {@link EventBus#fire}.
 * EventBus#fire를 사용하여 이벤트 버스를 통해 이벤트를 내보낼 수 있습니다.
 * 
 * ```javascript
 *
 * // false indicates that the default action
 * // was prevented by listeners
 * // false는 리스너가 기본 액션을 금지 했을 때 나타남
 * if (eventBus.fire('foo') === false) {
 *   console.log('default has been prevented!');
 * };
 *
 *
 * // custom args + return value listener
 * eventBus.on('sum', function(event, a, b) {
 *   return a + b;
 * });
 *
 * // you can pass custom arguments + retrieve result values.
 * // 커스텀 아규먼트와 결과 값을 전달
 * var sum = eventBus.fire('sum', 1, 2);
 * console.log(sum); // 3
 * ```
 */
export default function EventBus() {
  this._listeners = {};

  // cleanup on destroy on lowest priority to allow
  // message passing until the bitter end
  // 모든 메시지가 다 처리 된 후 파괴시 정리, 우선 순위는 1로 줌
  this.on("diagram.destroy", 1, this._destroy, this);
}

/**
 * Register an event listener for events with the given name.
 * 지정된 이름의 이벤트에 대한 이벤트 리스너를 등록합니다.
 *
 * The callback will be invoked with `event, ...additionalArguments`
 * that have been passed to {@link EventBus#fire}.
 * 콜백은 EventBus#fire에서 전달된 `event, ...additionalArguments`으로 호출
 * Returning false from a listener will prevent the events default action
 * (if any is specified). To stop an event from being processed further in
 * other listeners execute {@link Event#stopPropagation}.
 *
 * Returning anything but `undefined` from a listener will stop the listener propagation.
 *
 * @param {string|Array<string>} events
 * @param {number} [priority=1000] the priority in which this listener is called, larger is higher
 * @param {Function} callback
 * @param {Object} [that] Pass context (`this`) to the callback
 */
EventBus.prototype.on = function (events, priority, callback, that) {
  events = isArray(events) ? events : [events];

  if (isFunction(priority)) {
    that = callback;
    callback = priority;
    priority = DEFAULT_PRIORITY;
  }

  if (!isNumber(priority)) {
    throw new Error("priority must be a number");
  }

  var actualCallback = callback;

  if (that) {
    actualCallback = bind(callback, that);

    // make sure we remember and are able to remove
    // bound callbacks via {@link #off} using the original
    // callback
    actualCallback[FN_REF] = callback[FN_REF] || callback;
  }

  var self = this;

  events.forEach(function (e) {
    self._addListener(e, {
      priority: priority,
      callback: actualCallback,
      next: null
    });
  });
};

/**
 * Register an event listener that is executed only once.
 *
 * @param {string} event the event name to register for
 * @param {number} [priority=1000] the priority in which this listener is called, larger is higher
 * @param {Function} callback the callback to execute
 * @param {Object} [that] Pass context (`this`) to the callback
 */
EventBus.prototype.once = function (event, priority, callback, that) {
  var self = this;

  if (isFunction(priority)) {
    that = callback;
    callback = priority;
    priority = DEFAULT_PRIORITY;
  }

  if (!isNumber(priority)) {
    throw new Error("priority must be a number");
  }

  function wrappedCallback() {
    var result = callback.apply(that, arguments);

    self.off(event, wrappedCallback);

    return result;
  }

  // make sure we remember and are able to remove
  // bound callbacks via {@link #off} using the original
  // callback
  wrappedCallback[FN_REF] = callback;

  this.on(event, priority, wrappedCallback);
};

/**
 * Removes event listeners by event and callback.
 *
 * If no callback is given, all listeners for a given event name are being removed.
 *
 * @param {string|Array<string>} events
 * @param {Function} [callback]
 */
EventBus.prototype.off = function (events, callback) {
  events = isArray(events) ? events : [events];

  var self = this;

  events.forEach(function (event) {
    self._removeListener(event, callback);
  });
};

/**
 * Create an EventBus event.
 *
 * @param {Object} data
 *
 * @return {Object} event, recognized by the eventBus
 */
EventBus.prototype.createEvent = function (data) {
  var event = new InternalEvent();

  event.init(data);

  return event;
};

/**
 * Fires a named event.
 *
 * @example
 *
 * // fire event by name
 * events.fire('foo');
 *
 * // fire event object with nested type
 * var event = { type: 'foo' };
 * events.fire(event);
 *
 * // fire event with explicit type
 * var event = { x: 10, y: 20 };
 * events.fire('element.moved', event);
 *
 * // pass additional arguments to the event
 * events.on('foo', function(event, bar) {
 *   alert(bar);
 * });
 *
 * events.fire({ type: 'foo' }, 'I am bar!');
 *
 * @param {string} [name] the optional event name
 * @param {Object} [event] the event object
 * @param {...Object} additional arguments to be passed to the callback functions
 *
 * @return {boolean} the events return value, if specified or false if the
 *                   default action was prevented by listeners
 */
EventBus.prototype.fire = function (type, data) {
  var event, firstListener, returnValue, args;

  args = slice.call(arguments);

  if (typeof type === "object") {
    data = type;
    type = data.type;
  }

  if (!type) {
    throw new Error("no event type specified");
  }

  firstListener = this._listeners[type];

  if (!firstListener) {
    return;
  }

  // we make sure we fire instances of our home made
  // events here. We wrap them only once, though
  if (data instanceof InternalEvent) {
    // we are fine, we alread have an event
    event = data;
  } else {
    event = this.createEvent(data);
  }

  // ensure we pass the event as the first parameter
  args[0] = event;

  // original event type (in case we delegate)
  var originalType = event.type;

  // update event type before delegation
  if (type !== originalType) {
    event.type = type;
  }

  try {
    returnValue = this._invokeListeners(event, args, firstListener);
  } finally {
    // reset event type after delegation
    if (type !== originalType) {
      event.type = originalType;
    }
  }

  // set the return value to false if the event default
  // got prevented and no other return value exists
  if (returnValue === undefined && event.defaultPrevented) {
    returnValue = false;
  }

  return returnValue;
};

EventBus.prototype.handleError = function (error) {
  return this.fire("error", { error: error }) === false;
};

EventBus.prototype._destroy = function () {
  this._listeners = {};
};

EventBus.prototype._invokeListeners = function (event, args, listener) {
  var returnValue;

  while (listener) {
    // handle stopped propagation
    if (event.cancelBubble) {
      break;
    }

    returnValue = this._invokeListener(event, args, listener);

    listener = listener.next;
  }

  return returnValue;
};

EventBus.prototype._invokeListener = function (event, args, listener) {
  var returnValue;

  try {
    // returning false prevents the default action
    returnValue = invokeFunction(listener.callback, args);

    // stop propagation on return value
    if (returnValue !== undefined) {
      event.returnValue = returnValue;
      event.stopPropagation();
    }

    // prevent default on return false
    if (returnValue === false) {
      event.preventDefault();
    }
  } catch (e) {
    if (!this.handleError(e)) {
      console.error("unhandled error in event listener");
      console.error(e.stack);

      throw e;
    }
  }

  return returnValue;
};

/*
 * Add new listener with a certain priority to the list
 * of listeners (for the given event).
 *
 * The semantics of listener registration / listener execution are
 * first register, first serve: New listeners will always be inserted
 * after existing listeners with the same priority.
 *
 * Example: Inserting two listeners with priority 1000 and 1300
 *
 *    * before: [ 1500, 1500, 1000, 1000 ]
 *    * after: [ 1500, 1500, (new=1300), 1000, 1000, (new=1000) ]
 *
 * @param {string} event
 * @param {Object} listener { priority, callback }
 */
EventBus.prototype._addListener = function (event, newListener) {
  var listener = this._getListeners(event),
    previousListener;

  // no prior listeners
  if (!listener) {
    this._setListeners(event, newListener);

    return;
  }

  // ensure we order listeners by priority from
  // 0 (high) to n > 0 (low)
  while (listener) {
    if (listener.priority < newListener.priority) {
      newListener.next = listener;

      if (previousListener) {
        previousListener.next = newListener;
      } else {
        this._setListeners(event, newListener);
      }

      return;
    }

    previousListener = listener;
    listener = listener.next;
  }

  // add new listener to back
  previousListener.next = newListener;
};

EventBus.prototype._getListeners = function (name) {
  return this._listeners[name];
};

EventBus.prototype._setListeners = function (name, listener) {
  this._listeners[name] = listener;
};

EventBus.prototype._removeListener = function (event, callback) {
  var listener = this._getListeners(event),
    nextListener,
    previousListener,
    listenerCallback;

  if (!callback) {
    // clear listeners
    this._setListeners(event, null);

    return;
  }

  while (listener) {
    nextListener = listener.next;

    listenerCallback = listener.callback;

    if (
      listenerCallback === callback ||
      listenerCallback[FN_REF] === callback
    ) {
      if (previousListener) {
        previousListener.next = nextListener;
      } else {
        // new first listener
        this._setListeners(event, nextListener);
      }
    }

    previousListener = listener;
    listener = nextListener;
  }
};

/**
 * A event that is emitted via the event bus.
 */
function InternalEvent() {}

InternalEvent.prototype.stopPropagation = function () {
  this.cancelBubble = true;
};

InternalEvent.prototype.preventDefault = function () {
  this.defaultPrevented = true;
};

InternalEvent.prototype.init = function (data) {
  assign(this, data || {});
};

/**
 * Invoke function. Be fast...
 *
 * @param {Function} fn
 * @param {Array<Object>} args
 *
 * @return {Any}
 */
function invokeFunction(fn, args) {
  return fn.apply(null, args);
}
