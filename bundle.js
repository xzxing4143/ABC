/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};

/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {

/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId])
/******/ 			return installedModules[moduleId].exports;

/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			exports: {},
/******/ 			id: moduleId,
/******/ 			loaded: false
/******/ 		};

/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);

/******/ 		// Flag the module as loaded
/******/ 		module.loaded = true;

/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}


/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;

/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;

/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";

/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(0);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";

	var _OriginCalculate = __webpack_require__(1);

	var _EventProxy = __webpack_require__(2);

	var cal = new _OriginCalculate.OriginCalculate("小写");
	document.write(cal.getName());
	var map = new Map();
	map.set("name", "xiaoxie");
	map.set("value", "22");
	for (var _ref in map) {
	    var key = _ref.key;
	    var value = _ref.value;

	    document.write(key + '====' + value);
	}

/***/ },
/* 1 */
/***/ function(module, exports) {

	"use strict";

	Object.defineProperty(exports, "__esModule", {
	  value: true
	});

	var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

	var OriginCalculate = function () {
	  function OriginCalculate(name) {
	    _classCallCheck(this, OriginCalculate);

	    this.name = name;
	  }

	  _createClass(OriginCalculate, [{
	    key: "getName",
	    value: function getName() {
	      return this.name;
	    }
	  }]);

	  return OriginCalculate;
	}();

	exports.OriginCalculate = OriginCalculate;

/***/ },
/* 2 */
/***/ function(module, exports, __webpack_require__) {

	/* WEBPACK VAR INJECTION */(function(setImmediate, process) {"use strict";

	Object.defineProperty(exports, "__esModule", {
	  value: true
	});
	/**
	 * 事件代理工具类
	 */
	var EventProxy = ABC.EventProxy = function () {
	  var debug = function debug() {};
	  var SLICE = Array.prototype.slice;
	  var CONCAT = Array.prototype.concat;
	  var ALL_EVENT = "__all__";
	  var EventProxy = function EventProxy() {
	    if (!(this instanceof EventProxy)) {
	      return new EventProxy();
	    }
	    this._callbacks = {};
	    this._fired = {};
	  };
	  EventProxy.prototype.addListener = function (ev, callback) {
	    debug("Add listener for %s", ev);
	    this._callbacks[ev] = this._callbacks[ev] || [];
	    this._callbacks[ev].push(callback);
	    return this;
	  };
	  EventProxy.prototype.bind = EventProxy.prototype.addListener;
	  EventProxy.prototype.on = EventProxy.prototype.addListener;
	  EventProxy.prototype.subscribe = EventProxy.prototype.addListener;
	  EventProxy.prototype.headbind = function (ev, callback) {
	    debug("Add listener for %s", ev);
	    this._callbacks[ev] = this._callbacks[ev] || [];
	    this._callbacks[ev].unshift(callback);
	    return this;
	  };
	  EventProxy.prototype.removeListener = function (eventname, callback) {
	    var calls = this._callbacks;
	    if (!eventname) {
	      debug("Remove all listeners");
	      this._callbacks = {};
	    } else {
	      if (!callback) {
	        debug("Remove all listeners of %s", eventname);
	        calls[eventname] = [];
	      } else {
	        var list = calls[eventname];
	        if (list) {
	          var l = list.length;
	          for (var i = 0; i < l; i++) {
	            if (callback === list[i]) {
	              debug("Remove a listener of %s", eventname);
	              list[i] = null;
	            }
	          }
	        }
	      }
	    }
	    return this;
	  };
	  EventProxy.prototype.unbind = EventProxy.prototype.removeListener;
	  EventProxy.prototype.removeAllListeners = function (event) {
	    return this.unbind(event);
	  };
	  EventProxy.prototype.bindForAll = function (callback) {
	    this.bind(ALL_EVENT, callback);
	  };
	  EventProxy.prototype.unbindForAll = function (callback) {
	    this.unbind(ALL_EVENT, callback);
	  };
	  EventProxy.prototype.trigger = function (eventname, data) {
	    var list, ev, callback, i, l;
	    var both = 2;
	    var calls = this._callbacks;
	    debug("Emit event %s with data %j", eventname, data);
	    while (both--) {
	      ev = both ? eventname : ALL_EVENT;
	      list = calls[ev];
	      if (list) {
	        for (i = 0, l = list.length; i < l; i++) {
	          if (!(callback = list[i])) {
	            list.splice(i, 1);
	            i--;
	            l--;
	          } else {
	            var args = [];
	            var start = both ? 1 : 0;
	            for (var j = start; j < arguments.length; j++) {
	              args.push(arguments[j]);
	            }
	            callback.apply(this, args);
	          }
	        }
	      }
	    }
	    return this;
	  };
	  EventProxy.prototype.emit = EventProxy.prototype.trigger;
	  EventProxy.prototype.fire = EventProxy.prototype.trigger;
	  EventProxy.prototype.once = function (ev, callback) {
	    var self = this;
	    var wrapper = function wrapper() {
	      callback.apply(self, arguments);
	      self.unbind(ev, wrapper);
	    };
	    this.bind(ev, wrapper);
	    return this;
	  };
	  var later = typeof setImmediate !== "undefined" && setImmediate || typeof process !== "undefined" && process.nextTick || function (fn) {
	    setTimeout(fn, 0);
	  };
	  EventProxy.prototype.emitLater = function () {
	    var self = this;
	    var args = arguments;
	    later(function () {
	      self.trigger.apply(self, args);
	    });
	  };
	  EventProxy.prototype.immediate = function (ev, callback, data) {
	    this.bind(ev, callback);
	    this.trigger(ev, data);
	    return this;
	  };
	  EventProxy.prototype.asap = EventProxy.prototype.immediate;
	  var _assign = function _assign(eventname1, eventname2, cb, once) {
	    var proxy = this;
	    var argsLength = arguments.length;
	    var times = 0;
	    var flag = {};
	    if (argsLength < 3) {
	      return this;
	    }
	    var events = SLICE.call(arguments, 0, -2);
	    var callback = arguments[argsLength - 2];
	    var isOnce = arguments[argsLength - 1];
	    if (typeof callback !== "function") {
	      return this;
	    }
	    debug("Assign listener for events %j, once is %s", events, !!isOnce);
	    var bind = function bind(key) {
	      var method = isOnce ? "once" : "bind";
	      proxy[method](key, function (data) {
	        proxy._fired[key] = proxy._fired[key] || {};
	        proxy._fired[key].data = data;
	        if (!flag[key]) {
	          flag[key] = true;
	          times++;
	        }
	      });
	    };
	    var length = events.length;
	    for (var index = 0; index < length; index++) {
	      bind(events[index]);
	    }
	    var _all = function _all(event) {
	      if (times < length) {
	        return;
	      }
	      if (!flag[event]) {
	        return;
	      }
	      var data = [];
	      for (var index = 0; index < length; index++) {
	        data.push(proxy._fired[events[index]].data);
	      }
	      if (isOnce) {
	        proxy.unbindForAll(_all);
	      }
	      debug("Events %j all emited with data %j", events, data);
	      callback.apply(null, data);
	    };
	    proxy.bindForAll(_all);
	  };
	  EventProxy.prototype.all = function (eventname1, eventname2, callback) {
	    var args = CONCAT.apply([], arguments);
	    args.push(true);
	    _assign.apply(this, args);
	    return this;
	  };
	  EventProxy.prototype.assign = EventProxy.prototype.all;
	  EventProxy.prototype.fail = function (callback) {
	    var that = this;
	    that.once("error", function () {
	      that.unbind();
	      callback.apply(null, arguments);
	    });
	    return this;
	  };
	  EventProxy.prototype['throw'] = function () {
	    var that = this;
	    that.emit.apply(that, ["error"].concat(SLICE.call(arguments)));
	  };
	  EventProxy.prototype.tail = function () {
	    var args = CONCAT.apply([], arguments);
	    args.push(false);
	    _assign.apply(this, args);
	    return this;
	  };
	  EventProxy.prototype.assignAll = EventProxy.prototype.tail;
	  EventProxy.prototype.assignAlways = EventProxy.prototype.tail;
	  EventProxy.prototype.after = function (eventname, times, callback) {
	    if (times === 0) {
	      callback.call(null, []);
	      return this;
	    }
	    var proxy = this,
	        firedData = [];
	    this._after = this._after || {};
	    var group = eventname + "_group";
	    this._after[group] = {
	      index: 0,
	      results: []
	    };
	    debug("After emit %s times, event %s's listenner will execute", times, eventname);
	    var all = function all(name, data) {
	      if (name === eventname) {
	        times--;
	        firedData.push(data);
	        if (times < 1) {
	          debug("Event %s was emit %s, and execute the listenner", eventname, times);
	          proxy.unbindForAll(all);
	          callback.apply(null, [firedData]);
	        }
	      }
	      if (name === group) {
	        times--;
	        proxy._after[group].results[data.index] = data.result;
	        if (times < 1) {
	          debug("Event %s was emit %s, and execute the listenner", eventname, times);
	          proxy.unbindForAll(all);
	          callback.call(null, proxy._after[group].results);
	        }
	      }
	    };
	    proxy.bindForAll(all);
	    return this;
	  };
	  EventProxy.prototype.group = function (eventname, callback) {
	    var that = this;
	    var group = eventname + "_group";
	    var index = that._after[group].index;
	    that._after[group].index++;
	    return function (err, data) {
	      if (err) {
	        return that.emit.apply(that, ["error"].concat(SLICE.call(arguments)));
	      }
	      that.emit(group, {
	        index: index,
	        result: callback ? callback.apply(null, SLICE.call(arguments, 1)) : data
	      });
	    };
	  };
	  EventProxy.prototype.any = function () {
	    var proxy = this,
	        callback = arguments[arguments.length - 1],
	        events = SLICE.call(arguments, 0, -1),
	        _eventname = events.join("_");
	    debug("Add listenner for Any of events %j emit", events);
	    proxy.once(_eventname, callback);
	    var _bind = function _bind(key) {
	      proxy.bind(key, function (data) {
	        debug("One of events %j emited, execute the listenner");
	        proxy.trigger(_eventname, {
	          data: data,
	          eventName: key
	        });
	      });
	    };
	    for (var index = 0; index < events.length; index++) {
	      _bind(events[index]);
	    }
	  };
	  EventProxy.prototype.not = function (eventname, callback) {
	    var proxy = this;
	    debug("Add listenner for not event %s", eventname);
	    proxy.bindForAll(function (name, data) {
	      if (name !== eventname) {
	        debug("listenner execute of event %s emit, but not event %s.", name, eventname);
	        callback(data);
	      }
	    });
	  };
	  EventProxy.prototype.done = function (handler, callback) {
	    var that = this;
	    return function (err, data) {
	      if (err) {
	        return that.emit.apply(that, ["error"].concat(SLICE.call(arguments)));
	      }
	      var args = SLICE.call(arguments, 1);
	      if (typeof handler === "string") {
	        if (callback) {
	          return that.emit(handler, callback.apply(null, args));
	        } else {
	          return that.emit.apply(that, [handler].concat(args));
	        }
	      }
	      if (arguments.length <= 2) {
	        return handler(data);
	      }
	      handler.apply(null, args);
	    };
	  };
	  EventProxy.prototype.doneLater = function (handler, callback) {
	    var _doneHandler = this.done(handler, callback);
	    return function (err, data) {
	      var args = arguments;
	      later(function () {
	        _doneHandler.apply(null, args);
	      });
	    };
	  };
	  EventProxy.create = function () {
	    var ep = new EventProxy();
	    var args = CONCAT.apply([], arguments);
	    if (args.length) {
	      var errorHandler = args[args.length - 1];
	      var callback = args[args.length - 2];
	      if (typeof errorHandler === "function" && typeof callback === "function") {
	        args.pop();
	        ep.fail(errorHandler);
	      }
	      ep.assign.apply(ep, args);
	    }
	    return ep;
	  };
	  EventProxy.EventProxy = EventProxy;
	  return EventProxy;
	}();
	exports.EventProxy = EventProxy;
	/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(3).setImmediate, __webpack_require__(4)))

/***/ },
/* 3 */
/***/ function(module, exports, __webpack_require__) {

	/* WEBPACK VAR INJECTION */(function(setImmediate, clearImmediate) {var nextTick = __webpack_require__(4).nextTick;
	var apply = Function.prototype.apply;
	var slice = Array.prototype.slice;
	var immediateIds = {};
	var nextImmediateId = 0;

	// DOM APIs, for completeness

	exports.setTimeout = function() {
	  return new Timeout(apply.call(setTimeout, window, arguments), clearTimeout);
	};
	exports.setInterval = function() {
	  return new Timeout(apply.call(setInterval, window, arguments), clearInterval);
	};
	exports.clearTimeout =
	exports.clearInterval = function(timeout) { timeout.close(); };

	function Timeout(id, clearFn) {
	  this._id = id;
	  this._clearFn = clearFn;
	}
	Timeout.prototype.unref = Timeout.prototype.ref = function() {};
	Timeout.prototype.close = function() {
	  this._clearFn.call(window, this._id);
	};

	// Does not start the time, just sets up the members needed.
	exports.enroll = function(item, msecs) {
	  clearTimeout(item._idleTimeoutId);
	  item._idleTimeout = msecs;
	};

	exports.unenroll = function(item) {
	  clearTimeout(item._idleTimeoutId);
	  item._idleTimeout = -1;
	};

	exports._unrefActive = exports.active = function(item) {
	  clearTimeout(item._idleTimeoutId);

	  var msecs = item._idleTimeout;
	  if (msecs >= 0) {
	    item._idleTimeoutId = setTimeout(function onTimeout() {
	      if (item._onTimeout)
	        item._onTimeout();
	    }, msecs);
	  }
	};

	// That's not how node.js implements it but the exposed api is the same.
	exports.setImmediate = typeof setImmediate === "function" ? setImmediate : function(fn) {
	  var id = nextImmediateId++;
	  var args = arguments.length < 2 ? false : slice.call(arguments, 1);

	  immediateIds[id] = true;

	  nextTick(function onNextTick() {
	    if (immediateIds[id]) {
	      // fn.call() is faster so we optimize for the common use-case
	      // @see http://jsperf.com/call-apply-segu
	      if (args) {
	        fn.apply(null, args);
	      } else {
	        fn.call(null);
	      }
	      // Prevent ids from leaking
	      exports.clearImmediate(id);
	    }
	  });

	  return id;
	};

	exports.clearImmediate = typeof clearImmediate === "function" ? clearImmediate : function(id) {
	  delete immediateIds[id];
	};
	/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(3).setImmediate, __webpack_require__(3).clearImmediate))

/***/ },
/* 4 */
/***/ function(module, exports) {

	// shim for using process in browser
	var process = module.exports = {};

	// cached from whatever global is present so that test runners that stub it
	// don't break things.  But we need to wrap it in a try catch in case it is
	// wrapped in strict mode code which doesn't define any globals.  It's inside a
	// function because try/catches deoptimize in certain engines.

	var cachedSetTimeout;
	var cachedClearTimeout;

	(function () {
	    try {
	        cachedSetTimeout = setTimeout;
	    } catch (e) {
	        cachedSetTimeout = function () {
	            throw new Error('setTimeout is not defined');
	        }
	    }
	    try {
	        cachedClearTimeout = clearTimeout;
	    } catch (e) {
	        cachedClearTimeout = function () {
	            throw new Error('clearTimeout is not defined');
	        }
	    }
	} ())
	function runTimeout(fun) {
	    if (cachedSetTimeout === setTimeout) {
	        //normal enviroments in sane situations
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

	process.binding = function (name) {
	    throw new Error('process.binding is not supported');
	};

	process.cwd = function () { return '/' };
	process.chdir = function (dir) {
	    throw new Error('process.chdir is not supported');
	};
	process.umask = function() { return 0; };


/***/ }
/******/ ]);