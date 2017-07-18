/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId]) {
/******/ 			return installedModules[moduleId].exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {}
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// identity function for calling harmony imports with the correct context
/******/ 	__webpack_require__.i = function(value) { return value; };
/******/
/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, {
/******/ 				configurable: false,
/******/ 				enumerable: true,
/******/ 				get: getter
/******/ 			});
/******/ 		}
/******/ 	};
/******/
/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};
/******/
/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "/";
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = 16);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (immutable) */ __webpack_exports__["a"] = Stream;
/** @license MIT License (c) copyright 2010-2016 original author or authors */
/** @author Brian Cavalier */
/** @author John Hann */

function Stream (source) {
  this.source = source
}

Stream.prototype.run = function (sink, scheduler) {
  return this.source.run(sink, scheduler)
}


/***/ }),
/* 1 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (immutable) */ __webpack_exports__["a"] = tryDispose;
/* harmony export (immutable) */ __webpack_exports__["f"] = create;
/* harmony export (immutable) */ __webpack_exports__["c"] = empty;
/* harmony export (immutable) */ __webpack_exports__["b"] = all;
/* unused harmony export promised */
/* harmony export (immutable) */ __webpack_exports__["e"] = settable;
/* harmony export (immutable) */ __webpack_exports__["d"] = once;
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__Disposable__ = __webpack_require__(95);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__SettableDisposable__ = __webpack_require__(96);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__Promise__ = __webpack_require__(73);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3__most_prelude__ = __webpack_require__(4);
/** @license MIT License (c) copyright 2010-2016 original author or authors */
/** @author Brian Cavalier */
/** @author John Hann */





var map = __WEBPACK_IMPORTED_MODULE_3__most_prelude__["h" /* map */]
var identity = __WEBPACK_IMPORTED_MODULE_3__most_prelude__["i" /* id */]

/**
 * Call disposable.dispose.  If it returns a promise, catch promise
 * error and forward it through the provided sink.
 * @param {number} t time
 * @param {{dispose: function}} disposable
 * @param {{error: function}} sink
 * @return {*} result of disposable.dispose
 */
function tryDispose (t, disposable, sink) {
  var result = disposeSafely(disposable)
  return __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_2__Promise__["a" /* isPromise */])(result)
    ? result.catch(function (e) {
      sink.error(t, e)
    })
    : result
}

/**
 * Create a new Disposable which will dispose its underlying resource
 * at most once.
 * @param {function} dispose function
 * @param {*?} data any data to be passed to disposer function
 * @return {Disposable}
 */
function create (dispose, data) {
  return once(new __WEBPACK_IMPORTED_MODULE_0__Disposable__["a" /* default */](dispose, data))
}

/**
 * Create a noop disposable. Can be used to satisfy a Disposable
 * requirement when no actual resource needs to be disposed.
 * @return {Disposable|exports|module.exports}
 */
function empty () {
  return new __WEBPACK_IMPORTED_MODULE_0__Disposable__["a" /* default */](identity, void 0)
}

/**
 * Create a disposable that will dispose all input disposables in parallel.
 * @param {Array<Disposable>} disposables
 * @return {Disposable}
 */
function all (disposables) {
  return create(disposeAll, disposables)
}

function disposeAll (disposables) {
  return Promise.all(map(disposeSafely, disposables))
}

function disposeSafely (disposable) {
  try {
    return disposable.dispose()
  } catch (e) {
    return Promise.reject(e)
  }
}

/**
 * Create a disposable from a promise for another disposable
 * @param {Promise<Disposable>} disposablePromise
 * @return {Disposable}
 */
function promised (disposablePromise) {
  return create(disposePromise, disposablePromise)
}

function disposePromise (disposablePromise) {
  return disposablePromise.then(disposeOne)
}

function disposeOne (disposable) {
  return disposable.dispose()
}

/**
 * Create a disposable proxy that allows its underlying disposable to
 * be set later.
 * @return {SettableDisposable}
 */
function settable () {
  return new __WEBPACK_IMPORTED_MODULE_1__SettableDisposable__["a" /* default */]()
}

/**
 * Wrap an existing disposable (which may not already have been once()d)
 * so that it will only dispose its underlying resource at most once.
 * @param {{ dispose: function() }} disposable
 * @return {Disposable} wrapped disposable
 */
function once (disposable) {
  return new __WEBPACK_IMPORTED_MODULE_0__Disposable__["a" /* default */](disposeMemoized, memoized(disposable))
}

function disposeMemoized (memoized) {
  if (!memoized.disposed) {
    memoized.disposed = true
    memoized.value = disposeSafely(memoized.disposable)
    memoized.disposable = void 0
  }

  return memoized.value
}

function memoized (disposable) {
  return { disposed: false, disposable: disposable, value: void 0 }
}


/***/ }),
/* 2 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (immutable) */ __webpack_exports__["a"] = Pipe;
/** @license MIT License (c) copyright 2010-2016 original author or authors */
/** @author Brian Cavalier */
/** @author John Hann */

/**
 * A sink mixin that simply forwards event, end, and error to
 * another sink.
 * @param sink
 * @constructor
 */
function Pipe (sink) {
  this.sink = sink
}

Pipe.prototype.event = function (t, x) {
  return this.sink.event(t, x)
}

Pipe.prototype.end = function (t, x) {
  return this.sink.end(t, x)
}

Pipe.prototype.error = function (t, e) {
  return this.sink.error(t, e)
}


/***/ }),
/* 3 */
/***/ (function(module, exports) {

var g;

// This works in non-strict mode
g = (function() {
	return this;
})();

try {
	// This works if eval is allowed (see CSP)
	g = g || Function("return this")() || (1,eval)("this");
} catch(e) {
	// This works if the window reference is available
	if(typeof window === "object")
		g = window;
}

// g can still be undefined, but nothing to do about it...
// We return undefined, instead of nothing here, so it's
// easier to handle this case. if(!global) { ...}

module.exports = g;


/***/ }),
/* 4 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return cons; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "f", function() { return append; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "k", function() { return drop; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "c", function() { return tail; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "l", function() { return copy; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "h", function() { return map; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "m", function() { return reduce; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "b", function() { return replace; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "g", function() { return remove; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "e", function() { return removeAll; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "d", function() { return findIndex; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "o", function() { return isArrayLike; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "i", function() { return id; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "j", function() { return compose; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "n", function() { return apply; });
/* unused harmony export curry2 */
/* unused harmony export curry3 */
/* unused harmony export curry4 */
/** @license MIT License (c) copyright 2010-2016 original author or authors */

// Non-mutating array operations

// cons :: a -> [a] -> [a]
// a with x prepended
function cons (x, a) {
  var l = a.length;
  var b = new Array(l + 1);
  b[0] = x;
  for (var i = 0; i < l; ++i) {
    b[i + 1] = a[i];
  }
  return b
}

// append :: a -> [a] -> [a]
// a with x appended
function append (x, a) {
  var l = a.length;
  var b = new Array(l + 1);
  for (var i = 0; i < l; ++i) {
    b[i] = a[i];
  }

  b[l] = x;
  return b
}

// drop :: Int -> [a] -> [a]
// drop first n elements
function drop (n, a) { // eslint-disable-line complexity
  if (n < 0) {
    throw new TypeError('n must be >= 0')
  }

  var l = a.length;
  if (n === 0 || l === 0) {
    return a
  }

  if (n >= l) {
    return []
  }

  return unsafeDrop(n, a, l - n)
}

// unsafeDrop :: Int -> [a] -> Int -> [a]
// Internal helper for drop
function unsafeDrop (n, a, l) {
  var b = new Array(l);
  for (var i = 0; i < l; ++i) {
    b[i] = a[n + i];
  }
  return b
}

// tail :: [a] -> [a]
// drop head element
function tail (a) {
  return drop(1, a)
}

// copy :: [a] -> [a]
// duplicate a (shallow duplication)
function copy (a) {
  var l = a.length;
  var b = new Array(l);
  for (var i = 0; i < l; ++i) {
    b[i] = a[i];
  }
  return b
}

// map :: (a -> b) -> [a] -> [b]
// transform each element with f
function map (f, a) {
  var l = a.length;
  var b = new Array(l);
  for (var i = 0; i < l; ++i) {
    b[i] = f(a[i]);
  }
  return b
}

// reduce :: (a -> b -> a) -> a -> [b] -> a
// accumulate via left-fold
function reduce (f, z, a) {
  var r = z;
  for (var i = 0, l = a.length; i < l; ++i) {
    r = f(r, a[i], i);
  }
  return r
}

// replace :: a -> Int -> [a]
// replace element at index
function replace (x, i, a) { // eslint-disable-line complexity
  if (i < 0) {
    throw new TypeError('i must be >= 0')
  }

  var l = a.length;
  var b = new Array(l);
  for (var j = 0; j < l; ++j) {
    b[j] = i === j ? x : a[j];
  }
  return b
}

// remove :: Int -> [a] -> [a]
// remove element at index
function remove (i, a) {  // eslint-disable-line complexity
  if (i < 0) {
    throw new TypeError('i must be >= 0')
  }

  var l = a.length;
  if (l === 0 || i >= l) { // exit early if index beyond end of array
    return a
  }

  if (l === 1) { // exit early if index in bounds and length === 1
    return []
  }

  return unsafeRemove(i, a, l - 1)
}

// unsafeRemove :: Int -> [a] -> Int -> [a]
// Internal helper to remove element at index
function unsafeRemove (i, a, l) {
  var b = new Array(l);
  var j;
  for (j = 0; j < i; ++j) {
    b[j] = a[j];
  }
  for (j = i; j < l; ++j) {
    b[j] = a[j + 1];
  }

  return b
}

// removeAll :: (a -> boolean) -> [a] -> [a]
// remove all elements matching a predicate
function removeAll (f, a) {
  var l = a.length;
  var b = new Array(l);
  var j = 0;
  for (var x = (void 0), i = 0; i < l; ++i) {
    x = a[i];
    if (!f(x)) {
      b[j] = x;
      ++j;
    }
  }

  b.length = j;
  return b
}

// findIndex :: a -> [a] -> Int
// find index of x in a, from the left
function findIndex (x, a) {
  for (var i = 0, l = a.length; i < l; ++i) {
    if (x === a[i]) {
      return i
    }
  }
  return -1
}

// isArrayLike :: * -> boolean
// Return true iff x is array-like
function isArrayLike (x) {
  return x != null && typeof x.length === 'number' && typeof x !== 'function'
}

/** @license MIT License (c) copyright 2010-2016 original author or authors */

// id :: a -> a
var id = function (x) { return x; };

// compose :: (b -> c) -> (a -> b) -> (a -> c)
var compose = function (f, g) { return function (x) { return f(g(x)); }; };

// apply :: (a -> b) -> a -> b
var apply = function (f, x) { return f(x); };

// curry2 :: ((a, b) -> c) -> (a -> b -> c)
function curry2 (f) {
  function curried (a, b) {
    switch (arguments.length) {
      case 0: return curried
      case 1: return function (b) { return f(a, b); }
      default: return f(a, b)
    }
  }
  return curried
}

// curry3 :: ((a, b, c) -> d) -> (a -> b -> c -> d)
function curry3 (f) {
  function curried (a, b, c) { // eslint-disable-line complexity
    switch (arguments.length) {
      case 0: return curried
      case 1: return curry2(function (b, c) { return f(a, b, c); })
      case 2: return function (c) { return f(a, b, c); }
      default:return f(a, b, c)
    }
  }
  return curried
}

// curry4 :: ((a, b, c, d) -> e) -> (a -> b -> c -> d -> e)
function curry4 (f) {
  function curried (a, b, c, d) { // eslint-disable-line complexity
    switch (arguments.length) {
      case 0: return curried
      case 1: return curry3(function (b, c, d) { return f(a, b, c, d); })
      case 2: return curry2(function (c, d) { return f(a, b, c, d); })
      case 3: return function (d) { return f(a, b, c, d); }
      default:return f(a, b, c, d)
    }
  }
  return curried
}

/** @license MIT License (c) copyright 2016 original author or authors */


//# sourceMappingURL=index.es.js.map


/***/ }),
/* 5 */
/***/ (function(module, exports, __webpack_require__) {

/* WEBPACK VAR INJECTION */(function(process) {/**
 * This is the web browser implementation of `debug()`.
 *
 * Expose `debug()` as the module.
 */

exports = module.exports = __webpack_require__(61);
exports.log = log;
exports.formatArgs = formatArgs;
exports.save = save;
exports.load = load;
exports.useColors = useColors;
exports.storage = 'undefined' != typeof chrome
               && 'undefined' != typeof chrome.storage
                  ? chrome.storage.local
                  : localstorage();

/**
 * Colors.
 */

exports.colors = [
  'lightseagreen',
  'forestgreen',
  'goldenrod',
  'dodgerblue',
  'darkorchid',
  'crimson'
];

/**
 * Currently only WebKit-based Web Inspectors, Firefox >= v31,
 * and the Firebug extension (any Firefox version) are known
 * to support "%c" CSS customizations.
 *
 * TODO: add a `localStorage` variable to explicitly enable/disable colors
 */

function useColors() {
  // NB: In an Electron preload script, document will be defined but not fully
  // initialized. Since we know we're in Chrome, we'll just detect this case
  // explicitly
  if (typeof window !== 'undefined' && window.process && window.process.type === 'renderer') {
    return true;
  }

  // is webkit? http://stackoverflow.com/a/16459606/376773
  // document is undefined in react-native: https://github.com/facebook/react-native/pull/1632
  return (typeof document !== 'undefined' && document.documentElement && document.documentElement.style && document.documentElement.style.WebkitAppearance) ||
    // is firebug? http://stackoverflow.com/a/398120/376773
    (typeof window !== 'undefined' && window.console && (window.console.firebug || (window.console.exception && window.console.table))) ||
    // is firefox >= v31?
    // https://developer.mozilla.org/en-US/docs/Tools/Web_Console#Styling_messages
    (typeof navigator !== 'undefined' && navigator.userAgent && navigator.userAgent.toLowerCase().match(/firefox\/(\d+)/) && parseInt(RegExp.$1, 10) >= 31) ||
    // double check webkit in userAgent just in case we are in a worker
    (typeof navigator !== 'undefined' && navigator.userAgent && navigator.userAgent.toLowerCase().match(/applewebkit\/(\d+)/));
}

/**
 * Map %j to `JSON.stringify()`, since no Web Inspectors do that by default.
 */

exports.formatters.j = function(v) {
  try {
    return JSON.stringify(v);
  } catch (err) {
    return '[UnexpectedJSONParseError]: ' + err.message;
  }
};


/**
 * Colorize log arguments if enabled.
 *
 * @api public
 */

function formatArgs(args) {
  var useColors = this.useColors;

  args[0] = (useColors ? '%c' : '')
    + this.namespace
    + (useColors ? ' %c' : ' ')
    + args[0]
    + (useColors ? '%c ' : ' ')
    + '+' + exports.humanize(this.diff);

  if (!useColors) return;

  var c = 'color: ' + this.color;
  args.splice(1, 0, c, 'color: inherit')

  // the final "%c" is somewhat tricky, because there could be other
  // arguments passed either before or after the %c, so we need to
  // figure out the correct index to insert the CSS into
  var index = 0;
  var lastC = 0;
  args[0].replace(/%[a-zA-Z%]/g, function(match) {
    if ('%%' === match) return;
    index++;
    if ('%c' === match) {
      // we only are interested in the *last* %c
      // (the user may have provided their own)
      lastC = index;
    }
  });

  args.splice(lastC, 0, c);
}

/**
 * Invokes `console.log()` when available.
 * No-op when `console.log` is not a "function".
 *
 * @api public
 */

function log() {
  // this hackery is required for IE8/9, where
  // the `console.log` function doesn't have 'apply'
  return 'object' === typeof console
    && console.log
    && Function.prototype.apply.call(console.log, console, arguments);
}

/**
 * Save `namespaces`.
 *
 * @param {String} namespaces
 * @api private
 */

function save(namespaces) {
  try {
    if (null == namespaces) {
      exports.storage.removeItem('debug');
    } else {
      exports.storage.debug = namespaces;
    }
  } catch(e) {}
}

/**
 * Load `namespaces`.
 *
 * @return {String} returns the previously persisted debug modes
 * @api private
 */

function load() {
  var r;
  try {
    r = exports.storage.debug;
  } catch(e) {}

  // If debug isn't set in LS, and we're in Electron, try to load $DEBUG
  if (!r && typeof process !== 'undefined' && 'env' in process) {
    r = process.env.DEBUG;
  }

  return r;
}

/**
 * Enable namespaces listed in `localStorage.debug` initially.
 */

exports.enable(load());

/**
 * Localstorage attempts to return the localstorage.
 *
 * This is necessary because safari throws
 * when a user disables cookies/localstorage
 * and you attempt to access it.
 *
 * @return {LocalStorage}
 * @api private
 */

function localstorage() {
  try {
    return window.localStorage;
  } catch (e) {}
}

/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(120)))

/***/ }),
/* 6 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (immutable) */ __webpack_exports__["a"] = PropagateTask;
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__fatalError__ = __webpack_require__(21);
/** @license MIT License (c) copyright 2010-2016 original author or authors */
/** @author Brian Cavalier */
/** @author John Hann */



function PropagateTask (run, value, sink) {
  this._run = run
  this.value = value
  this.sink = sink
  this.active = true
}

PropagateTask.event = function (value, sink) {
  return new PropagateTask(emit, value, sink)
}

PropagateTask.end = function (value, sink) {
  return new PropagateTask(end, value, sink)
}

PropagateTask.error = function (value, sink) {
  return new PropagateTask(error, value, sink)
}

PropagateTask.prototype.dispose = function () {
  this.active = false
}

PropagateTask.prototype.run = function (t) {
  if (!this.active) {
    return
  }
  this._run(t, this.value, this.sink)
}

PropagateTask.prototype.error = function (t, e) {
  if (!this.active) {
    return __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_0__fatalError__["a" /* default */])(e)
  }
  this.sink.error(t, e)
}

function error (t, e, sink) {
  sink.error(t, e)
}

function emit (t, x, sink) {
  sink.event(t, x)
}

function end (t, x, sink) {
  sink.end(t, x)
}


/***/ }),
/* 7 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (immutable) */ __webpack_exports__["a"] = of;
/* harmony export (immutable) */ __webpack_exports__["b"] = empty;
/* harmony export (immutable) */ __webpack_exports__["c"] = never;
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__Stream__ = __webpack_require__(0);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__disposable_dispose__ = __webpack_require__(1);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__scheduler_PropagateTask__ = __webpack_require__(6);
/** @license MIT License (c) copyright 2010-2016 original author or authors */
/** @author Brian Cavalier */
/** @author John Hann */





/**
 * Stream containing only x
 * @param {*} x
 * @returns {Stream}
 */
function of (x) {
  return new __WEBPACK_IMPORTED_MODULE_0__Stream__["a" /* default */](new Just(x))
}

function Just (x) {
  this.value = x
}

Just.prototype.run = function (sink, scheduler) {
  return scheduler.asap(new __WEBPACK_IMPORTED_MODULE_2__scheduler_PropagateTask__["a" /* default */](runJust, this.value, sink))
}

function runJust (t, x, sink) {
  sink.event(t, x)
  sink.end(t, void 0)
}

/**
 * Stream containing no events and ends immediately
 * @returns {Stream}
 */
function empty () {
  return EMPTY
}

function EmptySource () {}

EmptySource.prototype.run = function (sink, scheduler) {
  var task = __WEBPACK_IMPORTED_MODULE_2__scheduler_PropagateTask__["a" /* default */].end(void 0, sink)
  scheduler.asap(task)

  return __WEBPACK_IMPORTED_MODULE_1__disposable_dispose__["f" /* create */](disposeEmpty, task)
}

function disposeEmpty (task) {
  return task.dispose()
}

var EMPTY = new __WEBPACK_IMPORTED_MODULE_0__Stream__["a" /* default */](new EmptySource())

/**
 * Stream containing no events and never ends
 * @returns {Stream}
 */
function never () {
  return NEVER
}

function NeverSource () {}

NeverSource.prototype.run = function () {
  return __WEBPACK_IMPORTED_MODULE_1__disposable_dispose__["c" /* empty */]()
}

var NEVER = new __WEBPACK_IMPORTED_MODULE_0__Stream__["a" /* default */](new NeverSource())


/***/ }),
/* 8 */
/***/ (function(module, exports, __webpack_require__) {


/**
 * Expose `Emitter`.
 */

if (true) {
  module.exports = Emitter;
}

/**
 * Initialize a new `Emitter`.
 *
 * @api public
 */

function Emitter(obj) {
  if (obj) return mixin(obj);
};

/**
 * Mixin the emitter properties.
 *
 * @param {Object} obj
 * @return {Object}
 * @api private
 */

function mixin(obj) {
  for (var key in Emitter.prototype) {
    obj[key] = Emitter.prototype[key];
  }
  return obj;
}

/**
 * Listen on the given `event` with `fn`.
 *
 * @param {String} event
 * @param {Function} fn
 * @return {Emitter}
 * @api public
 */

Emitter.prototype.on =
Emitter.prototype.addEventListener = function(event, fn){
  this._callbacks = this._callbacks || {};
  (this._callbacks['$' + event] = this._callbacks['$' + event] || [])
    .push(fn);
  return this;
};

/**
 * Adds an `event` listener that will be invoked a single
 * time then automatically removed.
 *
 * @param {String} event
 * @param {Function} fn
 * @return {Emitter}
 * @api public
 */

Emitter.prototype.once = function(event, fn){
  function on() {
    this.off(event, on);
    fn.apply(this, arguments);
  }

  on.fn = fn;
  this.on(event, on);
  return this;
};

/**
 * Remove the given callback for `event` or all
 * registered callbacks.
 *
 * @param {String} event
 * @param {Function} fn
 * @return {Emitter}
 * @api public
 */

Emitter.prototype.off =
Emitter.prototype.removeListener =
Emitter.prototype.removeAllListeners =
Emitter.prototype.removeEventListener = function(event, fn){
  this._callbacks = this._callbacks || {};

  // all
  if (0 == arguments.length) {
    this._callbacks = {};
    return this;
  }

  // specific event
  var callbacks = this._callbacks['$' + event];
  if (!callbacks) return this;

  // remove all handlers
  if (1 == arguments.length) {
    delete this._callbacks['$' + event];
    return this;
  }

  // remove specific handler
  var cb;
  for (var i = 0; i < callbacks.length; i++) {
    cb = callbacks[i];
    if (cb === fn || cb.fn === fn) {
      callbacks.splice(i, 1);
      break;
    }
  }
  return this;
};

/**
 * Emit `event` with the given args.
 *
 * @param {String} event
 * @param {Mixed} ...
 * @return {Emitter}
 */

Emitter.prototype.emit = function(event){
  this._callbacks = this._callbacks || {};
  var args = [].slice.call(arguments, 1)
    , callbacks = this._callbacks['$' + event];

  if (callbacks) {
    callbacks = callbacks.slice(0);
    for (var i = 0, len = callbacks.length; i < len; ++i) {
      callbacks[i].apply(this, args);
    }
  }

  return this;
};

/**
 * Return array of callbacks for `event`.
 *
 * @param {String} event
 * @return {Array}
 * @api public
 */

Emitter.prototype.listeners = function(event){
  this._callbacks = this._callbacks || {};
  return this._callbacks['$' + event] || [];
};

/**
 * Check if this emitter has `event` handlers.
 *
 * @param {String} event
 * @return {Boolean}
 * @api public
 */

Emitter.prototype.hasListeners = function(event){
  return !! this.listeners(event).length;
};


/***/ }),
/* 9 */
/***/ (function(module, exports, __webpack_require__) {

/* WEBPACK VAR INJECTION */(function(global) {/**
 * Module dependencies.
 */

var keys = __webpack_require__(68);
var hasBinary = __webpack_require__(35);
var sliceBuffer = __webpack_require__(55);
var after = __webpack_require__(54);
var utf8 = __webpack_require__(69);

var base64encoder;
if (global && global.ArrayBuffer) {
  base64encoder = __webpack_require__(59);
}

/**
 * Check if we are running an android browser. That requires us to use
 * ArrayBuffer with polling transports...
 *
 * http://ghinda.net/jpeg-blob-ajax-android/
 */

var isAndroid = typeof navigator !== 'undefined' && /Android/i.test(navigator.userAgent);

/**
 * Check if we are running in PhantomJS.
 * Uploading a Blob with PhantomJS does not work correctly, as reported here:
 * https://github.com/ariya/phantomjs/issues/11395
 * @type boolean
 */
var isPhantomJS = typeof navigator !== 'undefined' && /PhantomJS/i.test(navigator.userAgent);

/**
 * When true, avoids using Blobs to encode payloads.
 * @type boolean
 */
var dontSendBlobs = isAndroid || isPhantomJS;

/**
 * Current protocol version.
 */

exports.protocol = 3;

/**
 * Packet types.
 */

var packets = exports.packets = {
    open:     0    // non-ws
  , close:    1    // non-ws
  , ping:     2
  , pong:     3
  , message:  4
  , upgrade:  5
  , noop:     6
};

var packetslist = keys(packets);

/**
 * Premade error packet.
 */

var err = { type: 'error', data: 'parser error' };

/**
 * Create a blob api even for blob builder when vendor prefixes exist
 */

var Blob = __webpack_require__(60);

/**
 * Encodes a packet.
 *
 *     <packet type id> [ <data> ]
 *
 * Example:
 *
 *     5hello world
 *     3
 *     4
 *
 * Binary is encoded in an identical principle
 *
 * @api private
 */

exports.encodePacket = function (packet, supportsBinary, utf8encode, callback) {
  if (typeof supportsBinary === 'function') {
    callback = supportsBinary;
    supportsBinary = false;
  }

  if (typeof utf8encode === 'function') {
    callback = utf8encode;
    utf8encode = null;
  }

  var data = (packet.data === undefined)
    ? undefined
    : packet.data.buffer || packet.data;

  if (global.ArrayBuffer && data instanceof ArrayBuffer) {
    return encodeArrayBuffer(packet, supportsBinary, callback);
  } else if (Blob && data instanceof global.Blob) {
    return encodeBlob(packet, supportsBinary, callback);
  }

  // might be an object with { base64: true, data: dataAsBase64String }
  if (data && data.base64) {
    return encodeBase64Object(packet, callback);
  }

  // Sending data as a utf-8 string
  var encoded = packets[packet.type];

  // data fragment is optional
  if (undefined !== packet.data) {
    encoded += utf8encode ? utf8.encode(String(packet.data), { strict: false }) : String(packet.data);
  }

  return callback('' + encoded);

};

function encodeBase64Object(packet, callback) {
  // packet data is an object { base64: true, data: dataAsBase64String }
  var message = 'b' + exports.packets[packet.type] + packet.data.data;
  return callback(message);
}

/**
 * Encode packet helpers for binary types
 */

function encodeArrayBuffer(packet, supportsBinary, callback) {
  if (!supportsBinary) {
    return exports.encodeBase64Packet(packet, callback);
  }

  var data = packet.data;
  var contentArray = new Uint8Array(data);
  var resultBuffer = new Uint8Array(1 + data.byteLength);

  resultBuffer[0] = packets[packet.type];
  for (var i = 0; i < contentArray.length; i++) {
    resultBuffer[i+1] = contentArray[i];
  }

  return callback(resultBuffer.buffer);
}

function encodeBlobAsArrayBuffer(packet, supportsBinary, callback) {
  if (!supportsBinary) {
    return exports.encodeBase64Packet(packet, callback);
  }

  var fr = new FileReader();
  fr.onload = function() {
    packet.data = fr.result;
    exports.encodePacket(packet, supportsBinary, true, callback);
  };
  return fr.readAsArrayBuffer(packet.data);
}

function encodeBlob(packet, supportsBinary, callback) {
  if (!supportsBinary) {
    return exports.encodeBase64Packet(packet, callback);
  }

  if (dontSendBlobs) {
    return encodeBlobAsArrayBuffer(packet, supportsBinary, callback);
  }

  var length = new Uint8Array(1);
  length[0] = packets[packet.type];
  var blob = new Blob([length.buffer, packet.data]);

  return callback(blob);
}

/**
 * Encodes a packet with binary data in a base64 string
 *
 * @param {Object} packet, has `type` and `data`
 * @return {String} base64 encoded message
 */

exports.encodeBase64Packet = function(packet, callback) {
  var message = 'b' + exports.packets[packet.type];
  if (Blob && packet.data instanceof global.Blob) {
    var fr = new FileReader();
    fr.onload = function() {
      var b64 = fr.result.split(',')[1];
      callback(message + b64);
    };
    return fr.readAsDataURL(packet.data);
  }

  var b64data;
  try {
    b64data = String.fromCharCode.apply(null, new Uint8Array(packet.data));
  } catch (e) {
    // iPhone Safari doesn't let you apply with typed arrays
    var typed = new Uint8Array(packet.data);
    var basic = new Array(typed.length);
    for (var i = 0; i < typed.length; i++) {
      basic[i] = typed[i];
    }
    b64data = String.fromCharCode.apply(null, basic);
  }
  message += global.btoa(b64data);
  return callback(message);
};

/**
 * Decodes a packet. Changes format to Blob if requested.
 *
 * @return {Object} with `type` and `data` (if any)
 * @api private
 */

exports.decodePacket = function (data, binaryType, utf8decode) {
  if (data === undefined) {
    return err;
  }
  // String data
  if (typeof data === 'string') {
    if (data.charAt(0) === 'b') {
      return exports.decodeBase64Packet(data.substr(1), binaryType);
    }

    if (utf8decode) {
      data = tryDecode(data);
      if (data === false) {
        return err;
      }
    }
    var type = data.charAt(0);

    if (Number(type) != type || !packetslist[type]) {
      return err;
    }

    if (data.length > 1) {
      return { type: packetslist[type], data: data.substring(1) };
    } else {
      return { type: packetslist[type] };
    }
  }

  var asArray = new Uint8Array(data);
  var type = asArray[0];
  var rest = sliceBuffer(data, 1);
  if (Blob && binaryType === 'blob') {
    rest = new Blob([rest]);
  }
  return { type: packetslist[type], data: rest };
};

function tryDecode(data) {
  try {
    data = utf8.decode(data, { strict: false });
  } catch (e) {
    return false;
  }
  return data;
}

/**
 * Decodes a packet encoded in a base64 string
 *
 * @param {String} base64 encoded message
 * @return {Object} with `type` and `data` (if any)
 */

exports.decodeBase64Packet = function(msg, binaryType) {
  var type = packetslist[msg.charAt(0)];
  if (!base64encoder) {
    return { type: type, data: { base64: true, data: msg.substr(1) } };
  }

  var data = base64encoder.decode(msg.substr(1));

  if (binaryType === 'blob' && Blob) {
    data = new Blob([data]);
  }

  return { type: type, data: data };
};

/**
 * Encodes multiple messages (payload).
 *
 *     <length>:data
 *
 * Example:
 *
 *     11:hello world2:hi
 *
 * If any contents are binary, they will be encoded as base64 strings. Base64
 * encoded strings are marked with a b before the length specifier
 *
 * @param {Array} packets
 * @api private
 */

exports.encodePayload = function (packets, supportsBinary, callback) {
  if (typeof supportsBinary === 'function') {
    callback = supportsBinary;
    supportsBinary = null;
  }

  var isBinary = hasBinary(packets);

  if (supportsBinary && isBinary) {
    if (Blob && !dontSendBlobs) {
      return exports.encodePayloadAsBlob(packets, callback);
    }

    return exports.encodePayloadAsArrayBuffer(packets, callback);
  }

  if (!packets.length) {
    return callback('0:');
  }

  function setLengthHeader(message) {
    return message.length + ':' + message;
  }

  function encodeOne(packet, doneCallback) {
    exports.encodePacket(packet, !isBinary ? false : supportsBinary, false, function(message) {
      doneCallback(null, setLengthHeader(message));
    });
  }

  map(packets, encodeOne, function(err, results) {
    return callback(results.join(''));
  });
};

/**
 * Async array map using after
 */

function map(ary, each, done) {
  var result = new Array(ary.length);
  var next = after(ary.length, done);

  var eachWithIndex = function(i, el, cb) {
    each(el, function(error, msg) {
      result[i] = msg;
      cb(error, result);
    });
  };

  for (var i = 0; i < ary.length; i++) {
    eachWithIndex(i, ary[i], next);
  }
}

/*
 * Decodes data when a payload is maybe expected. Possible binary contents are
 * decoded from their base64 representation
 *
 * @param {String} data, callback method
 * @api public
 */

exports.decodePayload = function (data, binaryType, callback) {
  if (typeof data !== 'string') {
    return exports.decodePayloadAsBinary(data, binaryType, callback);
  }

  if (typeof binaryType === 'function') {
    callback = binaryType;
    binaryType = null;
  }

  var packet;
  if (data === '') {
    // parser error - ignoring payload
    return callback(err, 0, 1);
  }

  var length = '', n, msg;

  for (var i = 0, l = data.length; i < l; i++) {
    var chr = data.charAt(i);

    if (chr !== ':') {
      length += chr;
      continue;
    }

    if (length === '' || (length != (n = Number(length)))) {
      // parser error - ignoring payload
      return callback(err, 0, 1);
    }

    msg = data.substr(i + 1, n);

    if (length != msg.length) {
      // parser error - ignoring payload
      return callback(err, 0, 1);
    }

    if (msg.length) {
      packet = exports.decodePacket(msg, binaryType, false);

      if (err.type === packet.type && err.data === packet.data) {
        // parser error in individual packet - ignoring payload
        return callback(err, 0, 1);
      }

      var ret = callback(packet, i + n, l);
      if (false === ret) return;
    }

    // advance cursor
    i += n;
    length = '';
  }

  if (length !== '') {
    // parser error - ignoring payload
    return callback(err, 0, 1);
  }

};

/**
 * Encodes multiple messages (payload) as binary.
 *
 * <1 = binary, 0 = string><number from 0-9><number from 0-9>[...]<number
 * 255><data>
 *
 * Example:
 * 1 3 255 1 2 3, if the binary contents are interpreted as 8 bit integers
 *
 * @param {Array} packets
 * @return {ArrayBuffer} encoded payload
 * @api private
 */

exports.encodePayloadAsArrayBuffer = function(packets, callback) {
  if (!packets.length) {
    return callback(new ArrayBuffer(0));
  }

  function encodeOne(packet, doneCallback) {
    exports.encodePacket(packet, true, true, function(data) {
      return doneCallback(null, data);
    });
  }

  map(packets, encodeOne, function(err, encodedPackets) {
    var totalLength = encodedPackets.reduce(function(acc, p) {
      var len;
      if (typeof p === 'string'){
        len = p.length;
      } else {
        len = p.byteLength;
      }
      return acc + len.toString().length + len + 2; // string/binary identifier + separator = 2
    }, 0);

    var resultArray = new Uint8Array(totalLength);

    var bufferIndex = 0;
    encodedPackets.forEach(function(p) {
      var isString = typeof p === 'string';
      var ab = p;
      if (isString) {
        var view = new Uint8Array(p.length);
        for (var i = 0; i < p.length; i++) {
          view[i] = p.charCodeAt(i);
        }
        ab = view.buffer;
      }

      if (isString) { // not true binary
        resultArray[bufferIndex++] = 0;
      } else { // true binary
        resultArray[bufferIndex++] = 1;
      }

      var lenStr = ab.byteLength.toString();
      for (var i = 0; i < lenStr.length; i++) {
        resultArray[bufferIndex++] = parseInt(lenStr[i]);
      }
      resultArray[bufferIndex++] = 255;

      var view = new Uint8Array(ab);
      for (var i = 0; i < view.length; i++) {
        resultArray[bufferIndex++] = view[i];
      }
    });

    return callback(resultArray.buffer);
  });
};

/**
 * Encode as Blob
 */

exports.encodePayloadAsBlob = function(packets, callback) {
  function encodeOne(packet, doneCallback) {
    exports.encodePacket(packet, true, true, function(encoded) {
      var binaryIdentifier = new Uint8Array(1);
      binaryIdentifier[0] = 1;
      if (typeof encoded === 'string') {
        var view = new Uint8Array(encoded.length);
        for (var i = 0; i < encoded.length; i++) {
          view[i] = encoded.charCodeAt(i);
        }
        encoded = view.buffer;
        binaryIdentifier[0] = 0;
      }

      var len = (encoded instanceof ArrayBuffer)
        ? encoded.byteLength
        : encoded.size;

      var lenStr = len.toString();
      var lengthAry = new Uint8Array(lenStr.length + 1);
      for (var i = 0; i < lenStr.length; i++) {
        lengthAry[i] = parseInt(lenStr[i]);
      }
      lengthAry[lenStr.length] = 255;

      if (Blob) {
        var blob = new Blob([binaryIdentifier.buffer, lengthAry.buffer, encoded]);
        doneCallback(null, blob);
      }
    });
  }

  map(packets, encodeOne, function(err, results) {
    return callback(new Blob(results));
  });
};

/*
 * Decodes data when a payload is maybe expected. Strings are decoded by
 * interpreting each byte as a key code for entries marked to start with 0. See
 * description of encodePayloadAsBinary
 *
 * @param {ArrayBuffer} data, callback method
 * @api public
 */

exports.decodePayloadAsBinary = function (data, binaryType, callback) {
  if (typeof binaryType === 'function') {
    callback = binaryType;
    binaryType = null;
  }

  var bufferTail = data;
  var buffers = [];

  while (bufferTail.byteLength > 0) {
    var tailArray = new Uint8Array(bufferTail);
    var isString = tailArray[0] === 0;
    var msgLength = '';

    for (var i = 1; ; i++) {
      if (tailArray[i] === 255) break;

      // 310 = char length of Number.MAX_VALUE
      if (msgLength.length > 310) {
        return callback(err, 0, 1);
      }

      msgLength += tailArray[i];
    }

    bufferTail = sliceBuffer(bufferTail, 2 + msgLength.length);
    msgLength = parseInt(msgLength);

    var msg = sliceBuffer(bufferTail, 0, msgLength);
    if (isString) {
      try {
        msg = String.fromCharCode.apply(null, new Uint8Array(msg));
      } catch (e) {
        // iPhone Safari doesn't let you apply to typed arrays
        var typed = new Uint8Array(msg);
        msg = '';
        for (var i = 0; i < typed.length; i++) {
          msg += String.fromCharCode(typed[i]);
        }
      }
    }

    buffers.push(msg);
    bufferTail = sliceBuffer(bufferTail, msgLength);
  }

  var total = buffers.length;
  buffers.forEach(function(buffer, i) {
    callback(exports.decodePacket(buffer, binaryType, true), i, total);
  });
};

/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(3)))

/***/ }),
/* 10 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});

var _bullet = __webpack_require__(30);

var _bullet2 = _interopRequireDefault(_bullet);

var _weapon = __webpack_require__(57);

var _enemy = __webpack_require__(31);

var _enemy2 = _interopRequireDefault(_enemy);

var _player = __webpack_require__(17);

var _player2 = _interopRequireDefault(_player);

var _mainMenu = __webpack_require__(28);

var _eventHandlers = __webpack_require__(15);

var _enemyHandlers = __webpack_require__(29);

var _enemyHandlers2 = _interopRequireDefault(_enemyHandlers);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/* ----- Declares global variables ----- */


/* ----- Server Dependencies ----- */
var map = void 0,
    layer = void 0,
    players = void 0,
    cursors = void 0,
    fireButton = void 0,
    changeKey = void 0,
    collisionLayer = void 0,
    enemies = void 0,
    bullets = void 0,
    weapons = void 0,
    localPlayer = void 0;

/* ----- State Dependencies ----- */

/* ----- Phaser Dependencies ----- */


var gameWidth = 1000;
var gameHeight = 800;
var score = 0;

var enemyMap = [];
var numEnemies = 5;

var divName = 'game-container';

/* ----- Start Game Instance ----- */
//formerly Phaser.AUTO for rendering; forcing Phaser.CANVAS to boost performacne
// const game = new Phaser.Game(gameWidth, gameHeight, Phaser.AUTO, '', {
//     init: init,
//     preload: preload,
//     create: create,
//     update: update,
//     render: render
// })

var game = {
  init: init,
  preload: preload,
  create: create,
  update: update,
  render: render
};

function init() {
  game.stage.disableVisibilityChange = true;
}

function preload() {
  game.load.crossOrigin = 'anonymous';

  game.load.tilemap('desert', './assets/tilemaps/desert.json', null, Phaser.Tilemap.TILED_JSON);
  game.load.tilemap('forest', './assets/tilemaps/forest.json', null, Phaser.Tilemap.TILED_JSON);
  game.load.image('forestTiles', './assets/tilemaps/trees-and-bushes.png');
  game.load.image('tiles', './assets/tilemaps/tmw_desert_spacing.png');

  game.load.image('zombie', './assets/Zombie_Sprite.png');
  game.load.image('human', './assets/dude.png');
  game.load.image('bullet', './assets/singleBullet.png');
  game.load.image('lazer', './assets/lazer.png');
  game.load.spritesheet('zombies', './assets/zombie_sheet.png', 32, 48);
}

function create() {
  //mainMenu()

  configureGame();

  addMap('desert'); // specify map can be: ['desert', 'forest']

  addEnemies(numEnemies); //specify number of enemies to be added

  addWeapons();
  addPlayer(); // currently incomplete, need to finish tie up

  (0, _eventHandlers.setEventHandlers)(); // Start listening for events

  addInputs(); // Add game controls
  addScore(); // Score animations

  checkForNewPlayers();

  addEnemiesToGroup();
  _enemyHandlers2.default.addRemoteEnemies();
}

function update() {
  if (localPlayer) checkPlayerInputs(localPlayer);
  if (localPlayer) checkCollisions();

  /* Multiplayer Functions */
  if (localPlayer) moveRemotePlayer();
  if (localPlayer) shootPlayer();

  if (enemies) checkEnemyActions();
  if (enemies) _enemyHandlers2.default.moveEnemy();

  checkScore();

  checkRemovePlayer();
}

function render() {}
//  if (localPlayer) game.debug.text("Player Health: " + localPlayer.health + " / " + localPlayer.maxHealth, 32, 32);
//  if (localPlayer) game.debug.text("Player Score:  " + game.score, 32, 64);
//  if (localPlayer) game.debug.text("Enemies Remaining:  " + enemies.children.length, 32, 96);


//use this to sync with streams running external to the update loop
function retreiveGameTime() {
  return game.time;
}

/* =============== =============== ===============
  =============== CREATE FUNCTIONS ===============
  =============== =============== =============== */

function configureGame() {
  game.physics.startSystem(Phaser.Physics.ARCADE);
  game.forceSingleUpdate = true; //suggested sync config
  // game.world.setBounds(-1000, -1000, 2000, 2000)
  game.playerMap = {};
  game.scale.pageAlignHorizontally = true;
  game.scale.pageAlignVertically = true;
}

function addInputs() {
  cursors = game.input.keyboard.createCursorKeys();
  fireButton = game.input.keyboard.addKey(Phaser.KeyCode.SPACEBAR);
  changeKey = game.input.keyboard.addKey(Phaser.Keyboard.ENTER);
}

function addMap(type) {
  if (type === 'desert') desertMap();
  if (type === 'forest') forestMap();
}

function desertMap() {
  map = game.add.tilemap('desert');
  map.addTilesetImage('Desert', 'tiles');
  layer = map.createLayer('Ground');
  layer.resizeWorld();
}

function forestMap() {
  map = game.add.tilemap('forest');
  map.addTilesetImage('forestTiles', 'forestTiles');
  map.addTilesetImage('tmw_desert_spacing', 'tiles');
  layer = map.createLayer('MapLayer');
  collisionLayer = map.createLayer('CollisionLayer');
  collisionLayer.visible = false;
  map.setCollisionByExclusion([], true, collisionLayer);
}

//https://leanpub.com/html5shootemupinanafternoon/read <- info on randomizing enemy spawn
function addEnemies() {
  var number = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 100;

  enemies = game.add.group();
  _eventHandlers.socket.emit('newEnemies', { number: number, x: gameWidth, y: gameHeight });
}

function createScoreAnimation(x, y, message, score) {
  var scoreFont = "20px Arial";

  //Create a new label for the score
  var scoreAnimation = game.add.text(x, y, message, { font: scoreFont, fill: "#ff0000", stroke: "#ffffff", strokeThickness: 5 });
  scoreAnimation.anchor.setTo(0.5, 0);
  scoreAnimation.align = 'center';

  //Tween this score label to the total score label
  var scoreTween = game.add.tween(scoreAnimation).to({ x: game.world.centerX, y: 50 }, 800, Phaser.Easing.Exponential.In, true);

  //When the animation finishes, destroy this score label, trigger the total score labels animation and add the score
  scoreTween.onComplete.add(function () {
    scoreAnimation.destroy();
    game.scoreLabelTween.start();
    game.scoreBuffer += score;
  }, game);
}

function addScore() {
  game.score = 0;
  game.scoreBuffer = 0;
  // game.add.text(16, 16, 'score: 0', { fontSize: '32px', fill: '#111' })

  var scoreFont = "100px Indie Flower";

  //Create the score label -> may want to move away from adding it directly on game object?
  game.scoreLabel = game.add.text(game.world.centerX, 50, '0', { font: scoreFont, fill: "#ff0000", stroke: "#535353", strokeThickness: 15 });
  // scoreLabel.anchor.setTo(0.5, 0)
  game.scoreLabel.align = 'center';

  //Create a tween to grow / shrink the score label
  game.scoreLabelTween = game.add.tween(game.scoreLabel.scale).to({ x: 1.5, y: 1.5 }, 200, Phaser.Easing.Linear.In).to({ x: 1, y: 1 }, 200, Phaser.Easing.Linear.In);
}

function checkScore() {
  if (game.scoreBuffer > 0) {
    incrementScore();
    game.scoreBuffer--;
  }
}

function incrementScore() {
  game.score += 1;
  game.scoreLabel.text = game.score;
}

function addPlayer() {
  players = game.add.group();

  // game.localPlayer = new Player(game,100,game.world.height / 2,'zombie',50,5,game.weapons,socketId)
  // players.add(game.localPlayer)

  game.startX = 32;
  game.startY = game.world.height / 2;

  console.log(players);
  // game.camera.follow(game.localPlayer)
}

function addWeapons() {
  weapons = game.add.group();
  weapons.add(new _weapon.SingleBullet(game, 'bullet'));
  weapons.add(new _weapon.LazerBeam(game, 'lazer'));

  game.weapons = weapons;
}

/* =============== =============== ===============
  =============== UPDATE FUNCTIONS ===============
  =============== =============== =============== */

function checkPlayerInputs(player) {
  if (cursors.left.isDown) {
    player.body.x -= player.body.velocity.x;
    sendPlayerMovement(player);
  }
  if (cursors.right.isDown) {
    player.body.x += player.body.velocity.x;
    sendPlayerMovement(player);
  }

  if (cursors.up.isDown) {
    player.body.y -= player.body.velocity.y;
    sendPlayerMovement(player);
  }

  if (cursors.down.isDown) {
    player.body.y += player.body.velocity.y;
    sendPlayerMovement(player);
  }

  if (fireButton.isDown) {
    // player.weapons.children[player.currentWeapon].fire(player)
    sendShot(player);
  }

  if (changeKey.isDown) {
    changeWeapon(player);
  }
}

function changeWeapon(player) {
  if (player.currentWeapon === 1) {
    player.currentWeapon = 0;
    return player;
  }

  if (player.currentWeapon === 0) {
    player.currentWeapon = 1;
    return player;
  }
}

function checkCollisions() {
  game.physics.arcade.collide(localPlayer, collisionLayer);
  game.physics.arcade.collide(enemies, collisionLayer);

  /* Collide weaponry with enemies */
  game.physics.arcade.overlap(localPlayer.weapons, enemies, hitEnemy, null, this);

  /* Collide weaponry with other players */
  //currently a stretch goal to include 3v3 mode
  // game.physics.arcade.overlap(localPlayer.weapons, players, hitPlayer, null, this)
}

function hitEnemy(bullet, enemy) {
  var damage = bullet.parent.damage;
  enemy.takeDamage(damage);
  bullet.kill();
  console.log("Hit Zombie");
  _eventHandlers.socket.emit('enemyHit', { id: enemy.id, damage: damage });

  var score = damage;
  // game.score += 5
  createScoreAnimation(enemy.x, enemy.y, '' + score, 5);
}

function hitPlayer(bullet, player) {
  console.log(bullet, player);
  player.takeDamage(bullet.parent.damage);
  // bullet.kill() //<- hits own player
  console.log("Hit Player");
}

function aimRotation() {
  var myPoint = new Phaser.Point(sprite.width / 2 + 30, -sprite.height / 2);
  myPoint.rotate(sprite.rotation);
  this.getFirstExists(false).fire(sprite.x + myPoint.x, sprite.y + myPoint.y, sprite.rotation, BulletPool.BULLET_SPEED);
}

function checkEnemyActions() {
  if (enemies) enemies.children.map(enemyOperations);
}

function enemyOperations(enemy) {
  if (enemy.isAlive()) {
    _enemyHandlers2.default.sendEnemyMovement(enemy);
    return enemy;
  }
  return enemy.destroy();
}

/* =============== =============== ===============
  =============== MULTIPLAYER FUNCTIONS ===============
  =============== =============== =============== */

function sendShot(player) {
  var weapon = player.weapons.children[player.currentWeapon];

  if (checkTimeToFire(player, weapon)) {
    _eventHandlers.socket.emit('shoot', { id: player.id, x: player.body.x, y: player.body.y, v: weapon.bulletSpeed, r: player.body.rotation });
  }
}

function checkTimeToFire(player, weapon) {
  if (game.time.time < weapon.nextFire) {
    return false;
  } else {
    weapon.nextFire = game.time.time + weapon.fireRate;
    return true;
  }
}

function shootPlayer() {
  _eventHandlers.playerObs.on('shootPlayer', shootOperation);
}

function shootOperation(data) {
  var player = game.playerMap[data.pid];
  var weapon = player.weapons.children[player.currentWeapon];
  var bullet = weapon.children[data.id];
  bullet.reset(data.x, data.y);
  bullet.rotation = data.r;
  // bullet.body.velocity = game.physics.arcade.velocityFromRotation(bullet.rotation, bullet.body.velocity)
  game.physics.arcade.velocityFromAngle(bullet.rotation, weapon.bulletSpeed, bullet.body.velocity);
}

//similar to shoot operation, but removes velocity factor
function layMine(data) {
  var player = game.playerMap[data.pid];
  var weapon = player.weapons.children[player.currentWeapon];
  var bullet = weapon.children[data.id];
  bullet.reset(data.x, data.y);
  bullet.rotation = data.r;
}

function checkForNewPlayers() {
  _eventHandlers.playerObs.on('addPlayer', addPlayersToGame);
}

function addPlayersToGame(player) {
  console.log('Playerd added');
  players.add(player);
  game.playerMap[player.id] = player;
  //replace global localPlayer variable with an observable
  if (!localPlayer) {
    localPlayer = player;
    game.camera.follow(localPlayer);
  }
}

function sendPlayerMovement(player) {
  _eventHandlers.socket.emit('movePlayer', { id: player.id, x: player.body.x, y: player.body.y });
}

function moveRemotePlayer() {
  _eventHandlers.playerObs.on('movingPlayer', movePlayerOperation);
}

function movePlayerOperation(movePlayer) {
  var player = movePlayer.player;
  var xCord = movePlayer.data.x;
  var yCord = movePlayer.data.y;

  var distance = Phaser.Math.distance(player.x, player.y, xCord, yCord);
  var tween = game.add.tween(player);
  // const duration = distance*10
  tween.to({ x: xCord, y: yCord }, 5); //formerly duration
  tween.start();
}

function checkRemovePlayer() {
  _eventHandlers.playerObs.on('removePlayer', removeOperations);
}

function removeOperations(removePlayer) {
  removePlayer.kill();
  delete game.playerMap[removePlayer.id];
}

function addEnemiesToGroup() {
  _eventHandlers.playerObs.on('enemyGroup', function (data) {
    console.log('enemy data!!', data);
    return enemies.add(data);
  });
}

exports.default = game;

/***/ }),
/* 11 */
/***/ (function(module, exports) {


module.exports = function(a, b){
  var fn = function(){};
  fn.prototype = b.prototype;
  a.prototype = new fn;
  a.prototype.constructor = a;
};

/***/ }),
/* 12 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (immutable) */ __webpack_exports__["a"] = map;
/* harmony export (immutable) */ __webpack_exports__["b"] = constant;
/* harmony export (immutable) */ __webpack_exports__["c"] = tap;
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__Stream__ = __webpack_require__(0);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__fusion_Map__ = __webpack_require__(22);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__sink_Pipe__ = __webpack_require__(2);
/** @license MIT License (c) copyright 2010-2016 original author or authors */
/** @author Brian Cavalier */
/** @author John Hann */





/**
 * Transform each value in the stream by applying f to each
 * @param {function(*):*} f mapping function
 * @param {Stream} stream stream to map
 * @returns {Stream} stream containing items transformed by f
 */
function map (f, stream) {
  return new __WEBPACK_IMPORTED_MODULE_0__Stream__["a" /* default */](__WEBPACK_IMPORTED_MODULE_1__fusion_Map__["a" /* default */].create(f, stream.source))
}

/**
* Replace each value in the stream with x
* @param {*} x
* @param {Stream} stream
* @returns {Stream} stream containing items replaced with x
*/
function constant (x, stream) {
  return map(function () {
    return x
  }, stream)
}

/**
* Perform a side effect for each item in the stream
* @param {function(x:*):*} f side effect to execute for each item. The
*  return value will be discarded.
* @param {Stream} stream stream to tap
* @returns {Stream} new stream containing the same items as this stream
*/
function tap (f, stream) {
  return new __WEBPACK_IMPORTED_MODULE_0__Stream__["a" /* default */](new Tap(f, stream.source))
}

function Tap (f, source) {
  this.source = source
  this.f = f
}

Tap.prototype.run = function (sink, scheduler) {
  return this.source.run(new TapSink(this.f, sink), scheduler)
}

function TapSink (f, sink) {
  this.sink = sink
  this.f = f
}

TapSink.prototype.end = __WEBPACK_IMPORTED_MODULE_2__sink_Pipe__["a" /* default */].prototype.end
TapSink.prototype.error = __WEBPACK_IMPORTED_MODULE_2__sink_Pipe__["a" /* default */].prototype.error

TapSink.prototype.event = function (t, x) {
  var f = this.f
  f(x)
  this.sink.event(t, x)
}


/***/ }),
/* 13 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (immutable) */ __webpack_exports__["a"] = tryEvent;
/* harmony export (immutable) */ __webpack_exports__["b"] = tryEnd;
/** @license MIT License (c) copyright 2010-2016 original author or authors */
/** @author Brian Cavalier */
/** @author John Hann */

function tryEvent (t, x, sink) {
  try {
    sink.event(t, x)
  } catch (e) {
    sink.error(t, e)
  }
}

function tryEnd (t, x, sink) {
  try {
    sink.end(t, x)
  } catch (e) {
    sink.error(t, e)
  }
}


/***/ }),
/* 14 */
/***/ (function(module, exports) {

/**
 * Compiles a querystring
 * Returns string representation of the object
 *
 * @param {Object}
 * @api private
 */

exports.encode = function (obj) {
  var str = '';

  for (var i in obj) {
    if (obj.hasOwnProperty(i)) {
      if (str.length) str += '&';
      str += encodeURIComponent(i) + '=' + encodeURIComponent(obj[i]);
    }
  }

  return str;
};

/**
 * Parses a simple querystring into an object
 *
 * @param {String} qs
 * @api private
 */

exports.decode = function(qs){
  var qry = {};
  var pairs = qs.split('&');
  for (var i = 0, l = pairs.length; i < l; i++) {
    var pair = pairs[i].split('=');
    qry[decodeURIComponent(pair[0])] = decodeURIComponent(pair[1]);
  }
  return qry;
};


/***/ }),
/* 15 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.playerObs = exports.setEventHandlers = exports.socket = undefined;

var _socket = __webpack_require__(121);

var _socket2 = _interopRequireDefault(_socket);

var _eventEmitterEs = __webpack_require__(70);

var _eventEmitterEs2 = _interopRequireDefault(_eventEmitterEs);

var _player = __webpack_require__(17);

var _player2 = _interopRequireDefault(_player);

var _game = __webpack_require__(10);

var _game2 = _interopRequireDefault(_game);

var _playerHandlers = __webpack_require__(56);

var _playerHandlers2 = _interopRequireDefault(_playerHandlers);

var _enemyHandlers = __webpack_require__(29);

var _enemyHandlers2 = _interopRequireDefault(_enemyHandlers);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

// if(process.env.ENVIRONMENT === 'development') port = 'https://localhost:4000'


//http://www.dynetisgames.com/2017/03/06/how-to-make-a-multiplayer-online-game-with-phaser-socket-io-and-node-js/
//https://github.com/Jerenaux/basic-mmo-phaser/blob/master/js/client.js
//http://www.html5gamedevs.com/topic/29104-how-to-make-a-multiplayer-online-game-with-phaser-socketio-and-nodejs/

//https://gamedev.stackexchange.com/questions/124434/phaser-io-with-socket-io-what-should-the-server-calculate-and-what-the-client

//https://github.com/fbaiodias/phaser-multiplayer-game

//https://github.com/Langerz82/phasertanksmultiplayer

//https://github.com/crisu83/capthatflag/tree/feature/phaser-server

//http://www.gabrielgambetta.com/client-side-prediction-server-reconciliation.html

//https://socket.io/docs/using-multiple-nodes/


var socket = (0, _socket2.default)('http://localhost:4000');
// const socket = io('https://backend-service-ycmxwvaphy.now.sh')

var playerObs = new _eventEmitterEs2.default();

var remotePlayers = [];
var enemies = [];

function setEventHandlers() {

  // trigger game start
  socket.emit('newPlayer', { x: _game2.default.startX, y: _game2.default.startY });

  /** PLAYER EVENTS */

  // New player message received
  socket.on('newPlayer', _playerHandlers2.default.onNewPlayer);

  // Player move message received
  socket.on('movePlayer', _playerHandlers2.default.onMovePlayer);

  //shootPlayer(data.id,data.pid,data.x,data.y,data.v,data.r,data.tr);
  socket.on('shoot', _playerHandlers2.default.onShoot);

  // Player removed message received
  socket.on('removePlayer', _playerHandlers2.default.onRemovePlayer);

  // Socket disconnection
  socket.on('disconnect', _playerHandlers2.default.onSocketDisconnect);

  /** ENEMY EVENTS */

  // add enemies to the game
  socket.on('newEnemies', _enemyHandlers2.default.onNewEnemies);

  // Enemy move message received
  socket.on('moveEnemy', _enemyHandlers2.default.onMoveEnemy);

  //bulletHitPlayer(data);
  socket.on('enemyHit', _enemyHandlers2.default.onEnemyHit);

  socket.on('test', function (data) {
    return console.log('test', data);
  });
}

exports.socket = socket;
exports.setEventHandlers = setEventHandlers;
exports.playerObs = playerObs;

/***/ }),
/* 16 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});

var _game = __webpack_require__(10);

var _game2 = _interopRequireDefault(_game);

var _mainMenu = __webpack_require__(28);

var _mainMenu2 = _interopRequireDefault(_mainMenu);

var _boot = __webpack_require__(52);

var _boot2 = _interopRequireDefault(_boot);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var CivZombie = {};

var gameWidth = window.innerWidth;
var gameHeight = window.innerHeight;
CivZombie.game = new Phaser.Game(1000, 800, Phaser.AUTO, 'game-container');

CivZombie.game.state.add('Boot', _boot2.default);
CivZombie.game.state.add('MainMenu', _mainMenu2.default);
CivZombie.game.state.add('Game', _game2.default);

CivZombie.game.state.start('Boot');

exports.default = CivZombie;

/***/ }),
/* 17 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var Player = function (_Phaser$Sprite) {
  _inherits(Player, _Phaser$Sprite);

  function Player(game, x, y, avatar, health, speed, weapons, id) {
    _classCallCheck(this, Player);

    var _this = _possibleConstructorReturn(this, (Player.__proto__ || Object.getPrototypeOf(Player)).call(this, game, x, y, avatar));

    _this.game = game;
    _this.x = x;
    _this.y = y;
    _this.health = health || 50;
    _this.maxHealth = health;
    _this.speed = speed || 5;
    _this.avatar = 'zombie';
    _this.weapons = weapons;
    _this.id = id;
    _this.currentWeapon = 0;
    // this.anchor.setTo(0.5, 0.5) // <- purpose?

    game.physics.enable(_this);
    _this.body.velocity.x = 10;
    _this.body.velocity.y = 10;
    // this.body.collideWorldBounds = true;
    return _this;
  }

  _createClass(Player, [{
    key: 'removePlayer',
    value: function removePlayer(game, id) {
      game.playerMap[id].destroy();
      delete game.playerMap[id];
    }
  }, {
    key: 'takeDamage',
    value: function takeDamage(damage) {
      this.health -= damage;

      if (this.health <= 0) {
        this.health = 0;
        this.alive = false;
        this.kill();
        return true;
      }
      return false;
    }
  }]);

  return Player;
}(Phaser.Sprite);

exports.default = Player;

/***/ }),
/* 18 */
/***/ (function(module, exports, __webpack_require__) {

/**
 * Module dependencies.
 */

var parser = __webpack_require__(9);
var Emitter = __webpack_require__(8);

/**
 * Module exports.
 */

module.exports = Transport;

/**
 * Transport abstract constructor.
 *
 * @param {Object} options.
 * @api private
 */

function Transport (opts) {
  this.path = opts.path;
  this.hostname = opts.hostname;
  this.port = opts.port;
  this.secure = opts.secure;
  this.query = opts.query;
  this.timestampParam = opts.timestampParam;
  this.timestampRequests = opts.timestampRequests;
  this.readyState = '';
  this.agent = opts.agent || false;
  this.socket = opts.socket;
  this.enablesXDR = opts.enablesXDR;

  // SSL options for Node.js client
  this.pfx = opts.pfx;
  this.key = opts.key;
  this.passphrase = opts.passphrase;
  this.cert = opts.cert;
  this.ca = opts.ca;
  this.ciphers = opts.ciphers;
  this.rejectUnauthorized = opts.rejectUnauthorized;
  this.forceNode = opts.forceNode;

  // other options for Node.js client
  this.extraHeaders = opts.extraHeaders;
  this.localAddress = opts.localAddress;
}

/**
 * Mix in `Emitter`.
 */

Emitter(Transport.prototype);

/**
 * Emits an error.
 *
 * @param {String} str
 * @return {Transport} for chaining
 * @api public
 */

Transport.prototype.onError = function (msg, desc) {
  var err = new Error(msg);
  err.type = 'TransportError';
  err.description = desc;
  this.emit('error', err);
  return this;
};

/**
 * Opens the transport.
 *
 * @api public
 */

Transport.prototype.open = function () {
  if ('closed' === this.readyState || '' === this.readyState) {
    this.readyState = 'opening';
    this.doOpen();
  }

  return this;
};

/**
 * Closes the transport.
 *
 * @api private
 */

Transport.prototype.close = function () {
  if ('opening' === this.readyState || 'open' === this.readyState) {
    this.doClose();
    this.onClose();
  }

  return this;
};

/**
 * Sends multiple packets.
 *
 * @param {Array} packets
 * @api private
 */

Transport.prototype.send = function (packets) {
  if ('open' === this.readyState) {
    this.write(packets);
  } else {
    throw new Error('Transport not open');
  }
};

/**
 * Called upon open
 *
 * @api private
 */

Transport.prototype.onOpen = function () {
  this.readyState = 'open';
  this.writable = true;
  this.emit('open');
};

/**
 * Called with data.
 *
 * @param {String} data
 * @api private
 */

Transport.prototype.onData = function (data) {
  var packet = parser.decodePacket(data, this.socket.binaryType);
  this.onPacket(packet);
};

/**
 * Called with a decoded packet.
 */

Transport.prototype.onPacket = function (packet) {
  this.emit('packet', packet);
};

/**
 * Called upon close.
 *
 * @api private
 */

Transport.prototype.onClose = function () {
  this.readyState = 'closed';
  this.emit('close');
};


/***/ }),
/* 19 */
/***/ (function(module, exports, __webpack_require__) {

/* WEBPACK VAR INJECTION */(function(global) {// browser shim for xmlhttprequest module

var hasCORS = __webpack_require__(71);

module.exports = function (opts) {
  var xdomain = opts.xdomain;

  // scheme must be same when usign XDomainRequest
  // http://blogs.msdn.com/b/ieinternals/archive/2010/05/13/xdomainrequest-restrictions-limitations-and-workarounds.aspx
  var xscheme = opts.xscheme;

  // XDomainRequest has a flow of not sending cookie, therefore it should be disabled as a default.
  // https://github.com/Automattic/engine.io-client/pull/217
  var enablesXDR = opts.enablesXDR;

  // XMLHttpRequest can be disabled on IE
  try {
    if ('undefined' !== typeof XMLHttpRequest && (!xdomain || hasCORS)) {
      return new XMLHttpRequest();
    }
  } catch (e) { }

  // Use XDomainRequest for IE8 if enablesXDR is true
  // because loading bar keeps flashing when using jsonp-polling
  // https://github.com/yujiosaka/socke.io-ie8-loading-example
  try {
    if ('undefined' !== typeof XDomainRequest && !xscheme && enablesXDR) {
      return new XDomainRequest();
    }
  } catch (e) { }

  if (!xdomain) {
    try {
      return new global[['Active'].concat('Object').join('X')]('Microsoft.XMLHTTP');
    } catch (e) { }
  }
};

/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(3)))

/***/ }),
/* 20 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (immutable) */ __webpack_exports__["a"] = mergeConcurrently;
/* harmony export (immutable) */ __webpack_exports__["b"] = mergeMapConcurrently;
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__Stream__ = __webpack_require__(0);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__disposable_dispose__ = __webpack_require__(1);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__LinkedList__ = __webpack_require__(72);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3__most_prelude__ = __webpack_require__(4);
/** @license MIT License (c) copyright 2010-2016 original author or authors */
/** @author Brian Cavalier */
/** @author John Hann */






function mergeConcurrently (concurrency, stream) {
  return mergeMapConcurrently(__WEBPACK_IMPORTED_MODULE_3__most_prelude__["i" /* id */], concurrency, stream)
}

function mergeMapConcurrently (f, concurrency, stream) {
  return new __WEBPACK_IMPORTED_MODULE_0__Stream__["a" /* default */](new MergeConcurrently(f, concurrency, stream.source))
}

function MergeConcurrently (f, concurrency, source) {
  this.f = f
  this.concurrency = concurrency
  this.source = source
}

MergeConcurrently.prototype.run = function (sink, scheduler) {
  return new Outer(this.f, this.concurrency, this.source, sink, scheduler)
}

function Outer (f, concurrency, source, sink, scheduler) {
  this.f = f
  this.concurrency = concurrency
  this.sink = sink
  this.scheduler = scheduler
  this.pending = []
  this.current = new __WEBPACK_IMPORTED_MODULE_2__LinkedList__["a" /* default */]()
  this.disposable = __WEBPACK_IMPORTED_MODULE_1__disposable_dispose__["d" /* once */](source.run(this, scheduler))
  this.active = true
}

Outer.prototype.event = function (t, x) {
  this._addInner(t, x)
}

Outer.prototype._addInner = function (t, x) {
  if (this.current.length < this.concurrency) {
    this._startInner(t, x)
  } else {
    this.pending.push(x)
  }
}

Outer.prototype._startInner = function (t, x) {
  try {
    this._initInner(t, x)
  } catch (e) {
    this.error(t, e)
  }
}

Outer.prototype._initInner = function (t, x) {
  var innerSink = new Inner(t, this, this.sink)
  innerSink.disposable = mapAndRun(this.f, x, innerSink, this.scheduler)
  this.current.add(innerSink)
}

function mapAndRun (f, x, sink, scheduler) {
  return f(x).source.run(sink, scheduler)
}

Outer.prototype.end = function (t, x) {
  this.active = false
  __WEBPACK_IMPORTED_MODULE_1__disposable_dispose__["a" /* tryDispose */](t, this.disposable, this.sink)
  this._checkEnd(t, x)
}

Outer.prototype.error = function (t, e) {
  this.active = false
  this.sink.error(t, e)
}

Outer.prototype.dispose = function () {
  this.active = false
  this.pending.length = 0
  return Promise.all([this.disposable.dispose(), this.current.dispose()])
}

Outer.prototype._endInner = function (t, x, inner) {
  this.current.remove(inner)
  __WEBPACK_IMPORTED_MODULE_1__disposable_dispose__["a" /* tryDispose */](t, inner, this)

  if (this.pending.length === 0) {
    this._checkEnd(t, x)
  } else {
    this._startInner(t, this.pending.shift())
  }
}

Outer.prototype._checkEnd = function (t, x) {
  if (!this.active && this.current.isEmpty()) {
    this.sink.end(t, x)
  }
}

function Inner (time, outer, sink) {
  this.prev = this.next = null
  this.time = time
  this.outer = outer
  this.sink = sink
  this.disposable = void 0
}

Inner.prototype.event = function (t, x) {
  this.sink.event(Math.max(t, this.time), x)
}

Inner.prototype.end = function (t, x) {
  this.outer._endInner(Math.max(t, this.time), x, this)
}

Inner.prototype.error = function (t, e) {
  this.outer.error(Math.max(t, this.time), e)
}

Inner.prototype.dispose = function () {
  return this.disposable.dispose()
}


/***/ }),
/* 21 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (immutable) */ __webpack_exports__["a"] = fatalError;
/** @license MIT License (c) copyright 2010-2016 original author or authors */
/** @author Brian Cavalier */
/** @author John Hann */

function fatalError (e) {
  setTimeout(function () {
    throw e
  }, 0)
}


/***/ }),
/* 22 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (immutable) */ __webpack_exports__["a"] = Map;
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__sink_Pipe__ = __webpack_require__(2);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__Filter__ = __webpack_require__(41);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__FilterMap__ = __webpack_require__(97);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3__most_prelude__ = __webpack_require__(4);
/** @license MIT License (c) copyright 2010-2016 original author or authors */
/** @author Brian Cavalier */
/** @author John Hann */






function Map (f, source) {
  this.f = f
  this.source = source
}

/**
 * Create a mapped source, fusing adjacent map.map, filter.map,
 * and filter.map.map if possible
 * @param {function(*):*} f mapping function
 * @param {{run:function}} source source to map
 * @returns {Map|FilterMap} mapped source, possibly fused
 */
Map.create = function createMap (f, source) {
  if (source instanceof Map) {
    return new Map(__WEBPACK_IMPORTED_MODULE_3__most_prelude__["j" /* compose */](f, source.f), source.source)
  }

  if (source instanceof __WEBPACK_IMPORTED_MODULE_1__Filter__["a" /* default */]) {
    return new __WEBPACK_IMPORTED_MODULE_2__FilterMap__["a" /* default */](source.p, f, source.source)
  }

  return new Map(f, source)
}

Map.prototype.run = function (sink, scheduler) { // eslint-disable-line no-extend-native
  return this.source.run(new MapSink(this.f, sink), scheduler)
}

function MapSink (f, sink) {
  this.f = f
  this.sink = sink
}

MapSink.prototype.end = __WEBPACK_IMPORTED_MODULE_0__sink_Pipe__["a" /* default */].prototype.end
MapSink.prototype.error = __WEBPACK_IMPORTED_MODULE_0__sink_Pipe__["a" /* default */].prototype.error

MapSink.prototype.event = function (t, x) {
  var f = this.f
  this.sink.event(t, f(x))
}


/***/ }),
/* 23 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (immutable) */ __webpack_exports__["a"] = invoke;
/** @license MIT License (c) copyright 2010-2016 original author or authors */
/** @author Brian Cavalier */
/** @author John Hann */

function invoke (f, args) {
	/*eslint complexity: [2,7]*/
  switch (args.length) {
    case 0: return f()
    case 1: return f(args[0])
    case 2: return f(args[0], args[1])
    case 3: return f(args[0], args[1], args[2])
    case 4: return f(args[0], args[1], args[2], args[3])
    case 5: return f(args[0], args[1], args[2], args[3], args[4])
    default:
      return f.apply(void 0, args)
  }
}


/***/ }),
/* 24 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__Scheduler__ = __webpack_require__(104);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__ClockTimer__ = __webpack_require__(102);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__Timeline__ = __webpack_require__(105);
/** @license MIT License (c) copyright 2010-2016 original author or authors */
/** @author Brian Cavalier */
/** @author John Hann */





var defaultScheduler = new __WEBPACK_IMPORTED_MODULE_0__Scheduler__["a" /* default */](new __WEBPACK_IMPORTED_MODULE_1__ClockTimer__["a" /* default */](), new __WEBPACK_IMPORTED_MODULE_2__Timeline__["a" /* default */]())

/* harmony default export */ __webpack_exports__["a"] = (defaultScheduler);


/***/ }),
/* 25 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (immutable) */ __webpack_exports__["a"] = IndexSink;
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__Pipe__ = __webpack_require__(2);
/** @license MIT License (c) copyright 2010-2016 original author or authors */
/** @author Brian Cavalier */
/** @author John Hann */



function IndexSink (i, sink) {
  this.sink = sink
  this.index = i
  this.active = true
  this.value = void 0
}

IndexSink.prototype.event = function (t, x) {
  if (!this.active) {
    return
  }
  this.value = x
  this.sink.event(t, this)
}

IndexSink.prototype.end = function (t, x) {
  if (!this.active) {
    return
  }
  this.active = false
  this.sink.end(t, { index: this.index, value: x })
}

IndexSink.prototype.error = __WEBPACK_IMPORTED_MODULE_0__Pipe__["a" /* default */].prototype.error


/***/ }),
/* 26 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (immutable) */ __webpack_exports__["a"] = defer;
/* harmony export (immutable) */ __webpack_exports__["b"] = runTask;
/** @license MIT License (c) copyright 2010-2016 original author or authors */
/** @author Brian Cavalier */
/** @author John Hann */

function defer (task) {
  return Promise.resolve(task).then(runTask)
}

function runTask (task) {
  try {
    return task.run()
  } catch (e) {
    return task.error(e)
  }
}


/***/ }),
/* 27 */
/***/ (function(module, exports, __webpack_require__) {


/**
 * Module dependencies.
 */

var debug = __webpack_require__(5)('socket.io-parser');
var Emitter = __webpack_require__(8);
var hasBin = __webpack_require__(35);
var binary = __webpack_require__(123);
var isBuf = __webpack_require__(48);

/**
 * Protocol version.
 *
 * @api public
 */

exports.protocol = 4;

/**
 * Packet types.
 *
 * @api public
 */

exports.types = [
  'CONNECT',
  'DISCONNECT',
  'EVENT',
  'ACK',
  'ERROR',
  'BINARY_EVENT',
  'BINARY_ACK'
];

/**
 * Packet type `connect`.
 *
 * @api public
 */

exports.CONNECT = 0;

/**
 * Packet type `disconnect`.
 *
 * @api public
 */

exports.DISCONNECT = 1;

/**
 * Packet type `event`.
 *
 * @api public
 */

exports.EVENT = 2;

/**
 * Packet type `ack`.
 *
 * @api public
 */

exports.ACK = 3;

/**
 * Packet type `error`.
 *
 * @api public
 */

exports.ERROR = 4;

/**
 * Packet type 'binary event'
 *
 * @api public
 */

exports.BINARY_EVENT = 5;

/**
 * Packet type `binary ack`. For acks with binary arguments.
 *
 * @api public
 */

exports.BINARY_ACK = 6;

/**
 * Encoder constructor.
 *
 * @api public
 */

exports.Encoder = Encoder;

/**
 * Decoder constructor.
 *
 * @api public
 */

exports.Decoder = Decoder;

/**
 * A socket.io Encoder instance
 *
 * @api public
 */

function Encoder() {}

/**
 * Encode a packet as a single string if non-binary, or as a
 * buffer sequence, depending on packet type.
 *
 * @param {Object} obj - packet object
 * @param {Function} callback - function to handle encodings (likely engine.write)
 * @return Calls callback with Array of encodings
 * @api public
 */

Encoder.prototype.encode = function(obj, callback){
  if ((obj.type === exports.EVENT || obj.type === exports.ACK) && hasBin(obj.data)) {
    obj.type = obj.type === exports.EVENT ? exports.BINARY_EVENT : exports.BINARY_ACK;
  }

  debug('encoding packet %j', obj);

  if (exports.BINARY_EVENT === obj.type || exports.BINARY_ACK === obj.type) {
    encodeAsBinary(obj, callback);
  }
  else {
    var encoding = encodeAsString(obj);
    callback([encoding]);
  }
};

/**
 * Encode packet as string.
 *
 * @param {Object} packet
 * @return {String} encoded
 * @api private
 */

function encodeAsString(obj) {

  // first is type
  var str = '' + obj.type;

  // attachments if we have them
  if (exports.BINARY_EVENT === obj.type || exports.BINARY_ACK === obj.type) {
    str += obj.attachments + '-';
  }

  // if we have a namespace other than `/`
  // we append it followed by a comma `,`
  if (obj.nsp && '/' !== obj.nsp) {
    str += obj.nsp + ',';
  }

  // immediately followed by the id
  if (null != obj.id) {
    str += obj.id;
  }

  // json data
  if (null != obj.data) {
    str += JSON.stringify(obj.data);
  }

  debug('encoded %j as %s', obj, str);
  return str;
}

/**
 * Encode packet as 'buffer sequence' by removing blobs, and
 * deconstructing packet into object with placeholders and
 * a list of buffers.
 *
 * @param {Object} packet
 * @return {Buffer} encoded
 * @api private
 */

function encodeAsBinary(obj, callback) {

  function writeEncoding(bloblessData) {
    var deconstruction = binary.deconstructPacket(bloblessData);
    var pack = encodeAsString(deconstruction.packet);
    var buffers = deconstruction.buffers;

    buffers.unshift(pack); // add packet info to beginning of data list
    callback(buffers); // write all the buffers
  }

  binary.removeBlobs(obj, writeEncoding);
}

/**
 * A socket.io Decoder instance
 *
 * @return {Object} decoder
 * @api public
 */

function Decoder() {
  this.reconstructor = null;
}

/**
 * Mix in `Emitter` with Decoder.
 */

Emitter(Decoder.prototype);

/**
 * Decodes an ecoded packet string into packet JSON.
 *
 * @param {String} obj - encoded packet
 * @return {Object} packet
 * @api public
 */

Decoder.prototype.add = function(obj) {
  var packet;
  if (typeof obj === 'string') {
    packet = decodeString(obj);
    if (exports.BINARY_EVENT === packet.type || exports.BINARY_ACK === packet.type) { // binary packet's json
      this.reconstructor = new BinaryReconstructor(packet);

      // no attachments, labeled binary but no binary data to follow
      if (this.reconstructor.reconPack.attachments === 0) {
        this.emit('decoded', packet);
      }
    } else { // non-binary full packet
      this.emit('decoded', packet);
    }
  }
  else if (isBuf(obj) || obj.base64) { // raw binary data
    if (!this.reconstructor) {
      throw new Error('got binary data when not reconstructing a packet');
    } else {
      packet = this.reconstructor.takeBinaryData(obj);
      if (packet) { // received final buffer
        this.reconstructor = null;
        this.emit('decoded', packet);
      }
    }
  }
  else {
    throw new Error('Unknown type: ' + obj);
  }
};

/**
 * Decode a packet String (JSON data)
 *
 * @param {String} str
 * @return {Object} packet
 * @api private
 */

function decodeString(str) {
  var i = 0;
  // look up type
  var p = {
    type: Number(str.charAt(0))
  };

  if (null == exports.types[p.type]) return error();

  // look up attachments if type binary
  if (exports.BINARY_EVENT === p.type || exports.BINARY_ACK === p.type) {
    var buf = '';
    while (str.charAt(++i) !== '-') {
      buf += str.charAt(i);
      if (i == str.length) break;
    }
    if (buf != Number(buf) || str.charAt(i) !== '-') {
      throw new Error('Illegal attachments');
    }
    p.attachments = Number(buf);
  }

  // look up namespace (if any)
  if ('/' === str.charAt(i + 1)) {
    p.nsp = '';
    while (++i) {
      var c = str.charAt(i);
      if (',' === c) break;
      p.nsp += c;
      if (i === str.length) break;
    }
  } else {
    p.nsp = '/';
  }

  // look up id
  var next = str.charAt(i + 1);
  if ('' !== next && Number(next) == next) {
    p.id = '';
    while (++i) {
      var c = str.charAt(i);
      if (null == c || Number(c) != c) {
        --i;
        break;
      }
      p.id += str.charAt(i);
      if (i === str.length) break;
    }
    p.id = Number(p.id);
  }

  // look up json data
  if (str.charAt(++i)) {
    p = tryParse(p, str.substr(i));
  }

  debug('decoded %s as %j', str, p);
  return p;
}

function tryParse(p, str) {
  try {
    p.data = JSON.parse(str);
  } catch(e){
    return error();
  }
  return p; 
}

/**
 * Deallocates a parser's resources
 *
 * @api public
 */

Decoder.prototype.destroy = function() {
  if (this.reconstructor) {
    this.reconstructor.finishedReconstruction();
  }
};

/**
 * A manager of a binary event's 'buffer sequence'. Should
 * be constructed whenever a packet of type BINARY_EVENT is
 * decoded.
 *
 * @param {Object} packet
 * @return {BinaryReconstructor} initialized reconstructor
 * @api private
 */

function BinaryReconstructor(packet) {
  this.reconPack = packet;
  this.buffers = [];
}

/**
 * Method to be called when binary data received from connection
 * after a BINARY_EVENT packet.
 *
 * @param {Buffer | ArrayBuffer} binData - the raw binary data received
 * @return {null | Object} returns null if more binary data is expected or
 *   a reconstructed packet object if all buffers have been received.
 * @api private
 */

BinaryReconstructor.prototype.takeBinaryData = function(binData) {
  this.buffers.push(binData);
  if (this.buffers.length === this.reconPack.attachments) { // done with buffer list
    var packet = binary.reconstructPacket(this.reconPack, this.buffers);
    this.finishedReconstruction();
    return packet;
  }
  return null;
};

/**
 * Cleans up binary packet reconstruction variables.
 *
 * @api private
 */

BinaryReconstructor.prototype.finishedReconstruction = function() {
  this.reconPack = null;
  this.buffers = [];
};

function error() {
  return {
    type: exports.ERROR,
    data: 'parser error'
  };
}


/***/ }),
/* 28 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});

var _main = __webpack_require__(16);

var _main2 = _interopRequireDefault(_main);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var GameMenu = function GameMenu() {};

GameMenu.prototype = {
  preload: function preload() {
    _main2.default.game.load.image('preloadbar', 'assets/preloader-bar.png');
  },

  create: function create() {
    this.game.background = this.game.add.tileSprite(0, 0, this.game.width, this.game.height, 'space');

    //give it speed in x
    this.game.background.autoScroll(-20, 0);

    //start game text
    var text = "Tap to begin";
    var style = { font: "30px Arial", fill: "#fff", align: "center" };
    var t = this.game.add.text(this.game.width / 2, this.game.height / 2, text, style);
    t.anchor.set(0.5);

    //highest score
    //text = "Highest score: " + this.game.score
    text = 'Use Arrow Keys to Move, Press Space to Fire, \n Press Enter to change weapon';
    style = { font: "15px Arial", fill: "#fff", align: "center" };

    var h = this.game.add.text(this.game.width / 2, this.game.height / 2 + 50, text, style);
    h.anchor.set(0.5);

    t.inputEnabled = true;
    t.events.onInputDown.addOnce(this.startGame, this);
    console.log(this.game.state.getCurrentState());
  },

  // update: function () {
  //   if(game.input.activePointer.justPressed()) {
  //     console.log('starting game')
  //     CivZombie.game.state.start('Game')
  //   }
  // },

  startGame: function startGame() {
    console.log('game starting!');
    _main2.default.game.state.start('Game');
  }
};

function addInstructions() {
  var message = 'Use Arrow Keys to Move, Press Space to Fire, \n Press Enter to change weapon';
  var messageStyle = { font: '20px monospace', fill: '#fff', align: 'center' };
  game.instructions = game.add.text(400, 500, message, messageStyle);
  game.instructions.anchor.setTo(0.5, 0.5);
  game.instExpire = game.time.now + 10000;
}

exports.default = GameMenu;

/***/ }),
/* 29 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});

var _index = __webpack_require__(15);

var _enemy = __webpack_require__(31);

var _enemy2 = _interopRequireDefault(_enemy);

var _game = __webpack_require__(10);

var _game2 = _interopRequireDefault(_game);

var _most = __webpack_require__(98);

var most = _interopRequireWildcard(_most);

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var enemyMap = [];
//const enemies = game.add.group()

/** ADD ENEMIES */
function onNewEnemies(data) {
  console.log('new enemies to add!', data.enemyList, enemyMap.length);
  if (enemyMap.length < data.enemyList.length) {
    _index.playerObs.emit('addEnemies', data);
  }
}

//potentially utilize once?
function addRemoteEnemies() {
  _index.playerObs.on('addEnemies', addEnemyOperation);
}

function addEnemyOperation(enemyData) {
  if (enemyMap.length < 5) {
    enemyData.enemyList.forEach(function (enemy) {
      var newEnemy = new _enemy2.default(_game2.default, enemy.x, enemy.y, enemy.type, enemy.id);
      _index.playerObs.emit('enemyGroup', newEnemy);
      enemyMap.push(newEnemy);
    });
  }
}

/** MOVE ENEMIES */
//need to modify this to accept enemy collection
function sendEnemyMovement(enemy) {
  _index.socket.emit('moveEnemy', { id: enemy.id, x: enemy.body.x, y: enemy.body.y });
}

function onMoveEnemy(data) {
  var moveEnemy = enemyById(data.id);

  if (!moveEnemy) {
    console.log("Enemy (move) not found: " + data.id);
    return;
  }
  // playerObs.emit('movingEnemy', {id: moveEnemy.id, x: moveEnemy.body.x, y: moveEnemy.body.y})
  _index.playerObs.emit('movingEnemy', { id: moveEnemy.id, x: data.x, y: data.y });
}

function moveEnemy() {
  _index.playerObs.on('movingEnemy', moveEnemyOperation);
}

function moveEnemyOperation(moveEnemy) {
  var enemy = enemyById(moveEnemy.id);

  var xCord = moveEnemy.x;
  var yCord = moveEnemy.y;

  var distance = Phaser.Math.distance(enemy.body.x, enemy.body.y, xCord, yCord);
  var tween = _game2.default.add.tween(enemy);
  tween.to({ x: xCord, y: yCord }, 0);
  tween.start();

  //tween.remove(enemy) <-potential solution for memory consumption issue
}

function enemyById(id) {
  var identifiedEnemy = enemyMap.filter(function (enemy) {
    return enemy.id === id;
  });
  return identifiedEnemy.length > 0 ? identifiedEnemy[0] : false;
}

/** SHOOT ENEMIES */
function onEnemyHit(data) {
  var enemy = enemyById(data.id);
  console.log('enemy hit', data);

  if (data.alive) {
    enemy.health = data.health;
  } else {
    enemy.health = 0;
    enemy.kill();
  }
}

var enemyHandlers = { onNewEnemies: onNewEnemies, onMoveEnemy: onMoveEnemy, onEnemyHit: onEnemyHit, addRemoteEnemies: addRemoteEnemies, sendEnemyMovement: sendEnemyMovement, moveEnemy: moveEnemy };
exports.default = enemyHandlers;

/***/ }),
/* 30 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var Bullet = function (_Phaser$Sprite) {
  _inherits(Bullet, _Phaser$Sprite);

  function Bullet(game, type, tracking, id) {
    _classCallCheck(this, Bullet);

    var _this = _possibleConstructorReturn(this, (Bullet.__proto__ || Object.getPrototypeOf(Bullet)).call(this, game, 0, 0, type));

    _this.game = game;
    _this.type = type;
    _this.id = id;

    //prevent tracking on lazers
    if (_this.type === 'lazer') {
      tracking = false;
    }

    game.physics.enable(_this); //defaults to arcade

    _this.texture.baseTexture.scaleMode = PIXI.scaleModes.NEAREST;

    _this.anchor.set(0.5);

    _this.checkWorldBounds = true;
    _this.outOfBoundsKill = true;
    _this.exists = false;

    _this.tracking = tracking || false;
    _this.scaleSpeed = 0;
    return _this;
  }

  _createClass(Bullet, [{
    key: 'fire',
    value: function fire(x, y, angle, speed, gx, gy) {
      gx = gx || 0;
      gy = gy || 0;
      this.reset(x, y);
      this.scale.set(1);
      this.game.physics.arcade.velocityFromAngle(angle, speed, this.body.velocity);
      this.angle = angle;
      this.body.gravity.set(gx, gy);
    }
  }, {
    key: 'update',
    value: function update() {
      if (this.tracking) {
        this.rotation = Math.atan2(this.body.velocity.y, this.body.velocity.x);
      }
      if (this.scaleSpeed > 0) {
        this.scale.x += this.scaleSpeed;
        this.scale.y += this.scaleSpeed;
      }
    }
  }]);

  return Bullet;
}(Phaser.Sprite);

exports.default = Bullet;

/***/ }),
/* 31 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

//http://metroid.niklasberg.se/2016/02/12/phaser-making-and-using-a-generic-enemy-class-es6es2015/

//https://phaser.io/examples/v2/games/tanks

//http://www.html5gamedevs.com/topic/14281-help-needed-for-better-enemy-ai/
//^add functionality for more sophisticated enemy ai


var Enemy = function (_Phaser$Sprite) {
  _inherits(Enemy, _Phaser$Sprite);

  function Enemy(game, x, y, type, id) {
    _classCallCheck(this, Enemy);

    var _this = _possibleConstructorReturn(this, (Enemy.__proto__ || Object.getPrototypeOf(Enemy)).call(this, game, 0, 0, 'zombie'));

    _this.x = genRandomNum(x);
    _this.y = genRandomNum(y);
    _this.speed = 2;
    _this.type = type;
    _this.health = 30;
    _this.id = id;
    game.physics.enable(_this);
    return _this;
  }

  _createClass(Enemy, [{
    key: 'spawnEnemy',
    value: function spawnEnemy(game, x, y) {
      game.add.sprite(genRandomNum(x), genRandomNum(y), 'zombie');
    }
  }, {
    key: 'move',
    value: function move(game, enemy, player) {
      game.physics.arcade.moveToObject(enemy, player, 60, 0);
    }
  }, {
    key: 'isAlive',
    value: function isAlive() {
      if (this.health <= 0) {
        return false;
      }
      return true;
    }
  }, {
    key: 'takeDamage',
    value: function takeDamage(damage) {
      this.health -= damage;
    }
  }, {
    key: 'update',
    value: function update() {
      this.game.physics.arcade.collide(this, this.game.collisionLayer);

      // if (this.body.blocked.right) {
      //   this.scale.x = -1;
      //   this.body.x = genRandomNum(this.speed)
      // } else if (this.body.blocked.left) {
      //   this.scale.x = 1;
      //   this.body.velocity.x = genRandomNum(this.speed)
      // }
    }
  }]);

  return Enemy;
}(Phaser.Sprite);

function genRandomNum(factor) {
  return Math.floor(factor * Math.random());
}

function genMovement(factor) {
  return Math.floor(factor * (Math.round(Math.random()) * 2 - 1));
}

exports.default = Enemy;

/***/ }),
/* 32 */
/***/ (function(module, exports) {

/**
 * Slice reference.
 */

var slice = [].slice;

/**
 * Bind `obj` to `fn`.
 *
 * @param {Object} obj
 * @param {Function|String} fn or string
 * @return {Function}
 * @api public
 */

module.exports = function(obj, fn){
  if ('string' == typeof fn) fn = obj[fn];
  if ('function' != typeof fn) throw new Error('bind() requires a function');
  var args = slice.call(arguments, 2);
  return function(){
    return fn.apply(obj, args.concat(slice.call(arguments)));
  }
};


/***/ }),
/* 33 */
/***/ (function(module, exports, __webpack_require__) {

/* WEBPACK VAR INJECTION */(function(global) {/**
 * Module dependencies
 */

var XMLHttpRequest = __webpack_require__(19);
var XHR = __webpack_require__(66);
var JSONP = __webpack_require__(65);
var websocket = __webpack_require__(67);

/**
 * Export transports.
 */

exports.polling = polling;
exports.websocket = websocket;

/**
 * Polling transport polymorphic constructor.
 * Decides on xhr vs jsonp based on feature detection.
 *
 * @api private
 */

function polling (opts) {
  var xhr;
  var xd = false;
  var xs = false;
  var jsonp = false !== opts.jsonp;

  if (global.location) {
    var isSSL = 'https:' === location.protocol;
    var port = location.port;

    // some user agents have empty `location.port`
    if (!port) {
      port = isSSL ? 443 : 80;
    }

    xd = opts.hostname !== location.hostname || port !== opts.port;
    xs = opts.secure !== isSSL;
  }

  opts.xdomain = xd;
  opts.xscheme = xs;
  xhr = new XMLHttpRequest(opts);

  if ('open' in xhr && !opts.forceJSONP) {
    return new XHR(opts);
  } else {
    if (!jsonp) throw new Error('JSONP disabled');
    return new JSONP(opts);
  }
}

/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(3)))

/***/ }),
/* 34 */
/***/ (function(module, exports, __webpack_require__) {

/**
 * Module dependencies.
 */

var Transport = __webpack_require__(18);
var parseqs = __webpack_require__(14);
var parser = __webpack_require__(9);
var inherit = __webpack_require__(11);
var yeast = __webpack_require__(51);
var debug = __webpack_require__(5)('engine.io-client:polling');

/**
 * Module exports.
 */

module.exports = Polling;

/**
 * Is XHR2 supported?
 */

var hasXHR2 = (function () {
  var XMLHttpRequest = __webpack_require__(19);
  var xhr = new XMLHttpRequest({ xdomain: false });
  return null != xhr.responseType;
})();

/**
 * Polling interface.
 *
 * @param {Object} opts
 * @api private
 */

function Polling (opts) {
  var forceBase64 = (opts && opts.forceBase64);
  if (!hasXHR2 || forceBase64) {
    this.supportsBinary = false;
  }
  Transport.call(this, opts);
}

/**
 * Inherits from Transport.
 */

inherit(Polling, Transport);

/**
 * Transport name.
 */

Polling.prototype.name = 'polling';

/**
 * Opens the socket (triggers polling). We write a PING message to determine
 * when the transport is open.
 *
 * @api private
 */

Polling.prototype.doOpen = function () {
  this.poll();
};

/**
 * Pauses polling.
 *
 * @param {Function} callback upon buffers are flushed and transport is paused
 * @api private
 */

Polling.prototype.pause = function (onPause) {
  var self = this;

  this.readyState = 'pausing';

  function pause () {
    debug('paused');
    self.readyState = 'paused';
    onPause();
  }

  if (this.polling || !this.writable) {
    var total = 0;

    if (this.polling) {
      debug('we are currently polling - waiting to pause');
      total++;
      this.once('pollComplete', function () {
        debug('pre-pause polling complete');
        --total || pause();
      });
    }

    if (!this.writable) {
      debug('we are currently writing - waiting to pause');
      total++;
      this.once('drain', function () {
        debug('pre-pause writing complete');
        --total || pause();
      });
    }
  } else {
    pause();
  }
};

/**
 * Starts polling cycle.
 *
 * @api public
 */

Polling.prototype.poll = function () {
  debug('polling');
  this.polling = true;
  this.doPoll();
  this.emit('poll');
};

/**
 * Overloads onData to detect payloads.
 *
 * @api private
 */

Polling.prototype.onData = function (data) {
  var self = this;
  debug('polling got data %s', data);
  var callback = function (packet, index, total) {
    // if its the first message we consider the transport open
    if ('opening' === self.readyState) {
      self.onOpen();
    }

    // if its a close packet, we close the ongoing requests
    if ('close' === packet.type) {
      self.onClose();
      return false;
    }

    // otherwise bypass onData and handle the message
    self.onPacket(packet);
  };

  // decode payload
  parser.decodePayload(data, this.socket.binaryType, callback);

  // if an event did not trigger closing
  if ('closed' !== this.readyState) {
    // if we got data we're not polling
    this.polling = false;
    this.emit('pollComplete');

    if ('open' === this.readyState) {
      this.poll();
    } else {
      debug('ignoring poll - transport state "%s"', this.readyState);
    }
  }
};

/**
 * For polling, send a close packet.
 *
 * @api private
 */

Polling.prototype.doClose = function () {
  var self = this;

  function close () {
    debug('writing close packet');
    self.write([{ type: 'close' }]);
  }

  if ('open' === this.readyState) {
    debug('transport open - closing');
    close();
  } else {
    // in case we're trying to close while
    // handshaking is in progress (GH-164)
    debug('transport not open - deferring close');
    this.once('open', close);
  }
};

/**
 * Writes a packets payload.
 *
 * @param {Array} data packets
 * @param {Function} drain callback
 * @api private
 */

Polling.prototype.write = function (packets) {
  var self = this;
  this.writable = false;
  var callbackfn = function () {
    self.writable = true;
    self.emit('drain');
  };

  parser.encodePayload(packets, this.supportsBinary, function (data) {
    self.doWrite(data, callbackfn);
  });
};

/**
 * Generates uri for connection.
 *
 * @api private
 */

Polling.prototype.uri = function () {
  var query = this.query || {};
  var schema = this.secure ? 'https' : 'http';
  var port = '';

  // cache busting is forced
  if (false !== this.timestampRequests) {
    query[this.timestampParam] = yeast();
  }

  if (!this.supportsBinary && !query.sid) {
    query.b64 = 1;
  }

  query = parseqs.encode(query);

  // avoid port if default for schema
  if (this.port && (('https' === schema && Number(this.port) !== 443) ||
     ('http' === schema && Number(this.port) !== 80))) {
    port = ':' + this.port;
  }

  // prepend ? to query
  if (query.length) {
    query = '?' + query;
  }

  var ipv6 = this.hostname.indexOf(':') !== -1;
  return schema + '://' + (ipv6 ? '[' + this.hostname + ']' : this.hostname) + port + this.path + query;
};


/***/ }),
/* 35 */
/***/ (function(module, exports, __webpack_require__) {

/* WEBPACK VAR INJECTION */(function(global) {/* global Blob File */

/*
 * Module requirements.
 */

var isArray = __webpack_require__(37);

var toString = Object.prototype.toString;
var withNativeBlob = typeof global.Blob === 'function' || toString.call(global.Blob) === '[object BlobConstructor]';
var withNativeFile = typeof global.File === 'function' || toString.call(global.File) === '[object FileConstructor]';

/**
 * Module exports.
 */

module.exports = hasBinary;

/**
 * Checks for binary data.
 *
 * Supports Buffer, ArrayBuffer, Blob and File.
 *
 * @param {Object} anything
 * @api public
 */

function hasBinary (obj) {
  if (!obj || typeof obj !== 'object') {
    return false;
  }

  if (isArray(obj)) {
    for (var i = 0, l = obj.length; i < l; i++) {
      if (hasBinary(obj[i])) {
        return true;
      }
    }
    return false;
  }

  if ((typeof global.Buffer === 'function' && global.Buffer.isBuffer && global.Buffer.isBuffer(obj)) ||
     (typeof global.ArrayBuffer === 'function' && obj instanceof ArrayBuffer) ||
     (withNativeBlob && obj instanceof Blob) ||
     (withNativeFile && obj instanceof File)
    ) {
    return true;
  }

  // see: https://github.com/Automattic/has-binary/pull/4
  if (obj.toJSON && typeof obj.toJSON === 'function' && arguments.length === 1) {
    return hasBinary(obj.toJSON(), true);
  }

  for (var key in obj) {
    if (Object.prototype.hasOwnProperty.call(obj, key) && hasBinary(obj[key])) {
      return true;
    }
  }

  return false;
}

/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(3)))

/***/ }),
/* 36 */
/***/ (function(module, exports) {


var indexOf = [].indexOf;

module.exports = function(arr, obj){
  if (indexOf) return arr.indexOf(obj);
  for (var i = 0; i < arr.length; ++i) {
    if (arr[i] === obj) return i;
  }
  return -1;
};

/***/ }),
/* 37 */
/***/ (function(module, exports) {

var toString = {}.toString;

module.exports = Array.isArray || function (arr) {
  return toString.call(arr) == '[object Array]';
};


/***/ }),
/* 38 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (immutable) */ __webpack_exports__["a"] = combine;
/* harmony export (immutable) */ __webpack_exports__["b"] = combineArray;
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__Stream__ = __webpack_require__(0);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__transform__ = __webpack_require__(12);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__source_core__ = __webpack_require__(7);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3__sink_Pipe__ = __webpack_require__(2);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_4__sink_IndexSink__ = __webpack_require__(25);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_5__disposable_dispose__ = __webpack_require__(1);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_6__most_prelude__ = __webpack_require__(4);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_7__invoke__ = __webpack_require__(23);
/** @license MIT License (c) copyright 2010-2016 original author or authors */
/** @author Brian Cavalier */
/** @author John Hann */










var map = __WEBPACK_IMPORTED_MODULE_6__most_prelude__["h" /* map */]
var tail = __WEBPACK_IMPORTED_MODULE_6__most_prelude__["c" /* tail */]

/**
 * Combine latest events from all input streams
 * @param {function(...events):*} f function to combine most recent events
 * @returns {Stream} stream containing the result of applying f to the most recent
 *  event of each input stream, whenever a new event arrives on any stream.
 */
function combine (f /*, ...streams */) {
  return combineArray(f, tail(arguments))
}

/**
* Combine latest events from all input streams
* @param {function(...events):*} f function to combine most recent events
* @param {[Stream]} streams most recent events
* @returns {Stream} stream containing the result of applying f to the most recent
*  event of each input stream, whenever a new event arrives on any stream.
*/
function combineArray (f, streams) {
  var l = streams.length
  return l === 0 ? __WEBPACK_IMPORTED_MODULE_2__source_core__["b" /* empty */]()
  : l === 1 ? __WEBPACK_IMPORTED_MODULE_1__transform__["a" /* map */](f, streams[0])
  : new __WEBPACK_IMPORTED_MODULE_0__Stream__["a" /* default */](combineSources(f, streams))
}

function combineSources (f, streams) {
  return new Combine(f, map(getSource, streams))
}

function getSource (stream) {
  return stream.source
}

function Combine (f, sources) {
  this.f = f
  this.sources = sources
}

Combine.prototype.run = function (sink, scheduler) {
  var l = this.sources.length
  var disposables = new Array(l)
  var sinks = new Array(l)

  var mergeSink = new CombineSink(disposables, sinks, sink, this.f)

  for (var indexSink, i = 0; i < l; ++i) {
    indexSink = sinks[i] = new __WEBPACK_IMPORTED_MODULE_4__sink_IndexSink__["a" /* default */](i, mergeSink)
    disposables[i] = this.sources[i].run(indexSink, scheduler)
  }

  return __WEBPACK_IMPORTED_MODULE_5__disposable_dispose__["b" /* all */](disposables)
}

function CombineSink (disposables, sinks, sink, f) {
  this.sink = sink
  this.disposables = disposables
  this.sinks = sinks
  this.f = f

  var l = sinks.length
  this.awaiting = l
  this.values = new Array(l)
  this.hasValue = new Array(l)
  for (var i = 0; i < l; ++i) {
    this.hasValue[i] = false
  }

  this.activeCount = sinks.length
}

CombineSink.prototype.error = __WEBPACK_IMPORTED_MODULE_3__sink_Pipe__["a" /* default */].prototype.error

CombineSink.prototype.event = function (t, indexedValue) {
  var i = indexedValue.index
  var awaiting = this._updateReady(i)

  this.values[i] = indexedValue.value
  if (awaiting === 0) {
    this.sink.event(t, __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_7__invoke__["a" /* default */])(this.f, this.values))
  }
}

CombineSink.prototype._updateReady = function (index) {
  if (this.awaiting > 0) {
    if (!this.hasValue[index]) {
      this.hasValue[index] = true
      this.awaiting -= 1
    }
  }
  return this.awaiting
}

CombineSink.prototype.end = function (t, indexedValue) {
  __WEBPACK_IMPORTED_MODULE_5__disposable_dispose__["a" /* tryDispose */](t, this.disposables[indexedValue.index], this.sink)
  if (--this.activeCount === 0) {
    this.sink.end(t, indexedValue.value)
  }
}


/***/ }),
/* 39 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (immutable) */ __webpack_exports__["a"] = continueWith;
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__Stream__ = __webpack_require__(0);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__sink_Pipe__ = __webpack_require__(2);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__disposable_dispose__ = __webpack_require__(1);
/** @license MIT License (c) copyright 2010-2016 original author or authors */
/** @author Brian Cavalier */
/** @author John Hann */





function continueWith (f, stream) {
  return new __WEBPACK_IMPORTED_MODULE_0__Stream__["a" /* default */](new ContinueWith(f, stream.source))
}

function ContinueWith (f, source) {
  this.f = f
  this.source = source
}

ContinueWith.prototype.run = function (sink, scheduler) {
  return new ContinueWithSink(this.f, this.source, sink, scheduler)
}

function ContinueWithSink (f, source, sink, scheduler) {
  this.f = f
  this.sink = sink
  this.scheduler = scheduler
  this.active = true
  this.disposable = __WEBPACK_IMPORTED_MODULE_2__disposable_dispose__["d" /* once */](source.run(this, scheduler))
}

ContinueWithSink.prototype.error = __WEBPACK_IMPORTED_MODULE_1__sink_Pipe__["a" /* default */].prototype.error

ContinueWithSink.prototype.event = function (t, x) {
  if (!this.active) {
    return
  }
  this.sink.event(t, x)
}

ContinueWithSink.prototype.end = function (t, x) {
  if (!this.active) {
    return
  }

  __WEBPACK_IMPORTED_MODULE_2__disposable_dispose__["a" /* tryDispose */](t, this.disposable, this.sink)
  this._startNext(t, x, this.sink)
}

ContinueWithSink.prototype._startNext = function (t, x, sink) {
  try {
    this.disposable = this._continue(this.f, x, sink)
  } catch (e) {
    sink.error(t, e)
  }
}

ContinueWithSink.prototype._continue = function (f, x, sink) {
  return f(x).source.run(sink, this.scheduler)
}

ContinueWithSink.prototype.dispose = function () {
  this.active = false
  return this.disposable.dispose()
}


/***/ }),
/* 40 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (immutable) */ __webpack_exports__["a"] = flatMap;
/* harmony export (immutable) */ __webpack_exports__["b"] = join;
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__mergeConcurrently__ = __webpack_require__(20);
/** @license MIT License (c) copyright 2010-2016 original author or authors */
/** @author Brian Cavalier */
/** @author John Hann */



/**
 * Map each value in the stream to a new stream, and merge it into the
 * returned outer stream. Event arrival times are preserved.
 * @param {function(x:*):Stream} f chaining function, must return a Stream
 * @param {Stream} stream
 * @returns {Stream} new stream containing all events from each stream returned by f
 */
function flatMap (f, stream) {
  return __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_0__mergeConcurrently__["b" /* mergeMapConcurrently */])(f, Infinity, stream)
}

/**
 * Monadic join. Flatten a Stream<Stream<X>> to Stream<X> by merging inner
 * streams to the outer. Event arrival times are preserved.
 * @param {Stream<Stream<X>>} stream stream of streams
 * @returns {Stream<X>} new stream containing all events of all inner streams
 */
function join (stream) {
  return __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_0__mergeConcurrently__["a" /* mergeConcurrently */])(Infinity, stream)
}


/***/ }),
/* 41 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (immutable) */ __webpack_exports__["a"] = Filter;
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__sink_Pipe__ = __webpack_require__(2);
/** @license MIT License (c) copyright 2010-2016 original author or authors */
/** @author Brian Cavalier */
/** @author John Hann */



function Filter (p, source) {
  this.p = p
  this.source = source
}

/**
 * Create a filtered source, fusing adjacent filter.filter if possible
 * @param {function(x:*):boolean} p filtering predicate
 * @param {{run:function}} source source to filter
 * @returns {Filter} filtered source
 */
Filter.create = function createFilter (p, source) {
  if (source instanceof Filter) {
    return new Filter(and(source.p, p), source.source)
  }

  return new Filter(p, source)
}

Filter.prototype.run = function (sink, scheduler) {
  return this.source.run(new FilterSink(this.p, sink), scheduler)
}

function FilterSink (p, sink) {
  this.p = p
  this.sink = sink
}

FilterSink.prototype.end = __WEBPACK_IMPORTED_MODULE_0__sink_Pipe__["a" /* default */].prototype.end
FilterSink.prototype.error = __WEBPACK_IMPORTED_MODULE_0__sink_Pipe__["a" /* default */].prototype.error

FilterSink.prototype.event = function (t, x) {
  var p = this.p
  p(x) && this.sink.event(t, x)
}

function and (p, q) {
  return function (x) {
    return p(x) && q(x)
  }
}


/***/ }),
/* 42 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (immutable) */ __webpack_exports__["a"] = isIterable;
/* harmony export (immutable) */ __webpack_exports__["b"] = getIterator;
/* unused harmony export makeIterable */
/** @license MIT License (c) copyright 2010-2016 original author or authors */
/** @author Brian Cavalier */
/** @author John Hann */

/*global Set, Symbol*/
var iteratorSymbol
// Firefox ships a partial implementation using the name @@iterator.
// https://bugzilla.mozilla.org/show_bug.cgi?id=907077#c14
if (typeof Set === 'function' && typeof new Set()['@@iterator'] === 'function') {
  iteratorSymbol = '@@iterator'
} else {
  iteratorSymbol = typeof Symbol === 'function' && Symbol.iterator ||
  '_es6shim_iterator_'
}

function isIterable (o) {
  return typeof o[iteratorSymbol] === 'function'
}

function getIterator (o) {
  return o[iteratorSymbol]()
}

function makeIterable (f, o) {
  o[iteratorSymbol] = f
  return o
}


/***/ }),
/* 43 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (immutable) */ __webpack_exports__["a"] = withDefaultScheduler;
/* unused harmony export withScheduler */
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__disposable_dispose__ = __webpack_require__(1);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__scheduler_defaultScheduler__ = __webpack_require__(24);
/** @license MIT License (c) copyright 2010-2016 original author or authors */
/** @author Brian Cavalier */
/** @author John Hann */




function withDefaultScheduler (source) {
  return withScheduler(source, __WEBPACK_IMPORTED_MODULE_1__scheduler_defaultScheduler__["a" /* default */])
}

function withScheduler (source, scheduler) {
  return new Promise(function (resolve, reject) {
    runSource(source, scheduler, resolve, reject)
  })
}

function runSource (source, scheduler, resolve, reject) {
  var disposable = __WEBPACK_IMPORTED_MODULE_0__disposable_dispose__["e" /* settable */]()
  var observer = new Drain(resolve, reject, disposable)

  disposable.setDisposable(source.run(observer, scheduler))
}

function Drain (end, error, disposable) {
  this._end = end
  this._error = error
  this._disposable = disposable
  this.active = true
}

Drain.prototype.event = function (t, x) {}

Drain.prototype.end = function (t, x) {
  if (!this.active) {
    return
  }
  this.active = false
  disposeThen(this._end, this._error, this._disposable, x)
}

Drain.prototype.error = function (t, e) {
  this.active = false
  disposeThen(this._error, this._error, this._disposable, e)
}

function disposeThen (end, error, disposable, x) {
  Promise.resolve(disposable.dispose()).then(function () {
    end(x)
  }, error)
}


/***/ }),
/* 44 */
/***/ (function(module, exports) {

/**
 * Parses an URI
 *
 * @author Steven Levithan <stevenlevithan.com> (MIT license)
 * @api private
 */

var re = /^(?:(?![^:@]+:[^:@\/]*@)(http|https|ws|wss):\/\/)?((?:(([^:@]*)(?::([^:@]*))?)?@)?((?:[a-f0-9]{0,4}:){2,7}[a-f0-9]{0,4}|[^:\/?#]*)(?::(\d*))?)(((\/(?:[^?#](?![^?#\/]*\.[^?#\/.]+(?:[?#]|$)))*\/?)?([^?#\/]*))(?:\?([^#]*))?(?:#(.*))?)/;

var parts = [
    'source', 'protocol', 'authority', 'userInfo', 'user', 'password', 'host', 'port', 'relative', 'path', 'directory', 'file', 'query', 'anchor'
];

module.exports = function parseuri(str) {
    var src = str,
        b = str.indexOf('['),
        e = str.indexOf(']');

    if (b != -1 && e != -1) {
        str = str.substring(0, b) + str.substring(b, e).replace(/:/g, ';') + str.substring(e, str.length);
    }

    var m = re.exec(str || ''),
        uri = {},
        i = 14;

    while (i--) {
        uri[parts[i]] = m[i] || '';
    }

    if (b != -1 && e != -1) {
        uri.source = src;
        uri.host = uri.host.substring(1, uri.host.length - 1).replace(/;/g, ':');
        uri.authority = uri.authority.replace('[', '').replace(']', '').replace(/;/g, ':');
        uri.ipv6uri = true;
    }

    return uri;
};


/***/ }),
/* 45 */
/***/ (function(module, exports, __webpack_require__) {


/**
 * Module dependencies.
 */

var eio = __webpack_require__(62);
var Socket = __webpack_require__(47);
var Emitter = __webpack_require__(8);
var parser = __webpack_require__(27);
var on = __webpack_require__(46);
var bind = __webpack_require__(32);
var debug = __webpack_require__(5)('socket.io-client:manager');
var indexOf = __webpack_require__(36);
var Backoff = __webpack_require__(58);

/**
 * IE6+ hasOwnProperty
 */

var has = Object.prototype.hasOwnProperty;

/**
 * Module exports
 */

module.exports = Manager;

/**
 * `Manager` constructor.
 *
 * @param {String} engine instance or engine uri/opts
 * @param {Object} options
 * @api public
 */

function Manager (uri, opts) {
  if (!(this instanceof Manager)) return new Manager(uri, opts);
  if (uri && ('object' === typeof uri)) {
    opts = uri;
    uri = undefined;
  }
  opts = opts || {};

  opts.path = opts.path || '/socket.io';
  this.nsps = {};
  this.subs = [];
  this.opts = opts;
  this.reconnection(opts.reconnection !== false);
  this.reconnectionAttempts(opts.reconnectionAttempts || Infinity);
  this.reconnectionDelay(opts.reconnectionDelay || 1000);
  this.reconnectionDelayMax(opts.reconnectionDelayMax || 5000);
  this.randomizationFactor(opts.randomizationFactor || 0.5);
  this.backoff = new Backoff({
    min: this.reconnectionDelay(),
    max: this.reconnectionDelayMax(),
    jitter: this.randomizationFactor()
  });
  this.timeout(null == opts.timeout ? 20000 : opts.timeout);
  this.readyState = 'closed';
  this.uri = uri;
  this.connecting = [];
  this.lastPing = null;
  this.encoding = false;
  this.packetBuffer = [];
  var _parser = opts.parser || parser;
  this.encoder = new _parser.Encoder();
  this.decoder = new _parser.Decoder();
  this.autoConnect = opts.autoConnect !== false;
  if (this.autoConnect) this.open();
}

/**
 * Propagate given event to sockets and emit on `this`
 *
 * @api private
 */

Manager.prototype.emitAll = function () {
  this.emit.apply(this, arguments);
  for (var nsp in this.nsps) {
    if (has.call(this.nsps, nsp)) {
      this.nsps[nsp].emit.apply(this.nsps[nsp], arguments);
    }
  }
};

/**
 * Update `socket.id` of all sockets
 *
 * @api private
 */

Manager.prototype.updateSocketIds = function () {
  for (var nsp in this.nsps) {
    if (has.call(this.nsps, nsp)) {
      this.nsps[nsp].id = this.generateId(nsp);
    }
  }
};

/**
 * generate `socket.id` for the given `nsp`
 *
 * @param {String} nsp
 * @return {String}
 * @api private
 */

Manager.prototype.generateId = function (nsp) {
  return (nsp === '/' ? '' : (nsp + '#')) + this.engine.id;
};

/**
 * Mix in `Emitter`.
 */

Emitter(Manager.prototype);

/**
 * Sets the `reconnection` config.
 *
 * @param {Boolean} true/false if it should automatically reconnect
 * @return {Manager} self or value
 * @api public
 */

Manager.prototype.reconnection = function (v) {
  if (!arguments.length) return this._reconnection;
  this._reconnection = !!v;
  return this;
};

/**
 * Sets the reconnection attempts config.
 *
 * @param {Number} max reconnection attempts before giving up
 * @return {Manager} self or value
 * @api public
 */

Manager.prototype.reconnectionAttempts = function (v) {
  if (!arguments.length) return this._reconnectionAttempts;
  this._reconnectionAttempts = v;
  return this;
};

/**
 * Sets the delay between reconnections.
 *
 * @param {Number} delay
 * @return {Manager} self or value
 * @api public
 */

Manager.prototype.reconnectionDelay = function (v) {
  if (!arguments.length) return this._reconnectionDelay;
  this._reconnectionDelay = v;
  this.backoff && this.backoff.setMin(v);
  return this;
};

Manager.prototype.randomizationFactor = function (v) {
  if (!arguments.length) return this._randomizationFactor;
  this._randomizationFactor = v;
  this.backoff && this.backoff.setJitter(v);
  return this;
};

/**
 * Sets the maximum delay between reconnections.
 *
 * @param {Number} delay
 * @return {Manager} self or value
 * @api public
 */

Manager.prototype.reconnectionDelayMax = function (v) {
  if (!arguments.length) return this._reconnectionDelayMax;
  this._reconnectionDelayMax = v;
  this.backoff && this.backoff.setMax(v);
  return this;
};

/**
 * Sets the connection timeout. `false` to disable
 *
 * @return {Manager} self or value
 * @api public
 */

Manager.prototype.timeout = function (v) {
  if (!arguments.length) return this._timeout;
  this._timeout = v;
  return this;
};

/**
 * Starts trying to reconnect if reconnection is enabled and we have not
 * started reconnecting yet
 *
 * @api private
 */

Manager.prototype.maybeReconnectOnOpen = function () {
  // Only try to reconnect if it's the first time we're connecting
  if (!this.reconnecting && this._reconnection && this.backoff.attempts === 0) {
    // keeps reconnection from firing twice for the same reconnection loop
    this.reconnect();
  }
};

/**
 * Sets the current transport `socket`.
 *
 * @param {Function} optional, callback
 * @return {Manager} self
 * @api public
 */

Manager.prototype.open =
Manager.prototype.connect = function (fn, opts) {
  debug('readyState %s', this.readyState);
  if (~this.readyState.indexOf('open')) return this;

  debug('opening %s', this.uri);
  this.engine = eio(this.uri, this.opts);
  var socket = this.engine;
  var self = this;
  this.readyState = 'opening';
  this.skipReconnect = false;

  // emit `open`
  var openSub = on(socket, 'open', function () {
    self.onopen();
    fn && fn();
  });

  // emit `connect_error`
  var errorSub = on(socket, 'error', function (data) {
    debug('connect_error');
    self.cleanup();
    self.readyState = 'closed';
    self.emitAll('connect_error', data);
    if (fn) {
      var err = new Error('Connection error');
      err.data = data;
      fn(err);
    } else {
      // Only do this if there is no fn to handle the error
      self.maybeReconnectOnOpen();
    }
  });

  // emit `connect_timeout`
  if (false !== this._timeout) {
    var timeout = this._timeout;
    debug('connect attempt will timeout after %d', timeout);

    // set timer
    var timer = setTimeout(function () {
      debug('connect attempt timed out after %d', timeout);
      openSub.destroy();
      socket.close();
      socket.emit('error', 'timeout');
      self.emitAll('connect_timeout', timeout);
    }, timeout);

    this.subs.push({
      destroy: function () {
        clearTimeout(timer);
      }
    });
  }

  this.subs.push(openSub);
  this.subs.push(errorSub);

  return this;
};

/**
 * Called upon transport open.
 *
 * @api private
 */

Manager.prototype.onopen = function () {
  debug('open');

  // clear old subs
  this.cleanup();

  // mark as open
  this.readyState = 'open';
  this.emit('open');

  // add new subs
  var socket = this.engine;
  this.subs.push(on(socket, 'data', bind(this, 'ondata')));
  this.subs.push(on(socket, 'ping', bind(this, 'onping')));
  this.subs.push(on(socket, 'pong', bind(this, 'onpong')));
  this.subs.push(on(socket, 'error', bind(this, 'onerror')));
  this.subs.push(on(socket, 'close', bind(this, 'onclose')));
  this.subs.push(on(this.decoder, 'decoded', bind(this, 'ondecoded')));
};

/**
 * Called upon a ping.
 *
 * @api private
 */

Manager.prototype.onping = function () {
  this.lastPing = new Date();
  this.emitAll('ping');
};

/**
 * Called upon a packet.
 *
 * @api private
 */

Manager.prototype.onpong = function () {
  this.emitAll('pong', new Date() - this.lastPing);
};

/**
 * Called with data.
 *
 * @api private
 */

Manager.prototype.ondata = function (data) {
  this.decoder.add(data);
};

/**
 * Called when parser fully decodes a packet.
 *
 * @api private
 */

Manager.prototype.ondecoded = function (packet) {
  this.emit('packet', packet);
};

/**
 * Called upon socket error.
 *
 * @api private
 */

Manager.prototype.onerror = function (err) {
  debug('error', err);
  this.emitAll('error', err);
};

/**
 * Creates a new socket for the given `nsp`.
 *
 * @return {Socket}
 * @api public
 */

Manager.prototype.socket = function (nsp, opts) {
  var socket = this.nsps[nsp];
  if (!socket) {
    socket = new Socket(this, nsp, opts);
    this.nsps[nsp] = socket;
    var self = this;
    socket.on('connecting', onConnecting);
    socket.on('connect', function () {
      socket.id = self.generateId(nsp);
    });

    if (this.autoConnect) {
      // manually call here since connecting event is fired before listening
      onConnecting();
    }
  }

  function onConnecting () {
    if (!~indexOf(self.connecting, socket)) {
      self.connecting.push(socket);
    }
  }

  return socket;
};

/**
 * Called upon a socket close.
 *
 * @param {Socket} socket
 */

Manager.prototype.destroy = function (socket) {
  var index = indexOf(this.connecting, socket);
  if (~index) this.connecting.splice(index, 1);
  if (this.connecting.length) return;

  this.close();
};

/**
 * Writes a packet.
 *
 * @param {Object} packet
 * @api private
 */

Manager.prototype.packet = function (packet) {
  debug('writing packet %j', packet);
  var self = this;
  if (packet.query && packet.type === 0) packet.nsp += '?' + packet.query;

  if (!self.encoding) {
    // encode, then write to engine with result
    self.encoding = true;
    this.encoder.encode(packet, function (encodedPackets) {
      for (var i = 0; i < encodedPackets.length; i++) {
        self.engine.write(encodedPackets[i], packet.options);
      }
      self.encoding = false;
      self.processPacketQueue();
    });
  } else { // add packet to the queue
    self.packetBuffer.push(packet);
  }
};

/**
 * If packet buffer is non-empty, begins encoding the
 * next packet in line.
 *
 * @api private
 */

Manager.prototype.processPacketQueue = function () {
  if (this.packetBuffer.length > 0 && !this.encoding) {
    var pack = this.packetBuffer.shift();
    this.packet(pack);
  }
};

/**
 * Clean up transport subscriptions and packet buffer.
 *
 * @api private
 */

Manager.prototype.cleanup = function () {
  debug('cleanup');

  var subsLength = this.subs.length;
  for (var i = 0; i < subsLength; i++) {
    var sub = this.subs.shift();
    sub.destroy();
  }

  this.packetBuffer = [];
  this.encoding = false;
  this.lastPing = null;

  this.decoder.destroy();
};

/**
 * Close the current socket.
 *
 * @api private
 */

Manager.prototype.close =
Manager.prototype.disconnect = function () {
  debug('disconnect');
  this.skipReconnect = true;
  this.reconnecting = false;
  if ('opening' === this.readyState) {
    // `onclose` will not fire because
    // an open event never happened
    this.cleanup();
  }
  this.backoff.reset();
  this.readyState = 'closed';
  if (this.engine) this.engine.close();
};

/**
 * Called upon engine close.
 *
 * @api private
 */

Manager.prototype.onclose = function (reason) {
  debug('onclose');

  this.cleanup();
  this.backoff.reset();
  this.readyState = 'closed';
  this.emit('close', reason);

  if (this._reconnection && !this.skipReconnect) {
    this.reconnect();
  }
};

/**
 * Attempt a reconnection.
 *
 * @api private
 */

Manager.prototype.reconnect = function () {
  if (this.reconnecting || this.skipReconnect) return this;

  var self = this;

  if (this.backoff.attempts >= this._reconnectionAttempts) {
    debug('reconnect failed');
    this.backoff.reset();
    this.emitAll('reconnect_failed');
    this.reconnecting = false;
  } else {
    var delay = this.backoff.duration();
    debug('will wait %dms before reconnect attempt', delay);

    this.reconnecting = true;
    var timer = setTimeout(function () {
      if (self.skipReconnect) return;

      debug('attempting reconnect');
      self.emitAll('reconnect_attempt', self.backoff.attempts);
      self.emitAll('reconnecting', self.backoff.attempts);

      // check again for the case socket closed in above events
      if (self.skipReconnect) return;

      self.open(function (err) {
        if (err) {
          debug('reconnect attempt error');
          self.reconnecting = false;
          self.reconnect();
          self.emitAll('reconnect_error', err.data);
        } else {
          debug('reconnect success');
          self.onreconnect();
        }
      });
    }, delay);

    this.subs.push({
      destroy: function () {
        clearTimeout(timer);
      }
    });
  }
};

/**
 * Called upon successful reconnect.
 *
 * @api private
 */

Manager.prototype.onreconnect = function () {
  var attempt = this.backoff.attempts;
  this.reconnecting = false;
  this.backoff.reset();
  this.updateSocketIds();
  this.emitAll('reconnect', attempt);
};


/***/ }),
/* 46 */
/***/ (function(module, exports) {


/**
 * Module exports.
 */

module.exports = on;

/**
 * Helper for subscriptions.
 *
 * @param {Object|EventEmitter} obj with `Emitter` mixin or `EventEmitter`
 * @param {String} event name
 * @param {Function} callback
 * @api public
 */

function on (obj, ev, fn) {
  obj.on(ev, fn);
  return {
    destroy: function () {
      obj.removeListener(ev, fn);
    }
  };
}


/***/ }),
/* 47 */
/***/ (function(module, exports, __webpack_require__) {


/**
 * Module dependencies.
 */

var parser = __webpack_require__(27);
var Emitter = __webpack_require__(8);
var toArray = __webpack_require__(126);
var on = __webpack_require__(46);
var bind = __webpack_require__(32);
var debug = __webpack_require__(5)('socket.io-client:socket');
var parseqs = __webpack_require__(14);

/**
 * Module exports.
 */

module.exports = exports = Socket;

/**
 * Internal events (blacklisted).
 * These events can't be emitted by the user.
 *
 * @api private
 */

var events = {
  connect: 1,
  connect_error: 1,
  connect_timeout: 1,
  connecting: 1,
  disconnect: 1,
  error: 1,
  reconnect: 1,
  reconnect_attempt: 1,
  reconnect_failed: 1,
  reconnect_error: 1,
  reconnecting: 1,
  ping: 1,
  pong: 1
};

/**
 * Shortcut to `Emitter#emit`.
 */

var emit = Emitter.prototype.emit;

/**
 * `Socket` constructor.
 *
 * @api public
 */

function Socket (io, nsp, opts) {
  this.io = io;
  this.nsp = nsp;
  this.json = this; // compat
  this.ids = 0;
  this.acks = {};
  this.receiveBuffer = [];
  this.sendBuffer = [];
  this.connected = false;
  this.disconnected = true;
  if (opts && opts.query) {
    this.query = opts.query;
  }
  if (this.io.autoConnect) this.open();
}

/**
 * Mix in `Emitter`.
 */

Emitter(Socket.prototype);

/**
 * Subscribe to open, close and packet events
 *
 * @api private
 */

Socket.prototype.subEvents = function () {
  if (this.subs) return;

  var io = this.io;
  this.subs = [
    on(io, 'open', bind(this, 'onopen')),
    on(io, 'packet', bind(this, 'onpacket')),
    on(io, 'close', bind(this, 'onclose'))
  ];
};

/**
 * "Opens" the socket.
 *
 * @api public
 */

Socket.prototype.open =
Socket.prototype.connect = function () {
  if (this.connected) return this;

  this.subEvents();
  this.io.open(); // ensure open
  if ('open' === this.io.readyState) this.onopen();
  this.emit('connecting');
  return this;
};

/**
 * Sends a `message` event.
 *
 * @return {Socket} self
 * @api public
 */

Socket.prototype.send = function () {
  var args = toArray(arguments);
  args.unshift('message');
  this.emit.apply(this, args);
  return this;
};

/**
 * Override `emit`.
 * If the event is in `events`, it's emitted normally.
 *
 * @param {String} event name
 * @return {Socket} self
 * @api public
 */

Socket.prototype.emit = function (ev) {
  if (events.hasOwnProperty(ev)) {
    emit.apply(this, arguments);
    return this;
  }

  var args = toArray(arguments);
  var packet = { type: parser.EVENT, data: args };

  packet.options = {};
  packet.options.compress = !this.flags || false !== this.flags.compress;

  // event ack callback
  if ('function' === typeof args[args.length - 1]) {
    debug('emitting packet with ack id %d', this.ids);
    this.acks[this.ids] = args.pop();
    packet.id = this.ids++;
  }

  if (this.connected) {
    this.packet(packet);
  } else {
    this.sendBuffer.push(packet);
  }

  delete this.flags;

  return this;
};

/**
 * Sends a packet.
 *
 * @param {Object} packet
 * @api private
 */

Socket.prototype.packet = function (packet) {
  packet.nsp = this.nsp;
  this.io.packet(packet);
};

/**
 * Called upon engine `open`.
 *
 * @api private
 */

Socket.prototype.onopen = function () {
  debug('transport is open - connecting');

  // write connect packet if necessary
  if ('/' !== this.nsp) {
    if (this.query) {
      var query = typeof this.query === 'object' ? parseqs.encode(this.query) : this.query;
      debug('sending connect packet with query %s', query);
      this.packet({type: parser.CONNECT, query: query});
    } else {
      this.packet({type: parser.CONNECT});
    }
  }
};

/**
 * Called upon engine `close`.
 *
 * @param {String} reason
 * @api private
 */

Socket.prototype.onclose = function (reason) {
  debug('close (%s)', reason);
  this.connected = false;
  this.disconnected = true;
  delete this.id;
  this.emit('disconnect', reason);
};

/**
 * Called with socket packet.
 *
 * @param {Object} packet
 * @api private
 */

Socket.prototype.onpacket = function (packet) {
  if (packet.nsp !== this.nsp) return;

  switch (packet.type) {
    case parser.CONNECT:
      this.onconnect();
      break;

    case parser.EVENT:
      this.onevent(packet);
      break;

    case parser.BINARY_EVENT:
      this.onevent(packet);
      break;

    case parser.ACK:
      this.onack(packet);
      break;

    case parser.BINARY_ACK:
      this.onack(packet);
      break;

    case parser.DISCONNECT:
      this.ondisconnect();
      break;

    case parser.ERROR:
      this.emit('error', packet.data);
      break;
  }
};

/**
 * Called upon a server event.
 *
 * @param {Object} packet
 * @api private
 */

Socket.prototype.onevent = function (packet) {
  var args = packet.data || [];
  debug('emitting event %j', args);

  if (null != packet.id) {
    debug('attaching ack callback to event');
    args.push(this.ack(packet.id));
  }

  if (this.connected) {
    emit.apply(this, args);
  } else {
    this.receiveBuffer.push(args);
  }
};

/**
 * Produces an ack callback to emit with an event.
 *
 * @api private
 */

Socket.prototype.ack = function (id) {
  var self = this;
  var sent = false;
  return function () {
    // prevent double callbacks
    if (sent) return;
    sent = true;
    var args = toArray(arguments);
    debug('sending ack %j', args);

    self.packet({
      type: parser.ACK,
      id: id,
      data: args
    });
  };
};

/**
 * Called upon a server acknowlegement.
 *
 * @param {Object} packet
 * @api private
 */

Socket.prototype.onack = function (packet) {
  var ack = this.acks[packet.id];
  if ('function' === typeof ack) {
    debug('calling ack %s with %j', packet.id, packet.data);
    ack.apply(this, packet.data);
    delete this.acks[packet.id];
  } else {
    debug('bad ack %s', packet.id);
  }
};

/**
 * Called upon server connect.
 *
 * @api private
 */

Socket.prototype.onconnect = function () {
  this.connected = true;
  this.disconnected = false;
  this.emit('connect');
  this.emitBuffered();
};

/**
 * Emit buffered events (received and emitted).
 *
 * @api private
 */

Socket.prototype.emitBuffered = function () {
  var i;
  for (i = 0; i < this.receiveBuffer.length; i++) {
    emit.apply(this, this.receiveBuffer[i]);
  }
  this.receiveBuffer = [];

  for (i = 0; i < this.sendBuffer.length; i++) {
    this.packet(this.sendBuffer[i]);
  }
  this.sendBuffer = [];
};

/**
 * Called upon server disconnect.
 *
 * @api private
 */

Socket.prototype.ondisconnect = function () {
  debug('server disconnect (%s)', this.nsp);
  this.destroy();
  this.onclose('io server disconnect');
};

/**
 * Called upon forced client/server side disconnections,
 * this method ensures the manager stops tracking us and
 * that reconnections don't get triggered for this.
 *
 * @api private.
 */

Socket.prototype.destroy = function () {
  if (this.subs) {
    // clean subscriptions to avoid reconnections
    for (var i = 0; i < this.subs.length; i++) {
      this.subs[i].destroy();
    }
    this.subs = null;
  }

  this.io.destroy(this);
};

/**
 * Disconnects the socket manually.
 *
 * @return {Socket} self
 * @api public
 */

Socket.prototype.close =
Socket.prototype.disconnect = function () {
  if (this.connected) {
    debug('performing disconnect (%s)', this.nsp);
    this.packet({ type: parser.DISCONNECT });
  }

  // remove socket from pool
  this.destroy();

  if (this.connected) {
    // fire events
    this.onclose('io client disconnect');
  }
  return this;
};

/**
 * Sets the compress flag.
 *
 * @param {Boolean} if `true`, compresses the sending data
 * @return {Socket} self
 * @api public
 */

Socket.prototype.compress = function (compress) {
  this.flags = this.flags || {};
  this.flags.compress = compress;
  return this;
};


/***/ }),
/* 48 */
/***/ (function(module, exports, __webpack_require__) {

/* WEBPACK VAR INJECTION */(function(global) {
module.exports = isBuf;

/**
 * Returns true if obj is a buffer or an arraybuffer.
 *
 * @api private
 */

function isBuf(obj) {
  return (global.Buffer && global.Buffer.isBuffer(obj)) ||
         (global.ArrayBuffer && obj instanceof ArrayBuffer);
}

/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(3)))

/***/ }),
/* 49 */
/***/ (function(module, exports, __webpack_require__) {

module.exports = __webpack_require__(124);


/***/ }),
/* 50 */
/***/ (function(module, exports) {

module.exports = function(module) {
	if(!module.webpackPolyfill) {
		module.deprecate = function() {};
		module.paths = [];
		// module.parent = undefined by default
		if(!module.children) module.children = [];
		Object.defineProperty(module, "loaded", {
			enumerable: true,
			get: function() {
				return module.l;
			}
		});
		Object.defineProperty(module, "id", {
			enumerable: true,
			get: function() {
				return module.i;
			}
		});
		module.webpackPolyfill = 1;
	}
	return module;
};


/***/ }),
/* 51 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var alphabet = '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz-_'.split('')
  , length = 64
  , map = {}
  , seed = 0
  , i = 0
  , prev;

/**
 * Return a string representing the specified number.
 *
 * @param {Number} num The number to convert.
 * @returns {String} The string representation of the number.
 * @api public
 */
function encode(num) {
  var encoded = '';

  do {
    encoded = alphabet[num % length] + encoded;
    num = Math.floor(num / length);
  } while (num > 0);

  return encoded;
}

/**
 * Return the integer value specified by the given string.
 *
 * @param {String} str The string to convert.
 * @returns {Number} The integer value represented by the string.
 * @api public
 */
function decode(str) {
  var decoded = 0;

  for (i = 0; i < str.length; i++) {
    decoded = decoded * length + map[str.charAt(i)];
  }

  return decoded;
}

/**
 * Yeast: A tiny growing id generator.
 *
 * @returns {String} A unique id.
 * @api public
 */
function yeast() {
  var now = encode(+new Date());

  if (now !== prev) return seed = 0, prev = now;
  return now +'.'+ encode(seed++);
}

//
// Map each character to its index.
//
for (; i < length; i++) map[alphabet[i]] = i;

//
// Expose the `yeast`, `encode` and `decode` functions.
//
yeast.encode = encode;
yeast.decode = decode;
module.exports = yeast;


/***/ }),
/* 52 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});

var _main = __webpack_require__(16);

var _main2 = _interopRequireDefault(_main);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var Boot = function Boot() {};

Boot.prototype = {

  preload: function preload() {
    _main2.default.game.load.image('space', 'assets/space.png');
  },

  create: function create() {
    _main2.default.game.state.start('MainMenu');
  }

};

exports.default = Boot;

/***/ }),
/* 53 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* unused harmony export MulticastSource */
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__most_prelude__ = __webpack_require__(4);


var MulticastDisposable = function MulticastDisposable (source, sink) {
  this.source = source
  this.sink = sink
  this.disposed = false
};

MulticastDisposable.prototype.dispose = function dispose () {
  if (this.disposed) {
    return
  }
  this.disposed = true
  var remaining = this.source.remove(this.sink)
  return remaining === 0 && this.source._dispose()
};

function tryEvent (t, x, sink) {
  try {
    sink.event(t, x)
  } catch (e) {
    sink.error(t, e)
  }
}

function tryEnd (t, x, sink) {
  try {
    sink.end(t, x)
  } catch (e) {
    sink.error(t, e)
  }
}

var dispose = function (disposable) { return disposable.dispose(); }

var emptyDisposable = {
  dispose: function dispose$1 () {}
}

var MulticastSource = function MulticastSource (source) {
  this.source = source
  this.sinks = []
  this._disposable = emptyDisposable
};

MulticastSource.prototype.run = function run (sink, scheduler) {
  var n = this.add(sink)
  if (n === 1) {
    this._disposable = this.source.run(this, scheduler)
  }
  return new MulticastDisposable(this, sink)
};

MulticastSource.prototype._dispose = function _dispose () {
  var disposable = this._disposable
  this._disposable = emptyDisposable
  return Promise.resolve(disposable).then(dispose)
};

MulticastSource.prototype.add = function add (sink) {
  this.sinks = __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_0__most_prelude__["f" /* append */])(sink, this.sinks)
  return this.sinks.length
};

MulticastSource.prototype.remove = function remove$1 (sink) {
  var i = __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_0__most_prelude__["d" /* findIndex */])(sink, this.sinks)
  // istanbul ignore next
  if (i >= 0) {
    this.sinks = __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_0__most_prelude__["g" /* remove */])(i, this.sinks)
  }

  return this.sinks.length
};

MulticastSource.prototype.event = function event (time, value) {
  var s = this.sinks
  if (s.length === 1) {
    return s[0].event(time, value)
  }
  for (var i = 0; i < s.length; ++i) {
    tryEvent(time, value, s[i])
  }
};

MulticastSource.prototype.end = function end (time, value) {
  var s = this.sinks
  for (var i = 0; i < s.length; ++i) {
    tryEnd(time, value, s[i])
  }
};

MulticastSource.prototype.error = function error (time, err) {
  var s = this.sinks
  for (var i = 0; i < s.length; ++i) {
    s[i].error(time, err)
  }
};

function multicast (stream) {
  var source = stream.source
  return source instanceof MulticastSource
    ? stream
    : new stream.constructor(new MulticastSource(source))
}

/* harmony default export */ __webpack_exports__["a"] = (multicast);
//# sourceMappingURL=multicast.es.js.map


/***/ }),
/* 54 */
/***/ (function(module, exports) {

module.exports = after

function after(count, callback, err_cb) {
    var bail = false
    err_cb = err_cb || noop
    proxy.count = count

    return (count === 0) ? callback() : proxy

    function proxy(err, result) {
        if (proxy.count <= 0) {
            throw new Error('after called too many times')
        }
        --proxy.count

        // after first error, rest are passed to err_cb
        if (err) {
            bail = true
            callback(err)
            // future error callbacks will go to error handler
            callback = err_cb
        } else if (proxy.count === 0 && !bail) {
            callback(null, result)
        }
    }
}

function noop() {}


/***/ }),
/* 55 */
/***/ (function(module, exports) {

/**
 * An abstraction for slicing an arraybuffer even when
 * ArrayBuffer.prototype.slice is not supported
 *
 * @api public
 */

module.exports = function(arraybuffer, start, end) {
  var bytes = arraybuffer.byteLength;
  start = start || 0;
  end = end || bytes;

  if (arraybuffer.slice) { return arraybuffer.slice(start, end); }

  if (start < 0) { start += bytes; }
  if (end < 0) { end += bytes; }
  if (end > bytes) { end = bytes; }

  if (start >= bytes || start >= end || bytes === 0) {
    return new ArrayBuffer(0);
  }

  var abv = new Uint8Array(arraybuffer);
  var result = new Uint8Array(end - start);
  for (var i = start, ii = 0; i < end; i++, ii++) {
    result[ii] = abv[i];
  }
  return result.buffer;
};


/***/ }),
/* 56 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});

var _index = __webpack_require__(15);

var _player = __webpack_require__(17);

var _player2 = _interopRequireDefault(_player);

var _game = __webpack_require__(10);

var _game2 = _interopRequireDefault(_game);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var remotePlayers = [];

function onNewPlayer(data) {
  console.log('New player connected:', data);

  var duplicate = playerById(data.id);

  if (duplicate) {
    console.log('Duplicate player!');
    return;
  }

  if (remotePlayers.length === 0) {
    return localPlayer(_game2.default, data);
  } else if (remotePlayers.length > 0) {
    var newPlayer = new _player2.default(_game2.default, data.x, data.y, 'zombie', 50, 5, _game2.default.weapons, data.id);
    remotePlayers.push(newPlayer);
    _index.playerObs.emit('addPlayer', newPlayer);
  }
}

function localPlayer(game, data) {
  var newPlayer = new _player2.default(game, data.x, data.y, 'zombie', 50, 5, game.weapons, data.id);
  _index.playerObs.emit('addPlayer', newPlayer);
  remotePlayers.push(newPlayer);
  console.log('first player!');

  /** Add enemies if local player is only player in the game */
  _index.socket.emit('newEnemies', { number: 5, x: game.startX, y: game.startY });
}

function onMovePlayer(data) {
  var movePlayer = playerById(data.id);
  return movePlayer ? _index.playerObs.emit('movingPlayer', { player: movePlayer, data: data }) : false;
}

function onShoot(data) {
  _index.playerObs.emit('shootPlayer', { id: data.id, pid: data.pid, x: data.x, y: data.y, v: data.v, r: data.r });
}

function onRemovePlayer(data) {
  var removePlayer = playerById(data.id);

  if (!removePlayer) {
    console.log('Player (remove) not found: ', data.id);
    return;
  }

  // removePlayer.kill() // unnecessary?
  _index.playerObs.emit('removePlayer', removePlayer);
  remotePlayers.splice(remotePlayers.indexOf(removePlayer), 1);
}

function onSocketDisconnect() {
  console.log('Disconnected from socket server');
}

function playerById(id) {
  var identifiedPlayer = remotePlayers.filter(function (player) {
    return player.id === id;
  });
  return identifiedPlayer.length > 0 ? identifiedPlayer[0] : false;
}

var playerHandlers = { onNewPlayer: onNewPlayer, localPlayer: localPlayer, onMovePlayer: onMovePlayer, onShoot: onShoot, onRemovePlayer: onRemovePlayer, onSocketDisconnect: onSocketDisconnect };
exports.default = playerHandlers;

/***/ }),
/* 57 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.LazerBeam = exports.SingleBullet = undefined;

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _bullet = __webpack_require__(30);

var _bullet2 = _interopRequireDefault(_bullet);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; } //tutorial this is based upon
//https://github.com/photonstorm/phaser-coding-tips/blob/master/issue-007/bulletpool.html

//boost performance by reducing the rate of fire?

var Weapon = function (_Phaser$Group) {
  _inherits(Weapon, _Phaser$Group);

  function Weapon(game) {
    _classCallCheck(this, Weapon);

    var _this = _possibleConstructorReturn(this, (Weapon.__proto__ || Object.getPrototypeOf(Weapon)).call(this, game));

    _this.game = game;
    return _this;
  }

  _createClass(Weapon, [{
    key: 'fire',
    value: function fire(source) {
      if (this.game.time.time < this.nextFire) {
        return;
      }
      var x = source.x + 10;
      var y = source.y + 10;
      this.getFirstExists(false).fire(x, y, source.x, this.bulletSpeed, 0, 0);
      this.nextFire = this.game.time.time + this.fireRate;
    }
  }, {
    key: 'addBullets',
    value: function addBullets(weapon, game, type, instances) {
      var count = 0;
      while (count++ < instances) {
        weapon.add(new _bullet2.default(game, type, true, count), true);
      }
    }
  }]);

  return Weapon;
}(Phaser.Group);

/* ----- Single Bullet ----- */


var SingleBullet = exports.SingleBullet = function (_Weapon) {
  _inherits(SingleBullet, _Weapon);

  function SingleBullet(game, type) {
    _classCallCheck(this, SingleBullet);

    var _this2 = _possibleConstructorReturn(this, (SingleBullet.__proto__ || Object.getPrototypeOf(SingleBullet)).call(this, game));

    _this2.nextFire = 0;
    _this2.bulletSpeed = 600;
    _this2.fireRate = 1000;
    _this2.damage = 5;
    _this2.addBullets(_this2, game, type, 120);
    return _this2;
  }

  return SingleBullet;
}(Weapon);

/* ----- Lazer Weapon ----- */


var LazerBeam = exports.LazerBeam = function (_Weapon2) {
  _inherits(LazerBeam, _Weapon2);

  function LazerBeam(game, type) {
    _classCallCheck(this, LazerBeam);

    var _this3 = _possibleConstructorReturn(this, (LazerBeam.__proto__ || Object.getPrototypeOf(LazerBeam)).call(this, game));

    _this3.nextFire = 0;
    _this3.bulletSpeed = 600;
    _this3.fireRate = 500;
    _this3.damage = 3;
    _this3.addBullets(_this3, game, type, 120);
    return _this3;
  }

  return LazerBeam;
}(Weapon);

/***/ }),
/* 58 */
/***/ (function(module, exports) {


/**
 * Expose `Backoff`.
 */

module.exports = Backoff;

/**
 * Initialize backoff timer with `opts`.
 *
 * - `min` initial timeout in milliseconds [100]
 * - `max` max timeout [10000]
 * - `jitter` [0]
 * - `factor` [2]
 *
 * @param {Object} opts
 * @api public
 */

function Backoff(opts) {
  opts = opts || {};
  this.ms = opts.min || 100;
  this.max = opts.max || 10000;
  this.factor = opts.factor || 2;
  this.jitter = opts.jitter > 0 && opts.jitter <= 1 ? opts.jitter : 0;
  this.attempts = 0;
}

/**
 * Return the backoff duration.
 *
 * @return {Number}
 * @api public
 */

Backoff.prototype.duration = function(){
  var ms = this.ms * Math.pow(this.factor, this.attempts++);
  if (this.jitter) {
    var rand =  Math.random();
    var deviation = Math.floor(rand * this.jitter * ms);
    ms = (Math.floor(rand * 10) & 1) == 0  ? ms - deviation : ms + deviation;
  }
  return Math.min(ms, this.max) | 0;
};

/**
 * Reset the number of attempts.
 *
 * @api public
 */

Backoff.prototype.reset = function(){
  this.attempts = 0;
};

/**
 * Set the minimum duration
 *
 * @api public
 */

Backoff.prototype.setMin = function(min){
  this.ms = min;
};

/**
 * Set the maximum duration
 *
 * @api public
 */

Backoff.prototype.setMax = function(max){
  this.max = max;
};

/**
 * Set the jitter
 *
 * @api public
 */

Backoff.prototype.setJitter = function(jitter){
  this.jitter = jitter;
};



/***/ }),
/* 59 */
/***/ (function(module, exports) {

/*
 * base64-arraybuffer
 * https://github.com/niklasvh/base64-arraybuffer
 *
 * Copyright (c) 2012 Niklas von Hertzen
 * Licensed under the MIT license.
 */
(function(){
  "use strict";

  var chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/";

  // Use a lookup table to find the index.
  var lookup = new Uint8Array(256);
  for (var i = 0; i < chars.length; i++) {
    lookup[chars.charCodeAt(i)] = i;
  }

  exports.encode = function(arraybuffer) {
    var bytes = new Uint8Array(arraybuffer),
    i, len = bytes.length, base64 = "";

    for (i = 0; i < len; i+=3) {
      base64 += chars[bytes[i] >> 2];
      base64 += chars[((bytes[i] & 3) << 4) | (bytes[i + 1] >> 4)];
      base64 += chars[((bytes[i + 1] & 15) << 2) | (bytes[i + 2] >> 6)];
      base64 += chars[bytes[i + 2] & 63];
    }

    if ((len % 3) === 2) {
      base64 = base64.substring(0, base64.length - 1) + "=";
    } else if (len % 3 === 1) {
      base64 = base64.substring(0, base64.length - 2) + "==";
    }

    return base64;
  };

  exports.decode =  function(base64) {
    var bufferLength = base64.length * 0.75,
    len = base64.length, i, p = 0,
    encoded1, encoded2, encoded3, encoded4;

    if (base64[base64.length - 1] === "=") {
      bufferLength--;
      if (base64[base64.length - 2] === "=") {
        bufferLength--;
      }
    }

    var arraybuffer = new ArrayBuffer(bufferLength),
    bytes = new Uint8Array(arraybuffer);

    for (i = 0; i < len; i+=4) {
      encoded1 = lookup[base64.charCodeAt(i)];
      encoded2 = lookup[base64.charCodeAt(i+1)];
      encoded3 = lookup[base64.charCodeAt(i+2)];
      encoded4 = lookup[base64.charCodeAt(i+3)];

      bytes[p++] = (encoded1 << 2) | (encoded2 >> 4);
      bytes[p++] = ((encoded2 & 15) << 4) | (encoded3 >> 2);
      bytes[p++] = ((encoded3 & 3) << 6) | (encoded4 & 63);
    }

    return arraybuffer;
  };
})();


/***/ }),
/* 60 */
/***/ (function(module, exports, __webpack_require__) {

/* WEBPACK VAR INJECTION */(function(global) {/**
 * Create a blob builder even when vendor prefixes exist
 */

var BlobBuilder = global.BlobBuilder
  || global.WebKitBlobBuilder
  || global.MSBlobBuilder
  || global.MozBlobBuilder;

/**
 * Check if Blob constructor is supported
 */

var blobSupported = (function() {
  try {
    var a = new Blob(['hi']);
    return a.size === 2;
  } catch(e) {
    return false;
  }
})();

/**
 * Check if Blob constructor supports ArrayBufferViews
 * Fails in Safari 6, so we need to map to ArrayBuffers there.
 */

var blobSupportsArrayBufferView = blobSupported && (function() {
  try {
    var b = new Blob([new Uint8Array([1,2])]);
    return b.size === 2;
  } catch(e) {
    return false;
  }
})();

/**
 * Check if BlobBuilder is supported
 */

var blobBuilderSupported = BlobBuilder
  && BlobBuilder.prototype.append
  && BlobBuilder.prototype.getBlob;

/**
 * Helper function that maps ArrayBufferViews to ArrayBuffers
 * Used by BlobBuilder constructor and old browsers that didn't
 * support it in the Blob constructor.
 */

function mapArrayBufferViews(ary) {
  for (var i = 0; i < ary.length; i++) {
    var chunk = ary[i];
    if (chunk.buffer instanceof ArrayBuffer) {
      var buf = chunk.buffer;

      // if this is a subarray, make a copy so we only
      // include the subarray region from the underlying buffer
      if (chunk.byteLength !== buf.byteLength) {
        var copy = new Uint8Array(chunk.byteLength);
        copy.set(new Uint8Array(buf, chunk.byteOffset, chunk.byteLength));
        buf = copy.buffer;
      }

      ary[i] = buf;
    }
  }
}

function BlobBuilderConstructor(ary, options) {
  options = options || {};

  var bb = new BlobBuilder();
  mapArrayBufferViews(ary);

  for (var i = 0; i < ary.length; i++) {
    bb.append(ary[i]);
  }

  return (options.type) ? bb.getBlob(options.type) : bb.getBlob();
};

function BlobConstructor(ary, options) {
  mapArrayBufferViews(ary);
  return new Blob(ary, options || {});
};

module.exports = (function() {
  if (blobSupported) {
    return blobSupportsArrayBufferView ? global.Blob : BlobConstructor;
  } else if (blobBuilderSupported) {
    return BlobBuilderConstructor;
  } else {
    return undefined;
  }
})();

/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(3)))

/***/ }),
/* 61 */
/***/ (function(module, exports, __webpack_require__) {


/**
 * This is the common logic for both the Node.js and web browser
 * implementations of `debug()`.
 *
 * Expose `debug()` as the module.
 */

exports = module.exports = createDebug.debug = createDebug['default'] = createDebug;
exports.coerce = coerce;
exports.disable = disable;
exports.enable = enable;
exports.enabled = enabled;
exports.humanize = __webpack_require__(118);

/**
 * The currently active debug mode names, and names to skip.
 */

exports.names = [];
exports.skips = [];

/**
 * Map of special "%n" handling functions, for the debug "format" argument.
 *
 * Valid key names are a single, lower or upper-case letter, i.e. "n" and "N".
 */

exports.formatters = {};

/**
 * Previous log timestamp.
 */

var prevTime;

/**
 * Select a color.
 * @param {String} namespace
 * @return {Number}
 * @api private
 */

function selectColor(namespace) {
  var hash = 0, i;

  for (i in namespace) {
    hash  = ((hash << 5) - hash) + namespace.charCodeAt(i);
    hash |= 0; // Convert to 32bit integer
  }

  return exports.colors[Math.abs(hash) % exports.colors.length];
}

/**
 * Create a debugger with the given `namespace`.
 *
 * @param {String} namespace
 * @return {Function}
 * @api public
 */

function createDebug(namespace) {

  function debug() {
    // disabled?
    if (!debug.enabled) return;

    var self = debug;

    // set `diff` timestamp
    var curr = +new Date();
    var ms = curr - (prevTime || curr);
    self.diff = ms;
    self.prev = prevTime;
    self.curr = curr;
    prevTime = curr;

    // turn the `arguments` into a proper Array
    var args = new Array(arguments.length);
    for (var i = 0; i < args.length; i++) {
      args[i] = arguments[i];
    }

    args[0] = exports.coerce(args[0]);

    if ('string' !== typeof args[0]) {
      // anything else let's inspect with %O
      args.unshift('%O');
    }

    // apply any `formatters` transformations
    var index = 0;
    args[0] = args[0].replace(/%([a-zA-Z%])/g, function(match, format) {
      // if we encounter an escaped % then don't increase the array index
      if (match === '%%') return match;
      index++;
      var formatter = exports.formatters[format];
      if ('function' === typeof formatter) {
        var val = args[index];
        match = formatter.call(self, val);

        // now we need to remove `args[index]` since it's inlined in the `format`
        args.splice(index, 1);
        index--;
      }
      return match;
    });

    // apply env-specific formatting (colors, etc.)
    exports.formatArgs.call(self, args);

    var logFn = debug.log || exports.log || console.log.bind(console);
    logFn.apply(self, args);
  }

  debug.namespace = namespace;
  debug.enabled = exports.enabled(namespace);
  debug.useColors = exports.useColors();
  debug.color = selectColor(namespace);

  // env-specific initialization logic for debug instances
  if ('function' === typeof exports.init) {
    exports.init(debug);
  }

  return debug;
}

/**
 * Enables a debug mode by namespaces. This can include modes
 * separated by a colon and wildcards.
 *
 * @param {String} namespaces
 * @api public
 */

function enable(namespaces) {
  exports.save(namespaces);

  exports.names = [];
  exports.skips = [];

  var split = (typeof namespaces === 'string' ? namespaces : '').split(/[\s,]+/);
  var len = split.length;

  for (var i = 0; i < len; i++) {
    if (!split[i]) continue; // ignore empty strings
    namespaces = split[i].replace(/\*/g, '.*?');
    if (namespaces[0] === '-') {
      exports.skips.push(new RegExp('^' + namespaces.substr(1) + '$'));
    } else {
      exports.names.push(new RegExp('^' + namespaces + '$'));
    }
  }
}

/**
 * Disable debug output.
 *
 * @api public
 */

function disable() {
  exports.enable('');
}

/**
 * Returns true if the given mode name is enabled, false otherwise.
 *
 * @param {String} name
 * @return {Boolean}
 * @api public
 */

function enabled(name) {
  var i, len;
  for (i = 0, len = exports.skips.length; i < len; i++) {
    if (exports.skips[i].test(name)) {
      return false;
    }
  }
  for (i = 0, len = exports.names.length; i < len; i++) {
    if (exports.names[i].test(name)) {
      return true;
    }
  }
  return false;
}

/**
 * Coerce `val`.
 *
 * @param {Mixed} val
 * @return {Mixed}
 * @api private
 */

function coerce(val) {
  if (val instanceof Error) return val.stack || val.message;
  return val;
}


/***/ }),
/* 62 */
/***/ (function(module, exports, __webpack_require__) {


module.exports = __webpack_require__(63);


/***/ }),
/* 63 */
/***/ (function(module, exports, __webpack_require__) {


module.exports = __webpack_require__(64);

/**
 * Exports parser
 *
 * @api public
 *
 */
module.exports.parser = __webpack_require__(9);


/***/ }),
/* 64 */
/***/ (function(module, exports, __webpack_require__) {

/* WEBPACK VAR INJECTION */(function(global) {/**
 * Module dependencies.
 */

var transports = __webpack_require__(33);
var Emitter = __webpack_require__(8);
var debug = __webpack_require__(5)('engine.io-client:socket');
var index = __webpack_require__(36);
var parser = __webpack_require__(9);
var parseuri = __webpack_require__(44);
var parsejson = __webpack_require__(119);
var parseqs = __webpack_require__(14);

/**
 * Module exports.
 */

module.exports = Socket;

/**
 * Socket constructor.
 *
 * @param {String|Object} uri or options
 * @param {Object} options
 * @api public
 */

function Socket (uri, opts) {
  if (!(this instanceof Socket)) return new Socket(uri, opts);

  opts = opts || {};

  if (uri && 'object' === typeof uri) {
    opts = uri;
    uri = null;
  }

  if (uri) {
    uri = parseuri(uri);
    opts.hostname = uri.host;
    opts.secure = uri.protocol === 'https' || uri.protocol === 'wss';
    opts.port = uri.port;
    if (uri.query) opts.query = uri.query;
  } else if (opts.host) {
    opts.hostname = parseuri(opts.host).host;
  }

  this.secure = null != opts.secure ? opts.secure
    : (global.location && 'https:' === location.protocol);

  if (opts.hostname && !opts.port) {
    // if no port is specified manually, use the protocol default
    opts.port = this.secure ? '443' : '80';
  }

  this.agent = opts.agent || false;
  this.hostname = opts.hostname ||
    (global.location ? location.hostname : 'localhost');
  this.port = opts.port || (global.location && location.port
      ? location.port
      : (this.secure ? 443 : 80));
  this.query = opts.query || {};
  if ('string' === typeof this.query) this.query = parseqs.decode(this.query);
  this.upgrade = false !== opts.upgrade;
  this.path = (opts.path || '/engine.io').replace(/\/$/, '') + '/';
  this.forceJSONP = !!opts.forceJSONP;
  this.jsonp = false !== opts.jsonp;
  this.forceBase64 = !!opts.forceBase64;
  this.enablesXDR = !!opts.enablesXDR;
  this.timestampParam = opts.timestampParam || 't';
  this.timestampRequests = opts.timestampRequests;
  this.transports = opts.transports || ['polling', 'websocket'];
  this.transportOptions = opts.transportOptions || {};
  this.readyState = '';
  this.writeBuffer = [];
  this.prevBufferLen = 0;
  this.policyPort = opts.policyPort || 843;
  this.rememberUpgrade = opts.rememberUpgrade || false;
  this.binaryType = null;
  this.onlyBinaryUpgrades = opts.onlyBinaryUpgrades;
  this.perMessageDeflate = false !== opts.perMessageDeflate ? (opts.perMessageDeflate || {}) : false;

  if (true === this.perMessageDeflate) this.perMessageDeflate = {};
  if (this.perMessageDeflate && null == this.perMessageDeflate.threshold) {
    this.perMessageDeflate.threshold = 1024;
  }

  // SSL options for Node.js client
  this.pfx = opts.pfx || null;
  this.key = opts.key || null;
  this.passphrase = opts.passphrase || null;
  this.cert = opts.cert || null;
  this.ca = opts.ca || null;
  this.ciphers = opts.ciphers || null;
  this.rejectUnauthorized = opts.rejectUnauthorized === undefined ? true : opts.rejectUnauthorized;
  this.forceNode = !!opts.forceNode;

  // other options for Node.js client
  var freeGlobal = typeof global === 'object' && global;
  if (freeGlobal.global === freeGlobal) {
    if (opts.extraHeaders && Object.keys(opts.extraHeaders).length > 0) {
      this.extraHeaders = opts.extraHeaders;
    }

    if (opts.localAddress) {
      this.localAddress = opts.localAddress;
    }
  }

  // set on handshake
  this.id = null;
  this.upgrades = null;
  this.pingInterval = null;
  this.pingTimeout = null;

  // set on heartbeat
  this.pingIntervalTimer = null;
  this.pingTimeoutTimer = null;

  this.open();
}

Socket.priorWebsocketSuccess = false;

/**
 * Mix in `Emitter`.
 */

Emitter(Socket.prototype);

/**
 * Protocol version.
 *
 * @api public
 */

Socket.protocol = parser.protocol; // this is an int

/**
 * Expose deps for legacy compatibility
 * and standalone browser access.
 */

Socket.Socket = Socket;
Socket.Transport = __webpack_require__(18);
Socket.transports = __webpack_require__(33);
Socket.parser = __webpack_require__(9);

/**
 * Creates transport of the given type.
 *
 * @param {String} transport name
 * @return {Transport}
 * @api private
 */

Socket.prototype.createTransport = function (name) {
  debug('creating transport "%s"', name);
  var query = clone(this.query);

  // append engine.io protocol identifier
  query.EIO = parser.protocol;

  // transport name
  query.transport = name;

  // per-transport options
  var options = this.transportOptions[name] || {};

  // session id if we already have one
  if (this.id) query.sid = this.id;

  var transport = new transports[name]({
    query: query,
    socket: this,
    agent: options.agent || this.agent,
    hostname: options.hostname || this.hostname,
    port: options.port || this.port,
    secure: options.secure || this.secure,
    path: options.path || this.path,
    forceJSONP: options.forceJSONP || this.forceJSONP,
    jsonp: options.jsonp || this.jsonp,
    forceBase64: options.forceBase64 || this.forceBase64,
    enablesXDR: options.enablesXDR || this.enablesXDR,
    timestampRequests: options.timestampRequests || this.timestampRequests,
    timestampParam: options.timestampParam || this.timestampParam,
    policyPort: options.policyPort || this.policyPort,
    pfx: options.pfx || this.pfx,
    key: options.key || this.key,
    passphrase: options.passphrase || this.passphrase,
    cert: options.cert || this.cert,
    ca: options.ca || this.ca,
    ciphers: options.ciphers || this.ciphers,
    rejectUnauthorized: options.rejectUnauthorized || this.rejectUnauthorized,
    perMessageDeflate: options.perMessageDeflate || this.perMessageDeflate,
    extraHeaders: options.extraHeaders || this.extraHeaders,
    forceNode: options.forceNode || this.forceNode,
    localAddress: options.localAddress || this.localAddress,
    requestTimeout: options.requestTimeout || this.requestTimeout,
    protocols: options.protocols || void (0)
  });

  return transport;
};

function clone (obj) {
  var o = {};
  for (var i in obj) {
    if (obj.hasOwnProperty(i)) {
      o[i] = obj[i];
    }
  }
  return o;
}

/**
 * Initializes transport to use and starts probe.
 *
 * @api private
 */
Socket.prototype.open = function () {
  var transport;
  if (this.rememberUpgrade && Socket.priorWebsocketSuccess && this.transports.indexOf('websocket') !== -1) {
    transport = 'websocket';
  } else if (0 === this.transports.length) {
    // Emit error on next tick so it can be listened to
    var self = this;
    setTimeout(function () {
      self.emit('error', 'No transports available');
    }, 0);
    return;
  } else {
    transport = this.transports[0];
  }
  this.readyState = 'opening';

  // Retry with the next transport if the transport is disabled (jsonp: false)
  try {
    transport = this.createTransport(transport);
  } catch (e) {
    this.transports.shift();
    this.open();
    return;
  }

  transport.open();
  this.setTransport(transport);
};

/**
 * Sets the current transport. Disables the existing one (if any).
 *
 * @api private
 */

Socket.prototype.setTransport = function (transport) {
  debug('setting transport %s', transport.name);
  var self = this;

  if (this.transport) {
    debug('clearing existing transport %s', this.transport.name);
    this.transport.removeAllListeners();
  }

  // set up transport
  this.transport = transport;

  // set up transport listeners
  transport
  .on('drain', function () {
    self.onDrain();
  })
  .on('packet', function (packet) {
    self.onPacket(packet);
  })
  .on('error', function (e) {
    self.onError(e);
  })
  .on('close', function () {
    self.onClose('transport close');
  });
};

/**
 * Probes a transport.
 *
 * @param {String} transport name
 * @api private
 */

Socket.prototype.probe = function (name) {
  debug('probing transport "%s"', name);
  var transport = this.createTransport(name, { probe: 1 });
  var failed = false;
  var self = this;

  Socket.priorWebsocketSuccess = false;

  function onTransportOpen () {
    if (self.onlyBinaryUpgrades) {
      var upgradeLosesBinary = !this.supportsBinary && self.transport.supportsBinary;
      failed = failed || upgradeLosesBinary;
    }
    if (failed) return;

    debug('probe transport "%s" opened', name);
    transport.send([{ type: 'ping', data: 'probe' }]);
    transport.once('packet', function (msg) {
      if (failed) return;
      if ('pong' === msg.type && 'probe' === msg.data) {
        debug('probe transport "%s" pong', name);
        self.upgrading = true;
        self.emit('upgrading', transport);
        if (!transport) return;
        Socket.priorWebsocketSuccess = 'websocket' === transport.name;

        debug('pausing current transport "%s"', self.transport.name);
        self.transport.pause(function () {
          if (failed) return;
          if ('closed' === self.readyState) return;
          debug('changing transport and sending upgrade packet');

          cleanup();

          self.setTransport(transport);
          transport.send([{ type: 'upgrade' }]);
          self.emit('upgrade', transport);
          transport = null;
          self.upgrading = false;
          self.flush();
        });
      } else {
        debug('probe transport "%s" failed', name);
        var err = new Error('probe error');
        err.transport = transport.name;
        self.emit('upgradeError', err);
      }
    });
  }

  function freezeTransport () {
    if (failed) return;

    // Any callback called by transport should be ignored since now
    failed = true;

    cleanup();

    transport.close();
    transport = null;
  }

  // Handle any error that happens while probing
  function onerror (err) {
    var error = new Error('probe error: ' + err);
    error.transport = transport.name;

    freezeTransport();

    debug('probe transport "%s" failed because of error: %s', name, err);

    self.emit('upgradeError', error);
  }

  function onTransportClose () {
    onerror('transport closed');
  }

  // When the socket is closed while we're probing
  function onclose () {
    onerror('socket closed');
  }

  // When the socket is upgraded while we're probing
  function onupgrade (to) {
    if (transport && to.name !== transport.name) {
      debug('"%s" works - aborting "%s"', to.name, transport.name);
      freezeTransport();
    }
  }

  // Remove all listeners on the transport and on self
  function cleanup () {
    transport.removeListener('open', onTransportOpen);
    transport.removeListener('error', onerror);
    transport.removeListener('close', onTransportClose);
    self.removeListener('close', onclose);
    self.removeListener('upgrading', onupgrade);
  }

  transport.once('open', onTransportOpen);
  transport.once('error', onerror);
  transport.once('close', onTransportClose);

  this.once('close', onclose);
  this.once('upgrading', onupgrade);

  transport.open();
};

/**
 * Called when connection is deemed open.
 *
 * @api public
 */

Socket.prototype.onOpen = function () {
  debug('socket open');
  this.readyState = 'open';
  Socket.priorWebsocketSuccess = 'websocket' === this.transport.name;
  this.emit('open');
  this.flush();

  // we check for `readyState` in case an `open`
  // listener already closed the socket
  if ('open' === this.readyState && this.upgrade && this.transport.pause) {
    debug('starting upgrade probes');
    for (var i = 0, l = this.upgrades.length; i < l; i++) {
      this.probe(this.upgrades[i]);
    }
  }
};

/**
 * Handles a packet.
 *
 * @api private
 */

Socket.prototype.onPacket = function (packet) {
  if ('opening' === this.readyState || 'open' === this.readyState ||
      'closing' === this.readyState) {
    debug('socket receive: type "%s", data "%s"', packet.type, packet.data);

    this.emit('packet', packet);

    // Socket is live - any packet counts
    this.emit('heartbeat');

    switch (packet.type) {
      case 'open':
        this.onHandshake(parsejson(packet.data));
        break;

      case 'pong':
        this.setPing();
        this.emit('pong');
        break;

      case 'error':
        var err = new Error('server error');
        err.code = packet.data;
        this.onError(err);
        break;

      case 'message':
        this.emit('data', packet.data);
        this.emit('message', packet.data);
        break;
    }
  } else {
    debug('packet received with socket readyState "%s"', this.readyState);
  }
};

/**
 * Called upon handshake completion.
 *
 * @param {Object} handshake obj
 * @api private
 */

Socket.prototype.onHandshake = function (data) {
  this.emit('handshake', data);
  this.id = data.sid;
  this.transport.query.sid = data.sid;
  this.upgrades = this.filterUpgrades(data.upgrades);
  this.pingInterval = data.pingInterval;
  this.pingTimeout = data.pingTimeout;
  this.onOpen();
  // In case open handler closes socket
  if ('closed' === this.readyState) return;
  this.setPing();

  // Prolong liveness of socket on heartbeat
  this.removeListener('heartbeat', this.onHeartbeat);
  this.on('heartbeat', this.onHeartbeat);
};

/**
 * Resets ping timeout.
 *
 * @api private
 */

Socket.prototype.onHeartbeat = function (timeout) {
  clearTimeout(this.pingTimeoutTimer);
  var self = this;
  self.pingTimeoutTimer = setTimeout(function () {
    if ('closed' === self.readyState) return;
    self.onClose('ping timeout');
  }, timeout || (self.pingInterval + self.pingTimeout));
};

/**
 * Pings server every `this.pingInterval` and expects response
 * within `this.pingTimeout` or closes connection.
 *
 * @api private
 */

Socket.prototype.setPing = function () {
  var self = this;
  clearTimeout(self.pingIntervalTimer);
  self.pingIntervalTimer = setTimeout(function () {
    debug('writing ping packet - expecting pong within %sms', self.pingTimeout);
    self.ping();
    self.onHeartbeat(self.pingTimeout);
  }, self.pingInterval);
};

/**
* Sends a ping packet.
*
* @api private
*/

Socket.prototype.ping = function () {
  var self = this;
  this.sendPacket('ping', function () {
    self.emit('ping');
  });
};

/**
 * Called on `drain` event
 *
 * @api private
 */

Socket.prototype.onDrain = function () {
  this.writeBuffer.splice(0, this.prevBufferLen);

  // setting prevBufferLen = 0 is very important
  // for example, when upgrading, upgrade packet is sent over,
  // and a nonzero prevBufferLen could cause problems on `drain`
  this.prevBufferLen = 0;

  if (0 === this.writeBuffer.length) {
    this.emit('drain');
  } else {
    this.flush();
  }
};

/**
 * Flush write buffers.
 *
 * @api private
 */

Socket.prototype.flush = function () {
  if ('closed' !== this.readyState && this.transport.writable &&
    !this.upgrading && this.writeBuffer.length) {
    debug('flushing %d packets in socket', this.writeBuffer.length);
    this.transport.send(this.writeBuffer);
    // keep track of current length of writeBuffer
    // splice writeBuffer and callbackBuffer on `drain`
    this.prevBufferLen = this.writeBuffer.length;
    this.emit('flush');
  }
};

/**
 * Sends a message.
 *
 * @param {String} message.
 * @param {Function} callback function.
 * @param {Object} options.
 * @return {Socket} for chaining.
 * @api public
 */

Socket.prototype.write =
Socket.prototype.send = function (msg, options, fn) {
  this.sendPacket('message', msg, options, fn);
  return this;
};

/**
 * Sends a packet.
 *
 * @param {String} packet type.
 * @param {String} data.
 * @param {Object} options.
 * @param {Function} callback function.
 * @api private
 */

Socket.prototype.sendPacket = function (type, data, options, fn) {
  if ('function' === typeof data) {
    fn = data;
    data = undefined;
  }

  if ('function' === typeof options) {
    fn = options;
    options = null;
  }

  if ('closing' === this.readyState || 'closed' === this.readyState) {
    return;
  }

  options = options || {};
  options.compress = false !== options.compress;

  var packet = {
    type: type,
    data: data,
    options: options
  };
  this.emit('packetCreate', packet);
  this.writeBuffer.push(packet);
  if (fn) this.once('flush', fn);
  this.flush();
};

/**
 * Closes the connection.
 *
 * @api private
 */

Socket.prototype.close = function () {
  if ('opening' === this.readyState || 'open' === this.readyState) {
    this.readyState = 'closing';

    var self = this;

    if (this.writeBuffer.length) {
      this.once('drain', function () {
        if (this.upgrading) {
          waitForUpgrade();
        } else {
          close();
        }
      });
    } else if (this.upgrading) {
      waitForUpgrade();
    } else {
      close();
    }
  }

  function close () {
    self.onClose('forced close');
    debug('socket closing - telling transport to close');
    self.transport.close();
  }

  function cleanupAndClose () {
    self.removeListener('upgrade', cleanupAndClose);
    self.removeListener('upgradeError', cleanupAndClose);
    close();
  }

  function waitForUpgrade () {
    // wait for upgrade to finish since we can't send packets while pausing a transport
    self.once('upgrade', cleanupAndClose);
    self.once('upgradeError', cleanupAndClose);
  }

  return this;
};

/**
 * Called upon transport error
 *
 * @api private
 */

Socket.prototype.onError = function (err) {
  debug('socket error %j', err);
  Socket.priorWebsocketSuccess = false;
  this.emit('error', err);
  this.onClose('transport error', err);
};

/**
 * Called upon transport close.
 *
 * @api private
 */

Socket.prototype.onClose = function (reason, desc) {
  if ('opening' === this.readyState || 'open' === this.readyState || 'closing' === this.readyState) {
    debug('socket close with reason: "%s"', reason);
    var self = this;

    // clear timers
    clearTimeout(this.pingIntervalTimer);
    clearTimeout(this.pingTimeoutTimer);

    // stop event from firing again for transport
    this.transport.removeAllListeners('close');

    // ensure transport won't stay open
    this.transport.close();

    // ignore further transport communication
    this.transport.removeAllListeners();

    // set ready state
    this.readyState = 'closed';

    // clear session id
    this.id = null;

    // emit close event
    this.emit('close', reason, desc);

    // clean buffers after, so users can still
    // grab the buffers on `close` event
    self.writeBuffer = [];
    self.prevBufferLen = 0;
  }
};

/**
 * Filters upgrades, returning only those matching client transports.
 *
 * @param {Array} server upgrades
 * @api private
 *
 */

Socket.prototype.filterUpgrades = function (upgrades) {
  var filteredUpgrades = [];
  for (var i = 0, j = upgrades.length; i < j; i++) {
    if (~index(this.transports, upgrades[i])) filteredUpgrades.push(upgrades[i]);
  }
  return filteredUpgrades;
};

/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(3)))

/***/ }),
/* 65 */
/***/ (function(module, exports, __webpack_require__) {

/* WEBPACK VAR INJECTION */(function(global) {
/**
 * Module requirements.
 */

var Polling = __webpack_require__(34);
var inherit = __webpack_require__(11);

/**
 * Module exports.
 */

module.exports = JSONPPolling;

/**
 * Cached regular expressions.
 */

var rNewline = /\n/g;
var rEscapedNewline = /\\n/g;

/**
 * Global JSONP callbacks.
 */

var callbacks;

/**
 * Noop.
 */

function empty () { }

/**
 * JSONP Polling constructor.
 *
 * @param {Object} opts.
 * @api public
 */

function JSONPPolling (opts) {
  Polling.call(this, opts);

  this.query = this.query || {};

  // define global callbacks array if not present
  // we do this here (lazily) to avoid unneeded global pollution
  if (!callbacks) {
    // we need to consider multiple engines in the same page
    if (!global.___eio) global.___eio = [];
    callbacks = global.___eio;
  }

  // callback identifier
  this.index = callbacks.length;

  // add callback to jsonp global
  var self = this;
  callbacks.push(function (msg) {
    self.onData(msg);
  });

  // append to query string
  this.query.j = this.index;

  // prevent spurious errors from being emitted when the window is unloaded
  if (global.document && global.addEventListener) {
    global.addEventListener('beforeunload', function () {
      if (self.script) self.script.onerror = empty;
    }, false);
  }
}

/**
 * Inherits from Polling.
 */

inherit(JSONPPolling, Polling);

/*
 * JSONP only supports binary as base64 encoded strings
 */

JSONPPolling.prototype.supportsBinary = false;

/**
 * Closes the socket.
 *
 * @api private
 */

JSONPPolling.prototype.doClose = function () {
  if (this.script) {
    this.script.parentNode.removeChild(this.script);
    this.script = null;
  }

  if (this.form) {
    this.form.parentNode.removeChild(this.form);
    this.form = null;
    this.iframe = null;
  }

  Polling.prototype.doClose.call(this);
};

/**
 * Starts a poll cycle.
 *
 * @api private
 */

JSONPPolling.prototype.doPoll = function () {
  var self = this;
  var script = document.createElement('script');

  if (this.script) {
    this.script.parentNode.removeChild(this.script);
    this.script = null;
  }

  script.async = true;
  script.src = this.uri();
  script.onerror = function (e) {
    self.onError('jsonp poll error', e);
  };

  var insertAt = document.getElementsByTagName('script')[0];
  if (insertAt) {
    insertAt.parentNode.insertBefore(script, insertAt);
  } else {
    (document.head || document.body).appendChild(script);
  }
  this.script = script;

  var isUAgecko = 'undefined' !== typeof navigator && /gecko/i.test(navigator.userAgent);

  if (isUAgecko) {
    setTimeout(function () {
      var iframe = document.createElement('iframe');
      document.body.appendChild(iframe);
      document.body.removeChild(iframe);
    }, 100);
  }
};

/**
 * Writes with a hidden iframe.
 *
 * @param {String} data to send
 * @param {Function} called upon flush.
 * @api private
 */

JSONPPolling.prototype.doWrite = function (data, fn) {
  var self = this;

  if (!this.form) {
    var form = document.createElement('form');
    var area = document.createElement('textarea');
    var id = this.iframeId = 'eio_iframe_' + this.index;
    var iframe;

    form.className = 'socketio';
    form.style.position = 'absolute';
    form.style.top = '-1000px';
    form.style.left = '-1000px';
    form.target = id;
    form.method = 'POST';
    form.setAttribute('accept-charset', 'utf-8');
    area.name = 'd';
    form.appendChild(area);
    document.body.appendChild(form);

    this.form = form;
    this.area = area;
  }

  this.form.action = this.uri();

  function complete () {
    initIframe();
    fn();
  }

  function initIframe () {
    if (self.iframe) {
      try {
        self.form.removeChild(self.iframe);
      } catch (e) {
        self.onError('jsonp polling iframe removal error', e);
      }
    }

    try {
      // ie6 dynamic iframes with target="" support (thanks Chris Lambacher)
      var html = '<iframe src="javascript:0" name="' + self.iframeId + '">';
      iframe = document.createElement(html);
    } catch (e) {
      iframe = document.createElement('iframe');
      iframe.name = self.iframeId;
      iframe.src = 'javascript:0';
    }

    iframe.id = self.iframeId;

    self.form.appendChild(iframe);
    self.iframe = iframe;
  }

  initIframe();

  // escape \n to prevent it from being converted into \r\n by some UAs
  // double escaping is required for escaped new lines because unescaping of new lines can be done safely on server-side
  data = data.replace(rEscapedNewline, '\\\n');
  this.area.value = data.replace(rNewline, '\\n');

  try {
    this.form.submit();
  } catch (e) {}

  if (this.iframe.attachEvent) {
    this.iframe.onreadystatechange = function () {
      if (self.iframe.readyState === 'complete') {
        complete();
      }
    };
  } else {
    this.iframe.onload = complete;
  }
};

/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(3)))

/***/ }),
/* 66 */
/***/ (function(module, exports, __webpack_require__) {

/* WEBPACK VAR INJECTION */(function(global) {/**
 * Module requirements.
 */

var XMLHttpRequest = __webpack_require__(19);
var Polling = __webpack_require__(34);
var Emitter = __webpack_require__(8);
var inherit = __webpack_require__(11);
var debug = __webpack_require__(5)('engine.io-client:polling-xhr');

/**
 * Module exports.
 */

module.exports = XHR;
module.exports.Request = Request;

/**
 * Empty function
 */

function empty () {}

/**
 * XHR Polling constructor.
 *
 * @param {Object} opts
 * @api public
 */

function XHR (opts) {
  Polling.call(this, opts);
  this.requestTimeout = opts.requestTimeout;
  this.extraHeaders = opts.extraHeaders;

  if (global.location) {
    var isSSL = 'https:' === location.protocol;
    var port = location.port;

    // some user agents have empty `location.port`
    if (!port) {
      port = isSSL ? 443 : 80;
    }

    this.xd = opts.hostname !== global.location.hostname ||
      port !== opts.port;
    this.xs = opts.secure !== isSSL;
  }
}

/**
 * Inherits from Polling.
 */

inherit(XHR, Polling);

/**
 * XHR supports binary
 */

XHR.prototype.supportsBinary = true;

/**
 * Creates a request.
 *
 * @param {String} method
 * @api private
 */

XHR.prototype.request = function (opts) {
  opts = opts || {};
  opts.uri = this.uri();
  opts.xd = this.xd;
  opts.xs = this.xs;
  opts.agent = this.agent || false;
  opts.supportsBinary = this.supportsBinary;
  opts.enablesXDR = this.enablesXDR;

  // SSL options for Node.js client
  opts.pfx = this.pfx;
  opts.key = this.key;
  opts.passphrase = this.passphrase;
  opts.cert = this.cert;
  opts.ca = this.ca;
  opts.ciphers = this.ciphers;
  opts.rejectUnauthorized = this.rejectUnauthorized;
  opts.requestTimeout = this.requestTimeout;

  // other options for Node.js client
  opts.extraHeaders = this.extraHeaders;

  return new Request(opts);
};

/**
 * Sends data.
 *
 * @param {String} data to send.
 * @param {Function} called upon flush.
 * @api private
 */

XHR.prototype.doWrite = function (data, fn) {
  var isBinary = typeof data !== 'string' && data !== undefined;
  var req = this.request({ method: 'POST', data: data, isBinary: isBinary });
  var self = this;
  req.on('success', fn);
  req.on('error', function (err) {
    self.onError('xhr post error', err);
  });
  this.sendXhr = req;
};

/**
 * Starts a poll cycle.
 *
 * @api private
 */

XHR.prototype.doPoll = function () {
  debug('xhr poll');
  var req = this.request();
  var self = this;
  req.on('data', function (data) {
    self.onData(data);
  });
  req.on('error', function (err) {
    self.onError('xhr poll error', err);
  });
  this.pollXhr = req;
};

/**
 * Request constructor
 *
 * @param {Object} options
 * @api public
 */

function Request (opts) {
  this.method = opts.method || 'GET';
  this.uri = opts.uri;
  this.xd = !!opts.xd;
  this.xs = !!opts.xs;
  this.async = false !== opts.async;
  this.data = undefined !== opts.data ? opts.data : null;
  this.agent = opts.agent;
  this.isBinary = opts.isBinary;
  this.supportsBinary = opts.supportsBinary;
  this.enablesXDR = opts.enablesXDR;
  this.requestTimeout = opts.requestTimeout;

  // SSL options for Node.js client
  this.pfx = opts.pfx;
  this.key = opts.key;
  this.passphrase = opts.passphrase;
  this.cert = opts.cert;
  this.ca = opts.ca;
  this.ciphers = opts.ciphers;
  this.rejectUnauthorized = opts.rejectUnauthorized;

  // other options for Node.js client
  this.extraHeaders = opts.extraHeaders;

  this.create();
}

/**
 * Mix in `Emitter`.
 */

Emitter(Request.prototype);

/**
 * Creates the XHR object and sends the request.
 *
 * @api private
 */

Request.prototype.create = function () {
  var opts = { agent: this.agent, xdomain: this.xd, xscheme: this.xs, enablesXDR: this.enablesXDR };

  // SSL options for Node.js client
  opts.pfx = this.pfx;
  opts.key = this.key;
  opts.passphrase = this.passphrase;
  opts.cert = this.cert;
  opts.ca = this.ca;
  opts.ciphers = this.ciphers;
  opts.rejectUnauthorized = this.rejectUnauthorized;

  var xhr = this.xhr = new XMLHttpRequest(opts);
  var self = this;

  try {
    debug('xhr open %s: %s', this.method, this.uri);
    xhr.open(this.method, this.uri, this.async);
    try {
      if (this.extraHeaders) {
        xhr.setDisableHeaderCheck && xhr.setDisableHeaderCheck(true);
        for (var i in this.extraHeaders) {
          if (this.extraHeaders.hasOwnProperty(i)) {
            xhr.setRequestHeader(i, this.extraHeaders[i]);
          }
        }
      }
    } catch (e) {}

    if ('POST' === this.method) {
      try {
        if (this.isBinary) {
          xhr.setRequestHeader('Content-type', 'application/octet-stream');
        } else {
          xhr.setRequestHeader('Content-type', 'text/plain;charset=UTF-8');
        }
      } catch (e) {}
    }

    try {
      xhr.setRequestHeader('Accept', '*/*');
    } catch (e) {}

    // ie6 check
    if ('withCredentials' in xhr) {
      xhr.withCredentials = true;
    }

    if (this.requestTimeout) {
      xhr.timeout = this.requestTimeout;
    }

    if (this.hasXDR()) {
      xhr.onload = function () {
        self.onLoad();
      };
      xhr.onerror = function () {
        self.onError(xhr.responseText);
      };
    } else {
      xhr.onreadystatechange = function () {
        if (xhr.readyState === 2) {
          var contentType;
          try {
            contentType = xhr.getResponseHeader('Content-Type');
          } catch (e) {}
          if (contentType === 'application/octet-stream') {
            xhr.responseType = 'arraybuffer';
          }
        }
        if (4 !== xhr.readyState) return;
        if (200 === xhr.status || 1223 === xhr.status) {
          self.onLoad();
        } else {
          // make sure the `error` event handler that's user-set
          // does not throw in the same tick and gets caught here
          setTimeout(function () {
            self.onError(xhr.status);
          }, 0);
        }
      };
    }

    debug('xhr data %s', this.data);
    xhr.send(this.data);
  } catch (e) {
    // Need to defer since .create() is called directly fhrom the constructor
    // and thus the 'error' event can only be only bound *after* this exception
    // occurs.  Therefore, also, we cannot throw here at all.
    setTimeout(function () {
      self.onError(e);
    }, 0);
    return;
  }

  if (global.document) {
    this.index = Request.requestsCount++;
    Request.requests[this.index] = this;
  }
};

/**
 * Called upon successful response.
 *
 * @api private
 */

Request.prototype.onSuccess = function () {
  this.emit('success');
  this.cleanup();
};

/**
 * Called if we have data.
 *
 * @api private
 */

Request.prototype.onData = function (data) {
  this.emit('data', data);
  this.onSuccess();
};

/**
 * Called upon error.
 *
 * @api private
 */

Request.prototype.onError = function (err) {
  this.emit('error', err);
  this.cleanup(true);
};

/**
 * Cleans up house.
 *
 * @api private
 */

Request.prototype.cleanup = function (fromError) {
  if ('undefined' === typeof this.xhr || null === this.xhr) {
    return;
  }
  // xmlhttprequest
  if (this.hasXDR()) {
    this.xhr.onload = this.xhr.onerror = empty;
  } else {
    this.xhr.onreadystatechange = empty;
  }

  if (fromError) {
    try {
      this.xhr.abort();
    } catch (e) {}
  }

  if (global.document) {
    delete Request.requests[this.index];
  }

  this.xhr = null;
};

/**
 * Called upon load.
 *
 * @api private
 */

Request.prototype.onLoad = function () {
  var data;
  try {
    var contentType;
    try {
      contentType = this.xhr.getResponseHeader('Content-Type');
    } catch (e) {}
    if (contentType === 'application/octet-stream') {
      data = this.xhr.response || this.xhr.responseText;
    } else {
      data = this.xhr.responseText;
    }
  } catch (e) {
    this.onError(e);
  }
  if (null != data) {
    this.onData(data);
  }
};

/**
 * Check if it has XDomainRequest.
 *
 * @api private
 */

Request.prototype.hasXDR = function () {
  return 'undefined' !== typeof global.XDomainRequest && !this.xs && this.enablesXDR;
};

/**
 * Aborts the request.
 *
 * @api public
 */

Request.prototype.abort = function () {
  this.cleanup();
};

/**
 * Aborts pending requests when unloading the window. This is needed to prevent
 * memory leaks (e.g. when using IE) and to ensure that no spurious error is
 * emitted.
 */

Request.requestsCount = 0;
Request.requests = {};

if (global.document) {
  if (global.attachEvent) {
    global.attachEvent('onunload', unloadHandler);
  } else if (global.addEventListener) {
    global.addEventListener('beforeunload', unloadHandler, false);
  }
}

function unloadHandler () {
  for (var i in Request.requests) {
    if (Request.requests.hasOwnProperty(i)) {
      Request.requests[i].abort();
    }
  }
}

/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(3)))

/***/ }),
/* 67 */
/***/ (function(module, exports, __webpack_require__) {

/* WEBPACK VAR INJECTION */(function(global) {/**
 * Module dependencies.
 */

var Transport = __webpack_require__(18);
var parser = __webpack_require__(9);
var parseqs = __webpack_require__(14);
var inherit = __webpack_require__(11);
var yeast = __webpack_require__(51);
var debug = __webpack_require__(5)('engine.io-client:websocket');
var BrowserWebSocket = global.WebSocket || global.MozWebSocket;
var NodeWebSocket;
if (typeof window === 'undefined') {
  try {
    NodeWebSocket = __webpack_require__(127);
  } catch (e) { }
}

/**
 * Get either the `WebSocket` or `MozWebSocket` globals
 * in the browser or try to resolve WebSocket-compatible
 * interface exposed by `ws` for Node-like environment.
 */

var WebSocket = BrowserWebSocket;
if (!WebSocket && typeof window === 'undefined') {
  WebSocket = NodeWebSocket;
}

/**
 * Module exports.
 */

module.exports = WS;

/**
 * WebSocket transport constructor.
 *
 * @api {Object} connection options
 * @api public
 */

function WS (opts) {
  var forceBase64 = (opts && opts.forceBase64);
  if (forceBase64) {
    this.supportsBinary = false;
  }
  this.perMessageDeflate = opts.perMessageDeflate;
  this.usingBrowserWebSocket = BrowserWebSocket && !opts.forceNode;
  this.protocols = opts.protocols;
  if (!this.usingBrowserWebSocket) {
    WebSocket = NodeWebSocket;
  }
  Transport.call(this, opts);
}

/**
 * Inherits from Transport.
 */

inherit(WS, Transport);

/**
 * Transport name.
 *
 * @api public
 */

WS.prototype.name = 'websocket';

/*
 * WebSockets support binary
 */

WS.prototype.supportsBinary = true;

/**
 * Opens socket.
 *
 * @api private
 */

WS.prototype.doOpen = function () {
  if (!this.check()) {
    // let probe timeout
    return;
  }

  var uri = this.uri();
  var protocols = this.protocols;
  var opts = {
    agent: this.agent,
    perMessageDeflate: this.perMessageDeflate
  };

  // SSL options for Node.js client
  opts.pfx = this.pfx;
  opts.key = this.key;
  opts.passphrase = this.passphrase;
  opts.cert = this.cert;
  opts.ca = this.ca;
  opts.ciphers = this.ciphers;
  opts.rejectUnauthorized = this.rejectUnauthorized;
  if (this.extraHeaders) {
    opts.headers = this.extraHeaders;
  }
  if (this.localAddress) {
    opts.localAddress = this.localAddress;
  }

  try {
    this.ws = this.usingBrowserWebSocket ? (protocols ? new WebSocket(uri, protocols) : new WebSocket(uri)) : new WebSocket(uri, protocols, opts);
  } catch (err) {
    return this.emit('error', err);
  }

  if (this.ws.binaryType === undefined) {
    this.supportsBinary = false;
  }

  if (this.ws.supports && this.ws.supports.binary) {
    this.supportsBinary = true;
    this.ws.binaryType = 'nodebuffer';
  } else {
    this.ws.binaryType = 'arraybuffer';
  }

  this.addEventListeners();
};

/**
 * Adds event listeners to the socket
 *
 * @api private
 */

WS.prototype.addEventListeners = function () {
  var self = this;

  this.ws.onopen = function () {
    self.onOpen();
  };
  this.ws.onclose = function () {
    self.onClose();
  };
  this.ws.onmessage = function (ev) {
    self.onData(ev.data);
  };
  this.ws.onerror = function (e) {
    self.onError('websocket error', e);
  };
};

/**
 * Writes data to socket.
 *
 * @param {Array} array of packets.
 * @api private
 */

WS.prototype.write = function (packets) {
  var self = this;
  this.writable = false;

  // encodePacket efficient as it uses WS framing
  // no need for encodePayload
  var total = packets.length;
  for (var i = 0, l = total; i < l; i++) {
    (function (packet) {
      parser.encodePacket(packet, self.supportsBinary, function (data) {
        if (!self.usingBrowserWebSocket) {
          // always create a new object (GH-437)
          var opts = {};
          if (packet.options) {
            opts.compress = packet.options.compress;
          }

          if (self.perMessageDeflate) {
            var len = 'string' === typeof data ? global.Buffer.byteLength(data) : data.length;
            if (len < self.perMessageDeflate.threshold) {
              opts.compress = false;
            }
          }
        }

        // Sometimes the websocket has already been closed but the browser didn't
        // have a chance of informing us about it yet, in that case send will
        // throw an error
        try {
          if (self.usingBrowserWebSocket) {
            // TypeError is thrown when passing the second argument on Safari
            self.ws.send(data);
          } else {
            self.ws.send(data, opts);
          }
        } catch (e) {
          debug('websocket closed before onclose event');
        }

        --total || done();
      });
    })(packets[i]);
  }

  function done () {
    self.emit('flush');

    // fake drain
    // defer to next tick to allow Socket to clear writeBuffer
    setTimeout(function () {
      self.writable = true;
      self.emit('drain');
    }, 0);
  }
};

/**
 * Called upon close
 *
 * @api private
 */

WS.prototype.onClose = function () {
  Transport.prototype.onClose.call(this);
};

/**
 * Closes socket.
 *
 * @api private
 */

WS.prototype.doClose = function () {
  if (typeof this.ws !== 'undefined') {
    this.ws.close();
  }
};

/**
 * Generates uri for connection.
 *
 * @api private
 */

WS.prototype.uri = function () {
  var query = this.query || {};
  var schema = this.secure ? 'wss' : 'ws';
  var port = '';

  // avoid port if default for schema
  if (this.port && (('wss' === schema && Number(this.port) !== 443) ||
    ('ws' === schema && Number(this.port) !== 80))) {
    port = ':' + this.port;
  }

  // append timestamp to URI
  if (this.timestampRequests) {
    query[this.timestampParam] = yeast();
  }

  // communicate binary support capabilities
  if (!this.supportsBinary) {
    query.b64 = 1;
  }

  query = parseqs.encode(query);

  // prepend ? to query
  if (query.length) {
    query = '?' + query;
  }

  var ipv6 = this.hostname.indexOf(':') !== -1;
  return schema + '://' + (ipv6 ? '[' + this.hostname + ']' : this.hostname) + port + this.path + query;
};

/**
 * Feature detection for WebSocket.
 *
 * @return {Boolean} whether this transport is available.
 * @api public
 */

WS.prototype.check = function () {
  return !!WebSocket && !('__initialize' in WebSocket && this.name === WS.prototype.name);
};

/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(3)))

/***/ }),
/* 68 */
/***/ (function(module, exports) {


/**
 * Gets the keys for an object.
 *
 * @return {Array} keys
 * @api private
 */

module.exports = Object.keys || function keys (obj){
  var arr = [];
  var has = Object.prototype.hasOwnProperty;

  for (var i in obj) {
    if (has.call(obj, i)) {
      arr.push(i);
    }
  }
  return arr;
};


/***/ }),
/* 69 */
/***/ (function(module, exports, __webpack_require__) {

/* WEBPACK VAR INJECTION */(function(module, global) {var __WEBPACK_AMD_DEFINE_RESULT__;/*! https://mths.be/utf8js v2.1.2 by @mathias */
;(function(root) {

	// Detect free variables `exports`
	var freeExports = typeof exports == 'object' && exports;

	// Detect free variable `module`
	var freeModule = typeof module == 'object' && module &&
		module.exports == freeExports && module;

	// Detect free variable `global`, from Node.js or Browserified code,
	// and use it as `root`
	var freeGlobal = typeof global == 'object' && global;
	if (freeGlobal.global === freeGlobal || freeGlobal.window === freeGlobal) {
		root = freeGlobal;
	}

	/*--------------------------------------------------------------------------*/

	var stringFromCharCode = String.fromCharCode;

	// Taken from https://mths.be/punycode
	function ucs2decode(string) {
		var output = [];
		var counter = 0;
		var length = string.length;
		var value;
		var extra;
		while (counter < length) {
			value = string.charCodeAt(counter++);
			if (value >= 0xD800 && value <= 0xDBFF && counter < length) {
				// high surrogate, and there is a next character
				extra = string.charCodeAt(counter++);
				if ((extra & 0xFC00) == 0xDC00) { // low surrogate
					output.push(((value & 0x3FF) << 10) + (extra & 0x3FF) + 0x10000);
				} else {
					// unmatched surrogate; only append this code unit, in case the next
					// code unit is the high surrogate of a surrogate pair
					output.push(value);
					counter--;
				}
			} else {
				output.push(value);
			}
		}
		return output;
	}

	// Taken from https://mths.be/punycode
	function ucs2encode(array) {
		var length = array.length;
		var index = -1;
		var value;
		var output = '';
		while (++index < length) {
			value = array[index];
			if (value > 0xFFFF) {
				value -= 0x10000;
				output += stringFromCharCode(value >>> 10 & 0x3FF | 0xD800);
				value = 0xDC00 | value & 0x3FF;
			}
			output += stringFromCharCode(value);
		}
		return output;
	}

	function checkScalarValue(codePoint, strict) {
		if (codePoint >= 0xD800 && codePoint <= 0xDFFF) {
			if (strict) {
				throw Error(
					'Lone surrogate U+' + codePoint.toString(16).toUpperCase() +
					' is not a scalar value'
				);
			}
			return false;
		}
		return true;
	}
	/*--------------------------------------------------------------------------*/

	function createByte(codePoint, shift) {
		return stringFromCharCode(((codePoint >> shift) & 0x3F) | 0x80);
	}

	function encodeCodePoint(codePoint, strict) {
		if ((codePoint & 0xFFFFFF80) == 0) { // 1-byte sequence
			return stringFromCharCode(codePoint);
		}
		var symbol = '';
		if ((codePoint & 0xFFFFF800) == 0) { // 2-byte sequence
			symbol = stringFromCharCode(((codePoint >> 6) & 0x1F) | 0xC0);
		}
		else if ((codePoint & 0xFFFF0000) == 0) { // 3-byte sequence
			if (!checkScalarValue(codePoint, strict)) {
				codePoint = 0xFFFD;
			}
			symbol = stringFromCharCode(((codePoint >> 12) & 0x0F) | 0xE0);
			symbol += createByte(codePoint, 6);
		}
		else if ((codePoint & 0xFFE00000) == 0) { // 4-byte sequence
			symbol = stringFromCharCode(((codePoint >> 18) & 0x07) | 0xF0);
			symbol += createByte(codePoint, 12);
			symbol += createByte(codePoint, 6);
		}
		symbol += stringFromCharCode((codePoint & 0x3F) | 0x80);
		return symbol;
	}

	function utf8encode(string, opts) {
		opts = opts || {};
		var strict = false !== opts.strict;

		var codePoints = ucs2decode(string);
		var length = codePoints.length;
		var index = -1;
		var codePoint;
		var byteString = '';
		while (++index < length) {
			codePoint = codePoints[index];
			byteString += encodeCodePoint(codePoint, strict);
		}
		return byteString;
	}

	/*--------------------------------------------------------------------------*/

	function readContinuationByte() {
		if (byteIndex >= byteCount) {
			throw Error('Invalid byte index');
		}

		var continuationByte = byteArray[byteIndex] & 0xFF;
		byteIndex++;

		if ((continuationByte & 0xC0) == 0x80) {
			return continuationByte & 0x3F;
		}

		// If we end up here, it’s not a continuation byte
		throw Error('Invalid continuation byte');
	}

	function decodeSymbol(strict) {
		var byte1;
		var byte2;
		var byte3;
		var byte4;
		var codePoint;

		if (byteIndex > byteCount) {
			throw Error('Invalid byte index');
		}

		if (byteIndex == byteCount) {
			return false;
		}

		// Read first byte
		byte1 = byteArray[byteIndex] & 0xFF;
		byteIndex++;

		// 1-byte sequence (no continuation bytes)
		if ((byte1 & 0x80) == 0) {
			return byte1;
		}

		// 2-byte sequence
		if ((byte1 & 0xE0) == 0xC0) {
			byte2 = readContinuationByte();
			codePoint = ((byte1 & 0x1F) << 6) | byte2;
			if (codePoint >= 0x80) {
				return codePoint;
			} else {
				throw Error('Invalid continuation byte');
			}
		}

		// 3-byte sequence (may include unpaired surrogates)
		if ((byte1 & 0xF0) == 0xE0) {
			byte2 = readContinuationByte();
			byte3 = readContinuationByte();
			codePoint = ((byte1 & 0x0F) << 12) | (byte2 << 6) | byte3;
			if (codePoint >= 0x0800) {
				return checkScalarValue(codePoint, strict) ? codePoint : 0xFFFD;
			} else {
				throw Error('Invalid continuation byte');
			}
		}

		// 4-byte sequence
		if ((byte1 & 0xF8) == 0xF0) {
			byte2 = readContinuationByte();
			byte3 = readContinuationByte();
			byte4 = readContinuationByte();
			codePoint = ((byte1 & 0x07) << 0x12) | (byte2 << 0x0C) |
				(byte3 << 0x06) | byte4;
			if (codePoint >= 0x010000 && codePoint <= 0x10FFFF) {
				return codePoint;
			}
		}

		throw Error('Invalid UTF-8 detected');
	}

	var byteArray;
	var byteCount;
	var byteIndex;
	function utf8decode(byteString, opts) {
		opts = opts || {};
		var strict = false !== opts.strict;

		byteArray = ucs2decode(byteString);
		byteCount = byteArray.length;
		byteIndex = 0;
		var codePoints = [];
		var tmp;
		while ((tmp = decodeSymbol(strict)) !== false) {
			codePoints.push(tmp);
		}
		return ucs2encode(codePoints);
	}

	/*--------------------------------------------------------------------------*/

	var utf8 = {
		'version': '2.1.2',
		'encode': utf8encode,
		'decode': utf8decode
	};

	// Some AMD build optimizers, like r.js, check for specific condition patterns
	// like the following:
	if (
		true
	) {
		!(__WEBPACK_AMD_DEFINE_RESULT__ = function() {
			return utf8;
		}.call(exports, __webpack_require__, exports, module),
				__WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));
	}	else if (freeExports && !freeExports.nodeType) {
		if (freeModule) { // in Node.js or RingoJS v0.8.0+
			freeModule.exports = utf8;
		} else { // in Narwhal or RingoJS v0.7.0-
			var object = {};
			var hasOwnProperty = object.hasOwnProperty;
			for (var key in utf8) {
				hasOwnProperty.call(utf8, key) && (freeExports[key] = utf8[key]);
			}
		}
	} else { // in Rhino or a web browser
		root.utf8 = utf8;
	}

}(this));

/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(50)(module), __webpack_require__(3)))

/***/ }),
/* 70 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var DEFAULT_VALUES = {
    emitDelay: 10,
    strictMode: false
};

/**
 * @typedef {object} EventEmitterListenerFunc
 * @property {boolean} once
 * @property {function} fn
 */

/**
 * @class EventEmitter
 *
 * @private
 * @property {Object.<string, EventEmitterListenerFunc[]>} _listeners
 * @property {string[]} events
 */

var EventEmitter = function () {

    /**
     * @constructor
     * @param {{}}      [opts]
     * @param {number}  [opts.emitDelay = 10] - Number in ms. Specifies whether emit will be sync or async. By default - 10ms. If 0 - fires sync
     * @param {boolean} [opts.strictMode = false] - is true, Emitter throws error on emit error with no listeners
     */

    function EventEmitter() {
        var opts = arguments.length <= 0 || arguments[0] === undefined ? DEFAULT_VALUES : arguments[0];

        _classCallCheck(this, EventEmitter);

        var emitDelay = void 0,
            strictMode = void 0;

        if (opts.hasOwnProperty('emitDelay')) {
            emitDelay = opts.emitDelay;
        } else {
            emitDelay = DEFAULT_VALUES.emitDelay;
        }
        this._emitDelay = emitDelay;

        if (opts.hasOwnProperty('strictMode')) {
            strictMode = opts.strictMode;
        } else {
            strictMode = DEFAULT_VALUES.strictMode;
        }
        this._strictMode = strictMode;

        this._listeners = {};
        this.events = [];
    }

    /**
     * @protected
     * @param {string} type
     * @param {function} listener
     * @param {boolean} [once = false]
     */


    _createClass(EventEmitter, [{
        key: '_addListenner',
        value: function _addListenner(type, listener, once) {
            if (typeof listener !== 'function') {
                throw TypeError('listener must be a function');
            }

            if (this.events.indexOf(type) === -1) {
                this._listeners[type] = [{
                    once: once,
                    fn: listener
                }];
                this.events.push(type);
            } else {
                this._listeners[type].push({
                    once: once,
                    fn: listener
                });
            }
        }

        /**
         * Subscribes on event type specified function
         * @param {string} type
         * @param {function} listener
         */

    }, {
        key: 'on',
        value: function on(type, listener) {
            this._addListenner(type, listener, false);
        }

        /**
         * Subscribes on event type specified function to fire only once
         * @param {string} type
         * @param {function} listener
         */

    }, {
        key: 'once',
        value: function once(type, listener) {
            this._addListenner(type, listener, true);
        }

        /**
         * Removes event with specified type. If specified listenerFunc - deletes only one listener of specified type
         * @param {string} eventType
         * @param {function} [listenerFunc]
         */

    }, {
        key: 'off',
        value: function off(eventType, listenerFunc) {
            var _this = this;

            var typeIndex = this.events.indexOf(eventType);
            var hasType = eventType && typeIndex !== -1;

            if (hasType) {
                if (!listenerFunc) {
                    delete this._listeners[eventType];
                    this.events.splice(typeIndex, 1);
                } else {
                    (function () {
                        var removedEvents = [];
                        var typeListeners = _this._listeners[eventType];

                        typeListeners.forEach(
                        /**
                         * @param {EventEmitterListenerFunc} fn
                         * @param {number} idx
                         */
                        function (fn, idx) {
                            if (fn.fn === listenerFunc) {
                                removedEvents.unshift(idx);
                            }
                        });

                        removedEvents.forEach(function (idx) {
                            typeListeners.splice(idx, 1);
                        });

                        if (!typeListeners.length) {
                            _this.events.splice(typeIndex, 1);
                            delete _this._listeners[eventType];
                        }
                    })();
                }
            }
        }

        /**
         * Applies arguments to specified event type
         * @param {string} eventType
         * @param {*[]} eventArguments
         * @protected
         */

    }, {
        key: '_applyEvents',
        value: function _applyEvents(eventType, eventArguments) {
            var typeListeners = this._listeners[eventType];

            if (!typeListeners || !typeListeners.length) {
                if (this._strictMode) {
                    throw 'No listeners specified for event: ' + eventType;
                } else {
                    return;
                }
            }

            var removableListeners = [];
            typeListeners.forEach(function (eeListener, idx) {
                eeListener.fn.apply(null, eventArguments);
                if (eeListener.once) {
                    removableListeners.unshift(idx);
                }
            });

            removableListeners.forEach(function (idx) {
                typeListeners.splice(idx, 1);
            });
        }

        /**
         * Emits event with specified type and params.
         * @param {string} type
         * @param eventArgs
         */

    }, {
        key: 'emit',
        value: function emit(type) {
            var _this2 = this;

            for (var _len = arguments.length, eventArgs = Array(_len > 1 ? _len - 1 : 0), _key = 1; _key < _len; _key++) {
                eventArgs[_key - 1] = arguments[_key];
            }

            if (this._emitDelay) {
                setTimeout(function () {
                    _this2._applyEvents.call(_this2, type, eventArgs);
                }, this._emitDelay);
            } else {
                this._applyEvents(type, eventArgs);
            }
        }

        /**
         * Emits event with specified type and params synchronously.
         * @param {string} type
         * @param eventArgs
         */

    }, {
        key: 'emitSync',
        value: function emitSync(type) {
            for (var _len2 = arguments.length, eventArgs = Array(_len2 > 1 ? _len2 - 1 : 0), _key2 = 1; _key2 < _len2; _key2++) {
                eventArgs[_key2 - 1] = arguments[_key2];
            }

            this._applyEvents(type, eventArgs);
        }

        /**
         * Destroys EventEmitter
         */

    }, {
        key: 'destroy',
        value: function destroy() {
            this._listeners = {};
            this.events = [];
        }
    }]);

    return EventEmitter;
}();

module.exports = EventEmitter;


/***/ }),
/* 71 */
/***/ (function(module, exports) {


/**
 * Module exports.
 *
 * Logic borrowed from Modernizr:
 *
 *   - https://github.com/Modernizr/Modernizr/blob/master/feature-detects/cors.js
 */

try {
  module.exports = typeof XMLHttpRequest !== 'undefined' &&
    'withCredentials' in new XMLHttpRequest();
} catch (err) {
  // if XMLHttp support is disabled in IE then it will throw
  // when trying to create
  module.exports = false;
}


/***/ }),
/* 72 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (immutable) */ __webpack_exports__["a"] = LinkedList;
/** @license MIT License (c) copyright 2010-2016 original author or authors */
/** @author Brian Cavalier */
/** @author John Hann */

/**
 * Doubly linked list
 * @constructor
 */
function LinkedList () {
  this.head = null
  this.length = 0
}

/**
 * Add a node to the end of the list
 * @param {{prev:Object|null, next:Object|null, dispose:function}} x node to add
 */
LinkedList.prototype.add = function (x) {
  if (this.head !== null) {
    this.head.prev = x
    x.next = this.head
  }
  this.head = x
  ++this.length
}

/**
 * Remove the provided node from the list
 * @param {{prev:Object|null, next:Object|null, dispose:function}} x node to remove
 */
LinkedList.prototype.remove = function (x) { // eslint-disable-line  complexity
  --this.length
  if (x === this.head) {
    this.head = this.head.next
  }
  if (x.next !== null) {
    x.next.prev = x.prev
    x.next = null
  }
  if (x.prev !== null) {
    x.prev.next = x.next
    x.prev = null
  }
}

/**
 * @returns {boolean} true iff there are no nodes in the list
 */
LinkedList.prototype.isEmpty = function () {
  return this.length === 0
}

/**
 * Dispose all nodes
 * @returns {Promise} promise that fulfills when all nodes have been disposed,
 *  or rejects if an error occurs while disposing
 */
LinkedList.prototype.dispose = function () {
  if (this.isEmpty()) {
    return Promise.resolve()
  }

  var promises = []
  var x = this.head
  this.head = null
  this.length = 0

  while (x !== null) {
    promises.push(x.dispose())
    x = x.next
  }

  return Promise.all(promises)
}


/***/ }),
/* 73 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (immutable) */ __webpack_exports__["a"] = isPromise;
/** @license MIT License (c) copyright 2010-2016 original author or authors */
/** @author Brian Cavalier */
/** @author John Hann */

function isPromise (p) {
  return p !== null && typeof p === 'object' && typeof p.then === 'function'
}


/***/ }),
/* 74 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (immutable) */ __webpack_exports__["a"] = Queue;
/** @license MIT License (c) copyright 2010-2016 original author or authors */
/** @author Brian Cavalier */
/** @author John Hann */

// Based on https://github.com/petkaantonov/deque

function Queue (capPow2) {
  this._capacity = capPow2 || 32
  this._length = 0
  this._head = 0
}

Queue.prototype.push = function (x) {
  var len = this._length
  this._checkCapacity(len + 1)

  var i = (this._head + len) & (this._capacity - 1)
  this[i] = x
  this._length = len + 1
}

Queue.prototype.shift = function () {
  var head = this._head
  var x = this[head]

  this[head] = void 0
  this._head = (head + 1) & (this._capacity - 1)
  this._length--
  return x
}

Queue.prototype.isEmpty = function () {
  return this._length === 0
}

Queue.prototype.length = function () {
  return this._length
}

Queue.prototype._checkCapacity = function (size) {
  if (this._capacity < size) {
    this._ensureCapacity(this._capacity << 1)
  }
}

Queue.prototype._ensureCapacity = function (capacity) {
  var oldCapacity = this._capacity
  this._capacity = capacity

  var last = this._head + this._length

  if (last > oldCapacity) {
    copy(this, 0, this, oldCapacity, last & (oldCapacity - 1))
  }
}

function copy (src, srcIndex, dst, dstIndex, len) {
  for (var j = 0; j < len; ++j) {
    dst[j + dstIndex] = src[j + srcIndex]
    src[j + srcIndex] = void 0
  }
}


/***/ }),
/* 75 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (immutable) */ __webpack_exports__["a"] = scan;
/* harmony export (immutable) */ __webpack_exports__["b"] = reduce;
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__Stream__ = __webpack_require__(0);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__sink_Pipe__ = __webpack_require__(2);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__runSource__ = __webpack_require__(43);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3__disposable_dispose__ = __webpack_require__(1);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_4__scheduler_PropagateTask__ = __webpack_require__(6);
/** @license MIT License (c) copyright 2010-2016 original author or authors */
/** @author Brian Cavalier */
/** @author John Hann */







/**
 * Create a stream containing successive reduce results of applying f to
 * the previous reduce result and the current stream item.
 * @param {function(result:*, x:*):*} f reducer function
 * @param {*} initial initial value
 * @param {Stream} stream stream to scan
 * @returns {Stream} new stream containing successive reduce results
 */
function scan (f, initial, stream) {
  return new __WEBPACK_IMPORTED_MODULE_0__Stream__["a" /* default */](new Scan(f, initial, stream.source))
}

function Scan (f, z, source) {
  this.source = source
  this.f = f
  this.value = z
}

Scan.prototype.run = function (sink, scheduler) {
  var d1 = scheduler.asap(__WEBPACK_IMPORTED_MODULE_4__scheduler_PropagateTask__["a" /* default */].event(this.value, sink))
  var d2 = this.source.run(new ScanSink(this.f, this.value, sink), scheduler)
  return __WEBPACK_IMPORTED_MODULE_3__disposable_dispose__["b" /* all */]([d1, d2])
}

function ScanSink (f, z, sink) {
  this.f = f
  this.value = z
  this.sink = sink
}

ScanSink.prototype.event = function (t, x) {
  var f = this.f
  this.value = f(this.value, x)
  this.sink.event(t, this.value)
}

ScanSink.prototype.error = __WEBPACK_IMPORTED_MODULE_1__sink_Pipe__["a" /* default */].prototype.error
ScanSink.prototype.end = __WEBPACK_IMPORTED_MODULE_1__sink_Pipe__["a" /* default */].prototype.end

/**
* Reduce a stream to produce a single result.  Note that reducing an infinite
* stream will return a Promise that never fulfills, but that may reject if an error
* occurs.
* @param {function(result:*, x:*):*} f reducer function
* @param {*} initial initial value
* @param {Stream} stream to reduce
* @returns {Promise} promise for the file result of the reduce
*/
function reduce (f, initial, stream) {
  return __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_2__runSource__["a" /* withDefaultScheduler */])(new Reduce(f, initial, stream.source))
}

function Reduce (f, z, source) {
  this.source = source
  this.f = f
  this.value = z
}

Reduce.prototype.run = function (sink, scheduler) {
  return this.source.run(new ReduceSink(this.f, this.value, sink), scheduler)
}

function ReduceSink (f, z, sink) {
  this.f = f
  this.value = z
  this.sink = sink
}

ReduceSink.prototype.event = function (t, x) {
  var f = this.f
  this.value = f(this.value, x)
  this.sink.event(t, this.value)
}

ReduceSink.prototype.error = __WEBPACK_IMPORTED_MODULE_1__sink_Pipe__["a" /* default */].prototype.error

ReduceSink.prototype.end = function (t) {
  this.sink.end(t, this.value)
}


/***/ }),
/* 76 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (immutable) */ __webpack_exports__["a"] = ap;
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__combine__ = __webpack_require__(38);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__most_prelude__ = __webpack_require__(4);
/** @license MIT License (c) copyright 2010-2016 original author or authors */
/** @author Brian Cavalier */
/** @author John Hann */




/**
 * Assume fs is a stream containing functions, and apply the latest function
 * in fs to the latest value in xs.
 * fs:         --f---------g--------h------>
 * xs:         -a-------b-------c-------d-->
 * ap(fs, xs): --fa-----fb-gb---gc--hc--hd->
 * @param {Stream} fs stream of functions to apply to the latest x
 * @param {Stream} xs stream of values to which to apply all the latest f
 * @returns {Stream} stream containing all the applications of fs to xs
 */
function ap (fs, xs) {
  return __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_0__combine__["a" /* combine */])(__WEBPACK_IMPORTED_MODULE_1__most_prelude__["n" /* apply */], fs, xs)
}


/***/ }),
/* 77 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (immutable) */ __webpack_exports__["b"] = cons;
/* harmony export (immutable) */ __webpack_exports__["a"] = concat;
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__source_core__ = __webpack_require__(7);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__continueWith__ = __webpack_require__(39);
/** @license MIT License (c) copyright 2010-2016 original author or authors */
/** @author Brian Cavalier */
/** @author John Hann */




/**
 * @param {*} x value to prepend
 * @param {Stream} stream
 * @returns {Stream} new stream with x prepended
 */
function cons (x, stream) {
  return concat(__webpack_require__.i(__WEBPACK_IMPORTED_MODULE_0__source_core__["a" /* of */])(x), stream)
}

/**
* @param {Stream} left
* @param {Stream} right
* @returns {Stream} new stream containing all events in left followed by all
*  events in right.  This *timeshifts* right to the end of left.
*/
function concat (left, right) {
  return __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_1__continueWith__["a" /* continueWith */])(function () {
    return right
  }, left)
}


/***/ }),
/* 78 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (immutable) */ __webpack_exports__["a"] = concatMap;
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__mergeConcurrently__ = __webpack_require__(20);
/** @license MIT License (c) copyright 2010-2016 original author or authors */
/** @author Brian Cavalier */
/** @author John Hann */



/**
 * Map each value in stream to a new stream, and concatenate them all
 * stream:              -a---b---cX
 * f(a):                 1-1-1-1X
 * f(b):                        -2-2-2-2X
 * f(c):                                -3-3-3-3X
 * stream.concatMap(f): -1-1-1-1-2-2-2-2-3-3-3-3X
 * @param {function(x:*):Stream} f function to map each value to a stream
 * @param {Stream} stream
 * @returns {Stream} new stream containing all events from each stream returned by f
 */
function concatMap (f, stream) {
  return __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_0__mergeConcurrently__["b" /* mergeMapConcurrently */])(f, 1, stream)
}


/***/ }),
/* 79 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (immutable) */ __webpack_exports__["a"] = delay;
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__Stream__ = __webpack_require__(0);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__sink_Pipe__ = __webpack_require__(2);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__disposable_dispose__ = __webpack_require__(1);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3__scheduler_PropagateTask__ = __webpack_require__(6);
/** @license MIT License (c) copyright 2010-2016 original author or authors */
/** @author Brian Cavalier */
/** @author John Hann */






/**
 * @param {Number} delayTime milliseconds to delay each item
 * @param {Stream} stream
 * @returns {Stream} new stream containing the same items, but delayed by ms
 */
function delay (delayTime, stream) {
  return delayTime <= 0 ? stream
    : new __WEBPACK_IMPORTED_MODULE_0__Stream__["a" /* default */](new Delay(delayTime, stream.source))
}

function Delay (dt, source) {
  this.dt = dt
  this.source = source
}

Delay.prototype.run = function (sink, scheduler) {
  var delaySink = new DelaySink(this.dt, sink, scheduler)
  return __WEBPACK_IMPORTED_MODULE_2__disposable_dispose__["b" /* all */]([delaySink, this.source.run(delaySink, scheduler)])
}

function DelaySink (dt, sink, scheduler) {
  this.dt = dt
  this.sink = sink
  this.scheduler = scheduler
}

DelaySink.prototype.dispose = function () {
  var self = this
  this.scheduler.cancelAll(function (task) {
    return task.sink === self.sink
  })
}

DelaySink.prototype.event = function (t, x) {
  this.scheduler.delay(this.dt, __WEBPACK_IMPORTED_MODULE_3__scheduler_PropagateTask__["a" /* default */].event(x, this.sink))
}

DelaySink.prototype.end = function (t, x) {
  this.scheduler.delay(this.dt, __WEBPACK_IMPORTED_MODULE_3__scheduler_PropagateTask__["a" /* default */].end(x, this.sink))
}

DelaySink.prototype.error = __WEBPACK_IMPORTED_MODULE_1__sink_Pipe__["a" /* default */].prototype.error


/***/ }),
/* 80 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (immutable) */ __webpack_exports__["a"] = recoverWith;
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "b", function() { return flatMapError; });
/* harmony export (immutable) */ __webpack_exports__["c"] = throwError;
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__Stream__ = __webpack_require__(0);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__sink_SafeSink__ = __webpack_require__(107);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__disposable_dispose__ = __webpack_require__(1);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3__source_tryEvent__ = __webpack_require__(13);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_4__scheduler_PropagateTask__ = __webpack_require__(6);
/** @license MIT License (c) copyright 2010-2016 original author or authors */
/** @author Brian Cavalier */
/** @author John Hann */







/**
 * If stream encounters an error, recover and continue with items from stream
 * returned by f.
 * @param {function(error:*):Stream} f function which returns a new stream
 * @param {Stream} stream
 * @returns {Stream} new stream which will recover from an error by calling f
 */
function recoverWith (f, stream) {
  return new __WEBPACK_IMPORTED_MODULE_0__Stream__["a" /* default */](new RecoverWith(f, stream.source))
}

var flatMapError = recoverWith

/**
 * Create a stream containing only an error
 * @param {*} e error value, preferably an Error or Error subtype
 * @returns {Stream} new stream containing only an error
 */
function throwError (e) {
  return new __WEBPACK_IMPORTED_MODULE_0__Stream__["a" /* default */](new ErrorSource(e))
}

function ErrorSource (e) {
  this.value = e
}

ErrorSource.prototype.run = function (sink, scheduler) {
  return scheduler.asap(new __WEBPACK_IMPORTED_MODULE_4__scheduler_PropagateTask__["a" /* default */](runError, this.value, sink))
}

function runError (t, e, sink) {
  sink.error(t, e)
}

function RecoverWith (f, source) {
  this.f = f
  this.source = source
}

RecoverWith.prototype.run = function (sink, scheduler) {
  return new RecoverWithSink(this.f, this.source, sink, scheduler)
}

function RecoverWithSink (f, source, sink, scheduler) {
  this.f = f
  this.sink = new __WEBPACK_IMPORTED_MODULE_1__sink_SafeSink__["a" /* default */](sink)
  this.scheduler = scheduler
  this.disposable = source.run(this, scheduler)
}

RecoverWithSink.prototype.event = function (t, x) {
  __WEBPACK_IMPORTED_MODULE_3__source_tryEvent__["a" /* tryEvent */](t, x, this.sink)
}

RecoverWithSink.prototype.end = function (t, x) {
  __WEBPACK_IMPORTED_MODULE_3__source_tryEvent__["b" /* tryEnd */](t, x, this.sink)
}

RecoverWithSink.prototype.error = function (t, e) {
  var nextSink = this.sink.disable()

  __WEBPACK_IMPORTED_MODULE_2__disposable_dispose__["a" /* tryDispose */](t, this.disposable, this.sink)
  this._startNext(t, e, nextSink)
}

RecoverWithSink.prototype._startNext = function (t, x, sink) {
  try {
    this.disposable = this._continue(this.f, x, sink)
  } catch (e) {
    sink.error(t, e)
  }
}

RecoverWithSink.prototype._continue = function (f, x, sink) {
  var stream = f(x)
  return stream.source.run(sink, this.scheduler)
}

RecoverWithSink.prototype.dispose = function () {
  return this.disposable.dispose()
}


/***/ }),
/* 81 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (immutable) */ __webpack_exports__["a"] = filter;
/* harmony export (immutable) */ __webpack_exports__["b"] = skipRepeats;
/* harmony export (immutable) */ __webpack_exports__["c"] = skipRepeatsWith;
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__Stream__ = __webpack_require__(0);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__sink_Pipe__ = __webpack_require__(2);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__fusion_Filter__ = __webpack_require__(41);
/** @license MIT License (c) copyright 2010-2016 original author or authors */
/** @author Brian Cavalier */
/** @author John Hann */





/**
 * Retain only items matching a predicate
 * @param {function(x:*):boolean} p filtering predicate called for each item
 * @param {Stream} stream stream to filter
 * @returns {Stream} stream containing only items for which predicate returns truthy
 */
function filter (p, stream) {
  return new __WEBPACK_IMPORTED_MODULE_0__Stream__["a" /* default */](__WEBPACK_IMPORTED_MODULE_2__fusion_Filter__["a" /* default */].create(p, stream.source))
}

/**
 * Skip repeated events, using === to detect duplicates
 * @param {Stream} stream stream from which to omit repeated events
 * @returns {Stream} stream without repeated events
 */
function skipRepeats (stream) {
  return skipRepeatsWith(same, stream)
}

/**
 * Skip repeated events using the provided equals function to detect duplicates
 * @param {function(a:*, b:*):boolean} equals optional function to compare items
 * @param {Stream} stream stream from which to omit repeated events
 * @returns {Stream} stream without repeated events
 */
function skipRepeatsWith (equals, stream) {
  return new __WEBPACK_IMPORTED_MODULE_0__Stream__["a" /* default */](new SkipRepeats(equals, stream.source))
}

function SkipRepeats (equals, source) {
  this.equals = equals
  this.source = source
}

SkipRepeats.prototype.run = function (sink, scheduler) {
  return this.source.run(new SkipRepeatsSink(this.equals, sink), scheduler)
}

function SkipRepeatsSink (equals, sink) {
  this.equals = equals
  this.sink = sink
  this.value = void 0
  this.init = true
}

SkipRepeatsSink.prototype.end = __WEBPACK_IMPORTED_MODULE_1__sink_Pipe__["a" /* default */].prototype.end
SkipRepeatsSink.prototype.error = __WEBPACK_IMPORTED_MODULE_1__sink_Pipe__["a" /* default */].prototype.error

SkipRepeatsSink.prototype.event = function (t, x) {
  if (this.init) {
    this.init = false
    this.value = x
    this.sink.event(t, x)
  } else if (!this.equals(this.value, x)) {
    this.value = x
    this.sink.event(t, x)
  }
}

function same (a, b) {
  return a === b
}


/***/ }),
/* 82 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (immutable) */ __webpack_exports__["a"] = throttle;
/* harmony export (immutable) */ __webpack_exports__["b"] = debounce;
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__Stream__ = __webpack_require__(0);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__sink_Pipe__ = __webpack_require__(2);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__disposable_dispose__ = __webpack_require__(1);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3__scheduler_PropagateTask__ = __webpack_require__(6);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_4__fusion_Map__ = __webpack_require__(22);
/** @license MIT License (c) copyright 2010-2016 original author or authors */
/** @author Brian Cavalier */
/** @author John Hann */







/**
 * Limit the rate of events by suppressing events that occur too often
 * @param {Number} period time to suppress events
 * @param {Stream} stream
 * @returns {Stream}
 */
function throttle (period, stream) {
  return new __WEBPACK_IMPORTED_MODULE_0__Stream__["a" /* default */](throttleSource(period, stream.source))
}

function throttleSource (period, source) {
  return source instanceof __WEBPACK_IMPORTED_MODULE_4__fusion_Map__["a" /* default */] ? commuteMapThrottle(period, source)
    : source instanceof Throttle ? fuseThrottle(period, source)
    : new Throttle(period, source)
}

function commuteMapThrottle (period, source) {
  return __WEBPACK_IMPORTED_MODULE_4__fusion_Map__["a" /* default */].create(source.f, throttleSource(period, source.source))
}

function fuseThrottle (period, source) {
  return new Throttle(Math.max(period, source.period), source.source)
}

function Throttle (period, source) {
  this.period = period
  this.source = source
}

Throttle.prototype.run = function (sink, scheduler) {
  return this.source.run(new ThrottleSink(this.period, sink), scheduler)
}

function ThrottleSink (period, sink) {
  this.time = 0
  this.period = period
  this.sink = sink
}

ThrottleSink.prototype.event = function (t, x) {
  if (t >= this.time) {
    this.time = t + this.period
    this.sink.event(t, x)
  }
}

ThrottleSink.prototype.end = __WEBPACK_IMPORTED_MODULE_1__sink_Pipe__["a" /* default */].prototype.end

ThrottleSink.prototype.error = __WEBPACK_IMPORTED_MODULE_1__sink_Pipe__["a" /* default */].prototype.error

/**
 * Wait for a burst of events to subside and emit only the last event in the burst
 * @param {Number} period events occuring more frequently than this
 *  will be suppressed
 * @param {Stream} stream stream to debounce
 * @returns {Stream} new debounced stream
 */
function debounce (period, stream) {
  return new __WEBPACK_IMPORTED_MODULE_0__Stream__["a" /* default */](new Debounce(period, stream.source))
}

function Debounce (dt, source) {
  this.dt = dt
  this.source = source
}

Debounce.prototype.run = function (sink, scheduler) {
  return new DebounceSink(this.dt, this.source, sink, scheduler)
}

function DebounceSink (dt, source, sink, scheduler) {
  this.dt = dt
  this.sink = sink
  this.scheduler = scheduler
  this.value = void 0
  this.timer = null

  var sourceDisposable = source.run(this, scheduler)
  this.disposable = __WEBPACK_IMPORTED_MODULE_2__disposable_dispose__["b" /* all */]([this, sourceDisposable])
}

DebounceSink.prototype.event = function (t, x) {
  this._clearTimer()
  this.value = x
  this.timer = this.scheduler.delay(this.dt, __WEBPACK_IMPORTED_MODULE_3__scheduler_PropagateTask__["a" /* default */].event(x, this.sink))
}

DebounceSink.prototype.end = function (t, x) {
  if (this._clearTimer()) {
    this.sink.event(t, this.value)
    this.value = void 0
  }
  this.sink.end(t, x)
}

DebounceSink.prototype.error = function (t, x) {
  this._clearTimer()
  this.sink.error(t, x)
}

DebounceSink.prototype.dispose = function () {
  this._clearTimer()
}

DebounceSink.prototype._clearTimer = function () {
  if (this.timer === null) {
    return false
  }
  this.timer.dispose()
  this.timer = null
  return true
}


/***/ }),
/* 83 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (immutable) */ __webpack_exports__["a"] = loop;
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__Stream__ = __webpack_require__(0);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__sink_Pipe__ = __webpack_require__(2);
/** @license MIT License (c) copyright 2010-2016 original author or authors */
/** @author Brian Cavalier */
/** @author John Hann */




/**
 * Generalized feedback loop. Call a stepper function for each event. The stepper
 * will be called with 2 params: the current seed and the an event value.  It must
 * return a new { seed, value } pair. The `seed` will be fed back into the next
 * invocation of stepper, and the `value` will be propagated as the event value.
 * @param {function(seed:*, value:*):{seed:*, value:*}} stepper loop step function
 * @param {*} seed initial seed value passed to first stepper call
 * @param {Stream} stream event stream
 * @returns {Stream} new stream whose values are the `value` field of the objects
 * returned by the stepper
 */
function loop (stepper, seed, stream) {
  return new __WEBPACK_IMPORTED_MODULE_0__Stream__["a" /* default */](new Loop(stepper, seed, stream.source))
}

function Loop (stepper, seed, source) {
  this.step = stepper
  this.seed = seed
  this.source = source
}

Loop.prototype.run = function (sink, scheduler) {
  return this.source.run(new LoopSink(this.step, this.seed, sink), scheduler)
}

function LoopSink (stepper, seed, sink) {
  this.step = stepper
  this.seed = seed
  this.sink = sink
}

LoopSink.prototype.error = __WEBPACK_IMPORTED_MODULE_1__sink_Pipe__["a" /* default */].prototype.error

LoopSink.prototype.event = function (t, x) {
  var result = this.step(this.seed, x)
  this.seed = result.seed
  this.sink.event(t, result.value)
}

LoopSink.prototype.end = function (t) {
  this.sink.end(t, this.seed)
}


/***/ }),
/* 84 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (immutable) */ __webpack_exports__["a"] = merge;
/* harmony export (immutable) */ __webpack_exports__["b"] = mergeArray;
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__Stream__ = __webpack_require__(0);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__sink_Pipe__ = __webpack_require__(2);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__sink_IndexSink__ = __webpack_require__(25);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3__source_core__ = __webpack_require__(7);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_4__disposable_dispose__ = __webpack_require__(1);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_5__most_prelude__ = __webpack_require__(4);
/** @license MIT License (c) copyright 2010-2016 original author or authors */
/** @author Brian Cavalier */
/** @author John Hann */








var copy = __WEBPACK_IMPORTED_MODULE_5__most_prelude__["l" /* copy */]
var reduce = __WEBPACK_IMPORTED_MODULE_5__most_prelude__["m" /* reduce */]

/**
 * @returns {Stream} stream containing events from all streams in the argument
 * list in time order.  If two events are simultaneous they will be merged in
 * arbitrary order.
 */
function merge (/* ...streams*/) {
  return mergeArray(copy(arguments))
}

/**
 * @param {Array} streams array of stream to merge
 * @returns {Stream} stream containing events from all input observables
 * in time order.  If two events are simultaneous they will be merged in
 * arbitrary order.
 */
function mergeArray (streams) {
  var l = streams.length
  return l === 0 ? __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_3__source_core__["b" /* empty */])()
    : l === 1 ? streams[0]
    : new __WEBPACK_IMPORTED_MODULE_0__Stream__["a" /* default */](mergeSources(streams))
}

/**
 * This implements fusion/flattening for merge.  It will
 * fuse adjacent merge operations.  For example:
 * - a.merge(b).merge(c) effectively becomes merge(a, b, c)
 * - merge(a, merge(b, c)) effectively becomes merge(a, b, c)
 * It does this by concatenating the sources arrays of
 * any nested Merge sources, in effect "flattening" nested
 * merge operations into a single merge.
 */
function mergeSources (streams) {
  return new Merge(reduce(appendSources, [], streams))
}

function appendSources (sources, stream) {
  var source = stream.source
  return source instanceof Merge
    ? sources.concat(source.sources)
    : sources.concat(source)
}

function Merge (sources) {
  this.sources = sources
}

Merge.prototype.run = function (sink, scheduler) {
  var l = this.sources.length
  var disposables = new Array(l)
  var sinks = new Array(l)

  var mergeSink = new MergeSink(disposables, sinks, sink)

  for (var indexSink, i = 0; i < l; ++i) {
    indexSink = sinks[i] = new __WEBPACK_IMPORTED_MODULE_2__sink_IndexSink__["a" /* default */](i, mergeSink)
    disposables[i] = this.sources[i].run(indexSink, scheduler)
  }

  return __WEBPACK_IMPORTED_MODULE_4__disposable_dispose__["b" /* all */](disposables)
}

function MergeSink (disposables, sinks, sink) {
  this.sink = sink
  this.disposables = disposables
  this.activeCount = sinks.length
}

MergeSink.prototype.error = __WEBPACK_IMPORTED_MODULE_1__sink_Pipe__["a" /* default */].prototype.error

MergeSink.prototype.event = function (t, indexValue) {
  this.sink.event(t, indexValue.value)
}

MergeSink.prototype.end = function (t, indexedValue) {
  __WEBPACK_IMPORTED_MODULE_4__disposable_dispose__["a" /* tryDispose */](t, this.disposables[indexedValue.index], this.sink)
  if (--this.activeCount === 0) {
    this.sink.end(t, indexedValue.value)
  }
}


/***/ }),
/* 85 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (immutable) */ __webpack_exports__["a"] = observe;
/* harmony export (immutable) */ __webpack_exports__["b"] = drain;
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__runSource__ = __webpack_require__(43);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__transform__ = __webpack_require__(12);
/** @license MIT License (c) copyright 2010-2016 original author or authors */
/** @author Brian Cavalier */
/** @author John Hann */




/**
 * Observe all the event values in the stream in time order. The
 * provided function `f` will be called for each event value
 * @param {function(x:T):*} f function to call with each event value
 * @param {Stream<T>} stream stream to observe
 * @return {Promise} promise that fulfills after the stream ends without
 *  an error, or rejects if the stream ends with an error.
 */
function observe (f, stream) {
  return drain(__webpack_require__.i(__WEBPACK_IMPORTED_MODULE_1__transform__["c" /* tap */])(f, stream))
}

/**
 * "Run" a stream by creating demand and consuming all events
 * @param {Stream<T>} stream stream to drain
 * @return {Promise} promise that fulfills after the stream ends without
 *  an error, or rejects if the stream ends with an error.
 */
function drain (stream) {
  return __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_0__runSource__["a" /* withDefaultScheduler */])(stream.source)
}


/***/ }),
/* 86 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (immutable) */ __webpack_exports__["a"] = fromPromise;
/* harmony export (immutable) */ __webpack_exports__["b"] = awaitPromises;
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__Stream__ = __webpack_require__(0);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__fatalError__ = __webpack_require__(21);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__source_core__ = __webpack_require__(7);
/** @license MIT License (c) copyright 2010-2016 original author or authors */
/** @author Brian Cavalier */
/** @author John Hann */





/**
 * Create a stream containing only the promise's fulfillment
 * value at the time it fulfills.
 * @param {Promise<T>} p promise
 * @return {Stream<T>} stream containing promise's fulfillment value.
 *  If the promise rejects, the stream will error
 */
function fromPromise (p) {
  return awaitPromises(__webpack_require__.i(__WEBPACK_IMPORTED_MODULE_2__source_core__["a" /* of */])(p))
}

/**
 * Turn a Stream<Promise<T>> into Stream<T> by awaiting each promise.
 * Event order is preserved.
 * @param {Stream<Promise<T>>} stream
 * @return {Stream<T>} stream of fulfillment values.  The stream will
 * error if any promise rejects.
 */
function awaitPromises (stream) {
  return new __WEBPACK_IMPORTED_MODULE_0__Stream__["a" /* default */](new Await(stream.source))
}

function Await (source) {
  this.source = source
}

Await.prototype.run = function (sink, scheduler) {
  return this.source.run(new AwaitSink(sink, scheduler), scheduler)
}

function AwaitSink (sink, scheduler) {
  this.sink = sink
  this.scheduler = scheduler
  this.queue = Promise.resolve()
  var self = this

	// Pre-create closures, to avoid creating them per event
  this._eventBound = function (x) {
    self.sink.event(self.scheduler.now(), x)
  }

  this._endBound = function (x) {
    self.sink.end(self.scheduler.now(), x)
  }

  this._errorBound = function (e) {
    self.sink.error(self.scheduler.now(), e)
  }
}

AwaitSink.prototype.event = function (t, promise) {
  var self = this
  this.queue = this.queue.then(function () {
    return self._event(promise)
  }).catch(this._errorBound)
}

AwaitSink.prototype.end = function (t, x) {
  var self = this
  this.queue = this.queue.then(function () {
    return self._end(x)
  }).catch(this._errorBound)
}

AwaitSink.prototype.error = function (t, e) {
  var self = this
  // Don't resolve error values, propagate directly
  this.queue = this.queue.then(function () {
    return self._errorBound(e)
  }).catch(__WEBPACK_IMPORTED_MODULE_1__fatalError__["a" /* default */])
}

AwaitSink.prototype._event = function (promise) {
  return promise.then(this._eventBound)
}

AwaitSink.prototype._end = function (x) {
  return Promise.resolve(x).then(this._endBound)
}


/***/ }),
/* 87 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (immutable) */ __webpack_exports__["a"] = sample;
/* harmony export (immutable) */ __webpack_exports__["c"] = sampleWith;
/* harmony export (immutable) */ __webpack_exports__["b"] = sampleArray;
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__Stream__ = __webpack_require__(0);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__sink_Pipe__ = __webpack_require__(2);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__disposable_dispose__ = __webpack_require__(1);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3__most_prelude__ = __webpack_require__(4);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_4__invoke__ = __webpack_require__(23);
/** @license MIT License (c) copyright 2010-2016 original author or authors */
/** @author Brian Cavalier */
/** @author John Hann */







/**
 * When an event arrives on sampler, emit the result of calling f with the latest
 * values of all streams being sampled
 * @param {function(...values):*} f function to apply to each set of sampled values
 * @param {Stream} sampler streams will be sampled whenever an event arrives
 *  on sampler
 * @returns {Stream} stream of sampled and transformed values
 */
function sample (f, sampler /*, ...streams */) {
  return sampleArray(f, sampler, __WEBPACK_IMPORTED_MODULE_3__most_prelude__["k" /* drop */](2, arguments))
}

/**
 * When an event arrives on sampler, emit the latest event value from stream.
 * @param {Stream} sampler stream of events at whose arrival time
 *  stream's latest value will be propagated
 * @param {Stream} stream stream of values
 * @returns {Stream} sampled stream of values
 */
function sampleWith (sampler, stream) {
  return new __WEBPACK_IMPORTED_MODULE_0__Stream__["a" /* default */](new Sampler(__WEBPACK_IMPORTED_MODULE_3__most_prelude__["i" /* id */], sampler.source, [stream.source]))
}

function sampleArray (f, sampler, streams) {
  return new __WEBPACK_IMPORTED_MODULE_0__Stream__["a" /* default */](new Sampler(f, sampler.source, __WEBPACK_IMPORTED_MODULE_3__most_prelude__["h" /* map */](getSource, streams)))
}

function getSource (stream) {
  return stream.source
}

function Sampler (f, sampler, sources) {
  this.f = f
  this.sampler = sampler
  this.sources = sources
}

Sampler.prototype.run = function (sink, scheduler) {
  var l = this.sources.length
  var disposables = new Array(l + 1)
  var sinks = new Array(l)

  var sampleSink = new SampleSink(this.f, sinks, sink)

  for (var hold, i = 0; i < l; ++i) {
    hold = sinks[i] = new Hold(sampleSink)
    disposables[i] = this.sources[i].run(hold, scheduler)
  }

  disposables[i] = this.sampler.run(sampleSink, scheduler)

  return __WEBPACK_IMPORTED_MODULE_2__disposable_dispose__["b" /* all */](disposables)
}

function Hold (sink) {
  this.sink = sink
  this.hasValue = false
}

Hold.prototype.event = function (t, x) {
  this.value = x
  this.hasValue = true
  this.sink._notify(this)
}

Hold.prototype.end = function () {}
Hold.prototype.error = __WEBPACK_IMPORTED_MODULE_1__sink_Pipe__["a" /* default */].prototype.error

function SampleSink (f, sinks, sink) {
  this.f = f
  this.sinks = sinks
  this.sink = sink
  this.active = false
}

SampleSink.prototype._notify = function () {
  if (!this.active) {
    this.active = this.sinks.every(hasValue)
  }
}

SampleSink.prototype.event = function (t) {
  if (this.active) {
    this.sink.event(t, __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_4__invoke__["a" /* default */])(this.f, __WEBPACK_IMPORTED_MODULE_3__most_prelude__["h" /* map */](getValue, this.sinks)))
  }
}

SampleSink.prototype.end = __WEBPACK_IMPORTED_MODULE_1__sink_Pipe__["a" /* default */].prototype.end
SampleSink.prototype.error = __WEBPACK_IMPORTED_MODULE_1__sink_Pipe__["a" /* default */].prototype.error

function hasValue (hold) {
  return hold.hasValue
}

function getValue (hold) {
  return hold.value
}


/***/ }),
/* 88 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (immutable) */ __webpack_exports__["a"] = take;
/* harmony export (immutable) */ __webpack_exports__["b"] = skip;
/* harmony export (immutable) */ __webpack_exports__["c"] = slice;
/* harmony export (immutable) */ __webpack_exports__["d"] = takeWhile;
/* harmony export (immutable) */ __webpack_exports__["e"] = skipWhile;
/* harmony export (immutable) */ __webpack_exports__["f"] = skipAfter;
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__Stream__ = __webpack_require__(0);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__sink_Pipe__ = __webpack_require__(2);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__source_core__ = __webpack_require__(7);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3__fusion_Map__ = __webpack_require__(22);
/** @license MIT License (c) copyright 2010-2016 original author or authors */
/** @author Brian Cavalier */
/** @author John Hann */






/**
 * @param {number} n
 * @param {Stream} stream
 * @returns {Stream} new stream containing only up to the first n items from stream
 */
function take (n, stream) {
  return slice(0, n, stream)
}

/**
 * @param {number} n
 * @param {Stream} stream
 * @returns {Stream} new stream with the first n items removed
 */
function skip (n, stream) {
  return slice(n, Infinity, stream)
}

/**
 * Slice a stream by index. Negative start/end indexes are not supported
 * @param {number} start
 * @param {number} end
 * @param {Stream} stream
 * @returns {Stream} stream containing items where start <= index < end
 */
function slice (start, end, stream) {
  return end <= start ? __WEBPACK_IMPORTED_MODULE_2__source_core__["b" /* empty */]()
    : new __WEBPACK_IMPORTED_MODULE_0__Stream__["a" /* default */](sliceSource(start, end, stream.source))
}

function sliceSource (start, end, source) {
  return source instanceof __WEBPACK_IMPORTED_MODULE_3__fusion_Map__["a" /* default */] ? commuteMapSlice(start, end, source)
    : source instanceof Slice ? fuseSlice(start, end, source)
    : new Slice(start, end, source)
}

function commuteMapSlice (start, end, source) {
  return __WEBPACK_IMPORTED_MODULE_3__fusion_Map__["a" /* default */].create(source.f, sliceSource(start, end, source.source))
}

function fuseSlice (start, end, source) {
  start += source.min
  end = Math.min(end + source.min, source.max)
  return new Slice(start, end, source.source)
}

function Slice (min, max, source) {
  this.source = source
  this.min = min
  this.max = max
}

Slice.prototype.run = function (sink, scheduler) {
  return this.source.run(new SliceSink(this.min, this.max - this.min, sink), scheduler)
}

function SliceSink (skip, take, sink) {
  this.sink = sink
  this.skip = skip
  this.take = take
}

SliceSink.prototype.end = __WEBPACK_IMPORTED_MODULE_1__sink_Pipe__["a" /* default */].prototype.end
SliceSink.prototype.error = __WEBPACK_IMPORTED_MODULE_1__sink_Pipe__["a" /* default */].prototype.error

SliceSink.prototype.event = function (t, x) {
  /* eslint complexity: [1, 4] */
  if (this.skip > 0) {
    this.skip -= 1
    return
  }

  if (this.take === 0) {
    return
  }

  this.take -= 1
  this.sink.event(t, x)
  if (this.take === 0) {
    this.sink.end(t, x)
  }
}

function takeWhile (p, stream) {
  return new __WEBPACK_IMPORTED_MODULE_0__Stream__["a" /* default */](new TakeWhile(p, stream.source))
}

function TakeWhile (p, source) {
  this.p = p
  this.source = source
}

TakeWhile.prototype.run = function (sink, scheduler) {
  return this.source.run(new TakeWhileSink(this.p, sink), scheduler)
}

function TakeWhileSink (p, sink) {
  this.p = p
  this.sink = sink
  this.active = true
}

TakeWhileSink.prototype.end = __WEBPACK_IMPORTED_MODULE_1__sink_Pipe__["a" /* default */].prototype.end
TakeWhileSink.prototype.error = __WEBPACK_IMPORTED_MODULE_1__sink_Pipe__["a" /* default */].prototype.error

TakeWhileSink.prototype.event = function (t, x) {
  if (!this.active) {
    return
  }

  var p = this.p
  this.active = p(x)
  if (this.active) {
    this.sink.event(t, x)
  } else {
    this.sink.end(t, x)
  }
}

function skipWhile (p, stream) {
  return new __WEBPACK_IMPORTED_MODULE_0__Stream__["a" /* default */](new SkipWhile(p, stream.source))
}

function SkipWhile (p, source) {
  this.p = p
  this.source = source
}

SkipWhile.prototype.run = function (sink, scheduler) {
  return this.source.run(new SkipWhileSink(this.p, sink), scheduler)
}

function SkipWhileSink (p, sink) {
  this.p = p
  this.sink = sink
  this.skipping = true
}

SkipWhileSink.prototype.end = __WEBPACK_IMPORTED_MODULE_1__sink_Pipe__["a" /* default */].prototype.end
SkipWhileSink.prototype.error = __WEBPACK_IMPORTED_MODULE_1__sink_Pipe__["a" /* default */].prototype.error

SkipWhileSink.prototype.event = function (t, x) {
  if (this.skipping) {
    var p = this.p
    this.skipping = p(x)
    if (this.skipping) {
      return
    }
  }

  this.sink.event(t, x)
}

function skipAfter (p, stream) {
  return new __WEBPACK_IMPORTED_MODULE_0__Stream__["a" /* default */](new SkipAfter(p, stream.source))
}

function SkipAfter (p, source) {
  this.p = p
  this.source = source
}

SkipAfter.prototype.run = function run (sink, scheduler) {
  return this.source.run(new SkipAfterSink(this.p, sink), scheduler)
}

function SkipAfterSink (p, sink) {
  this.p = p
  this.sink = sink
  this.skipping = false
}

SkipAfterSink.prototype.event = function event (t, x) {
  if (this.skipping) {
    return
  }

  var p = this.p
  this.skipping = p(x)
  this.sink.event(t, x)

  if (this.skipping) {
    this.sink.end(t, x)
  }
}

SkipAfterSink.prototype.end = __WEBPACK_IMPORTED_MODULE_1__sink_Pipe__["a" /* default */].prototype.end
SkipAfterSink.prototype.error = __WEBPACK_IMPORTED_MODULE_1__sink_Pipe__["a" /* default */].prototype.error


/***/ }),
/* 89 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (immutable) */ __webpack_exports__["a"] = switchLatest;
/* unused harmony export switch */
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__Stream__ = __webpack_require__(0);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__disposable_dispose__ = __webpack_require__(1);
/** @license MIT License (c) copyright 2010-2016 original author or authors */
/** @author Brian Cavalier */
/** @author John Hann */




/**
 * Given a stream of streams, return a new stream that adopts the behavior
 * of the most recent inner stream.
 * @param {Stream} stream of streams on which to switch
 * @returns {Stream} switching stream
 */
function switchLatest (stream) {
  return new __WEBPACK_IMPORTED_MODULE_0__Stream__["a" /* default */](new Switch(stream.source))
}



function Switch (source) {
  this.source = source
}

Switch.prototype.run = function (sink, scheduler) {
  var switchSink = new SwitchSink(sink, scheduler)
  return __WEBPACK_IMPORTED_MODULE_1__disposable_dispose__["b" /* all */]([switchSink, this.source.run(switchSink, scheduler)])
}

function SwitchSink (sink, scheduler) {
  this.sink = sink
  this.scheduler = scheduler
  this.current = null
  this.ended = false
}

SwitchSink.prototype.event = function (t, stream) {
  this._disposeCurrent(t) // TODO: capture the result of this dispose
  this.current = new Segment(t, Infinity, this, this.sink)
  this.current.disposable = stream.source.run(this.current, this.scheduler)
}

SwitchSink.prototype.end = function (t, x) {
  this.ended = true
  this._checkEnd(t, x)
}

SwitchSink.prototype.error = function (t, e) {
  this.ended = true
  this.sink.error(t, e)
}

SwitchSink.prototype.dispose = function () {
  return this._disposeCurrent(this.scheduler.now())
}

SwitchSink.prototype._disposeCurrent = function (t) {
  if (this.current !== null) {
    return this.current._dispose(t)
  }
}

SwitchSink.prototype._disposeInner = function (t, inner) {
  inner._dispose(t) // TODO: capture the result of this dispose
  if (inner === this.current) {
    this.current = null
  }
}

SwitchSink.prototype._checkEnd = function (t, x) {
  if (this.ended && this.current === null) {
    this.sink.end(t, x)
  }
}

SwitchSink.prototype._endInner = function (t, x, inner) {
  this._disposeInner(t, inner)
  this._checkEnd(t, x)
}

SwitchSink.prototype._errorInner = function (t, e, inner) {
  this._disposeInner(t, inner)
  this.sink.error(t, e)
}

function Segment (min, max, outer, sink) {
  this.min = min
  this.max = max
  this.outer = outer
  this.sink = sink
  this.disposable = __WEBPACK_IMPORTED_MODULE_1__disposable_dispose__["c" /* empty */]()
}

Segment.prototype.event = function (t, x) {
  if (t < this.max) {
    this.sink.event(Math.max(t, this.min), x)
  }
}

Segment.prototype.end = function (t, x) {
  this.outer._endInner(Math.max(t, this.min), x, this)
}

Segment.prototype.error = function (t, e) {
  this.outer._errorInner(Math.max(t, this.min), e, this)
}

Segment.prototype._dispose = function (t) {
  this.max = t
  __WEBPACK_IMPORTED_MODULE_1__disposable_dispose__["a" /* tryDispose */](t, this.disposable, this.sink)
}


/***/ }),
/* 90 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (immutable) */ __webpack_exports__["a"] = thru;
/** @license MIT License (c) copyright 2010-2016 original author or authors */
/** @author Brian Cavalier */
/** @author John Hann */

function thru (f, stream) {
  return f(stream)
}


/***/ }),
/* 91 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (immutable) */ __webpack_exports__["a"] = takeUntil;
/* harmony export (immutable) */ __webpack_exports__["b"] = skipUntil;
/* harmony export (immutable) */ __webpack_exports__["c"] = during;
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__Stream__ = __webpack_require__(0);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__sink_Pipe__ = __webpack_require__(2);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__disposable_dispose__ = __webpack_require__(1);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3__combinator_flatMap__ = __webpack_require__(40);
/** @license MIT License (c) copyright 2010-2016 original author or authors */
/** @author Brian Cavalier */
/** @author John Hann */






function takeUntil (signal, stream) {
  return new __WEBPACK_IMPORTED_MODULE_0__Stream__["a" /* default */](new Until(signal.source, stream.source))
}

function skipUntil (signal, stream) {
  return new __WEBPACK_IMPORTED_MODULE_0__Stream__["a" /* default */](new Since(signal.source, stream.source))
}

function during (timeWindow, stream) {
  return takeUntil(__webpack_require__.i(__WEBPACK_IMPORTED_MODULE_3__combinator_flatMap__["b" /* join */])(timeWindow), skipUntil(timeWindow, stream))
}

function Until (maxSignal, source) {
  this.maxSignal = maxSignal
  this.source = source
}

Until.prototype.run = function (sink, scheduler) {
  var min = new Bound(-Infinity, sink)
  var max = new UpperBound(this.maxSignal, sink, scheduler)
  var disposable = this.source.run(new TimeWindowSink(min, max, sink), scheduler)

  return __WEBPACK_IMPORTED_MODULE_2__disposable_dispose__["b" /* all */]([min, max, disposable])
}

function Since (minSignal, source) {
  this.minSignal = minSignal
  this.source = source
}

Since.prototype.run = function (sink, scheduler) {
  var min = new LowerBound(this.minSignal, sink, scheduler)
  var max = new Bound(Infinity, sink)
  var disposable = this.source.run(new TimeWindowSink(min, max, sink), scheduler)

  return __WEBPACK_IMPORTED_MODULE_2__disposable_dispose__["b" /* all */]([min, max, disposable])
}

function Bound (value, sink) {
  this.value = value
  this.sink = sink
}

Bound.prototype.error = __WEBPACK_IMPORTED_MODULE_1__sink_Pipe__["a" /* default */].prototype.error
Bound.prototype.event = noop
Bound.prototype.end = noop
Bound.prototype.dispose = noop

function TimeWindowSink (min, max, sink) {
  this.min = min
  this.max = max
  this.sink = sink
}

TimeWindowSink.prototype.event = function (t, x) {
  if (t >= this.min.value && t < this.max.value) {
    this.sink.event(t, x)
  }
}

TimeWindowSink.prototype.error = __WEBPACK_IMPORTED_MODULE_1__sink_Pipe__["a" /* default */].prototype.error
TimeWindowSink.prototype.end = __WEBPACK_IMPORTED_MODULE_1__sink_Pipe__["a" /* default */].prototype.end

function LowerBound (signal, sink, scheduler) {
  this.value = Infinity
  this.sink = sink
  this.disposable = signal.run(this, scheduler)
}

LowerBound.prototype.event = function (t /*, x */) {
  if (t < this.value) {
    this.value = t
  }
}

LowerBound.prototype.end = noop
LowerBound.prototype.error = __WEBPACK_IMPORTED_MODULE_1__sink_Pipe__["a" /* default */].prototype.error

LowerBound.prototype.dispose = function () {
  return this.disposable.dispose()
}

function UpperBound (signal, sink, scheduler) {
  this.value = Infinity
  this.sink = sink
  this.disposable = signal.run(this, scheduler)
}

UpperBound.prototype.event = function (t, x) {
  if (t < this.value) {
    this.value = t
    this.sink.end(t, x)
  }
}

UpperBound.prototype.end = noop
UpperBound.prototype.error = __WEBPACK_IMPORTED_MODULE_1__sink_Pipe__["a" /* default */].prototype.error

UpperBound.prototype.dispose = function () {
  return this.disposable.dispose()
}

function noop () {}


/***/ }),
/* 92 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (immutable) */ __webpack_exports__["a"] = timestamp;
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__Stream__ = __webpack_require__(0);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__sink_Pipe__ = __webpack_require__(2);
/** @license MIT License (c) copyright 2010-2016 original author or authors */
/** @author Brian Cavalier */
/** @author John Hann */




function timestamp (stream) {
  return new __WEBPACK_IMPORTED_MODULE_0__Stream__["a" /* default */](new Timestamp(stream.source))
}

function Timestamp (source) {
  this.source = source
}

Timestamp.prototype.run = function (sink, scheduler) {
  return this.source.run(new TimestampSink(sink), scheduler)
}

function TimestampSink (sink) {
  this.sink = sink
}

TimestampSink.prototype.end = __WEBPACK_IMPORTED_MODULE_1__sink_Pipe__["a" /* default */].prototype.end
TimestampSink.prototype.error = __WEBPACK_IMPORTED_MODULE_1__sink_Pipe__["a" /* default */].prototype.error

TimestampSink.prototype.event = function (t, x) {
  this.sink.event(t, { time: t, value: x })
}


/***/ }),
/* 93 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (immutable) */ __webpack_exports__["a"] = transduce;
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__Stream__ = __webpack_require__(0);
/** @license MIT License (c) copyright 2010-2016 original author or authors */
/** @author Brian Cavalier */
/** @author John Hann */



/**
 * Transform a stream by passing its events through a transducer.
 * @param  {function} transducer transducer function
 * @param  {Stream} stream stream whose events will be passed through the
 *  transducer
 * @return {Stream} stream of events transformed by the transducer
 */
function transduce (transducer, stream) {
  return new __WEBPACK_IMPORTED_MODULE_0__Stream__["a" /* default */](new Transduce(transducer, stream.source))
}

function Transduce (transducer, source) {
  this.transducer = transducer
  this.source = source
}

Transduce.prototype.run = function (sink, scheduler) {
  var xf = this.transducer(new Transformer(sink))
  return this.source.run(new TransduceSink(getTxHandler(xf), sink), scheduler)
}

function TransduceSink (adapter, sink) {
  this.xf = adapter
  this.sink = sink
}

TransduceSink.prototype.event = function (t, x) {
  var next = this.xf.step(t, x)

  return this.xf.isReduced(next)
    ? this.sink.end(t, this.xf.getResult(next))
    : next
}

TransduceSink.prototype.end = function (t, x) {
  return this.xf.result(x)
}

TransduceSink.prototype.error = function (t, e) {
  return this.sink.error(t, e)
}

function Transformer (sink) {
  this.time = -Infinity
  this.sink = sink
}

Transformer.prototype['@@transducer/init'] = Transformer.prototype.init = function () {}

Transformer.prototype['@@transducer/step'] = Transformer.prototype.step = function (t, x) {
  if (!isNaN(t)) {
    this.time = Math.max(t, this.time)
  }
  return this.sink.event(this.time, x)
}

Transformer.prototype['@@transducer/result'] = Transformer.prototype.result = function (x) {
  return this.sink.end(this.time, x)
}

/**
* Given an object supporting the new or legacy transducer protocol,
* create an adapter for it.
* @param {object} tx transform
* @returns {TxAdapter|LegacyTxAdapter}
*/
function getTxHandler (tx) {
  return typeof tx['@@transducer/step'] === 'function'
    ? new TxAdapter(tx)
    : new LegacyTxAdapter(tx)
}

/**
* Adapter for new official transducer protocol
* @param {object} tx transform
* @constructor
*/
function TxAdapter (tx) {
  this.tx = tx
}

TxAdapter.prototype.step = function (t, x) {
  return this.tx['@@transducer/step'](t, x)
}
TxAdapter.prototype.result = function (x) {
  return this.tx['@@transducer/result'](x)
}
TxAdapter.prototype.isReduced = function (x) {
  return x != null && x['@@transducer/reduced']
}
TxAdapter.prototype.getResult = function (x) {
  return x['@@transducer/value']
}

/**
* Adapter for older transducer protocol
* @param {object} tx transform
* @constructor
*/
function LegacyTxAdapter (tx) {
  this.tx = tx
}

LegacyTxAdapter.prototype.step = function (t, x) {
  return this.tx.step(t, x)
}
LegacyTxAdapter.prototype.result = function (x) {
  return this.tx.result(x)
}
LegacyTxAdapter.prototype.isReduced = function (x) {
  return x != null && x.__transducers_reduced__
}
LegacyTxAdapter.prototype.getResult = function (x) {
  return x.value
}


/***/ }),
/* 94 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (immutable) */ __webpack_exports__["a"] = zip;
/* harmony export (immutable) */ __webpack_exports__["b"] = zipArray;
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__Stream__ = __webpack_require__(0);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__transform__ = __webpack_require__(12);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__source_core__ = __webpack_require__(7);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3__sink_Pipe__ = __webpack_require__(2);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_4__sink_IndexSink__ = __webpack_require__(25);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_5__disposable_dispose__ = __webpack_require__(1);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_6__most_prelude__ = __webpack_require__(4);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_7__invoke__ = __webpack_require__(23);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_8__Queue__ = __webpack_require__(74);
/** @license MIT License (c) copyright 2010-2016 original author or authors */
/** @author Brian Cavalier */
/** @author John Hann */











var map = __WEBPACK_IMPORTED_MODULE_6__most_prelude__["h" /* map */]
var tail = __WEBPACK_IMPORTED_MODULE_6__most_prelude__["c" /* tail */]

/**
 * Combine streams pairwise (or tuple-wise) by index by applying f to values
 * at corresponding indices.  The returned stream ends when any of the input
 * streams ends.
 * @param {function} f function to combine values
 * @returns {Stream} new stream with items at corresponding indices combined
 *  using f
 */
function zip (f /*, ...streams */) {
  return zipArray(f, tail(arguments))
}

/**
* Combine streams pairwise (or tuple-wise) by index by applying f to values
* at corresponding indices.  The returned stream ends when any of the input
* streams ends.
* @param {function} f function to combine values
* @param {[Stream]} streams streams to zip using f
* @returns {Stream} new stream with items at corresponding indices combined
*  using f
*/
function zipArray (f, streams) {
  return streams.length === 0 ? __WEBPACK_IMPORTED_MODULE_2__source_core__["b" /* empty */]()
: streams.length === 1 ? __WEBPACK_IMPORTED_MODULE_1__transform__["a" /* map */](f, streams[0])
: new __WEBPACK_IMPORTED_MODULE_0__Stream__["a" /* default */](new Zip(f, map(getSource, streams)))
}

function getSource (stream) {
  return stream.source
}

function Zip (f, sources) {
  this.f = f
  this.sources = sources
}

Zip.prototype.run = function (sink, scheduler) {
  var l = this.sources.length
  var disposables = new Array(l)
  var sinks = new Array(l)
  var buffers = new Array(l)

  var zipSink = new ZipSink(this.f, buffers, sinks, sink)

  for (var indexSink, i = 0; i < l; ++i) {
    buffers[i] = new __WEBPACK_IMPORTED_MODULE_8__Queue__["a" /* default */]()
    indexSink = sinks[i] = new __WEBPACK_IMPORTED_MODULE_4__sink_IndexSink__["a" /* default */](i, zipSink)
    disposables[i] = this.sources[i].run(indexSink, scheduler)
  }

  return __WEBPACK_IMPORTED_MODULE_5__disposable_dispose__["b" /* all */](disposables)
}

function ZipSink (f, buffers, sinks, sink) {
  this.f = f
  this.sinks = sinks
  this.sink = sink
  this.buffers = buffers
}

ZipSink.prototype.event = function (t, indexedValue) { // eslint-disable-line complexity
  var buffers = this.buffers
  var buffer = buffers[indexedValue.index]

  buffer.push(indexedValue.value)

  if (buffer.length() === 1) {
    if (!ready(this.buffers)) {
      return
    }

    emitZipped(this.f, t, buffers, this.sink)

    if (ended(this.buffers, this.sinks)) {
      this.sink.end(t, void 0)
    }
  }
}

ZipSink.prototype.end = function (t, indexedValue) {
  var buffer = this.buffers[indexedValue.index]
  if (buffer.isEmpty()) {
    this.sink.end(t, indexedValue.value)
  }
}

ZipSink.prototype.error = __WEBPACK_IMPORTED_MODULE_3__sink_Pipe__["a" /* default */].prototype.error

function emitZipped (f, t, buffers, sink) {
  sink.event(t, __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_7__invoke__["a" /* default */])(f, map(head, buffers)))
}

function head (buffer) {
  return buffer.shift()
}

function ended (buffers, sinks) {
  for (var i = 0, l = buffers.length; i < l; ++i) {
    if (buffers[i].isEmpty() && !sinks[i].active) {
      return true
    }
  }
  return false
}

function ready (buffers) {
  for (var i = 0, l = buffers.length; i < l; ++i) {
    if (buffers[i].isEmpty()) {
      return false
    }
  }
  return true
}


/***/ }),
/* 95 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (immutable) */ __webpack_exports__["a"] = Disposable;
/** @license MIT License (c) copyright 2010-2016 original author or authors */
/** @author Brian Cavalier */
/** @author John Hann */

/**
 * Create a new Disposable which will dispose its underlying resource.
 * @param {function} dispose function
 * @param {*?} data any data to be passed to disposer function
 * @constructor
 */
function Disposable (dispose, data) {
  this._dispose = dispose
  this._data = data
}

Disposable.prototype.dispose = function () {
  return this._dispose(this._data)
}


/***/ }),
/* 96 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (immutable) */ __webpack_exports__["a"] = SettableDisposable;
/** @license MIT License (c) copyright 2010-2016 original author or authors */
/** @author Brian Cavalier */
/** @author John Hann */

function SettableDisposable () {
  this.disposable = void 0
  this.disposed = false
  this._resolve = void 0

  var self = this
  this.result = new Promise(function (resolve) {
    self._resolve = resolve
  })
}

SettableDisposable.prototype.setDisposable = function (disposable) {
  if (this.disposable !== void 0) {
    throw new Error('setDisposable called more than once')
  }

  this.disposable = disposable

  if (this.disposed) {
    this._resolve(disposable.dispose())
  }
}

SettableDisposable.prototype.dispose = function () {
  if (this.disposed) {
    return this.result
  }

  this.disposed = true

  if (this.disposable !== void 0) {
    this.result = this.disposable.dispose()
  }

  return this.result
}


/***/ }),
/* 97 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (immutable) */ __webpack_exports__["a"] = FilterMap;
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__sink_Pipe__ = __webpack_require__(2);
/** @license MIT License (c) copyright 2010-2016 original author or authors */
/** @author Brian Cavalier */
/** @author John Hann */



function FilterMap (p, f, source) {
  this.p = p
  this.f = f
  this.source = source
}

FilterMap.prototype.run = function (sink, scheduler) {
  return this.source.run(new FilterMapSink(this.p, this.f, sink), scheduler)
}

function FilterMapSink (p, f, sink) {
  this.p = p
  this.f = f
  this.sink = sink
}

FilterMapSink.prototype.event = function (t, x) {
  var f = this.f
  var p = this.p
  p(x) && this.sink.event(t, f(x))
}

FilterMapSink.prototype.end = __WEBPACK_IMPORTED_MODULE_0__sink_Pipe__["a" /* default */].prototype.end
FilterMapSink.prototype.error = __WEBPACK_IMPORTED_MODULE_0__sink_Pipe__["a" /* default */].prototype.error


/***/ }),
/* 98 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
Object.defineProperty(__webpack_exports__, "__esModule", { value: true });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__Stream__ = __webpack_require__(0);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__most_prelude__ = __webpack_require__(4);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__source_core__ = __webpack_require__(7);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3__source_from__ = __webpack_require__(110);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_4__source_periodic__ = __webpack_require__(116);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_5_symbol_observable__ = __webpack_require__(49);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_5_symbol_observable___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_5_symbol_observable__);
/* harmony reexport (binding) */ __webpack_require__.d(__webpack_exports__, "Stream", function() { return __WEBPACK_IMPORTED_MODULE_0__Stream__["a"]; });
/* harmony reexport (binding) */ __webpack_require__.d(__webpack_exports__, "of", function() { return __WEBPACK_IMPORTED_MODULE_2__source_core__["a"]; });
/* harmony reexport (binding) */ __webpack_require__.d(__webpack_exports__, "just", function() { return __WEBPACK_IMPORTED_MODULE_2__source_core__["a"]; });
/* harmony reexport (binding) */ __webpack_require__.d(__webpack_exports__, "empty", function() { return __WEBPACK_IMPORTED_MODULE_2__source_core__["b"]; });
/* harmony reexport (binding) */ __webpack_require__.d(__webpack_exports__, "never", function() { return __WEBPACK_IMPORTED_MODULE_2__source_core__["c"]; });
/* harmony reexport (binding) */ __webpack_require__.d(__webpack_exports__, "from", function() { return __WEBPACK_IMPORTED_MODULE_3__source_from__["a"]; });
/* harmony reexport (binding) */ __webpack_require__.d(__webpack_exports__, "periodic", function() { return __WEBPACK_IMPORTED_MODULE_4__source_periodic__["a"]; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_6__observable_subscribe__ = __webpack_require__(101);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_7__combinator_thru__ = __webpack_require__(90);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_8__source_fromEvent__ = __webpack_require__(112);
/* harmony reexport (binding) */ __webpack_require__.d(__webpack_exports__, "fromEvent", function() { return __WEBPACK_IMPORTED_MODULE_8__source_fromEvent__["a"]; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_9__combinator_observe__ = __webpack_require__(85);
/* harmony reexport (binding) */ __webpack_require__.d(__webpack_exports__, "observe", function() { return __WEBPACK_IMPORTED_MODULE_9__combinator_observe__["a"]; });
/* harmony reexport (binding) */ __webpack_require__.d(__webpack_exports__, "forEach", function() { return __WEBPACK_IMPORTED_MODULE_9__combinator_observe__["a"]; });
/* harmony reexport (binding) */ __webpack_require__.d(__webpack_exports__, "drain", function() { return __WEBPACK_IMPORTED_MODULE_9__combinator_observe__["b"]; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_10__combinator_loop__ = __webpack_require__(83);
/* harmony reexport (binding) */ __webpack_require__.d(__webpack_exports__, "loop", function() { return __WEBPACK_IMPORTED_MODULE_10__combinator_loop__["a"]; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_11__combinator_accumulate__ = __webpack_require__(75);
/* harmony reexport (binding) */ __webpack_require__.d(__webpack_exports__, "scan", function() { return __WEBPACK_IMPORTED_MODULE_11__combinator_accumulate__["a"]; });
/* harmony reexport (binding) */ __webpack_require__.d(__webpack_exports__, "reduce", function() { return __WEBPACK_IMPORTED_MODULE_11__combinator_accumulate__["b"]; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_12__source_unfold__ = __webpack_require__(117);
/* harmony reexport (binding) */ __webpack_require__.d(__webpack_exports__, "unfold", function() { return __WEBPACK_IMPORTED_MODULE_12__source_unfold__["a"]; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_13__source_iterate__ = __webpack_require__(115);
/* harmony reexport (binding) */ __webpack_require__.d(__webpack_exports__, "iterate", function() { return __WEBPACK_IMPORTED_MODULE_13__source_iterate__["a"]; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_14__source_generate__ = __webpack_require__(114);
/* harmony reexport (binding) */ __webpack_require__.d(__webpack_exports__, "generate", function() { return __WEBPACK_IMPORTED_MODULE_14__source_generate__["a"]; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_15__combinator_build__ = __webpack_require__(77);
/* harmony reexport (binding) */ __webpack_require__.d(__webpack_exports__, "concat", function() { return __WEBPACK_IMPORTED_MODULE_15__combinator_build__["a"]; });
/* harmony reexport (binding) */ __webpack_require__.d(__webpack_exports__, "startWith", function() { return __WEBPACK_IMPORTED_MODULE_15__combinator_build__["b"]; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_16__combinator_transform__ = __webpack_require__(12);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_17__combinator_applicative__ = __webpack_require__(76);
/* harmony reexport (binding) */ __webpack_require__.d(__webpack_exports__, "map", function() { return __WEBPACK_IMPORTED_MODULE_16__combinator_transform__["a"]; });
/* harmony reexport (binding) */ __webpack_require__.d(__webpack_exports__, "constant", function() { return __WEBPACK_IMPORTED_MODULE_16__combinator_transform__["b"]; });
/* harmony reexport (binding) */ __webpack_require__.d(__webpack_exports__, "tap", function() { return __WEBPACK_IMPORTED_MODULE_16__combinator_transform__["c"]; });
/* harmony reexport (binding) */ __webpack_require__.d(__webpack_exports__, "ap", function() { return __WEBPACK_IMPORTED_MODULE_17__combinator_applicative__["a"]; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_18__combinator_transduce__ = __webpack_require__(93);
/* harmony reexport (binding) */ __webpack_require__.d(__webpack_exports__, "transduce", function() { return __WEBPACK_IMPORTED_MODULE_18__combinator_transduce__["a"]; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_19__combinator_flatMap__ = __webpack_require__(40);
/* harmony reexport (binding) */ __webpack_require__.d(__webpack_exports__, "flatMap", function() { return __WEBPACK_IMPORTED_MODULE_19__combinator_flatMap__["a"]; });
/* harmony reexport (binding) */ __webpack_require__.d(__webpack_exports__, "chain", function() { return __WEBPACK_IMPORTED_MODULE_19__combinator_flatMap__["a"]; });
/* harmony reexport (binding) */ __webpack_require__.d(__webpack_exports__, "join", function() { return __WEBPACK_IMPORTED_MODULE_19__combinator_flatMap__["b"]; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_20__combinator_continueWith__ = __webpack_require__(39);
/* harmony reexport (binding) */ __webpack_require__.d(__webpack_exports__, "continueWith", function() { return __WEBPACK_IMPORTED_MODULE_20__combinator_continueWith__["a"]; });
/* harmony reexport (binding) */ __webpack_require__.d(__webpack_exports__, "flatMapEnd", function() { return __WEBPACK_IMPORTED_MODULE_20__combinator_continueWith__["a"]; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_21__combinator_concatMap__ = __webpack_require__(78);
/* harmony reexport (binding) */ __webpack_require__.d(__webpack_exports__, "concatMap", function() { return __WEBPACK_IMPORTED_MODULE_21__combinator_concatMap__["a"]; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_22__combinator_mergeConcurrently__ = __webpack_require__(20);
/* harmony reexport (binding) */ __webpack_require__.d(__webpack_exports__, "mergeConcurrently", function() { return __WEBPACK_IMPORTED_MODULE_22__combinator_mergeConcurrently__["a"]; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_23__combinator_merge__ = __webpack_require__(84);
/* harmony reexport (binding) */ __webpack_require__.d(__webpack_exports__, "merge", function() { return __WEBPACK_IMPORTED_MODULE_23__combinator_merge__["a"]; });
/* harmony reexport (binding) */ __webpack_require__.d(__webpack_exports__, "mergeArray", function() { return __WEBPACK_IMPORTED_MODULE_23__combinator_merge__["b"]; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_24__combinator_combine__ = __webpack_require__(38);
/* harmony reexport (binding) */ __webpack_require__.d(__webpack_exports__, "combine", function() { return __WEBPACK_IMPORTED_MODULE_24__combinator_combine__["a"]; });
/* harmony reexport (binding) */ __webpack_require__.d(__webpack_exports__, "combineArray", function() { return __WEBPACK_IMPORTED_MODULE_24__combinator_combine__["b"]; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_25__combinator_sample__ = __webpack_require__(87);
/* harmony reexport (binding) */ __webpack_require__.d(__webpack_exports__, "sample", function() { return __WEBPACK_IMPORTED_MODULE_25__combinator_sample__["a"]; });
/* harmony reexport (binding) */ __webpack_require__.d(__webpack_exports__, "sampleArray", function() { return __WEBPACK_IMPORTED_MODULE_25__combinator_sample__["b"]; });
/* harmony reexport (binding) */ __webpack_require__.d(__webpack_exports__, "sampleWith", function() { return __WEBPACK_IMPORTED_MODULE_25__combinator_sample__["c"]; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_26__combinator_zip__ = __webpack_require__(94);
/* harmony reexport (binding) */ __webpack_require__.d(__webpack_exports__, "zip", function() { return __WEBPACK_IMPORTED_MODULE_26__combinator_zip__["a"]; });
/* harmony reexport (binding) */ __webpack_require__.d(__webpack_exports__, "zipArray", function() { return __WEBPACK_IMPORTED_MODULE_26__combinator_zip__["b"]; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_27__combinator_switch__ = __webpack_require__(89);
/* harmony reexport (binding) */ __webpack_require__.d(__webpack_exports__, "switchLatest", function() { return __WEBPACK_IMPORTED_MODULE_27__combinator_switch__["a"]; });
/* harmony reexport (binding) */ __webpack_require__.d(__webpack_exports__, "switch", function() { return __WEBPACK_IMPORTED_MODULE_27__combinator_switch__["a"]; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_28__combinator_filter__ = __webpack_require__(81);
/* harmony reexport (binding) */ __webpack_require__.d(__webpack_exports__, "filter", function() { return __WEBPACK_IMPORTED_MODULE_28__combinator_filter__["a"]; });
/* harmony reexport (binding) */ __webpack_require__.d(__webpack_exports__, "skipRepeats", function() { return __WEBPACK_IMPORTED_MODULE_28__combinator_filter__["b"]; });
/* harmony reexport (binding) */ __webpack_require__.d(__webpack_exports__, "distinct", function() { return __WEBPACK_IMPORTED_MODULE_28__combinator_filter__["b"]; });
/* harmony reexport (binding) */ __webpack_require__.d(__webpack_exports__, "skipRepeatsWith", function() { return __WEBPACK_IMPORTED_MODULE_28__combinator_filter__["c"]; });
/* harmony reexport (binding) */ __webpack_require__.d(__webpack_exports__, "distinctBy", function() { return __WEBPACK_IMPORTED_MODULE_28__combinator_filter__["c"]; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_29__combinator_slice__ = __webpack_require__(88);
/* harmony reexport (binding) */ __webpack_require__.d(__webpack_exports__, "take", function() { return __WEBPACK_IMPORTED_MODULE_29__combinator_slice__["a"]; });
/* harmony reexport (binding) */ __webpack_require__.d(__webpack_exports__, "skip", function() { return __WEBPACK_IMPORTED_MODULE_29__combinator_slice__["b"]; });
/* harmony reexport (binding) */ __webpack_require__.d(__webpack_exports__, "slice", function() { return __WEBPACK_IMPORTED_MODULE_29__combinator_slice__["c"]; });
/* harmony reexport (binding) */ __webpack_require__.d(__webpack_exports__, "takeWhile", function() { return __WEBPACK_IMPORTED_MODULE_29__combinator_slice__["d"]; });
/* harmony reexport (binding) */ __webpack_require__.d(__webpack_exports__, "skipWhile", function() { return __WEBPACK_IMPORTED_MODULE_29__combinator_slice__["e"]; });
/* harmony reexport (binding) */ __webpack_require__.d(__webpack_exports__, "skipAfter", function() { return __WEBPACK_IMPORTED_MODULE_29__combinator_slice__["f"]; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_30__combinator_timeslice__ = __webpack_require__(91);
/* harmony reexport (binding) */ __webpack_require__.d(__webpack_exports__, "takeUntil", function() { return __WEBPACK_IMPORTED_MODULE_30__combinator_timeslice__["a"]; });
/* harmony reexport (binding) */ __webpack_require__.d(__webpack_exports__, "until", function() { return __WEBPACK_IMPORTED_MODULE_30__combinator_timeslice__["a"]; });
/* harmony reexport (binding) */ __webpack_require__.d(__webpack_exports__, "skipUntil", function() { return __WEBPACK_IMPORTED_MODULE_30__combinator_timeslice__["b"]; });
/* harmony reexport (binding) */ __webpack_require__.d(__webpack_exports__, "since", function() { return __WEBPACK_IMPORTED_MODULE_30__combinator_timeslice__["b"]; });
/* harmony reexport (binding) */ __webpack_require__.d(__webpack_exports__, "during", function() { return __WEBPACK_IMPORTED_MODULE_30__combinator_timeslice__["c"]; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_31__combinator_delay__ = __webpack_require__(79);
/* harmony reexport (binding) */ __webpack_require__.d(__webpack_exports__, "delay", function() { return __WEBPACK_IMPORTED_MODULE_31__combinator_delay__["a"]; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_32__combinator_timestamp__ = __webpack_require__(92);
/* harmony reexport (binding) */ __webpack_require__.d(__webpack_exports__, "timestamp", function() { return __WEBPACK_IMPORTED_MODULE_32__combinator_timestamp__["a"]; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_33__combinator_limit__ = __webpack_require__(82);
/* harmony reexport (binding) */ __webpack_require__.d(__webpack_exports__, "throttle", function() { return __WEBPACK_IMPORTED_MODULE_33__combinator_limit__["a"]; });
/* harmony reexport (binding) */ __webpack_require__.d(__webpack_exports__, "debounce", function() { return __WEBPACK_IMPORTED_MODULE_33__combinator_limit__["b"]; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_34__combinator_promises__ = __webpack_require__(86);
/* harmony reexport (binding) */ __webpack_require__.d(__webpack_exports__, "fromPromise", function() { return __WEBPACK_IMPORTED_MODULE_34__combinator_promises__["a"]; });
/* harmony reexport (binding) */ __webpack_require__.d(__webpack_exports__, "awaitPromises", function() { return __WEBPACK_IMPORTED_MODULE_34__combinator_promises__["b"]; });
/* harmony reexport (binding) */ __webpack_require__.d(__webpack_exports__, "await", function() { return __WEBPACK_IMPORTED_MODULE_34__combinator_promises__["b"]; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_35__combinator_errors__ = __webpack_require__(80);
/* harmony reexport (binding) */ __webpack_require__.d(__webpack_exports__, "recoverWith", function() { return __WEBPACK_IMPORTED_MODULE_35__combinator_errors__["a"]; });
/* harmony reexport (binding) */ __webpack_require__.d(__webpack_exports__, "flatMapError", function() { return __WEBPACK_IMPORTED_MODULE_35__combinator_errors__["b"]; });
/* harmony reexport (binding) */ __webpack_require__.d(__webpack_exports__, "throwError", function() { return __WEBPACK_IMPORTED_MODULE_35__combinator_errors__["c"]; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_36__most_multicast__ = __webpack_require__(53);
/* harmony reexport (binding) */ __webpack_require__.d(__webpack_exports__, "multicast", function() { return __WEBPACK_IMPORTED_MODULE_36__most_multicast__["a"]; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_37__scheduler_defaultScheduler__ = __webpack_require__(24);
/* harmony reexport (binding) */ __webpack_require__.d(__webpack_exports__, "defaultScheduler", function() { return __WEBPACK_IMPORTED_MODULE_37__scheduler_defaultScheduler__["a"]; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_38__scheduler_PropagateTask__ = __webpack_require__(6);
/* harmony reexport (binding) */ __webpack_require__.d(__webpack_exports__, "PropagateTask", function() { return __WEBPACK_IMPORTED_MODULE_38__scheduler_PropagateTask__["a"]; });
/** @license MIT License (c) copyright 2010-2016 original author or authors */
/** @author Brian Cavalier */
/** @author John Hann */








/**
 * Core stream type
 * @type {Stream}
 */


// Add of and empty to constructor for fantasy-land compat
__WEBPACK_IMPORTED_MODULE_0__Stream__["a" /* default */].of = __WEBPACK_IMPORTED_MODULE_2__source_core__["a" /* of */]
__WEBPACK_IMPORTED_MODULE_0__Stream__["a" /* default */].empty = __WEBPACK_IMPORTED_MODULE_2__source_core__["b" /* empty */]
// Add from to constructor for ES Observable compat
__WEBPACK_IMPORTED_MODULE_0__Stream__["a" /* default */].from = __WEBPACK_IMPORTED_MODULE_3__source_from__["a" /* from */]


// -----------------------------------------------------------------------
// Draft ES Observable proposal interop
// https://github.com/zenparsing/es-observable



__WEBPACK_IMPORTED_MODULE_0__Stream__["a" /* default */].prototype.subscribe = function (subscriber) {
  return __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_6__observable_subscribe__["a" /* subscribe */])(subscriber, this)
}

__WEBPACK_IMPORTED_MODULE_0__Stream__["a" /* default */].prototype[__WEBPACK_IMPORTED_MODULE_5_symbol_observable___default.a] = function () {
  return this
}

// -----------------------------------------------------------------------
// Fluent adapter



/**
 * Adapt a functional stream transform to fluent style.
 * It applies f to the this stream object
 * @param  {function(s: Stream): Stream} f function that
 * receives the stream itself and must return a new stream
 * @return {Stream}
 */
__WEBPACK_IMPORTED_MODULE_0__Stream__["a" /* default */].prototype.thru = function (f) {
  return __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_7__combinator_thru__["a" /* thru */])(f, this)
}

// -----------------------------------------------------------------------
// Adapting other sources

/**
 * Create a stream of events from the supplied EventTarget or EventEmitter
 * @param {String} event event name
 * @param {EventTarget|EventEmitter} source EventTarget or EventEmitter. The source
 *  must support either addEventListener/removeEventListener (w3c EventTarget:
 *  http://www.w3.org/TR/DOM-Level-2-Events/events.html#Events-EventTarget),
 *  or addListener/removeListener (node EventEmitter: http://nodejs.org/api/events.html)
 * @returns {Stream} stream of events of the specified type from the source
 */


// -----------------------------------------------------------------------
// Observing





/**
 * Process all the events in the stream
 * @returns {Promise} promise that fulfills when the stream ends, or rejects
 *  if the stream fails with an unhandled error.
 */
__WEBPACK_IMPORTED_MODULE_0__Stream__["a" /* default */].prototype.observe = __WEBPACK_IMPORTED_MODULE_0__Stream__["a" /* default */].prototype.forEach = function (f) {
  return __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_9__combinator_observe__["a" /* observe */])(f, this)
}

/**
 * Consume all events in the stream, without providing a function to process each.
 * This causes a stream to become active and begin emitting events, and is useful
 * in cases where all processing has been setup upstream via other combinators, and
 * there is no need to process the terminal events.
 * @returns {Promise} promise that fulfills when the stream ends, or rejects
 *  if the stream fails with an unhandled error.
 */
__WEBPACK_IMPORTED_MODULE_0__Stream__["a" /* default */].prototype.drain = function () {
  return __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_9__combinator_observe__["b" /* drain */])(this)
}

// -------------------------------------------------------





/**
 * Generalized feedback loop. Call a stepper function for each event. The stepper
 * will be called with 2 params: the current seed and the an event value.  It must
 * return a new { seed, value } pair. The `seed` will be fed back into the next
 * invocation of stepper, and the `value` will be propagated as the event value.
 * @param {function(seed:*, value:*):{seed:*, value:*}} stepper loop step function
 * @param {*} seed initial seed value passed to first stepper call
 * @returns {Stream} new stream whose values are the `value` field of the objects
 * returned by the stepper
 */
__WEBPACK_IMPORTED_MODULE_0__Stream__["a" /* default */].prototype.loop = function (stepper, seed) {
  return __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_10__combinator_loop__["a" /* loop */])(stepper, seed, this)
}

// -------------------------------------------------------





/**
 * Create a stream containing successive reduce results of applying f to
 * the previous reduce result and the current stream item.
 * @param {function(result:*, x:*):*} f reducer function
 * @param {*} initial initial value
 * @returns {Stream} new stream containing successive reduce results
 */
__WEBPACK_IMPORTED_MODULE_0__Stream__["a" /* default */].prototype.scan = function (f, initial) {
  return __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_11__combinator_accumulate__["a" /* scan */])(f, initial, this)
}

/**
 * Reduce the stream to produce a single result.  Note that reducing an infinite
 * stream will return a Promise that never fulfills, but that may reject if an error
 * occurs.
 * @param {function(result:*, x:*):*} f reducer function
 * @param {*} initial optional initial value
 * @returns {Promise} promise for the file result of the reduce
 */
__WEBPACK_IMPORTED_MODULE_0__Stream__["a" /* default */].prototype.reduce = function (f, initial) {
  return __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_11__combinator_accumulate__["b" /* reduce */])(f, initial, this)
}

// -----------------------------------------------------------------------
// Building and extending








/**
 * @param {Stream} tail
 * @returns {Stream} new stream containing all items in this followed by
 *  all items in tail
 */
__WEBPACK_IMPORTED_MODULE_0__Stream__["a" /* default */].prototype.concat = function (tail) {
  return __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_15__combinator_build__["a" /* concat */])(this, tail)
}

/**
 * @param {*} x value to prepend
 * @returns {Stream} a new stream with x prepended
 */
__WEBPACK_IMPORTED_MODULE_0__Stream__["a" /* default */].prototype.startWith = function (x) {
  return __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_15__combinator_build__["b" /* cons */])(x, this)
}

// -----------------------------------------------------------------------
// Transforming






/**
 * Transform each value in the stream by applying f to each
 * @param {function(*):*} f mapping function
 * @returns {Stream} stream containing items transformed by f
 */
__WEBPACK_IMPORTED_MODULE_0__Stream__["a" /* default */].prototype.map = function (f) {
  return __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_16__combinator_transform__["a" /* map */])(f, this)
}

/**
 * Assume this stream contains functions, and apply each function to each item
 * in the provided stream.  This generates, in effect, a cross product.
 * @param {Stream} xs stream of items to which
 * @returns {Stream} stream containing the cross product of items
 */
__WEBPACK_IMPORTED_MODULE_0__Stream__["a" /* default */].prototype.ap = function (xs) {
  return __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_17__combinator_applicative__["a" /* ap */])(this, xs)
}

/**
 * Replace each value in the stream with x
 * @param {*} x
 * @returns {Stream} stream containing items replaced with x
 */
__WEBPACK_IMPORTED_MODULE_0__Stream__["a" /* default */].prototype.constant = function (x) {
  return __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_16__combinator_transform__["b" /* constant */])(x, this)
}

/**
 * Perform a side effect for each item in the stream
 * @param {function(x:*):*} f side effect to execute for each item. The
 *  return value will be discarded.
 * @returns {Stream} new stream containing the same items as this stream
 */
__WEBPACK_IMPORTED_MODULE_0__Stream__["a" /* default */].prototype.tap = function (f) {
  return __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_16__combinator_transform__["c" /* tap */])(f, this)
}

// -----------------------------------------------------------------------
// Transducer support





/**
 * Transform this stream by passing its events through a transducer.
 * @param  {function} transducer transducer function
 * @return {Stream} stream of events transformed by the transducer
 */
__WEBPACK_IMPORTED_MODULE_0__Stream__["a" /* default */].prototype.transduce = function (transducer) {
  return __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_18__combinator_transduce__["a" /* transduce */])(transducer, this)
}

// -----------------------------------------------------------------------
// FlatMapping



// @deprecated flatMap, use chain instead


/**
 * Map each value in the stream to a new stream, and merge it into the
 * returned outer stream. Event arrival times are preserved.
 * @param {function(x:*):Stream} f chaining function, must return a Stream
 * @returns {Stream} new stream containing all events from each stream returned by f
 */
__WEBPACK_IMPORTED_MODULE_0__Stream__["a" /* default */].prototype.chain = function (f) {
  return __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_19__combinator_flatMap__["a" /* flatMap */])(f, this)
}

// @deprecated use chain instead
__WEBPACK_IMPORTED_MODULE_0__Stream__["a" /* default */].prototype.flatMap = __WEBPACK_IMPORTED_MODULE_0__Stream__["a" /* default */].prototype.chain

  /**
 * Monadic join. Flatten a Stream<Stream<X>> to Stream<X> by merging inner
 * streams to the outer. Event arrival times are preserved.
 * @returns {Stream<X>} new stream containing all events of all inner streams
 */
__WEBPACK_IMPORTED_MODULE_0__Stream__["a" /* default */].prototype.join = function () {
  return __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_19__combinator_flatMap__["b" /* join */])(this)
}



// @deprecated flatMapEnd, use continueWith instead


/**
 * Map the end event to a new stream, and begin emitting its values.
 * @param {function(x:*):Stream} f function that receives the end event value,
 * and *must* return a new Stream to continue with.
 * @returns {Stream} new stream that emits all events from the original stream,
 * followed by all events from the stream returned by f.
 */
__WEBPACK_IMPORTED_MODULE_0__Stream__["a" /* default */].prototype.continueWith = function (f) {
  return __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_20__combinator_continueWith__["a" /* continueWith */])(f, this)
}

// @deprecated use continueWith instead
__WEBPACK_IMPORTED_MODULE_0__Stream__["a" /* default */].prototype.flatMapEnd = __WEBPACK_IMPORTED_MODULE_0__Stream__["a" /* default */].prototype.continueWith





__WEBPACK_IMPORTED_MODULE_0__Stream__["a" /* default */].prototype.concatMap = function (f) {
  return __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_21__combinator_concatMap__["a" /* concatMap */])(f, this)
}

// -----------------------------------------------------------------------
// Concurrent merging





/**
 * Flatten a Stream<Stream<X>> to Stream<X> by merging inner
 * streams to the outer, limiting the number of inner streams that may
 * be active concurrently.
 * @param {number} concurrency at most this many inner streams will be
 *  allowed to be active concurrently.
 * @return {Stream<X>} new stream containing all events of all inner
 *  streams, with limited concurrency.
 */
__WEBPACK_IMPORTED_MODULE_0__Stream__["a" /* default */].prototype.mergeConcurrently = function (concurrency) {
  return __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_22__combinator_mergeConcurrently__["a" /* mergeConcurrently */])(concurrency, this)
}

// -----------------------------------------------------------------------
// Merging





/**
 * Merge this stream and all the provided streams
 * @returns {Stream} stream containing items from this stream and s in time
 * order.  If two events are simultaneous they will be merged in
 * arbitrary order.
 */
__WEBPACK_IMPORTED_MODULE_0__Stream__["a" /* default */].prototype.merge = function (/* ...streams*/) {
  return __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_23__combinator_merge__["b" /* mergeArray */])(__WEBPACK_IMPORTED_MODULE_1__most_prelude__["a" /* cons */](this, arguments))
}

// -----------------------------------------------------------------------
// Combining





/**
 * Combine latest events from all input streams
 * @param {function(...events):*} f function to combine most recent events
 * @returns {Stream} stream containing the result of applying f to the most recent
 *  event of each input stream, whenever a new event arrives on any stream.
 */
__WEBPACK_IMPORTED_MODULE_0__Stream__["a" /* default */].prototype.combine = function (f /*, ...streams*/) {
  return __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_24__combinator_combine__["b" /* combineArray */])(f, __WEBPACK_IMPORTED_MODULE_1__most_prelude__["b" /* replace */](this, 0, arguments))
}

// -----------------------------------------------------------------------
// Sampling





/**
 * When an event arrives on sampler, emit the latest event value from stream.
 * @param {Stream} sampler stream of events at whose arrival time
 *  signal's latest value will be propagated
 * @returns {Stream} sampled stream of values
 */
__WEBPACK_IMPORTED_MODULE_0__Stream__["a" /* default */].prototype.sampleWith = function (sampler) {
  return __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_25__combinator_sample__["c" /* sampleWith */])(sampler, this)
}

/**
 * When an event arrives on this stream, emit the result of calling f with the latest
 * values of all streams being sampled
 * @param {function(...values):*} f function to apply to each set of sampled values
 * @returns {Stream} stream of sampled and transformed values
 */
__WEBPACK_IMPORTED_MODULE_0__Stream__["a" /* default */].prototype.sample = function (f /* ...streams */) {
  return __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_25__combinator_sample__["b" /* sampleArray */])(f, this, __WEBPACK_IMPORTED_MODULE_1__most_prelude__["c" /* tail */](arguments))
}

// -----------------------------------------------------------------------
// Zipping





/**
 * Pair-wise combine items with those in s. Given 2 streams:
 * [1,2,3] zipWith f [4,5,6] -> [f(1,4),f(2,5),f(3,6)]
 * Note: zip causes fast streams to buffer and wait for slow streams.
 * @param {function(a:Stream, b:Stream, ...):*} f function to combine items
 * @returns {Stream} new stream containing pairs
 */
__WEBPACK_IMPORTED_MODULE_0__Stream__["a" /* default */].prototype.zip = function (f /*, ...streams*/) {
  return __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_26__combinator_zip__["b" /* zipArray */])(f, __WEBPACK_IMPORTED_MODULE_1__most_prelude__["b" /* replace */](this, 0, arguments))
}

// -----------------------------------------------------------------------
// Switching



// @deprecated switch, use switchLatest instead


/**
 * Given a stream of streams, return a new stream that adopts the behavior
 * of the most recent inner stream.
 * @returns {Stream} switching stream
 */
__WEBPACK_IMPORTED_MODULE_0__Stream__["a" /* default */].prototype.switchLatest = function () {
  return __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_27__combinator_switch__["a" /* switchLatest */])(this)
}

// @deprecated use switchLatest instead
__WEBPACK_IMPORTED_MODULE_0__Stream__["a" /* default */].prototype.switch = __WEBPACK_IMPORTED_MODULE_0__Stream__["a" /* default */].prototype.switchLatest

// -----------------------------------------------------------------------
// Filtering



// @deprecated distinct, use skipRepeats instead
// @deprecated distinctBy, use skipRepeatsWith instead


/**
 * Retain only items matching a predicate
 * stream:                           -12345678-
 * filter(x => x % 2 === 0, stream): --2-4-6-8-
 * @param {function(x:*):boolean} p filtering predicate called for each item
 * @returns {Stream} stream containing only items for which predicate returns truthy
 */
__WEBPACK_IMPORTED_MODULE_0__Stream__["a" /* default */].prototype.filter = function (p) {
  return __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_28__combinator_filter__["a" /* filter */])(p, this)
}

/**
 * Skip repeated events, using === to compare items
 * stream:           -abbcd-
 * distinct(stream): -ab-cd-
 * @returns {Stream} stream with no repeated events
 */
__WEBPACK_IMPORTED_MODULE_0__Stream__["a" /* default */].prototype.skipRepeats = function () {
  return __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_28__combinator_filter__["b" /* skipRepeats */])(this)
}

/**
 * Skip repeated events, using supplied equals function to compare items
 * @param {function(a:*, b:*):boolean} equals function to compare items
 * @returns {Stream} stream with no repeated events
 */
__WEBPACK_IMPORTED_MODULE_0__Stream__["a" /* default */].prototype.skipRepeatsWith = function (equals) {
  return __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_28__combinator_filter__["c" /* skipRepeatsWith */])(equals, this)
}

// -----------------------------------------------------------------------
// Slicing





/**
 * stream:          -abcd-
 * take(2, stream): -ab|
 * @param {Number} n take up to this many events
 * @returns {Stream} stream containing at most the first n items from this stream
 */
__WEBPACK_IMPORTED_MODULE_0__Stream__["a" /* default */].prototype.take = function (n) {
  return __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_29__combinator_slice__["a" /* take */])(n, this)
}

/**
 * stream:          -abcd->
 * skip(2, stream): ---cd->
 * @param {Number} n skip this many events
 * @returns {Stream} stream not containing the first n events
 */
__WEBPACK_IMPORTED_MODULE_0__Stream__["a" /* default */].prototype.skip = function (n) {
  return __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_29__combinator_slice__["b" /* skip */])(n, this)
}

/**
 * Slice a stream by event index. Equivalent to, but more efficient than
 * stream.take(end).skip(start);
 * NOTE: Negative start and end are not supported
 * @param {Number} start skip all events before the start index
 * @param {Number} end allow all events from the start index to the end index
 * @returns {Stream} stream containing items where start <= index < end
 */
__WEBPACK_IMPORTED_MODULE_0__Stream__["a" /* default */].prototype.slice = function (start, end) {
  return __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_29__combinator_slice__["c" /* slice */])(start, end, this)
}

/**
 * stream:                        -123451234->
 * takeWhile(x => x < 5, stream): -1234|
 * @param {function(x:*):boolean} p predicate
 * @returns {Stream} stream containing items up to, but not including, the
 * first item for which p returns falsy.
 */
__WEBPACK_IMPORTED_MODULE_0__Stream__["a" /* default */].prototype.takeWhile = function (p) {
  return __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_29__combinator_slice__["d" /* takeWhile */])(p, this)
}

/**
 * stream:                        -123451234->
 * skipWhile(x => x < 5, stream): -----51234->
 * @param {function(x:*):boolean} p predicate
 * @returns {Stream} stream containing items following *and including* the
 * first item for which p returns falsy.
 */
__WEBPACK_IMPORTED_MODULE_0__Stream__["a" /* default */].prototype.skipWhile = function (p) {
  return __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_29__combinator_slice__["e" /* skipWhile */])(p, this)
}

/**
 * stream:                         -123456789->
 * skipAfter(x => x === 5, stream):-12345|
 * @param {function(x:*):boolean} p predicate
 * @returns {Stream} stream containing items up to, *and including*, the
 * first item for which p returns truthy.
 */
__WEBPACK_IMPORTED_MODULE_0__Stream__["a" /* default */].prototype.skipAfter = function (p) {
  return __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_29__combinator_slice__["f" /* skipAfter */])(p, this)
}

// -----------------------------------------------------------------------
// Time slicing



// @deprecated takeUntil, use until instead
// @deprecated skipUntil, use since instead


/**
 * stream:                    -a-b-c-d-e-f-g->
 * signal:                    -------x
 * takeUntil(signal, stream): -a-b-c-|
 * @param {Stream} signal retain only events in stream before the first
 * event in signal
 * @returns {Stream} new stream containing only events that occur before
 * the first event in signal.
 */
__WEBPACK_IMPORTED_MODULE_0__Stream__["a" /* default */].prototype.until = function (signal) {
  return __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_30__combinator_timeslice__["a" /* takeUntil */])(signal, this)
}

// @deprecated use until instead
__WEBPACK_IMPORTED_MODULE_0__Stream__["a" /* default */].prototype.takeUntil = __WEBPACK_IMPORTED_MODULE_0__Stream__["a" /* default */].prototype.until

  /**
 * stream:                    -a-b-c-d-e-f-g->
 * signal:                    -------x
 * takeUntil(signal, stream): -------d-e-f-g->
 * @param {Stream} signal retain only events in stream at or after the first
 * event in signal
 * @returns {Stream} new stream containing only events that occur after
 * the first event in signal.
 */
__WEBPACK_IMPORTED_MODULE_0__Stream__["a" /* default */].prototype.since = function (signal) {
  return __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_30__combinator_timeslice__["b" /* skipUntil */])(signal, this)
}

// @deprecated use since instead
__WEBPACK_IMPORTED_MODULE_0__Stream__["a" /* default */].prototype.skipUntil = __WEBPACK_IMPORTED_MODULE_0__Stream__["a" /* default */].prototype.since

  /**
 * stream:                    -a-b-c-d-e-f-g->
 * timeWindow:                -----s
 * s:                               -----t
 * stream.during(timeWindow): -----c-d-e-|
 * @param {Stream<Stream>} timeWindow a stream whose first event (s) represents
 *  the window start time.  That event (s) is itself a stream whose first event (t)
 *  represents the window end time
 * @returns {Stream} new stream containing only events within the provided timespan
 */
__WEBPACK_IMPORTED_MODULE_0__Stream__["a" /* default */].prototype.during = function (timeWindow) {
  return __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_30__combinator_timeslice__["c" /* during */])(timeWindow, this)
}

// -----------------------------------------------------------------------
// Delaying





/**
 * @param {Number} delayTime milliseconds to delay each item
 * @returns {Stream} new stream containing the same items, but delayed by ms
 */
__WEBPACK_IMPORTED_MODULE_0__Stream__["a" /* default */].prototype.delay = function (delayTime) {
  return __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_31__combinator_delay__["a" /* delay */])(delayTime, this)
}

// -----------------------------------------------------------------------
// Getting event timestamp




/**
 * Expose event timestamps into the stream. Turns a Stream<X> into
 * Stream<{time:t, value:X}>
 * @returns {Stream<{time:number, value:*}>}
 */
__WEBPACK_IMPORTED_MODULE_0__Stream__["a" /* default */].prototype.timestamp = function () {
  return __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_32__combinator_timestamp__["a" /* timestamp */])(this)
}

// -----------------------------------------------------------------------
// Rate limiting





/**
 * Limit the rate of events
 * stream:              abcd----abcd----
 * throttle(2, stream): a-c-----a-c-----
 * @param {Number} period time to suppress events
 * @returns {Stream} new stream that skips events for throttle period
 */
__WEBPACK_IMPORTED_MODULE_0__Stream__["a" /* default */].prototype.throttle = function (period) {
  return __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_33__combinator_limit__["a" /* throttle */])(period, this)
}

/**
 * Wait for a burst of events to subside and emit only the last event in the burst
 * stream:              abcd----abcd----
 * debounce(2, stream): -----d-------d--
 * @param {Number} period events occuring more frequently than this
 *  on the provided scheduler will be suppressed
 * @returns {Stream} new debounced stream
 */
__WEBPACK_IMPORTED_MODULE_0__Stream__["a" /* default */].prototype.debounce = function (period) {
  return __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_33__combinator_limit__["b" /* debounce */])(period, this)
}

// -----------------------------------------------------------------------
// Awaiting Promises



// @deprecated await, use awaitPromises instead


/**
 * Await promises, turning a Stream<Promise<X>> into Stream<X>.  Preserves
 * event order, but timeshifts events based on promise resolution time.
 * @returns {Stream<X>} stream containing non-promise values
 */
__WEBPACK_IMPORTED_MODULE_0__Stream__["a" /* default */].prototype.awaitPromises = function () {
  return __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_34__combinator_promises__["b" /* awaitPromises */])(this)
}

// @deprecated use awaitPromises instead
__WEBPACK_IMPORTED_MODULE_0__Stream__["a" /* default */].prototype.await = __WEBPACK_IMPORTED_MODULE_0__Stream__["a" /* default */].prototype.awaitPromises

// -----------------------------------------------------------------------
// Error handling



// @deprecated flatMapError, use recoverWith instead


/**
 * If this stream encounters an error, recover and continue with items from stream
 * returned by f.
 * stream:                  -a-b-c-X-
 * f(X):                           d-e-f-g-
 * flatMapError(f, stream): -a-b-c-d-e-f-g-
 * @param {function(error:*):Stream} f function which returns a new stream
 * @returns {Stream} new stream which will recover from an error by calling f
 */
__WEBPACK_IMPORTED_MODULE_0__Stream__["a" /* default */].prototype.recoverWith = function (f) {
  return __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_35__combinator_errors__["b" /* flatMapError */])(f, this)
}

// @deprecated use recoverWith instead
__WEBPACK_IMPORTED_MODULE_0__Stream__["a" /* default */].prototype.flatMapError = __WEBPACK_IMPORTED_MODULE_0__Stream__["a" /* default */].prototype.recoverWith

// -----------------------------------------------------------------------
// Multicasting





/**
 * Transform the stream into multicast stream.  That means that many subscribers
 * to the stream will not cause multiple invocations of the internal machinery.
 * @returns {Stream} new stream which will multicast events to all observers.
 */
__WEBPACK_IMPORTED_MODULE_0__Stream__["a" /* default */].prototype.multicast = function () {
  return __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_36__most_multicast__["a" /* default */])(this)
}

// export the instance of the defaultScheduler for third-party libraries




// export an implementation of Task used internally for third-party libraries





/***/ }),
/* 99 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (immutable) */ __webpack_exports__["a"] = fromObservable;
/* unused harmony export ObservableSource */
/* unused harmony export SubscriberSink */
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__Stream__ = __webpack_require__(0);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__disposable_dispose__ = __webpack_require__(1);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__source_tryEvent__ = __webpack_require__(13);
/** @license MIT License (c) copyright 2010-2016 original author or authors */
/** @author Brian Cavalier */
/** @author John Hann */





function fromObservable (observable) {
  return new __WEBPACK_IMPORTED_MODULE_0__Stream__["a" /* default */](new ObservableSource(observable))
}

function ObservableSource (observable) {
  this.observable = observable
}

ObservableSource.prototype.run = function (sink, scheduler) {
  var sub = this.observable.subscribe(new SubscriberSink(sink, scheduler))
  if (typeof sub === 'function') {
    return __WEBPACK_IMPORTED_MODULE_1__disposable_dispose__["f" /* create */](sub)
  } else if (sub && typeof sub.unsubscribe === 'function') {
    return __WEBPACK_IMPORTED_MODULE_1__disposable_dispose__["f" /* create */](unsubscribe, sub)
  }

  throw new TypeError('Observable returned invalid subscription ' + String(sub))
}

function SubscriberSink (sink, scheduler) {
  this.sink = sink
  this.scheduler = scheduler
}

SubscriberSink.prototype.next = function (x) {
  __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_2__source_tryEvent__["a" /* tryEvent */])(this.scheduler.now(), x, this.sink)
}

SubscriberSink.prototype.complete = function (x) {
  __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_2__source_tryEvent__["b" /* tryEnd */])(this.scheduler.now(), x, this.sink)
}

SubscriberSink.prototype.error = function (e) {
  this.sink.error(this.scheduler.now(), e)
}

function unsubscribe (subscription) {
  return subscription.unsubscribe()
}


/***/ }),
/* 100 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (immutable) */ __webpack_exports__["a"] = getObservable;
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_symbol_observable__ = __webpack_require__(49);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_symbol_observable___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_0_symbol_observable__);
/** @license MIT License (c) copyright 2010-2016 original author or authors */
/** @author Brian Cavalier */
/** @author John Hann */



function getObservable (o) { // eslint-disable-line complexity
  var obs = null
  if (o) {
  // Access foreign method only once
    var method = o[__WEBPACK_IMPORTED_MODULE_0_symbol_observable___default.a]
    if (typeof method === 'function') {
      obs = method.call(o)
      if (!(obs && typeof obs.subscribe === 'function')) {
        throw new TypeError('invalid observable ' + obs)
      }
    }
  }

  return obs
}


/***/ }),
/* 101 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (immutable) */ __webpack_exports__["a"] = subscribe;
/* unused harmony export SubscribeObserver */
/* unused harmony export Subscription */
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__scheduler_defaultScheduler__ = __webpack_require__(24);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__disposable_dispose__ = __webpack_require__(1);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__fatalError__ = __webpack_require__(21);
/** @license MIT License (c) copyright 2010-2016 original author or authors */
/** @author Brian Cavalier */
/** @author John Hann */





function subscribe (subscriber, stream) {
  if (Object(subscriber) !== subscriber) {
    throw new TypeError('subscriber must be an object')
  }

  var disposable = __WEBPACK_IMPORTED_MODULE_1__disposable_dispose__["e" /* settable */]()
  var observer = new SubscribeObserver(__WEBPACK_IMPORTED_MODULE_2__fatalError__["a" /* default */], subscriber, disposable)

  disposable.setDisposable(stream.source.run(observer, __WEBPACK_IMPORTED_MODULE_0__scheduler_defaultScheduler__["a" /* default */]))

  return new Subscription(disposable)
}

function SubscribeObserver (fatalError, subscriber, disposable) {
  this.fatalError = fatalError
  this.subscriber = subscriber
  this.disposable = disposable
}

SubscribeObserver.prototype.event = function (t, x) {
  if (!this.disposable.disposed && typeof this.subscriber.next === 'function') {
    this.subscriber.next(x)
  }
}

SubscribeObserver.prototype.end = function (t, x) {
  if (!this.disposable.disposed) {
    var s = this.subscriber
    doDispose(this.fatalError, s, s.complete, s.error, this.disposable, x)
  }
}

SubscribeObserver.prototype.error = function (t, e) {
  var s = this.subscriber
  doDispose(this.fatalError, s, s.error, s.error, this.disposable, e)
}

function Subscription (disposable) {
  this.disposable = disposable
}

Subscription.prototype.unsubscribe = function () {
  this.disposable.dispose()
}

function doDispose (fatal, subscriber, complete, error, disposable, x) {
  Promise.resolve(disposable.dispose()).then(function () {
    if (typeof complete === 'function') {
      complete.call(subscriber, x)
    }
  }).catch(function (e) {
    if (typeof error === 'function') {
      error.call(subscriber, e)
    }
  }).catch(fatal)
}


/***/ }),
/* 102 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (immutable) */ __webpack_exports__["a"] = ClockTimer;
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__task__ = __webpack_require__(26);
/** @license MIT License (c) copyright 2010-2016 original author or authors */
/** @author Brian Cavalier */
/** @author John Hann */



/*global setTimeout, clearTimeout*/

function ClockTimer () {}

ClockTimer.prototype.now = Date.now

ClockTimer.prototype.setTimer = function (f, dt) {
  return dt <= 0 ? runAsap(f) : setTimeout(f, dt)
}

ClockTimer.prototype.clearTimer = function (t) {
  return t instanceof Asap ? t.cancel() : clearTimeout(t)
}

function Asap (f) {
  this.f = f
  this.active = true
}

Asap.prototype.run = function () {
  return this.active && this.f()
}

Asap.prototype.error = function (e) {
  throw e
}

Asap.prototype.cancel = function () {
  this.active = false
}

function runAsap (f) {
  var task = new Asap(f)
  __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_0__task__["a" /* defer */])(task)
  return task
}


/***/ }),
/* 103 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (immutable) */ __webpack_exports__["a"] = ScheduledTask;
/** @license MIT License (c) copyright 2010-2016 original author or authors */
/** @author Brian Cavalier */
/** @author John Hann */

function ScheduledTask (delay, period, task, scheduler) {
  this.time = delay
  this.period = period
  this.task = task
  this.scheduler = scheduler
  this.active = true
}

ScheduledTask.prototype.run = function () {
  return this.task.run(this.time)
}

ScheduledTask.prototype.error = function (e) {
  return this.task.error(this.time, e)
}

ScheduledTask.prototype.dispose = function () {
  this.scheduler.cancel(this)
  return this.task.dispose()
}


/***/ }),
/* 104 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (immutable) */ __webpack_exports__["a"] = Scheduler;
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__ScheduledTask__ = __webpack_require__(103);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__task__ = __webpack_require__(26);
/** @license MIT License (c) copyright 2010-2016 original author or authors */
/** @author Brian Cavalier */
/** @author John Hann */




function Scheduler (timer, timeline) {
  this.timer = timer
  this.timeline = timeline

  this._timer = null
  this._nextArrival = Infinity

  var self = this
  this._runReadyTasksBound = function () {
    self._runReadyTasks(self.now())
  }
}

Scheduler.prototype.now = function () {
  return this.timer.now()
}

Scheduler.prototype.asap = function (task) {
  return this.schedule(0, -1, task)
}

Scheduler.prototype.delay = function (delay, task) {
  return this.schedule(delay, -1, task)
}

Scheduler.prototype.periodic = function (period, task) {
  return this.schedule(0, period, task)
}

Scheduler.prototype.schedule = function (delay, period, task) {
  var now = this.now()
  var st = new __WEBPACK_IMPORTED_MODULE_0__ScheduledTask__["a" /* default */](now + Math.max(0, delay), period, task, this)

  this.timeline.add(st)
  this._scheduleNextRun(now)
  return st
}

Scheduler.prototype.cancel = function (task) {
  task.active = false
  if (this.timeline.remove(task)) {
    this._reschedule()
  }
}

Scheduler.prototype.cancelAll = function (f) {
  this.timeline.removeAll(f)
  this._reschedule()
}

Scheduler.prototype._reschedule = function () {
  if (this.timeline.isEmpty()) {
    this._unschedule()
  } else {
    this._scheduleNextRun(this.now())
  }
}

Scheduler.prototype._unschedule = function () {
  this.timer.clearTimer(this._timer)
  this._timer = null
}

Scheduler.prototype._scheduleNextRun = function (now) { // eslint-disable-line complexity
  if (this.timeline.isEmpty()) {
    return
  }

  var nextArrival = this.timeline.nextArrival()

  if (this._timer === null) {
    this._scheduleNextArrival(nextArrival, now)
  } else if (nextArrival < this._nextArrival) {
    this._unschedule()
    this._scheduleNextArrival(nextArrival, now)
  }
}

Scheduler.prototype._scheduleNextArrival = function (nextArrival, now) {
  this._nextArrival = nextArrival
  var delay = Math.max(0, nextArrival - now)
  this._timer = this.timer.setTimer(this._runReadyTasksBound, delay)
}

Scheduler.prototype._runReadyTasks = function (now) {
  this._timer = null
  this.timeline.runTasks(now, __WEBPACK_IMPORTED_MODULE_1__task__["b" /* runTask */])
  this._scheduleNextRun(this.now())
}


/***/ }),
/* 105 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (immutable) */ __webpack_exports__["a"] = Timeline;
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__most_prelude__ = __webpack_require__(4);
/** @license MIT License (c) copyright 2010-2016 original author or authors */
/** @author Brian Cavalier */
/** @author John Hann */



function Timeline () {
  this.tasks = []
}

Timeline.prototype.nextArrival = function () {
  return this.isEmpty() ? Infinity : this.tasks[0].time
}

Timeline.prototype.isEmpty = function () {
  return this.tasks.length === 0
}

Timeline.prototype.add = function (st) {
  insertByTime(st, this.tasks)
}

Timeline.prototype.remove = function (st) {
  var i = binarySearch(st.time, this.tasks)

  if (i >= 0 && i < this.tasks.length) {
    var at = __WEBPACK_IMPORTED_MODULE_0__most_prelude__["d" /* findIndex */](st, this.tasks[i].events)
    if (at >= 0) {
      this.tasks[i].events.splice(at, 1)
      return true
    }
  }

  return false
}

Timeline.prototype.removeAll = function (f) {
  for (var i = 0, l = this.tasks.length; i < l; ++i) {
    removeAllFrom(f, this.tasks[i])
  }
}

Timeline.prototype.runTasks = function (t, runTask) {
  var tasks = this.tasks
  var l = tasks.length
  var i = 0

  while (i < l && tasks[i].time <= t) {
    ++i
  }

  this.tasks = tasks.slice(i)

  // Run all ready tasks
  for (var j = 0; j < i; ++j) {
    this.tasks = runTasks(runTask, tasks[j], this.tasks)
  }
}

function runTasks (runTask, timeslot, tasks) { // eslint-disable-line complexity
  var events = timeslot.events
  for (var i = 0; i < events.length; ++i) {
    var task = events[i]

    if (task.active) {
      runTask(task)

      // Reschedule periodic repeating tasks
      // Check active again, since a task may have canceled itself
      if (task.period >= 0 && task.active) {
        task.time = task.time + task.period
        insertByTime(task, tasks)
      }
    }
  }

  return tasks
}

function insertByTime (task, timeslots) { // eslint-disable-line complexity
  var l = timeslots.length

  if (l === 0) {
    timeslots.push(newTimeslot(task.time, [task]))
    return
  }

  var i = binarySearch(task.time, timeslots)

  if (i >= l) {
    timeslots.push(newTimeslot(task.time, [task]))
  } else if (task.time === timeslots[i].time) {
    timeslots[i].events.push(task)
  } else {
    timeslots.splice(i, 0, newTimeslot(task.time, [task]))
  }
}

function removeAllFrom (f, timeslot) {
  timeslot.events = __WEBPACK_IMPORTED_MODULE_0__most_prelude__["e" /* removeAll */](f, timeslot.events)
}

function binarySearch (t, sortedArray) { // eslint-disable-line complexity
  var lo = 0
  var hi = sortedArray.length
  var mid, y

  while (lo < hi) {
    mid = Math.floor((lo + hi) / 2)
    y = sortedArray[mid]

    if (t === y.time) {
      return mid
    } else if (t < y.time) {
      hi = mid
    } else {
      lo = mid + 1
    }
  }
  return hi
}

function newTimeslot (t, events) {
  return { time: t, events: events }
}


/***/ }),
/* 106 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (immutable) */ __webpack_exports__["a"] = DeferredSink;
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__task__ = __webpack_require__(26);
/** @license MIT License (c) copyright 2010-2016 original author or authors */
/** @author Brian Cavalier */
/** @author John Hann */



function DeferredSink (sink) {
  this.sink = sink
  this.events = []
  this.active = true
}

DeferredSink.prototype.event = function (t, x) {
  if (!this.active) {
    return
  }

  if (this.events.length === 0) {
    __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_0__task__["a" /* defer */])(new PropagateAllTask(this.sink, t, this.events))
  }

  this.events.push({ time: t, value: x })
}

DeferredSink.prototype.end = function (t, x) {
  if (!this.active) {
    return
  }

  this._end(new EndTask(t, x, this.sink))
}

DeferredSink.prototype.error = function (t, e) {
  this._end(new ErrorTask(t, e, this.sink))
}

DeferredSink.prototype._end = function (task) {
  this.active = false
  __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_0__task__["a" /* defer */])(task)
}

function PropagateAllTask (sink, time, events) {
  this.sink = sink
  this.events = events
  this.time = time
}

PropagateAllTask.prototype.run = function () {
  var events = this.events
  var sink = this.sink
  var event

  for (var i = 0, l = events.length; i < l; ++i) {
    event = events[i]
    this.time = event.time
    sink.event(event.time, event.value)
  }

  events.length = 0
}

PropagateAllTask.prototype.error = function (e) {
  this.sink.error(this.time, e)
}

function EndTask (t, x, sink) {
  this.time = t
  this.value = x
  this.sink = sink
}

EndTask.prototype.run = function () {
  this.sink.end(this.time, this.value)
}

EndTask.prototype.error = function (e) {
  this.sink.error(this.time, e)
}

function ErrorTask (t, e, sink) {
  this.time = t
  this.value = e
  this.sink = sink
}

ErrorTask.prototype.run = function () {
  this.sink.error(this.time, this.value)
}

ErrorTask.prototype.error = function (e) {
  throw e
}


/***/ }),
/* 107 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (immutable) */ __webpack_exports__["a"] = SafeSink;
/** @license MIT License (c) copyright 2010-2016 original author or authors */
/** @author Brian Cavalier */
/** @author John Hann */

function SafeSink (sink) {
  this.sink = sink
  this.active = true
}

SafeSink.prototype.event = function (t, x) {
  if (!this.active) {
    return
  }
  this.sink.event(t, x)
}

SafeSink.prototype.end = function (t, x) {
  if (!this.active) {
    return
  }
  this.disable()
  this.sink.end(t, x)
}

SafeSink.prototype.error = function (t, e) {
  this.disable()
  this.sink.error(t, e)
}

SafeSink.prototype.disable = function () {
  this.active = false
  return this.sink
}


/***/ }),
/* 108 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (immutable) */ __webpack_exports__["a"] = EventEmitterSource;
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__sink_DeferredSink__ = __webpack_require__(106);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__disposable_dispose__ = __webpack_require__(1);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__tryEvent__ = __webpack_require__(13);
/** @license MIT License (c) copyright 2010-2016 original author or authors */
/** @author Brian Cavalier */
/** @author John Hann */





function EventEmitterSource (event, source) {
  this.event = event
  this.source = source
}

EventEmitterSource.prototype.run = function (sink, scheduler) {
  // NOTE: Because EventEmitter allows events in the same call stack as
  // a listener is added, use a DeferredSink to buffer events
  // until the stack clears, then propagate.  This maintains most.js's
  // invariant that no event will be delivered in the same call stack
  // as an observer begins observing.
  var dsink = new __WEBPACK_IMPORTED_MODULE_0__sink_DeferredSink__["a" /* default */](sink)

  function addEventVariadic (a) {
    var l = arguments.length
    if (l > 1) {
      var arr = new Array(l)
      for (var i = 0; i < l; ++i) {
        arr[i] = arguments[i]
      }
      __WEBPACK_IMPORTED_MODULE_2__tryEvent__["a" /* tryEvent */](scheduler.now(), arr, dsink)
    } else {
      __WEBPACK_IMPORTED_MODULE_2__tryEvent__["a" /* tryEvent */](scheduler.now(), a, dsink)
    }
  }

  this.source.addListener(this.event, addEventVariadic)

  return __WEBPACK_IMPORTED_MODULE_1__disposable_dispose__["f" /* create */](disposeEventEmitter, { target: this, addEvent: addEventVariadic })
}

function disposeEventEmitter (info) {
  var target = info.target
  target.source.removeListener(target.event, info.addEvent)
}


/***/ }),
/* 109 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (immutable) */ __webpack_exports__["a"] = EventTargetSource;
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__disposable_dispose__ = __webpack_require__(1);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__tryEvent__ = __webpack_require__(13);
/** @license MIT License (c) copyright 2010-2016 original author or authors */
/** @author Brian Cavalier */
/** @author John Hann */




function EventTargetSource (event, source, capture) {
  this.event = event
  this.source = source
  this.capture = capture
}

EventTargetSource.prototype.run = function (sink, scheduler) {
  function addEvent (e) {
    __WEBPACK_IMPORTED_MODULE_1__tryEvent__["a" /* tryEvent */](scheduler.now(), e, sink)
  }

  this.source.addEventListener(this.event, addEvent, this.capture)

  return __WEBPACK_IMPORTED_MODULE_0__disposable_dispose__["f" /* create */](disposeEventTarget,
    { target: this, addEvent: addEvent })
}

function disposeEventTarget (info) {
  var target = info.target
  target.source.removeEventListener(target.event, info.addEvent, target.capture)
}


/***/ }),
/* 110 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (immutable) */ __webpack_exports__["a"] = from;
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__Stream__ = __webpack_require__(0);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__fromArray__ = __webpack_require__(111);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__iterable__ = __webpack_require__(42);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3__fromIterable__ = __webpack_require__(113);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_4__observable_getObservable__ = __webpack_require__(100);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_5__observable_fromObservable__ = __webpack_require__(99);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_6__most_prelude__ = __webpack_require__(4);
/** @license MIT License (c) copyright 2010-2016 original author or authors */
/** @author Brian Cavalier */
/** @author John Hann */









function from (a) { // eslint-disable-line complexity
  if (a instanceof __WEBPACK_IMPORTED_MODULE_0__Stream__["a" /* default */]) {
    return a
  }

  var observable = __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_4__observable_getObservable__["a" /* default */])(a)
  if (observable != null) {
    return __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_5__observable_fromObservable__["a" /* fromObservable */])(observable)
  }

  if (Array.isArray(a) || __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_6__most_prelude__["o" /* isArrayLike */])(a)) {
    return __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_1__fromArray__["a" /* fromArray */])(a)
  }

  if (__webpack_require__.i(__WEBPACK_IMPORTED_MODULE_2__iterable__["a" /* isIterable */])(a)) {
    return __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_3__fromIterable__["a" /* fromIterable */])(a)
  }

  throw new TypeError('from(x) must be observable, iterable, or array-like: ' + a)
}


/***/ }),
/* 111 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (immutable) */ __webpack_exports__["a"] = fromArray;
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__Stream__ = __webpack_require__(0);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__scheduler_PropagateTask__ = __webpack_require__(6);
/** @license MIT License (c) copyright 2010-2016 original author or authors */
/** @author Brian Cavalier */
/** @author John Hann */




function fromArray (a) {
  return new __WEBPACK_IMPORTED_MODULE_0__Stream__["a" /* default */](new ArraySource(a))
}

function ArraySource (a) {
  this.array = a
}

ArraySource.prototype.run = function (sink, scheduler) {
  return scheduler.asap(new __WEBPACK_IMPORTED_MODULE_1__scheduler_PropagateTask__["a" /* default */](runProducer, this.array, sink))
}

function runProducer (t, array, sink) {
  for (var i = 0, l = array.length; i < l && this.active; ++i) {
    sink.event(t, array[i])
  }

  this.active && sink.end(t)
}


/***/ }),
/* 112 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (immutable) */ __webpack_exports__["a"] = fromEvent;
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__Stream__ = __webpack_require__(0);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__EventTargetSource__ = __webpack_require__(109);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__EventEmitterSource__ = __webpack_require__(108);
/** @license MIT License (c) copyright 2010-2016 original author or authors */
/** @author Brian Cavalier */
/** @author John Hann */





/**
 * Create a stream from an EventTarget, such as a DOM Node, or EventEmitter.
 * @param {String} event event type name, e.g. 'click'
 * @param {EventTarget|EventEmitter} source EventTarget or EventEmitter
 * @param {*?} capture for DOM events, whether to use
 *  capturing--passed as 3rd parameter to addEventListener.
 * @returns {Stream} stream containing all events of the specified type
 * from the source.
 */
function fromEvent (event, source, capture) { // eslint-disable-line complexity
  var s

  if (typeof source.addEventListener === 'function' && typeof source.removeEventListener === 'function') {
    if (arguments.length < 3) {
      capture = false
    }

    s = new __WEBPACK_IMPORTED_MODULE_1__EventTargetSource__["a" /* default */](event, source, capture)
  } else if (typeof source.addListener === 'function' && typeof source.removeListener === 'function') {
    s = new __WEBPACK_IMPORTED_MODULE_2__EventEmitterSource__["a" /* default */](event, source)
  } else {
    throw new Error('source must support addEventListener/removeEventListener or addListener/removeListener')
  }

  return new __WEBPACK_IMPORTED_MODULE_0__Stream__["a" /* default */](s)
}


/***/ }),
/* 113 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (immutable) */ __webpack_exports__["a"] = fromIterable;
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__Stream__ = __webpack_require__(0);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__iterable__ = __webpack_require__(42);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__scheduler_PropagateTask__ = __webpack_require__(6);
/** @license MIT License (c) copyright 2010-2016 original author or authors */
/** @author Brian Cavalier */
/** @author John Hann */





function fromIterable (iterable) {
  return new __WEBPACK_IMPORTED_MODULE_0__Stream__["a" /* default */](new IterableSource(iterable))
}

function IterableSource (iterable) {
  this.iterable = iterable
}

IterableSource.prototype.run = function (sink, scheduler) {
  return scheduler.asap(new __WEBPACK_IMPORTED_MODULE_2__scheduler_PropagateTask__["a" /* default */](runProducer, __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_1__iterable__["b" /* getIterator */])(this.iterable), sink))
}

function runProducer (t, iterator, sink) {
  var r = iterator.next()

  while (!r.done && this.active) {
    sink.event(t, r.value)
    r = iterator.next()
  }

  sink.end(t, r.value)
}


/***/ }),
/* 114 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (immutable) */ __webpack_exports__["a"] = generate;
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__Stream__ = __webpack_require__(0);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__most_prelude__ = __webpack_require__(4);
/** @license MIT License (c) copyright 2010-2014 original author or authors */
/** @author Brian Cavalier */
/** @author John Hann */




/**
 * Compute a stream using an *async* generator, which yields promises
 * to control event times.
 * @param f
 * @returns {Stream}
 */
function generate (f /*, ...args */) {
  return new __WEBPACK_IMPORTED_MODULE_0__Stream__["a" /* default */](new GenerateSource(f, __WEBPACK_IMPORTED_MODULE_1__most_prelude__["c" /* tail */](arguments)))
}

function GenerateSource (f, args) {
  this.f = f
  this.args = args
}

GenerateSource.prototype.run = function (sink, scheduler) {
  return new Generate(this.f.apply(void 0, this.args), sink, scheduler)
}

function Generate (iterator, sink, scheduler) {
  this.iterator = iterator
  this.sink = sink
  this.scheduler = scheduler
  this.active = true

  var self = this
  function err (e) {
    self.sink.error(self.scheduler.now(), e)
  }

  Promise.resolve(this).then(next).catch(err)
}

function next (generate, x) {
  return generate.active ? handle(generate, generate.iterator.next(x)) : x
}

function handle (generate, result) {
  if (result.done) {
    return generate.sink.end(generate.scheduler.now(), result.value)
  }

  return Promise.resolve(result.value).then(function (x) {
    return emit(generate, x)
  }, function (e) {
    return error(generate, e)
  })
}

function emit (generate, x) {
  generate.sink.event(generate.scheduler.now(), x)
  return next(generate, x)
}

function error (generate, e) {
  return handle(generate, generate.iterator.throw(e))
}

Generate.prototype.dispose = function () {
  this.active = false
}


/***/ }),
/* 115 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (immutable) */ __webpack_exports__["a"] = iterate;
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__Stream__ = __webpack_require__(0);
/** @license MIT License (c) copyright 2010-2016 original author or authors */
/** @author Brian Cavalier */
/** @author John Hann */



/**
 * Compute a stream by iteratively calling f to produce values
 * Event times may be controlled by returning a Promise from f
 * @param {function(x:*):*|Promise<*>} f
 * @param {*} x initial value
 * @returns {Stream}
 */
function iterate (f, x) {
  return new __WEBPACK_IMPORTED_MODULE_0__Stream__["a" /* default */](new IterateSource(f, x))
}

function IterateSource (f, x) {
  this.f = f
  this.value = x
}

IterateSource.prototype.run = function (sink, scheduler) {
  return new Iterate(this.f, this.value, sink, scheduler)
}

function Iterate (f, initial, sink, scheduler) {
  this.f = f
  this.sink = sink
  this.scheduler = scheduler
  this.active = true

  var x = initial

  var self = this
  function err (e) {
    self.sink.error(self.scheduler.now(), e)
  }

  function start (iterate) {
    return stepIterate(iterate, x)
  }

  Promise.resolve(this).then(start).catch(err)
}

Iterate.prototype.dispose = function () {
  this.active = false
}

function stepIterate (iterate, x) {
  iterate.sink.event(iterate.scheduler.now(), x)

  if (!iterate.active) {
    return x
  }

  var f = iterate.f
  return Promise.resolve(f(x)).then(function (y) {
    return continueIterate(iterate, y)
  })
}

function continueIterate (iterate, x) {
  return !iterate.active ? iterate.value : stepIterate(iterate, x)
}


/***/ }),
/* 116 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (immutable) */ __webpack_exports__["a"] = periodic;
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__Stream__ = __webpack_require__(0);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__scheduler_PropagateTask__ = __webpack_require__(6);
/** @license MIT License (c) copyright 2010-2016 original author or authors */
/** @author Brian Cavalier */
/** @author John Hann */




/**
 * Create a stream that emits the current time periodically
 * @param {Number} period periodicity of events in millis
 * @param {*} deprecatedValue @deprecated value to emit each period
 * @returns {Stream} new stream that emits the current time every period
 */
function periodic (period, deprecatedValue) {
  return new __WEBPACK_IMPORTED_MODULE_0__Stream__["a" /* default */](new Periodic(period, deprecatedValue))
}

function Periodic (period, value) {
  this.period = period
  this.value = value
}

Periodic.prototype.run = function (sink, scheduler) {
  return scheduler.periodic(this.period, __WEBPACK_IMPORTED_MODULE_1__scheduler_PropagateTask__["a" /* default */].event(this.value, sink))
}


/***/ }),
/* 117 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (immutable) */ __webpack_exports__["a"] = unfold;
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__Stream__ = __webpack_require__(0);
/** @license MIT License (c) copyright 2010-2016 original author or authors */
/** @author Brian Cavalier */
/** @author John Hann */



/**
 * Compute a stream by unfolding tuples of future values from a seed value
 * Event times may be controlled by returning a Promise from f
 * @param {function(seed:*):{value:*, seed:*, done:boolean}|Promise<{value:*, seed:*, done:boolean}>} f unfolding function accepts
 *  a seed and returns a new tuple with a value, new seed, and boolean done flag.
 *  If tuple.done is true, the stream will end.
 * @param {*} seed seed value
 * @returns {Stream} stream containing all value of all tuples produced by the
 *  unfolding function.
 */
function unfold (f, seed) {
  return new __WEBPACK_IMPORTED_MODULE_0__Stream__["a" /* default */](new UnfoldSource(f, seed))
}

function UnfoldSource (f, seed) {
  this.f = f
  this.value = seed
}

UnfoldSource.prototype.run = function (sink, scheduler) {
  return new Unfold(this.f, this.value, sink, scheduler)
}

function Unfold (f, x, sink, scheduler) {
  this.f = f
  this.sink = sink
  this.scheduler = scheduler
  this.active = true

  var self = this
  function err (e) {
    self.sink.error(self.scheduler.now(), e)
  }

  function start (unfold) {
    return stepUnfold(unfold, x)
  }

  Promise.resolve(this).then(start).catch(err)
}

Unfold.prototype.dispose = function () {
  this.active = false
}

function stepUnfold (unfold, x) {
  var f = unfold.f
  return Promise.resolve(f(x)).then(function (tuple) {
    return continueUnfold(unfold, tuple)
  })
}

function continueUnfold (unfold, tuple) {
  if (tuple.done) {
    unfold.sink.end(unfold.scheduler.now(), tuple.value)
    return tuple.value
  }

  unfold.sink.event(unfold.scheduler.now(), tuple.value)

  if (!unfold.active) {
    return tuple.value
  }
  return stepUnfold(unfold, tuple.seed)
}


/***/ }),
/* 118 */
/***/ (function(module, exports) {

/**
 * Helpers.
 */

var s = 1000;
var m = s * 60;
var h = m * 60;
var d = h * 24;
var y = d * 365.25;

/**
 * Parse or format the given `val`.
 *
 * Options:
 *
 *  - `long` verbose formatting [false]
 *
 * @param {String|Number} val
 * @param {Object} [options]
 * @throws {Error} throw an error if val is not a non-empty string or a number
 * @return {String|Number}
 * @api public
 */

module.exports = function(val, options) {
  options = options || {};
  var type = typeof val;
  if (type === 'string' && val.length > 0) {
    return parse(val);
  } else if (type === 'number' && isNaN(val) === false) {
    return options.long ? fmtLong(val) : fmtShort(val);
  }
  throw new Error(
    'val is not a non-empty string or a valid number. val=' +
      JSON.stringify(val)
  );
};

/**
 * Parse the given `str` and return milliseconds.
 *
 * @param {String} str
 * @return {Number}
 * @api private
 */

function parse(str) {
  str = String(str);
  if (str.length > 100) {
    return;
  }
  var match = /^((?:\d+)?\.?\d+) *(milliseconds?|msecs?|ms|seconds?|secs?|s|minutes?|mins?|m|hours?|hrs?|h|days?|d|years?|yrs?|y)?$/i.exec(
    str
  );
  if (!match) {
    return;
  }
  var n = parseFloat(match[1]);
  var type = (match[2] || 'ms').toLowerCase();
  switch (type) {
    case 'years':
    case 'year':
    case 'yrs':
    case 'yr':
    case 'y':
      return n * y;
    case 'days':
    case 'day':
    case 'd':
      return n * d;
    case 'hours':
    case 'hour':
    case 'hrs':
    case 'hr':
    case 'h':
      return n * h;
    case 'minutes':
    case 'minute':
    case 'mins':
    case 'min':
    case 'm':
      return n * m;
    case 'seconds':
    case 'second':
    case 'secs':
    case 'sec':
    case 's':
      return n * s;
    case 'milliseconds':
    case 'millisecond':
    case 'msecs':
    case 'msec':
    case 'ms':
      return n;
    default:
      return undefined;
  }
}

/**
 * Short format for `ms`.
 *
 * @param {Number} ms
 * @return {String}
 * @api private
 */

function fmtShort(ms) {
  if (ms >= d) {
    return Math.round(ms / d) + 'd';
  }
  if (ms >= h) {
    return Math.round(ms / h) + 'h';
  }
  if (ms >= m) {
    return Math.round(ms / m) + 'm';
  }
  if (ms >= s) {
    return Math.round(ms / s) + 's';
  }
  return ms + 'ms';
}

/**
 * Long format for `ms`.
 *
 * @param {Number} ms
 * @return {String}
 * @api private
 */

function fmtLong(ms) {
  return plural(ms, d, 'day') ||
    plural(ms, h, 'hour') ||
    plural(ms, m, 'minute') ||
    plural(ms, s, 'second') ||
    ms + ' ms';
}

/**
 * Pluralization helper.
 */

function plural(ms, n, name) {
  if (ms < n) {
    return;
  }
  if (ms < n * 1.5) {
    return Math.floor(ms / n) + ' ' + name;
  }
  return Math.ceil(ms / n) + ' ' + name + 's';
}


/***/ }),
/* 119 */
/***/ (function(module, exports, __webpack_require__) {

/* WEBPACK VAR INJECTION */(function(global) {/**
 * JSON parse.
 *
 * @see Based on jQuery#parseJSON (MIT) and JSON2
 * @api private
 */

var rvalidchars = /^[\],:{}\s]*$/;
var rvalidescape = /\\(?:["\\\/bfnrt]|u[0-9a-fA-F]{4})/g;
var rvalidtokens = /"[^"\\\n\r]*"|true|false|null|-?\d+(?:\.\d*)?(?:[eE][+\-]?\d+)?/g;
var rvalidbraces = /(?:^|:|,)(?:\s*\[)+/g;
var rtrimLeft = /^\s+/;
var rtrimRight = /\s+$/;

module.exports = function parsejson(data) {
  if ('string' != typeof data || !data) {
    return null;
  }

  data = data.replace(rtrimLeft, '').replace(rtrimRight, '');

  // Attempt to parse using the native JSON parser first
  if (global.JSON && JSON.parse) {
    return JSON.parse(data);
  }

  if (rvalidchars.test(data.replace(rvalidescape, '@')
      .replace(rvalidtokens, ']')
      .replace(rvalidbraces, ''))) {
    return (new Function('return ' + data))();
  }
};
/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(3)))

/***/ }),
/* 120 */
/***/ (function(module, exports) {

// shim for using process in browser
var process = module.exports = {};

// cached from whatever global is present so that test runners that stub it
// don't break things.  But we need to wrap it in a try catch in case it is
// wrapped in strict mode code which doesn't define any globals.  It's inside a
// function because try/catches deoptimize in certain engines.

var cachedSetTimeout;
var cachedClearTimeout;

function defaultSetTimout() {
    throw new Error('setTimeout has not been defined');
}
function defaultClearTimeout () {
    throw new Error('clearTimeout has not been defined');
}
(function () {
    try {
        if (typeof setTimeout === 'function') {
            cachedSetTimeout = setTimeout;
        } else {
            cachedSetTimeout = defaultSetTimout;
        }
    } catch (e) {
        cachedSetTimeout = defaultSetTimout;
    }
    try {
        if (typeof clearTimeout === 'function') {
            cachedClearTimeout = clearTimeout;
        } else {
            cachedClearTimeout = defaultClearTimeout;
        }
    } catch (e) {
        cachedClearTimeout = defaultClearTimeout;
    }
} ())
function runTimeout(fun) {
    if (cachedSetTimeout === setTimeout) {
        //normal enviroments in sane situations
        return setTimeout(fun, 0);
    }
    // if setTimeout wasn't available but was latter defined
    if ((cachedSetTimeout === defaultSetTimout || !cachedSetTimeout) && setTimeout) {
        cachedSetTimeout = setTimeout;
        return setTimeout(fun, 0);
    }
    try {
        // when when somebody has screwed with setTimeout but no I.E. maddness
        return cachedSetTimeout(fun, 0);
    } catch(e){
        try {
            // When we are in I.E. but the script has been evaled so I.E. doesn't trust the global object when called normally
            return cachedSetTimeout.call(null, fun, 0);
        } catch(e){
            // same as above but when it's a version of I.E. that must have the global object for 'this', hopfully our context correct otherwise it will throw a global error
            return cachedSetTimeout.call(this, fun, 0);
        }
    }


}
function runClearTimeout(marker) {
    if (cachedClearTimeout === clearTimeout) {
        //normal enviroments in sane situations
        return clearTimeout(marker);
    }
    // if clearTimeout wasn't available but was latter defined
    if ((cachedClearTimeout === defaultClearTimeout || !cachedClearTimeout) && clearTimeout) {
        cachedClearTimeout = clearTimeout;
        return clearTimeout(marker);
    }
    try {
        // when when somebody has screwed with setTimeout but no I.E. maddness
        return cachedClearTimeout(marker);
    } catch (e){
        try {
            // When we are in I.E. but the script has been evaled so I.E. doesn't  trust the global object when called normally
            return cachedClearTimeout.call(null, marker);
        } catch (e){
            // same as above but when it's a version of I.E. that must have the global object for 'this', hopfully our context correct otherwise it will throw a global error.
            // Some versions of I.E. have different rules for clearTimeout vs setTimeout
            return cachedClearTimeout.call(this, marker);
        }
    }



}
var queue = [];
var draining = false;
var currentQueue;
var queueIndex = -1;

function cleanUpNextTick() {
    if (!draining || !currentQueue) {
        return;
    }
    draining = false;
    if (currentQueue.length) {
        queue = currentQueue.concat(queue);
    } else {
        queueIndex = -1;
    }
    if (queue.length) {
        drainQueue();
    }
}

function drainQueue() {
    if (draining) {
        return;
    }
    var timeout = runTimeout(cleanUpNextTick);
    draining = true;

    var len = queue.length;
    while(len) {
        currentQueue = queue;
        queue = [];
        while (++queueIndex < len) {
            if (currentQueue) {
                currentQueue[queueIndex].run();
            }
        }
        queueIndex = -1;
        len = queue.length;
    }
    currentQueue = null;
    draining = false;
    runClearTimeout(timeout);
}

process.nextTick = function (fun) {
    var args = new Array(arguments.length - 1);
    if (arguments.length > 1) {
        for (var i = 1; i < arguments.length; i++) {
            args[i - 1] = arguments[i];
        }
    }
    queue.push(new Item(fun, args));
    if (queue.length === 1 && !draining) {
        runTimeout(drainQueue);
    }
};

// v8 likes predictible objects
function Item(fun, array) {
    this.fun = fun;
    this.array = array;
}
Item.prototype.run = function () {
    this.fun.apply(null, this.array);
};
process.title = 'browser';
process.browser = true;
process.env = {};
process.argv = [];
process.version = ''; // empty string to avoid regexp issues
process.versions = {};

function noop() {}

process.on = noop;
process.addListener = noop;
process.once = noop;
process.off = noop;
process.removeListener = noop;
process.removeAllListeners = noop;
process.emit = noop;
process.prependListener = noop;
process.prependOnceListener = noop;

process.listeners = function (name) { return [] }

process.binding = function (name) {
    throw new Error('process.binding is not supported');
};

process.cwd = function () { return '/' };
process.chdir = function (dir) {
    throw new Error('process.chdir is not supported');
};
process.umask = function() { return 0; };


/***/ }),
/* 121 */
/***/ (function(module, exports, __webpack_require__) {


/**
 * Module dependencies.
 */

var url = __webpack_require__(122);
var parser = __webpack_require__(27);
var Manager = __webpack_require__(45);
var debug = __webpack_require__(5)('socket.io-client');

/**
 * Module exports.
 */

module.exports = exports = lookup;

/**
 * Managers cache.
 */

var cache = exports.managers = {};

/**
 * Looks up an existing `Manager` for multiplexing.
 * If the user summons:
 *
 *   `io('http://localhost/a');`
 *   `io('http://localhost/b');`
 *
 * We reuse the existing instance based on same scheme/port/host,
 * and we initialize sockets for each namespace.
 *
 * @api public
 */

function lookup (uri, opts) {
  if (typeof uri === 'object') {
    opts = uri;
    uri = undefined;
  }

  opts = opts || {};

  var parsed = url(uri);
  var source = parsed.source;
  var id = parsed.id;
  var path = parsed.path;
  var sameNamespace = cache[id] && path in cache[id].nsps;
  var newConnection = opts.forceNew || opts['force new connection'] ||
                      false === opts.multiplex || sameNamespace;

  var io;

  if (newConnection) {
    debug('ignoring socket cache for %s', source);
    io = Manager(source, opts);
  } else {
    if (!cache[id]) {
      debug('new io instance for %s', source);
      cache[id] = Manager(source, opts);
    }
    io = cache[id];
  }
  if (parsed.query && !opts.query) {
    opts.query = parsed.query;
  }
  return io.socket(parsed.path, opts);
}

/**
 * Protocol version.
 *
 * @api public
 */

exports.protocol = parser.protocol;

/**
 * `connect`.
 *
 * @param {String} uri
 * @api public
 */

exports.connect = lookup;

/**
 * Expose constructors for standalone build.
 *
 * @api public
 */

exports.Manager = __webpack_require__(45);
exports.Socket = __webpack_require__(47);


/***/ }),
/* 122 */
/***/ (function(module, exports, __webpack_require__) {

/* WEBPACK VAR INJECTION */(function(global) {
/**
 * Module dependencies.
 */

var parseuri = __webpack_require__(44);
var debug = __webpack_require__(5)('socket.io-client:url');

/**
 * Module exports.
 */

module.exports = url;

/**
 * URL parser.
 *
 * @param {String} url
 * @param {Object} An object meant to mimic window.location.
 *                 Defaults to window.location.
 * @api public
 */

function url (uri, loc) {
  var obj = uri;

  // default to window.location
  loc = loc || global.location;
  if (null == uri) uri = loc.protocol + '//' + loc.host;

  // relative path support
  if ('string' === typeof uri) {
    if ('/' === uri.charAt(0)) {
      if ('/' === uri.charAt(1)) {
        uri = loc.protocol + uri;
      } else {
        uri = loc.host + uri;
      }
    }

    if (!/^(https?|wss?):\/\//.test(uri)) {
      debug('protocol-less url %s', uri);
      if ('undefined' !== typeof loc) {
        uri = loc.protocol + '//' + uri;
      } else {
        uri = 'https://' + uri;
      }
    }

    // parse
    debug('parse %s', uri);
    obj = parseuri(uri);
  }

  // make sure we treat `localhost:80` and `localhost` equally
  if (!obj.port) {
    if (/^(http|ws)$/.test(obj.protocol)) {
      obj.port = '80';
    } else if (/^(http|ws)s$/.test(obj.protocol)) {
      obj.port = '443';
    }
  }

  obj.path = obj.path || '/';

  var ipv6 = obj.host.indexOf(':') !== -1;
  var host = ipv6 ? '[' + obj.host + ']' : obj.host;

  // define unique id
  obj.id = obj.protocol + '://' + host + ':' + obj.port;
  // define href
  obj.href = obj.protocol + '://' + host + (loc && loc.port === obj.port ? '' : (':' + obj.port));

  return obj;
}

/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(3)))

/***/ }),
/* 123 */
/***/ (function(module, exports, __webpack_require__) {

/* WEBPACK VAR INJECTION */(function(global) {/*global Blob,File*/

/**
 * Module requirements
 */

var isArray = __webpack_require__(37);
var isBuf = __webpack_require__(48);
var toString = Object.prototype.toString;
var withNativeBlob = typeof global.Blob === 'function' || toString.call(global.Blob) === '[object BlobConstructor]';
var withNativeFile = typeof global.File === 'function' || toString.call(global.File) === '[object FileConstructor]';

/**
 * Replaces every Buffer | ArrayBuffer in packet with a numbered placeholder.
 * Anything with blobs or files should be fed through removeBlobs before coming
 * here.
 *
 * @param {Object} packet - socket.io event packet
 * @return {Object} with deconstructed packet and list of buffers
 * @api public
 */

exports.deconstructPacket = function(packet) {
  var buffers = [];
  var packetData = packet.data;
  var pack = packet;
  pack.data = _deconstructPacket(packetData, buffers);
  pack.attachments = buffers.length; // number of binary 'attachments'
  return {packet: pack, buffers: buffers};
};

function _deconstructPacket(data, buffers) {
  if (!data) return data;

  if (isBuf(data)) {
    var placeholder = { _placeholder: true, num: buffers.length };
    buffers.push(data);
    return placeholder;
  } else if (isArray(data)) {
    var newData = new Array(data.length);
    for (var i = 0; i < data.length; i++) {
      newData[i] = _deconstructPacket(data[i], buffers);
    }
    return newData;
  } else if (typeof data === 'object' && !(data instanceof Date)) {
    var newData = {};
    for (var key in data) {
      newData[key] = _deconstructPacket(data[key], buffers);
    }
    return newData;
  }
  return data;
}

/**
 * Reconstructs a binary packet from its placeholder packet and buffers
 *
 * @param {Object} packet - event packet with placeholders
 * @param {Array} buffers - binary buffers to put in placeholder positions
 * @return {Object} reconstructed packet
 * @api public
 */

exports.reconstructPacket = function(packet, buffers) {
  packet.data = _reconstructPacket(packet.data, buffers);
  packet.attachments = undefined; // no longer useful
  return packet;
};

function _reconstructPacket(data, buffers) {
  if (!data) return data;

  if (data && data._placeholder) {
    return buffers[data.num]; // appropriate buffer (should be natural order anyway)
  } else if (isArray(data)) {
    for (var i = 0; i < data.length; i++) {
      data[i] = _reconstructPacket(data[i], buffers);
    }
  } else if (typeof data === 'object') {
    for (var key in data) {
      data[key] = _reconstructPacket(data[key], buffers);
    }
  }

  return data;
}

/**
 * Asynchronously removes Blobs or Files from data via
 * FileReader's readAsArrayBuffer method. Used before encoding
 * data as msgpack. Calls callback with the blobless data.
 *
 * @param {Object} data
 * @param {Function} callback
 * @api private
 */

exports.removeBlobs = function(data, callback) {
  function _removeBlobs(obj, curKey, containingObject) {
    if (!obj) return obj;

    // convert any blob
    if ((withNativeBlob && obj instanceof Blob) ||
        (withNativeFile && obj instanceof File)) {
      pendingBlobs++;

      // async filereader
      var fileReader = new FileReader();
      fileReader.onload = function() { // this.result == arraybuffer
        if (containingObject) {
          containingObject[curKey] = this.result;
        }
        else {
          bloblessData = this.result;
        }

        // if nothing pending its callback time
        if(! --pendingBlobs) {
          callback(bloblessData);
        }
      };

      fileReader.readAsArrayBuffer(obj); // blob -> arraybuffer
    } else if (isArray(obj)) { // handle array
      for (var i = 0; i < obj.length; i++) {
        _removeBlobs(obj[i], i, obj);
      }
    } else if (typeof obj === 'object' && !isBuf(obj)) { // and object
      for (var key in obj) {
        _removeBlobs(obj[key], key, obj);
      }
    }
  }

  var pendingBlobs = 0;
  var bloblessData = data;
  _removeBlobs(bloblessData);
  if (!pendingBlobs) {
    callback(bloblessData);
  }
};

/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(3)))

/***/ }),
/* 124 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
/* WEBPACK VAR INJECTION */(function(global, module) {

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _ponyfill = __webpack_require__(125);

var _ponyfill2 = _interopRequireDefault(_ponyfill);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

var root; /* global window */


if (typeof self !== 'undefined') {
  root = self;
} else if (typeof window !== 'undefined') {
  root = window;
} else if (typeof global !== 'undefined') {
  root = global;
} else if (true) {
  root = module;
} else {
  root = Function('return this')();
}

var result = (0, _ponyfill2['default'])(root);
exports['default'] = result;
/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(3), __webpack_require__(50)(module)))

/***/ }),
/* 125 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
	value: true
});
exports['default'] = symbolObservablePonyfill;
function symbolObservablePonyfill(root) {
	var result;
	var _Symbol = root.Symbol;

	if (typeof _Symbol === 'function') {
		if (_Symbol.observable) {
			result = _Symbol.observable;
		} else {
			result = _Symbol('observable');
			_Symbol.observable = result;
		}
	} else {
		result = '@@observable';
	}

	return result;
};

/***/ }),
/* 126 */
/***/ (function(module, exports) {

module.exports = toArray

function toArray(list, index) {
    var array = []

    index = index || 0

    for (var i = index || 0; i < list.length; i++) {
        array[i - index] = list[i]
    }

    return array
}


/***/ }),
/* 127 */
/***/ (function(module, exports) {

/* (ignored) */

/***/ })
/******/ ]);