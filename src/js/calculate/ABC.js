/*!
 * ABC JavaScript Library v1.0.0-pre
 * 
 * Author:zhenbao.zhai@outlook.com
 * 
 * Date: Tue Nov 10 11:37:21 CST 2015
 */
(function(global, definition) {
  if (typeof module === "object" && typeof module.exports === "object") {
    module.exports = global.document ? definition(global) :function(w) {
      if (!w.document) {
        throw new Error("ABC requires a window with a document");
      }
      return definition(w);
    };
  } else {
    definition(global);
  }
})(typeof window !== "undefined" ? window :this, function(global) {
  var __object = {};
  var toString = __object.toString;
  if (!String.prototype.trim) {
    String.prototype.trim = function() {
      return this.replace(/^[\s\uFEFF\xA0]+|[\s\uFEFF\xA0]+$/g, "");
    };
  }
  if (!Array.prototype.forEach) {
    Array.prototype.forEach = function(fn, arr) {
      if (!fn || !this) {
        return;
      }
      for (var i = 0; i < this.length; i++) {
        fn.call(arr || this, this[i], i, this);
      }
    };
  }
  if (!Array.prototype.filter) {
    Array.prototype.filter = function(fun) {
      if (this === void 0 || this === null) {
        throw new TypeError();
      }
      var t = Object(this);
      var len = t.length >>> 0;
      if (typeof fun !== "function") {
        throw new TypeError();
      }
      var res = [];
      var thisArg = arguments.length >= 2 ? arguments[1] :void 0;
      for (var i = 0; i < len; i++) {
        if (i in t) {
          var val = t[i];
          if (fun.call(thisArg, val, i, t)) {
            res.push(val);
          }
        }
      }
      return res;
    };
  }
  if (!Array.prototype.map) {
    Array.prototype.map = function(callback, thisArg) {
      var T, A, k;
      if (this == null) {
        throw new TypeError(" this is null or not defined");
      }
      var O = Object(this);
      var len = O.length >>> 0;
      if (typeof callback !== "function") {
        throw new TypeError(callback + " is not a function");
      }
      if (arguments.length > 1) {
        T = thisArg;
      }
      A = new Array(len);
      k = 0;
      while (k < len) {
        var kValue, mappedValue;
        if (k in O) {
          kValue = O[k];
          mappedValue = callback.call(T, kValue, k, O);
          A[k] = mappedValue;
        }
        k++;
      }
      return A;
    };
  }
  if (!Array.prototype.reduce) {
    Array.prototype.reduce = function(callback) {
      if (this == null) {
        throw new TypeError("Array.prototype.reduce called on null or undefined");
      }
      if (typeof callback !== "function") {
        throw new TypeError(callback + " is not a function");
      }
      var t = Object(this), len = t.length >>> 0, k = 0, value;
      if (arguments.length == 2) {
        value = arguments[1];
      } else {
        while (k < len && !(k in t)) {
          k++;
        }
        if (k >= len) {
          throw new TypeError("Reduce of empty array with no initial value");
        }
        value = t[k++];
      }
      for (;k < len; k++) {
        if (k in t) {
          value = callback(value, t[k], k, t);
        }
      }
      return value;
    };
  }
  var ABC = {};
  ABC.isFunction = function(fn) {
    return toString.apply(fn) === "[object Function]";
  };
  ABC.isObject = function(o) {
    return toString.apply(o) === "[object Object]";
  };
  ABC.isArray = function(o) {
    return toString.apply(o) === "[object Array]";
  };
  ABC.isPlainObject = function(obj) {
    var hasOwn = {}.hasOwnProperty;
    if (!obj || !ABC.isObject(obj)) {
      return false;
    }
    try {
      if (obj.constructor && !hasOwn.call(obj, "constructor") && !hasOwn.call(obj.constructor.prototype, "isPrototypeOf")) {
        return false;
      }
    } catch (e) {
      return false;
    }
    return true;
  };
  ABC.extend = function() {
    var options, name, src, copy, copyIsArray, clone, target = arguments[0] || {}, i = 1, length = arguments.length, deep = false;
    if (typeof target === "boolean") {
      deep = target;
      target = arguments[i] || {};
      i++;
    }
    if (typeof target !== "object" && !ABC.isFunction(target)) {
      target = {};
    }
    for (;i < length; i++) {
      if ((options = arguments[i]) != null) {
        for (name in options) {
          src = target[name];
          copy = options[name];
          if (target === copy) {
            continue;
          }
          if (deep && copy && (ABC.isPlainObject(copy) || (copyIsArray = ABC.isArray(copy)))) {
            if (copyIsArray) {
              copyIsArray = false;
              clone = src && ABC.isArray(src) ? src :[];
            } else {
              clone = src && ABC.isPlainObject(src) ? src :{};
            }
            target[name] = ABC.extend(deep, clone, copy);
          } else if (copy !== undefined) {
            target[name] = copy;
          }
        }
      }
    }
    return target;
  };
  ABC.copyPropertisByPrefix = function(prefix, config) {
    if (!prefix || !config) {
      return {};
    }
    var pattern = new RegExp("^" + prefix);
    var ret = {};
    var tempProp;
    for (var prop in config) {
      if (config.hasOwnProperty(prop) && pattern.test(prop)) {
        tempProp = prop.replace(pattern, "").replace(/^(.)/g, function($0) {
          return $0.toLowerCase();
        });
        ret[tempProp] = config[prop];
        tempProp = null;
      }
    }
    return ret;
  };
  ABC.windowTocanvas = function(canvas, x, y) {
    var bbox = canvas.getBoundingClientRect();
    x = x - bbox.left * (canvas.width / bbox.width);
    y = y - bbox.top * (canvas.height / bbox.height);
    return {
      x:x,
      y:y
    };
  };
  ABC.getDistance = function(deltaX, deltaY) {
    return Math.sqrt(Math.pow(deltaX, 2) + Math.pow(deltaY, 2));
  };
  ABC.uid = function() {
    return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, function(c) {
      var r = Math.random() * 16 | 0, v = c == "x" ? r :r & 3 | 8;
      return v.toString(16);
    });
  };
  ABC.changePos = function(vertex, point, k) {
    return {
      x:vertex.x * k + point.x * (1 - k),
      y:vertex.y * k + point.y * (1 - k),
      width:vertex.width * k,
      height:vertex.height * k,
      k:k
    };
  };
  (function() {
    var lastTime = 0;
    for (var b = [ "ms", "moz", "webkit", "o" ], c = 0; c < b.length && !window.requestAnimationFrame; ++c) {
      window.requestAnimationFrame = window.requestAnimationFrame || window[b[c] + "RequestAnimationFrame"];
      window.cancelAnimationFrame = window.cancelAnimationFrame || window[b[c] + "CancelAnimationFrame"] || window[b[c] + "CancelRequestAnimationFrame"];
    }
    window.requestAnimationFrame || (window.requestAnimationFrame = function(callback) {
      var currentTime = new Date().getTime(), timeToCall = Math.max(8, 16 - (currentTime - lastTime)), timeoutId = window.setTimeout(function() {
        callback(currentTime + timeToCall);
      }, timeToCall);
      lastTime = currentTime + timeToCall;
      return timeoutId;
    });
    window.cancelAnimationFrame || (window.cancelAnimationFrame = function(a) {
      window.clearTimeout(a);
    });
  })();
  var Shape = function() {
    this._connectable = true;
    this._selected = false;
    this._multiselect = false;
    this.selectable = true;
    this.getConnectable = function() {
      return this._connectable;
    };
    this.setConnectable = function(connectable) {
      this._connectable = connectable;
    };
    this.getSelected = function() {
      return this._selected;
    };
    this.setSelected = function(selected) {
      this._selected = selected;
    };
    this.getMultiselect = function() {
      return this._multiselect;
    };
    this.setMultiselect = function(multiselect) {
      this._multiselect = multiselect;
    };
  };
  ABC.Shape = Shape;
  var Point = function(x, y) {
    this.x = x;
    this.y = y;
  };
  ABC.Point = Point;
  var mode = ABC.mode = {
    drag:"drag",
    connect:"connect",
    select:"select"
  };
  var Graph = function() {
    this._vertexes = [];
    this._edges = [];
    this.MODES = mode;
    this.mode = this.MODES.drag;
    this.connect = {};
  };
  ABC.extend(Graph.prototype, new Shape(), {
    getGraphRange:function(){
      var min={x:0,y:0},max={x:0,y:0};
      this.getVertexes().forEach(function(v){
        var halfwidth=v.width/2;
        var halfheight=v.height/2;
        min.x=Math.min(min.x,v.x-halfwidth);
        min.y=Math.min(min.y,v.y-halfheight);
        max.x=Math.max(max.x,v.x+halfwidth);
        max.y=Math.max(max.y,v.y+halfheight);
      });
      return {
        min:min,max:max,
        width:max.x-min.x,
        height:max.y-min.y
      };
    },
    shift:function(deltaX, deltaY) {
      this._vertexes.forEach(function(v) {
        v.shift(deltaX, deltaY);
      });
    },
    getVertexes:function() {
      return this._vertexes;
    },
    getEdges:function() {
      return this._edges;
    },
    addVertex:function(vertex) {
      if (vertex) {
        this._vertexes.push(vertex);
      }
      return this;
    },
    addEdge:function(edge) {
      if (edge) {
        this._edges.push(edge);
      }
      return this;
    },
    isVertexInCanvas:function(vertex, width, height) {
      return vertex.x > -vertex.width / 2 && vertex.x < width + vertex.width / 2 && vertex.y > -vertex.height / 2 && vertex.y < height + vertex.height / 2;
    },
    isEdgeInCanvas:function(edge, width, height) {
      var rect = {
        xmin:0,
        xmax:width,
        ymin:0,
        ymax:height
      };
      var A = {
        x:edge.start.x,
        y:edge.start.y
      };
      var B = {
        x:edge.end.x,
        y:edge.end.y
      };
      return this.RSIntersection(rect, A, B);
    },
    IntervalOverlap:function(x1, x2, x3, x4) {
      var t;
      if (x3 > x4) {
        t = x3;
        x3 = x4;
        x4 = t;
      }
      return !(x3 > x2 || x4 < x1);
    },
    RSIntersection:function(r, A, B) {
      if (A.y == B.y) {
        if (A.y <= r.ymax && A.y >= r.ymin) {
          return this.IntervalOverlap(r.xmin, r.xmax, A.x, B.x);
        }
        return false;
      }
      var t;
      if (A.y > B.y) {
        t = A;
        A = B;
        B = t;
      }
      var k = (B.x - A.x) / (B.y - A.y);
      var C = {}, D = {};
      if (A.y < r.ymin) {
        C.y = r.ymin;
        C.x = k * (C.y - A.y) + A.x;
      } else {
        C = A;
      }
      if (B.y > r.ymax) {
        D.y = r.ymax;
        D.x = k * (D.y - B.y) + B.x;
      } else {
        D = B;
      }
      if (D.y >= C.y) {
        return this.IntervalOverlap(r.xmin, r.xmax, D.x, C.x);
      }
      return false;
    },
    filterEdges:function(width, height) {
      var edges = [];
      for (var i = 0; i < this._edges.length; i++) {
        if (this.isEdgeInCanvas(this._edges[i], width, height)) {
          edges.push(this._edges[i]);
        }
      }
      return edges;
    },
    filterVertexes:function(width, height) {
      var vertexes = [];
      for (var i = 0; i < this._vertexes.length; i++) {
        if (this.isVertexInCanvas(this._vertexes[i], width, height)) {
          vertexes.push(this._vertexes[i]);
        }
      }
      return vertexes;
    },
    getMouseInVertex:function(point) {
      var vs = this._vertexes.filter(function(v) {
        return v && v.isPointInVertex(point);
      });
      return vs.pop();
    },
    getDraggingVertexes:function() {
      return this._vertexes.filter(function(v) {
        return v && v.isDragging;
      });
    },
    getSelectedVertex:function() {
      return this.getSelectedVertexes()[0];
    },
    getSelectedEdges:function() {
      return this._edges.filter(function(e) {
        return e && e.getSelected();
      });
    },
    getSelectedVertexes:function() {
      return this._vertexes.filter(function(v) {
        return v && v.getSelected();
      });
    },
    getUnSelectedVertexes:function() {
      return this._vertexes.filter(function(v) {
        return v && !v.getSelected();
      });
    },
    getHoverVertex:function(mousepoint) {
      return this.getHoverVertexes(mousepoint)[0];
    },
    getHoverVertexes:function(mousepoint) {
      return this._vertexes.filter(function(v) {
        return v && v.isPointInVertex(mousepoint);
      });
    },
    removeVertex:function(vertex) {
      var index;
      if (vertex && (index = this._vertexes.indexOf(vertex)) >= 0) {
        this._vertexes.splice(index, 1);
      }
      return this;
    },
    removeEdge:function(edge) {
      var index;
      if (edge && (index = this._edges.indexOf(edge)) >= 0) {
        this._edges.splice(index, 1);
      }
      return this;
    }
  });
  ABC.Graph = Graph;
  var EventProxy = ABC.EventProxy = function() {
    var debug = function() {};
    var SLICE = Array.prototype.slice;
    var CONCAT = Array.prototype.concat;
    var ALL_EVENT = "__all__";
    var EventProxy = function() {
      if (!(this instanceof EventProxy)) {
        return new EventProxy();
      }
      this._callbacks = {};
      this._fired = {};
    };
    EventProxy.prototype.addListener = function(ev, callback) {
      debug("Add listener for %s", ev);
      this._callbacks[ev] = this._callbacks[ev] || [];
      this._callbacks[ev].push(callback);
      return this;
    };
    EventProxy.prototype.bind = EventProxy.prototype.addListener;
    EventProxy.prototype.on = EventProxy.prototype.addListener;
    EventProxy.prototype.subscribe = EventProxy.prototype.addListener;
    EventProxy.prototype.headbind = function(ev, callback) {
      debug("Add listener for %s", ev);
      this._callbacks[ev] = this._callbacks[ev] || [];
      this._callbacks[ev].unshift(callback);
      return this;
    };
    EventProxy.prototype.removeListener = function(eventname, callback) {
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
    EventProxy.prototype.removeAllListeners = function(event) {
      return this.unbind(event);
    };
    EventProxy.prototype.bindForAll = function(callback) {
      this.bind(ALL_EVENT, callback);
    };
    EventProxy.prototype.unbindForAll = function(callback) {
      this.unbind(ALL_EVENT, callback);
    };
    EventProxy.prototype.trigger = function(eventname, data) {
      var list, ev, callback, i, l;
      var both = 2;
      var calls = this._callbacks;
      debug("Emit event %s with data %j", eventname, data);
      while (both--) {
        ev = both ? eventname :ALL_EVENT;
        list = calls[ev];
        if (list) {
          for (i = 0, l = list.length; i < l; i++) {
            if (!(callback = list[i])) {
              list.splice(i, 1);
              i--;
              l--;
            } else {
              var args = [];
              var start = both ? 1 :0;
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
    EventProxy.prototype.once = function(ev, callback) {
      var self = this;
      var wrapper = function() {
        callback.apply(self, arguments);
        self.unbind(ev, wrapper);
      };
      this.bind(ev, wrapper);
      return this;
    };
    var later = typeof setImmediate !== "undefined" && setImmediate || typeof process !== "undefined" && process.nextTick || function(fn) {
      setTimeout(fn, 0);
    };
    EventProxy.prototype.emitLater = function() {
      var self = this;
      var args = arguments;
      later(function() {
        self.trigger.apply(self, args);
      });
    };
    EventProxy.prototype.immediate = function(ev, callback, data) {
      this.bind(ev, callback);
      this.trigger(ev, data);
      return this;
    };
    EventProxy.prototype.asap = EventProxy.prototype.immediate;
    var _assign = function(eventname1, eventname2, cb, once) {
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
      var bind = function(key) {
        var method = isOnce ? "once" :"bind";
        proxy[method](key, function(data) {
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
      var _all = function(event) {
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
    EventProxy.prototype.all = function(eventname1, eventname2, callback) {
      var args = CONCAT.apply([], arguments);
      args.push(true);
      _assign.apply(this, args);
      return this;
    };
    EventProxy.prototype.assign = EventProxy.prototype.all;
    EventProxy.prototype.fail = function(callback) {
      var that = this;
      that.once("error", function() {
        that.unbind();
        callback.apply(null, arguments);
      });
      return this;
    };
    EventProxy.prototype['throw'] = function() {
      var that = this;
      that.emit.apply(that, [ "error" ].concat(SLICE.call(arguments)));
    };
    EventProxy.prototype.tail = function() {
      var args = CONCAT.apply([], arguments);
      args.push(false);
      _assign.apply(this, args);
      return this;
    };
    EventProxy.prototype.assignAll = EventProxy.prototype.tail;
    EventProxy.prototype.assignAlways = EventProxy.prototype.tail;
    EventProxy.prototype.after = function(eventname, times, callback) {
      if (times === 0) {
        callback.call(null, []);
        return this;
      }
      var proxy = this, firedData = [];
      this._after = this._after || {};
      var group = eventname + "_group";
      this._after[group] = {
        index:0,
        results:[]
      };
      debug("After emit %s times, event %s's listenner will execute", times, eventname);
      var all = function(name, data) {
        if (name === eventname) {
          times--;
          firedData.push(data);
          if (times < 1) {
            debug("Event %s was emit %s, and execute the listenner", eventname, times);
            proxy.unbindForAll(all);
            callback.apply(null, [ firedData ]);
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
    EventProxy.prototype.group = function(eventname, callback) {
      var that = this;
      var group = eventname + "_group";
      var index = that._after[group].index;
      that._after[group].index++;
      return function(err, data) {
        if (err) {
          return that.emit.apply(that, [ "error" ].concat(SLICE.call(arguments)));
        }
        that.emit(group, {
          index:index,
          result:callback ? callback.apply(null, SLICE.call(arguments, 1)) :data
        });
      };
    };
    EventProxy.prototype.any = function() {
      var proxy = this, callback = arguments[arguments.length - 1], events = SLICE.call(arguments, 0, -1), _eventname = events.join("_");
      debug("Add listenner for Any of events %j emit", events);
      proxy.once(_eventname, callback);
      var _bind = function(key) {
        proxy.bind(key, function(data) {
          debug("One of events %j emited, execute the listenner");
          proxy.trigger(_eventname, {
            data:data,
            eventName:key
          });
        });
      };
      for (var index = 0; index < events.length; index++) {
        _bind(events[index]);
      }
    };
    EventProxy.prototype.not = function(eventname, callback) {
      var proxy = this;
      debug("Add listenner for not event %s", eventname);
      proxy.bindForAll(function(name, data) {
        if (name !== eventname) {
          debug("listenner execute of event %s emit, but not event %s.", name, eventname);
          callback(data);
        }
      });
    };
    EventProxy.prototype.done = function(handler, callback) {
      var that = this;
      return function(err, data) {
        if (err) {
          return that.emit.apply(that, [ "error" ].concat(SLICE.call(arguments)));
        }
        var args = SLICE.call(arguments, 1);
        if (typeof handler === "string") {
          if (callback) {
            return that.emit(handler, callback.apply(null, args));
          } else {
            return that.emit.apply(that, [ handler ].concat(args));
          }
        }
        if (arguments.length <= 2) {
          return handler(data);
        }
        handler.apply(null, args);
      };
    };
    EventProxy.prototype.doneLater = function(handler, callback) {
      var _doneHandler = this.done(handler, callback);
      return function(err, data) {
        var args = arguments;
        later(function() {
          _doneHandler.apply(null, args);
        });
      };
    };
    EventProxy.create = function() {
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
  var vertexEvent = function(EventProxy, Point) {
    var proxy = new EventProxy();
    proxy.on("positionChange", function(vertext, changePoint) {});
    proxy.on("dragstart", function(vertext, point) {
      vertext.isDragging = true;
      vertext.mouseOffset = new Point(vertext.x - point.x, vertext.y - point.y);
    });
    proxy.on("drag", function(vertext, point) {
      vertext.moveTo(point);
    });
    proxy.on("dragend", function(vertext, point) {
      vertext.isDragging = false;
      vertext.mouseOffset = new Point(0, 0);
      vertext.updateoragin();
    });
    proxy.on("click", function(v, point) {});
    proxy.on("nonselected", function(v, point) {
      v.setSelected(false);
    });
    proxy.on("onselected", function(v, point) {
      v.setSelected(true);
    });
    proxy.on("dbclick", function(v, point) {});
    proxy.on("menuselect", function(v, point) {
      v.setSelected(true);
    });
    proxy.on("menuunselect", function(v, point) {
      v.setSelected(false);
    });
    return proxy;
  }(EventProxy, Point);
  var IMGS=ABC.IMGS={};
  var Vertex = function(startPoint, range, config) {
    var defaultConf = {
      strokeStyle:"rgba(247, 247, 247, 0)",
      selectedStrokeStyle:"blue",
      fillStyle:"rgba(247, 247, 247, 0)",
      textFillStyle:"black",
      selectedfillStyle:"rgba(247, 247, 247, 0)",
      fontSize:12,
      fontFamily:"​arial,微软雅黑,​宋体,​tahoma,​simsun,​sans-serif",
      selectedTextAlign:"center",
      textAlign:"center",
      show:true
    };
    this.defaultConf = defaultConf;
    this.config = ABC.extend({},defaultConf, config || {});
    this.id = this.config.id || ABC.uid();
    this.type = this.config.type || "default";
    this.canDelete=typeof this.config.canDelete==="undefined"?true:!!this.config.canDelete;
    this.isDragging = false;
    this.width = range.width;
    this.height = range.height;
    this.x = startPoint.x + this.width / 2;
    this.y = startPoint.y + this.height / 2;
    this.oragin = new Point(this.x, this.y);
    this.r = ABC.getDistance(this.width / 2, this.height / 2);
    this.start = startPoint;
    this.image = null;
    this.loaded = false;
    this.showLayers=true;
    this.mouseOffset = new Point(0, 0);
    this.event = ABC.extend(true, {}, vertexEvent);
    this.showText = this.config.showText || true;
    this.text = this.config.text || "";
    if (typeof this.config.fontSize == "string") {
      var fontSize = this.config.fontSize.replace(/px$/i, "");
      this.config.fontSize = parseInt(fontSize);
    }
  };
  ABC.extend(Vertex, {
    layerHandler:{
      left:function(v, layer) {
        layer.x = v.x - .5 * (v.width + layer.width);
      },
      right:function(v, layer) {
        layer.x = v.x + .5 * (v.width + layer.width);
      },
      top:function(v, layer) {
        layer.y = v.y - .5 * (v.height + layer.height);
      },
      bottom:function(v, layer) {
        layer.y = v.y + .5 * (v.height + layer.height);
      },
      centerX:function(v, layer) {
        layer.x = v.x;
      },
      centerY:function(v, layer) {
        layer.y = v.y;
      }
    },
    parseLayerPosition:function(pos) {
      if (!pos) {
        return "left-top";
      }
      pos += "";
      pos = pos.replace(/(.+)-(.+)/, function($, $0, $1) {
        $0 === "center" && ($0 = "centerX");
        $1 === "center" && ($1 = "centerY");
        return $0 + "-" + $1;
      });
      return pos;
    },
    getLayerHandler:function(lp) {
      var names = lp.split("-", 2);
      var handler = [ Vertex.layerHandler[names[0]] || Vertex.layerHandler.left, Vertex.layerHandler[names[1]] || Vertex.layerHandler.top ];
      return handler;
    }
  });
  ABC.extend(Vertex.prototype, new Shape(), {
    resetLayer:function(layer) {
      if (!layer) {
        return;
      }
      var pos = Vertex.parseLayerPosition(layer.config.position);
      var handler = Vertex.getLayerHandler(pos);
      var that = this;
      handler.forEach(function(h) {
        h(that, layer);
      });
      var offset=layer.config.offset||{x:0,y:0};
      layer.shift(offset.x, offset.y);
      return layer;
    },
    resetLayers:function() {
      if (!this.layers || this.layers.length < 1) {
        return;
      }
      var that = this;
      this.layers.forEach(function(layer) {
        that.resetLayer(layer);
      });
    },
    addLayer:function(layer) {
      this.resetLayer(layer);
      this.layers || (this.layers = []);
      this.layers.push(layer);
    },
    updateRadius:function() {
      this.r = Math.sqrt(this.width / 2 * (this.width / 2) + this.height / 2 * this.height / 2);
    },
    changeTo:function(pos) {
      this.x = pos.x;
      this.y = pos.y;
      this.oragin = new Point(this.x, this.y);
      this.width = pos.width;
      this.height = pos.height;
      this.start = new Point(this.x - this.width / 2, this.y - this.height / 2);
      this.r = Math.sqrt(this.width / 2 * (this.width / 2) + this.height / 2 * this.height / 2);
      this.config.fontSize = this.config.fontSize * pos.k;
      this.resetLayers();
    },
    isPointInVertex:function(point) {
      var width = this.width / 2;
      var height = this.height / 2;
      return point.x >= this.x - width && point.y >= this.y - height && point.x <= this.x + width && point.y <= this.y + height;
    },
    shiftX:function(deltaX) {
      this.shift(deltaX, 0);
    },
    shiftY:function(deltaY) {
      this.shift(0, deltaY);
    },
    shift:function(deltaX, deltaY) {
      this.x += deltaX;
      this.y += deltaY;
      this.start = new Point(this.x - this.width / 2, this.y - this.height / 2);
      this.resetLayers();
    },
    drawTo:function(point) {
      this.x = point.x;
      this.y = point.y;
      this.shift(this.mouseOffset.x, this.mouseOffset.y);
    },
    updateoragin:function() {
      this.oragin = new Point(this.x, this.y);
    },
    draw:function(context, mousePoint, selectMode) {
      if(!this.config.show){
        return;
      }
      this.drwaBackground(context, mousePoint, selectMode);
      if (this.config.file && !this.loaded) {
        this.loadImg(this.config.file, context);
      }
      if (this.loaded) {
        this.drawImage(context);
      }
      this.showLayers&&this.layers && this.layers.forEach(function(layer) {
        layer.draw(context);
      });
      return this;
    },
    drwaBackground:function(context, mousePoint, selectMode) {
     /*context.save();
      context.beginPath();
      //context.fillStyle = this.config.fillStyle;
      //context.fillRect(this.start.x, this.start.y, this.width, this.height);
      context.rect(this.start.x, this.start.y, this.width, this.height);
      context.closePath();
      context.restore();*/
      context.save();
      context.beginPath();
      if (this._selected) {
        ABC.extend(context, ABC.copyPropertisByPrefix("selected", this.config));
        context.strokeRect(this.start.x, this.start.y, this.width, this.height);
      } else {
        ABC.extend(context, this.config);
        
      }
      
      if (this.showText) {
        ABC.extend(context, ABC.copyPropertisByPrefix("text", this.config));
        context.font = this.config.fontSize + "px " + this.config.fontFamily;
        this.drawText(context, this.text);
      }
      context.closePath();
      context.restore();
      return this;
    },
    drawText:function(context, text) {
      var times = 1;
      var textHeight = context.measureText("汉").width + 2;
      while (context.measureText(text).width > this.width * 2 && text.length > 1) {
        for (var i = 1; i < text.length; i++) {
          if (context.measureText(text.substring(0, i)).width <= this.width * 2 && context.measureText(text.substring(0, i + 1)).width > this.width * 2 || context.measureText(text.substring(0, i)).width > this.width * 2) {
            context.fillText(text.substring(0, i), this.x, this.y + this.height / 2 + textHeight * times);
            text = text.substring(i);
            break;
          }
        }
        times++;
      }
      context.fillText(text, this.x, this.y + this.height / 2 + textHeight * times);
    },
    drawImage:function(context) {
      context.drawImage(this.image, this.start.x, this.start.y, this.width, this.height);
      return this;
    },
    loadImg:function(file, context) {
      if (this.image) {
        return;
      }
      var that = this;
      var cached=ABC.IMGS[file];
      if(cached){
        this.image=cached;
        if(cached._imgvertexloaded){
          that.imageLoaded(context);
        }else{
          cached.addEventListener("load",function() {
            cached._imgvertexloaded=true;
            that.imageLoaded(context);
          });
        }
      }else{
	      ABC.IMGS[file]=this.image = new Image();
	      
	      this.image.addEventListener("load", function() {
            ABC.IMGS[file]._imgvertexloaded=true;
	        that.imageLoaded(context);
	      });
	      this.image.src = file;
      }
      return this;
    },
    imageLoaded:function(context) {
      this.loaded = true;
      this.drawImage(context);
    }
  });
  Vertex.prototype.moveTo = Vertex.prototype.drawTo;
  Vertex.prototype.init = Vertex.prototype.draw;
  ABC.Vertex = Vertex;
  var Layer = ABC.Layer = function(conf) {
    var width = parseInt(conf.width, 10) || 20;
    var height = parseInt(conf.height, 10) || 20;
    Vertex.call(this,new Point(0, 0), new Range(width, height), conf);
  };
  Layer.prototype=Vertex.prototype;
  Layer.prototype.constructor=Layer;
  Layer.create = function(conf) {
    
    var layer=new Layer(conf);
    
    return layer;
  };
  var render = {
    drawVertex:function(context, vertex) {},
    getIntersectionPoint:function(start, end) {
      var distance = ABC.getDistance(end.x - start.x, end.y - start.y);
      start.r || (start.r = 0);
      end.r || (end.r = 0);
      if (distance <= 0 || distance <= start.r + end.r) {
        return {
          start:new Point(start.x, start.y),
          end:new Point(end.x, end.y)
        };
      }
      var vector = new Point((end.x - start.x) / distance, (end.y - start.y) / distance);
      return {
        start:new Point(start.r * vector.x + start.x, start.r * vector.y + start.y),
        end:new Point((distance - end.r) * vector.x + start.x, (distance - end.r) * vector.y + start.y)
      };
    },
    drawArrow:function(context, startVertex, endVertex, config) {
      var vector = this.getIntersectionPoint(startVertex, endVertex);
      this.drawArrowBetweenPoints(context, vector.start, vector.end, config);
    },
    drawArrowBetweenVertexAndPoint:function(context, vertex, point, config) {
      this.drawArrow(context, vertex, point, config);
    },
    drawArrowBetweenPoints:function(context, start, end, config) {
      context.save();
      ABC.isObject(config) && ABC.extend(context, config);
      context.beginPath();
      context.moveTo(start.x, start.y);
      context.lineTo(end.x, end.y);
      context.stroke();
      context.closePath();
      context.beginPath();
      context.translate(end.x, end.y);
      var angle = (end.x - start.x) / (end.y - start.y);
      angle = Math.atan(angle);
      if (end.y - start.y >= 0) {
        angle = -angle;
      } else {
        angle = Math.PI - angle;
      }
      var minify=config.arrowMinifyRate||1;
      context.rotate(angle);
      context.lineTo(-5*minify, -10*minify);
      context.lineTo(0, -5*minify);
      context.lineTo(5*minify, -10*minify);
      context.lineTo(0, 0);
      context.fill();
      context.closePath();
      context.restore();
    }
  };
  ABC.render = render;
  var edgeEvent = function(EventProxy, Point) {
    var proxy = new EventProxy();
    proxy.on("positionChange", function(edge, changePoint) {});
    proxy.on("dragstart", function(edge, point) {});
    proxy.on("drag", function(edge, point) {});
    proxy.on("dragend", function(edge, point) {});
    proxy.on("onselected", function(edge, point) {
      edge.setSelected(true);
    });
    proxy.on("nonselected", function(edge, point) {
      edge.setSelected(false);
    });
    return proxy;
  }(EventProxy, Point);
  var Edge = function(startVertex, endVertex, config) {
    var defaultConf = {
      strokeStyle:"#738CBA",
      selectedStrokeStyle:"blue",
      fillStyle:"#738CBA",
      selectedFillStyle:"blue",
      selectedLineWidth:1.5,
      show:true
    };
    this.defaultConf = defaultConf;
    this.config = ABC.extend({},defaultConf, config || {});
    this.id = this.config.id || ABC.uid();
    this.start = startVertex;
    this.end = endVertex;
    this._selected = false;
    this.event = ABC.extend(true, {}, edgeEvent);
  };
  ABC.extend(Edge.prototype, new Shape(), {
    contains:function(vertex) {
      return this.start == vertex || this.end == vertex;
    },
    getSelectedConf:function() {
      return ABC.copyPropertisByPrefix("selected", this.config);
    },
    isPointInEdge:function(context, mousePoint) {
      if (!mousePoint) {
        return false;
      }
      var intersections = render.getIntersectionPoint(this.start, this.end);
      var pointInEdge = this.pointInEdge(context, mousePoint, intersections.start, intersections.end);
      return pointInEdge;
    },
    pointInEdge:function(context, mousePoint, start, end) {
      context.save();
      context.beginPath();
      var distance = ABC.getDistance(end.x - start.x, end.y - start.y);
      context.translate(start.x, start.y);
      context.rotate(Math.atan2(end.y - start.y, end.x - start.x));
      context.rect(0, -5, distance, 10);
      context.closePath();
      context.restore();
      var ret = mousePoint && context.isPointInPath(mousePoint.x, mousePoint.y);
      return ret;
    },
    drawArrow:function(context, mousePoint, changeSelectMode) {
      if(!this.config.show){
        return;
      }
      var intersections = render.getIntersectionPoint(this.start, this.end);
      var start = intersections.start;
      var end = intersections.end;
      pointInEdgeConf = this.getSelectedConf();
      render.drawArrowBetweenPoints(context, start, end, this._selected ? pointInEdgeConf :this.config);
    }
  });
  Edge.prototype.draw = Edge.prototype.rend = Edge.prototype.drawArrow;
  ABC.Edge = Edge;
  var Range = function(width, height) {
    this.width = width;
    this.height = height;
  };
  ABC.Range = Range;
  var Menu = function() {
    this._items = [];
  };
  ABC.extend(Menu.prototype, new Shape(), {
    getItems:function() {
      return this._items;
    },
    addItem:function(item) {
      if (item) {
        this._items.push(item);
      }
      return this;
    },
    removeItem:function(item) {
      var index;
      if (item && (index = this._items.indexOf(item)) >= 0) {
        this._items.splice(index, 1);
      }
      return this;
    }
  });
  ABC.Menu = Menu;
  var MenuView = function(canvas) {
    this.canvas = canvas;
    this.mousedown = false;
    this.context = canvas.getContext("2d");
    this.menu = new Menu();
    this.event = new EventProxy();
    this.defaultVertexRange = new Range(30, 30);
    this.defaultMarginLeft = 20;
    this.defaultMarginTop = 20;
  };
  ABC.extend(MenuView.prototype, {
    addItem:function(conf) {
      var lineCount = Math.floor(this.canvas.width / (this.defaultVertexRange.width * 2));
      var column = lineCount > 0 ? lineCount :1;
      var eleCount = this.menu.getItems().length;
      var heightCount = Math.floor(eleCount / lineCount);
      var rowPos = eleCount % column;
      var startX = rowPos * this.defaultVertexRange.width * 2 + this.defaultMarginLeft;
      var startY = heightCount * this.defaultVertexRange.height * 2 + this.defaultMarginTop;
      var start = new Point(startX, startY);
      var item = new ABC.Vertex(start, this.defaultVertexRange, conf);
      this.menu.addItem(item);
      return item;
    },
    listion:function() {
      var events = [ "drag", "drop", "dragstart", "dragover", "click", "dblclick", "keydown", "keypress", "keyup", "mousedown", "mousemove", "mouseup", "mouseout", "mouseover", "mousewheel", "wheel" ];
      var that = this;
      events.forEach(function(name) {
        that.canvas.addEventListener(name, function(evname) {
          return function(e) {
            try {
              e.preventDefault();
              if (e && e.stopPropagation) {
                e.stopPropagation();
              } else {
                e.cancelBubble = true;
              }
            } catch (ex) {}
            var loc = ABC.windowTocanvas(that.canvas, e.clientX, e.clientY);
            that.event.fire(name, e, loc);
            that.draw();
          };
        }(name), false);
      });
    },
    draw:function() {
      var that = this;
      this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);
      this.context.fillStyle = "rgba(228, 239, 242, 0.9)";
      this.context.fillRect(0, 0, this.canvas.width, this.canvas.height);
      this.menu.getItems().forEach(function(v) {
        v.draw(that.context, that.mousePoint);
      });
      if (this.currVertex) {
        this.currVertex.draw(that.context);
      }
      return this;
    },
    initEvent:function() {
      var that = this;
      this.event.on("click", function(e, loc) {
        that.menu.getItems().forEach(function(v) {
          if (v.isPointInVertex(loc)) {
            v.event.fire("click", v, loc, e, that);
          }
        });
      });
      this.event.on("mousedown", function(e, loc) {
        that.mousePoint = loc;
        that.mousedown = true;
        var selectedModeId;
        var selectV = false;
        that.menu.getItems().forEach(function(v) {
          if (v.isPointInVertex(loc)) {
            selectV = true;
            v.event.fire("menuselect", v, loc, e, that);
            if (v.type !== "mode") {
              that.currVertex = ABC.extend(true, {}, v);
            } else {
              selectedModeId = v.id;
            }
          } else {
            if (v.type !== "mode") {
              v.event.fire("menuunselect", v, loc, e, that);
            }
          }
        });
        if (!selectV) {
          that.currVertex = null;
        }
        if (selectedModeId) {
          that.menu.getItems().filter(function(v) {
            return v && v.type === "mode" && v.id !== selectedModeId;
          }).forEach(function(v) {
            v.event.fire("menuunselect", v, loc, e, that);
          });
        }
      });
      this.event.on("mousemove", function(e, loc) {
        var filtered = that.menu.getItems().filter(function(v) {
          return v && v.isPointInVertex(loc);
        });
        if (filtered.length < 1 && that.mousedown) {}
        that.mousePoint = loc;
        if (that.currVertex) {
          that.currVertex.moveTo(loc);
        }
      });
      this.event.on("mouseup", function(e, loc) {
        that.mousedown = false;
      });
      this.event.on("menustart", function(view) {
        var allLoaded = false;
        var interval = setInterval(function() {
          var filter = view.menu.getItems().filter(function(v) {
            return !v.loaded;
          });
          if (filter.length <= 0) {
            view.draw();
            clearInterval(interval);
            return;
          }
        }, 100);
      });
    },
    start:function() {
      this.draw();
      this.initEvent();
      this.listion();
      var that = this;
      this.event.fire("menustart", this);
      window.addEventListener("load", function(e) {
        that.draw();
      });
    }
  });
  ABC.MenuView = MenuView;
  var GraphView = function(canvas) {
    this.canvas = canvas;
    this.mousedown = false;
    this.controlKeyDown = false;
    this.context = canvas.getContext("2d");
    this.eventTriggers = [];
    this.clickQueue = [];
    this.scale = 0;
    this.SCALE = 3;
    this.pointer = null;
    this.graph = new Graph();
    this.event = new EventProxy();
    this.graph.setConnectable(false);
    this.k = 1.25;
    this.applyDefaultVertexSize = true;
    this.defaultVertexWidth = 50;
    this.defaultVertexHeight = 50;
    this.zoomable = true;
    //存放需要在画图工具关闭时销毁的定时器画图工具没有销毁事件需要在外面销毁
    this.intervals=[];
  };
  ABC.extend(GraphView.prototype, {
    showVertex:function(vertex){
      this.hideVertex(vertex,true);
    },
    hideVertex:function(vertex,show){
      if(!vertex){
        return;
      }
      show=!!show;//default false;
      vertex.config&&(vertex.config.show=show);
      this.graph.getEdges().forEach(function(edge){
        if(edge&&edge.contains(vertex)){
          //edge.config&&(edge.config.show=show);
          try{
	          if(edge.start.config.show&&edge.end.config.show){
	            edge.config.show=true;
	          }else{
	            edge.config.show=false;
	          }
          }catch(ex){}
        }
      });
      //this.draw();
    },
    showEdge:function(edge){
      this.hideEdge(edge,true);
    },
    hideEdge:function(edge,show){
      edge&&edge.config&&(edge.config.show=!!show);
      //this.draw();
    },
    center:function(v){
      if(!v){
        return;
      }
      var deltaX=Math.abs(v.x-this.canvas.width / 2);
      (v.x>this.canvas.width/2)&&(deltaX=-deltaX);
      var deltaY=Math.abs(v.y-this.canvas.height/2);
      (v.y>this.canvas.height/2)&&(deltaY=-deltaY);
      this.graph.shift(deltaX,deltaY);
      this.draw();
      
    },
    removeVertex:function(v) {
      var mode = this.graph;
      var edges = mode.getEdges();
      for (var i = edges.length - 1; i >= 0; i--) {
        if (edges[i] && edges[i].contains(v)) {
          this.event.fire("removeedgebyvertex", edges[i], v);
          this.event.fire("removeedge", edges[i]);
          mode.removeEdge(edges[i]);
        }
      }
      this.event.fire("removevertex", v);
      mode.removeVertex(v);
    },
    changeVertexPosition:function(loc, k) {
      this.graph.getVertexes().forEach(function(v) {
        var pos;
        if (v.isPointInVertex(loc)) {
          pos = ABC.changePos(v, v, k);
        } else {
          pos = ABC.changePos(v, loc, k);
        }
        v.changeTo(pos);
      });
    },
    zoomin:function(loc) {
      if (!this.zoomable) {
        return;
      }
      if (this.scale > this.SCALE) {
        return;
      }
      if (!loc) {
        loc = new Point(this.canvas.width / 2, this.canvas.height / 2);
      }
      var k = this.k;
      this.scale++;
      this.changeVertexPosition(loc, k);
      this.event.fire("zoomin", loc, this);
    },
    zoomout:function(loc) {
      if (!this.zoomable) {
        return;
      }
      if (this.scale < -this.SCALE) {
        return;
      }
      if (!loc) {
        loc = new Point(this.canvas.width / 2, this.canvas.height / 2);
      }
      var k = 1 / this.k;
      this.scale--;
      this.changeVertexPosition(loc, k);
      this.event.fire("zoomout", loc, this);
    },
    listion:function() {
      var events = ["mouseout","blur", "keydown", "keypress", "keyup", "mousemove", "mouseup" ];
      var canvasEvents = [ "contextmenu", "focus", "click", "dblclick", "mousedown", "wheel" ];
      var that = this;
      events.forEach(function(name) {
        window.addEventListener(name, function(evname) {
          return function(e) {
            try {} catch (ex) {}
            var loc = ABC.windowTocanvas(that.canvas, e.clientX, e.clientY);
            that.pointer = loc;
            that.event.fire(name, e, loc);
            if ("mousemove" !== name) {
              that.event.fire("redraw", that);
            }
          };
        }(name), false);
      });
      canvasEvents.forEach(function(name) {
        that.canvas.addEventListener(name, function(evname) {
          return function(e) {
            try {} catch (ex) {}
            var loc = ABC.windowTocanvas(that.canvas, e.clientX, e.clientY);
            that.pointer = loc;
            that.event.fire(name, e, loc);
            that.event.fire("redraw", that);
          };
        }(name), false);
      });
    },
    initEvent:function() {
      var that = this;
      var vertexAndEgeEventPublish = function() {
        var args = Array.prototype.slice.apply(arguments);
        var element = args.shift();
        var point = args.shift();
        var e = args.shift();
        if (element && point && e && args && args.length > 0) {
          args.forEach(function(name) {
            element.event.fire(name.element, point, e);
          });
        }
      };
      this.event.on("redraw", function(that,im) {
        that.draw(im);
      });
      this.event.on("keydown", function(e) {
        if (!e || !e.keyCode) {
          return;
        }
        if (e.keyCode == 27) {
          that.event.fire("esc", that, e);
        }
      });
      this.event.on("keydown", function(e) {
        if (!e || !e.keyCode) {
          return;
        }
        if (e.keyCode == 17) {
          that.event.fire("controlkeydown", e);
        }
      });
      this.event.on("keyup", function(e) {
        if (!e || !e.keyCode) {
          return;
        }
        if (e.keyCode == 17) {
          that.event.fire("controlkeyup", e);
        }
        if (e.keyCode == 46) {
          that.event.fire("delete", e);
        }
      });
      this.event.on("esc", function(that) {
        that.currVertex = null;
        that.mousedown = false;
      });
      this.event.on("mouseout", function() {
        that.currVertex = null;
        that.mousedown = false;
        that.controlKeyDown = false
      });
      this.event.on("addvertex", function(vertex, e, graphView) {
        if (graphView.applyDefaultVertexSize) {
          vertex.width = graphView.defaultVertexWidth;
          vertex.height = graphView.defaultVertexHeight;
        }
        var times = Math.pow(graphView.k, graphView.scale);
        vertex.width *= times;
        vertex.height *= times;
        vertex.config.fontSize *= times;
        vertex.shift(0, 0);
        vertex.id = ABC.uid();
        vertex.updateRadius();
      });
      this.event.on("delete", function() {
        var mode = that.graph;
        var selectedEdges = mode.getSelectedEdges();
        for (var i = selectedEdges.length - 1; i >= 0; i--) {
          if (selectedEdges[i]) {
            that.event.fire("removeselectededge", selectedEdges[i]);
            that.event.fire("removeedge", selectedEdges[i]);
            mode.removeEdge(selectedEdges[i]);
          }
        }
        mode.getSelectedVertexes().forEach(function(v) {
          if(!v.canDelete){
            return;
          }
          var edges = mode.getEdges();
          for (var i = edges.length - 1; i >= 0; i--) {
            if (edges[i] && edges[i].contains(v)) {
              that.event.fire("removeedgebyvertex", edges[i], v);
              that.event.fire("removeedge", edges[i]);
              mode.removeEdge(edges[i]);
            }
          }
          that.event.fire("removevertex", v);
          mode.removeVertex(v);
        });
      });
      this.event.on("controlkeydown", function(e) {
        that.controlKeyDown = true;
      });
      this.event.on("controlkeyup", function(e) {
        that.controlKeyDown = false;
      });
      that.event.on("mousemove",function(e,mousepoint){
        that.graph.getVertexes().forEach(function(v) {
          if (v.isPointInVertex(mousepoint)) {
            v.event.fire("mouseover", v, mousepoint, e, that);
            that.event.fire("vertexmouseover", v,  e, that);
            that.event.fire("mouseover", v,  e, that);
          }
        });
        that.graph.getEdges().forEach(function(edge) {
          if (edge.isPointInEdge(that.context, mousepoint)) {
            edge.event.fire("mouseover", edge, mousepoint, e, that);
            that.event.fire("edgemouseover", edge,  e, that);
            that.event.fire("mouseover", edge,  e, that);
          }
        });
      });
      this.event.on("dblclick", function(e, mousepoint) {
        that.graph.getVertexes().forEach(function(v) {
          if (v.isPointInVertex(mousepoint)) {
            v.event.fire("dblclick", v, mousepoint, e, that);
            that.event.fire("vertexdblclick", v, mousepoint, e, that);
          }
        });
        that.graph.getEdges().forEach(function(edge) {
          if (edge.isPointInEdge(that.context, mousepoint)) {
            edge.event.fire("dblclick", edge, mousepoint, e, that);
            that.event.fire("edgedblclick", edge, mousepoint, e, that);
          }
        });
        that.event.fire("redraw", that);
      });
      var selectControl = function(that, e, mousepoint) {
        that.graph.getVertexes().forEach(function(v) {
          if (v.isPointInVertex(mousepoint)) {
            v.event.fire("click", v, mousepoint, e, that);
            v.event.fire("onselected", v, mousepoint, e, that);
            that.event.fire("vertexclick", v, mousepoint, e, that);
          } else if (!(v.getSelected() && that.controlKeyDown)) {
            v.event.fire("nonselected", v, mousepoint, e, that);
          }
        });
        that.graph.getEdges().forEach(function(edge) {
          if (edge.isPointInEdge(that.context, mousepoint)) {
            edge.event.fire("click", edge, mousepoint, e, that);
            edge.event.fire("onselected", edge, mousepoint, e, that);
            that.event.fire("edgeclick", edge, mousepoint, e, that);
          } else if (!(edge.getSelected() && that.controlKeyDown)) {
            edge.event.fire("nonselected", edge, mousepoint, e, that);
          }
        });
      };
      this.event.on("click", function(e, mousepoint) {
        var hasSelectesd = false;
        var v;
        for (var i = that.graph.getVertexes().length - 1; i >= 0; i--) {
          v = that.graph.getVertexes()[i];
          if (that.controlKeyDown) {
            if (v.isPointInVertex(mousepoint)) {
              v.event.fire("click", v, mousepoint, e, that);
              v.event.fire("onselected", v, mousepoint, e, that);
              that.event.fire("vertexclick", v, mousepoint, e, that);
            }
            continue;
          }
          if (v.isPointInVertex(mousepoint) && !hasSelectesd) {
            hasSelectesd = true;
            v.event.fire("click", v, mousepoint, e, that);
            v.event.fire("onselected", v, mousepoint, e, that);
            that.event.fire("vertexclick", v, mousepoint, e, that);
          } else if (v.getSelected()) {
            v.event.fire("nonselected", v, mousepoint, e, that);
          }
        }
        that.graph.getEdges().forEach(function(edge) {
          if (edge.isPointInEdge(that.context, mousepoint)) {
            edge.event.fire("click", edge, mousepoint, e, that);
            edge.event.fire("onselected", edge, mousepoint, e, that);
            that.event.fire("edgeclick", edge, mousepoint, e, that);
          } else if (!(edge.getSelected() && that.controlKeyDown)) {
            edge.event.fire("nonselected", edge, mousepoint, e, that);
          }
        });
      });
      this.event.on("mousedown", function(e, mousepoint) {
        that.mousePoint = mousepoint;
        that.mousedown = true;
        if(that.satelliteView){
          that.satelliteView.mousedown=false;
        }
        var eventFired = false;
        var evname = that.graph.mode + "start";
        var hasSelectesd = false;
        var v;
        for (var i = that.graph.getVertexes().length - 1; i >= 0; i--) {
          v = that.graph.getVertexes()[i];
          if (that.controlKeyDown) {
            if (v.isPointInVertex(mousepoint)) {
              v.event.fire("mousedown", v, mousepoint, e, that);
              v.event.fire("onselected", v, mousepoint, e, that);
              that.event.fire("vertexmousedown", v, mousepoint, e, that);
            }
            continue;
          }
          if (v.isPointInVertex(mousepoint) && !hasSelectesd) {
            hasSelectesd = true;
            v.event.fire("mousedown", v, mousepoint, e, that);
            v.event.fire("onselected", v, mousepoint, e, that);
            that.event.fire("vertexmousedown", v, mousepoint, e, that);
          } else if (v.getSelected()) {
            v.event.fire("nonselected", v, mousepoint, e, that);
          }
        }
        that.graph.getEdges().forEach(function(edge) {
          if (edge.isPointInEdge(that.context, mousepoint)) {
            edge.event.fire("mousedown", edge, mousepoint, e, that);
            edge.event.fire("onselected", edge, mousepoint, e, that);
            that.event.fire("edgemousedown", edge, mousepoint, e, that);
          } else if (!(edge.getSelected() && that.controlKeyDown)) {
            edge.event.fire("nonselected", edge, mousepoint, e, that);
          }
        });
        if (that.graph.getConnectable()) {
          var mosueinVertex = that.graph.getMouseInVertex(mousepoint);
          if (that.graph.connect.vertex && mosueinVertex && that.graph.connect.vertex != mosueinVertex) {
            var edge = new Edge(that.graph.connect.vertex, mosueinVertex);
            that.graph.addEdge(edge);
            that.graph.connect = {};
            that.event.fire("addedge", edge, that);
          } else {
            that.graph.connect.vertex = mosueinVertex;
          }
          return;
        }
        that.graph.getVertexes().forEach(function(v) {
          if (v.getSelected()) {
            v.event.fire("mousedown", v, mousepoint, e, that);
            v.event.fire(evname, v, mousepoint, e, that, that);
            eventFired = true;
          }
        });
        that.graph.getEdges().forEach(function(edge) {
          if (edge.getSelected()) {
            edge.event.fire("mousedown", edge, mousepoint, e, that);
            edge.event.fire(evname, edge, mousepoint, e, that);
          }
        });
      });
      this.event.on("mouseup", function(e, mousepoint) {
        that.mousedown = false;
        that.canvas.style.cursor = "auto";
        if (that.currVertex) {
          that.currVertex.moveTo(mousepoint);
          that.graph.getVertexes().forEach(function(v) {
            v.event.fire("nonselected", v, mousepoint, e, that);
          });
          that.graph.addVertex(that.currVertex);
          that.event.fire("addvertex", that.currVertex, e, that);
          that.event.fire("redraw", that,true);
          that.currVertex = null;
        }
        if (that.graph.getConnectable()) {
          var mosueinVertex = that.graph.getMouseInVertex(mousepoint);
          if (that.graph.connect.vertex && mosueinVertex && that.graph.connect.vertex != mosueinVertex) {
            var edge = new Edge(that.graph.connect.vertex, mosueinVertex);
            that.graph.addEdge(edge);
            that.graph.connect = {};
            that.event.fire("addedge", edge, that);
          } else {
            that.graph.connect = {};
          }
          that.event.fire("redraw", that);
          return;
        }
        var evname = that.graph.mode + "end";
        var hasVertexDragged=false;//add by xzx
        that.graph.getVertexes().forEach(function(v) {
          if (v.isDragging) {
            hasVertexDragged=true;//add by xzx
            v.event.fire("mouseup", v, mousepoint, e, that);
            v.event.fire(evname, v, mousepoint, e, that);
          }
        });
        if(hasVertexDragged){//add by xzx
            that.event.fire(evname,that);
        }
        that.graph.getEdges().forEach(function(edge) {
          if (edge.isPointInEdge(that.context, mousepoint)) {
            edge.event.fire("mouseup", edge, mousepoint, e, that);
            edge.event.fire(evname, edge, mousepoint, e, that);
          }
        });
        
      });
      this.event.on("mousemove", function(e, mousepoint) {
        if (that.menu && that.menu.currVertex) {
          that.mousedown = true;
          that.currVertex = that.menu.currVertex;
          that.menu.currVertex = null;
          if (ABC.isFunction(that.menu.draw)) {
            that.menu.draw();
          }
        }
        if (that.currVertex) {
          that.currVertex.moveTo(mousepoint);
          that.event.fire("redraw", that);
          return;
        }
        if (!that.mousedown) {
          return;
        }
        var xx = mousepoint.x - (!!that.mousePoint ? that.mousePoint.x :0);
        var yy = mousepoint.y - (!!that.mousePoint ? that.mousePoint.y :0);
        that.mousePoint = mousepoint;
        if (that.graph.getConnectable()) {
          that.graph.connect.point = mousepoint;
          var invertex = that.graph.getVertexes().filter(function(v) {
            return v && v.isPointInVertex(mousepoint);
          });
          if (invertex.length < 1 && !that.graph.connect.vertex) {
            that.canvas.style.cursor="move";
            that.graph.shift(xx, yy);
           
          }
          that.event.fire("redraw", that);
          return;
        }
        that.canvas.style.cursor="move";
        var filterd = that.graph.getDraggingVertexes();
        if (filterd.length > 0) {
          filterd.forEach(function(v) {
            v.event.fire("mousemove", v, mousepoint, e, that);
            v.event.fire("drag", v, mousepoint, e, that);
            that.event.fire("vertexdrag", v, mousepoint, e, that);
          });
        } else {
          that.graph.shift(xx, yy);
        }
        that.event.fire("redraw", that);
      });
      this.event.on("wheel", function(e, loc) {
        if (e.wheelDelta > 0 || e.deltaY < 0) {
          that.zoomin(loc);
        } else {
          that.zoomout(loc);
        }
      });
      this.event.on("contextmenu", function(e, mousepoint) {
        try {
          e.preventDefault();
        } catch (ex) {}
        var published = false;
        that.graph.getVertexes().forEach(function(v) {
          if (v.isPointInVertex(mousepoint)) {
            v.event.fire("contextmenu", v, mousepoint, e, that);
            that.event.fire("vertexcontextmenu", v, e, that);
            published = true;
          }
        });
        if (published) {
          return;
        }
        that.graph.getEdges().forEach(function(edge) {
          if (edge.isPointInEdge(that.context, mousepoint)) {
            edge.event.fire("contextmenu", edge, mousepoint, e, that);
            that.event.fire("edgecontextmenu", edge, e, that);
            published = true;
          }
        });
        if (published) {
          return;
        }
        that.event.fire("blankcontextmenu", e, that);
      });
      this.event.on("graphstart", function(view) {
        var allLoaded = false;
        var time = 0;
        var interval = setInterval(function() {
          time++;
          var filter = view.graph.getVertexes().filter(function(v) {
            return !v.loaded;
          });
          if (filter.length <= 0 || time > 9) {
            view.event.fire("redraw", view);
            clearInterval(interval);
            return;
          }
        }, 100);
      });
      that.event.on("holdright", function(graph, point, xx) {
        graph.graph.getUnSelectedVertexes().forEach(function(v) {
          v.shiftX(-xx);
        });
      });
      that.event.on("holdleft", function(graph, point, xx) {
        graph.graph.getUnSelectedVertexes().forEach(function(v) {
          v.shiftX(xx);
        });
      });
      that.event.on("holdtop", function(graph, point, yy) {
        graph.graph.getUnSelectedVertexes().forEach(function(v) {
          v.shiftY(yy);
        });
      });
      that.event.on("holdbottom", function(graph, point, yy) {
        graph.graph.getUnSelectedVertexes().forEach(function(v) {
          v.shiftY(-yy);
        });
      });
      return this;
    },
    draw:function(im) {
      var that = this;
      
      this.context.save();
      this.context.setTransform(1, 0, 0, 1, 0, 0);
      this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);
      this.context.restore();
      this.graph.filterVertexes(this.canvas.width, this.canvas.height).forEach(function(v) {
        v.draw(that.context, that.mousePoint);
      });
      this.graph.filterEdges(this.canvas.width, this.canvas.height).forEach(function(e) {
        e.draw(that.context, that.mousePoint);
      });
      if (this.currVertex) {
        this.currVertex.draw(that.context);
      }
      if (this.graph.connect.vertex && this.graph.connect.point) {
        render.drawArrow(this.context, this.graph.connect.vertex, this.graph.connect.point, {
          strokeStyle:"blue",
          fillStyle:"blue"
        });
      }
      
      if(that.satelliteView&&!im){
        that.satelliteView.init(that);
      }
    },
    start:function() {
      this.initEvent();
      this.listion();
      this.draw();
      this.event.fire("graphstart", this);
      var that = this;
      window.addEventListener("load", function(e) {
        that.event.fire("redraw", that);
      });
      //这个定时器需要在画图工具关闭时销毁
      var interval=setInterval(function() {
        if(!that.mousedown){//当前仅当鼠标按下是触发下面操作
               return false
        }
        var limit = 20;
        var step = 13;
        if (that.mousedown&&(that.currVertex||(that.graph.connect&&that.graph.connect.vertex))||that.graph.getDraggingVertexes().length>0) {
          var width = that.canvas.width;
          var height = that.canvas.height;
          var fired = false;
          if (width <= limit * 2 || height <= limit * 2) {
            return;
          }
          if (that.pointer.x + limit >= width) {
            that.event.fire("holdright", that, that.pointer, step);
            fired = true;
          }
          if (that.pointer.x - limit <= 0) {
            that.event.fire("holdleft", that, that.pointer, step);
            fired = true;
          }
          if (that.pointer.y + limit >= height) {
            that.event.fire("holdbottom", that, that.pointer, step);
            fired = true;
          }
          if (that.pointer.y - limit <= 0) {
            that.event.fire("holdtop", that, that.pointer, step);
            fired = true;
          }
          if (fired) {
            that.event.fire("redraw", that);
          }
        }
      }, 100);
      //将需要在画图工具关闭时销毁的定时器放入	intervals
      this.intervals.push(interval);
    },	
    //获取需要销毁的定时器
    getIntervals:function(){
    	return this.intervals;
    } 
  });
  ABC.GraphView = GraphView;
  var Parser = function() {
    this.default_num = 50;
    this.parseJson = function(json) {
      var graph = new Graph();
      if (!json || !json.vertex || json.vertex.length == 0) {
        return graph;
      }
      var vertexArray = json.vertex;
      var vertexNum = vertexArray.length;
      for (var i = 0; i < vertexNum; i++) {
        this.addVertex(graph, vertexArray[i]);
      }
      if (!json.edge || json.edge.length == 0) {
        return graph;
      }
      var edgeArray = json.edge;
      var edgeNum = edgeArray.length;
      for (var j = 0; j < edgeNum; j++) {
        this.addEdge(graph, edgeArray[j]);
      }
      return graph;
    };
    this.debug = function(msg) {};
    this.addVertex = function(graph, vertex) {
      if (vertex) {
        var width = this.default_num, height = this.default_num;
        var x = vertex.x;
        var y = vertex.y;
        if (this.checkPos(x, y)) {
          width = this.filterToNumber(vertex.width);
          height = this.filterToNumber(vertex.height);
          x = x - width / 2;
          y = y - height / 2;
          vertex.id = this.filterToString(vertex.id);
          var vertex_new = new Vertex(new Point(x, y), new Range(width, height), vertex);
          if(vertex.layers) {
          	for(var i=0; i<vertex.layers.length; i++) {
          	  if(vertex.layers[i]) {
          		vertex_new.addLayer(ABC.Layer.create(vertex.layers[i]));
          	  }
          	}
   		  }
          graph.addVertex(vertex_new);
        }
      }
    };
    this.addEdge = function(graph, edge) {
      if (edge) {
        var from = this.filterToString(edge.from);
        var to = this.filterToString(edge.to);
        var fromVertex = this.searchVertex(from, graph.getVertexes());
        var toVertex = this.searchVertex(to, graph.getVertexes());
        if (fromVertex != null && toVertex != null) {
          var edge_new = new Edge(fromVertex, toVertex, edge);
          graph.addEdge(edge_new);
        }
      }
      return graph;
    };
    this.searchVertex = function(id, vertexArray) {
      var vertexNum = vertexArray.length;
      var vertex = null;
      for (var i = 0; i < vertexNum; i++) {
        if (id == vertexArray[i].id) {
          vertex = vertexArray[i];
          break;
        }
      }
      return vertex;
    };
    this.checkPos = function(x, y) {
      if (!x || !y) {
        this.debug("坐标有误");
        return false;
      }
      return true;
    };
    this.checkStrNum = function(str) {
      var regExp = /^\d+(\.\d+)?$/;
      return regExp.test(str);
    };
    this.filterToNumber = function(x) {
      var value = this.filterNaN(x);
      if (isNaN(value)) {
        value = this.default_num;
      }
      return value;
    };
    this.filterNaN = function(x) {
      if (typeof x != "undefined") {
        return parseInt(x);
      }
      return NaN;
    };
    this.filterToString = function(x) {
      return x + "";
    };
    this.parseGraphToJson = function(graphView,notReset) {
      var vertex = [];
      var edge = [];
      var graph=graphView.graph;
      if (graph && graph.getVertexes().length > 0) {
        var vertexs = graph.getVertexes();
        var vertexNum = vertexs.length;
        var offset={
          notReset:notReset,
          rate:Math.pow(graphView.k,graphView.scale)
        };
        if(vertexNum>0){
          var sample=vertexs[0];
          offset.xx=sample.x/offset.rate-sample.x;
          offset.yy=sample.y/offset.rate-sample.y;
        }
        for (var i = 0; i < vertexNum; i++) {
          this.addVertexConfig(vertex, vertexs[i],offset);
        }
        if (graph.getEdges().length > 0) {
          var edges = graph.getEdges();
          var edgeNum = edges.length;
          for (var j = 0; j < edgeNum; j++) {
            this.addEdgeConfig(edge, edges[j]);
          }
        }
      }
      var json = new Object();
      json.vertex = vertex;
      json.edge = edge;
      return json;
    };
    this.parseGraph=function(graphView,notReset){
      return JSON.stringify(this.parseGraphToJson(graphView,notReset))
    };
    this.addVertexConfig = function(vertexArray, vertex,offset) {
      var config = vertex.config;
      config.text = vertex.text;
      config.id = vertex.id;
      if(offset.notReset){
	      config.x = vertex.x;
	      config.y = vertex.y;
      }else{
	      config.x = vertex.x/offset.rate-offset.xx;
	      config.y = vertex.y/offset.rate-offset.yy;
      }
      config.width = vertex.width;
      config.height = vertex.height;
      vertexArray.push(config);
    };
    this.addEdgeConfig = function(edgeArray, edge) {
      var config = edge.config;
      config.id = edge.id;
      config.from = config.from || edge.start.id;
      config.to = config.to || edge.end.id;
      edgeArray.push(config);
    };
  };
  ABC.parser = new Parser();
  
  var SatelliteView =ABC.SatelliteView= function(canvas,config) {
    this.canvas = canvas;
    this.context = canvas.getContext("2d");
    this.graph = new Graph;
    this.event = new EventProxy;
    this.config=config||{};
    this.canDraw=true;
    //存放需要在画图工具关闭时销毁的定时器画图工具没有销毁事件需要在外面销毁
    this.intervals=[];
  };

  ABC.extend(SatelliteView.prototype, {
    init: function(graphView,immediately) {
      if (!graphView) {
        return;
      }
      this.graphView=graphView;
      graphView.satelliteView = this;
      //this.graphView=graphView;
      this.trigger++;
      /*if(immediately){
        this.trigger=0;
        this.drawImmediately();
      }*/
      
    },
    drawImmediately:function(){
      if(this.isDrawing||!this.canDraw){
        return;
      }
      this.isDrawing=true;
      var graphView=this.graphView;
      if(!graphView){
        return;
      }
      var view = {
        width: graphView.canvas.width,
        height: graphView.canvas.height
      };
      var graphRange = graphView.graph.getGraphRange();
      if(graphRange.max.x<view.width){
        graphRange.max.x=view.width;
      }
      if(graphRange.max.y<view.height){
        graphRange.max.y=view.height;
      }
      graphRange.width=graphRange.max.x-graphRange.min.x;
      graphRange.height=graphRange.max.y-graphRange.min.y;
     /* if (graphRange.width < view.width || graphRange.height < view.height) {
        graphRange.width = Math.max(graphRange.width, view.width);
        graphRange.height = Math.max(graphRange.height, view.height);
        graphRange.max.x = graphRange.width;
        graphRange.max.y = graphRange.height;
      }*/

      var curr = {
        width: this.canvas.width,
        height: this.canvas.height
      };
      var graphRateW = curr.width / graphRange.width;
      var graphRateH = curr.height / graphRange.height;
      var satelliteRate = Math.min(view.width / graphRange.width, view.height/ graphRange.height);
      var graph = ABC.parser.parseJson(JSON.parse(ABC.parser.parseGraph(graphView,true)));
      graph.getVertexes().forEach(function(v) {
        v.x = v.x * graphRateW;
        v.y = v.y * graphRateH;
        v.width*=graphRateW;
        v.height*=graphRateH;
        v.showText=false;
        v.showLayers=false;
        v.updateRadius();
        v.shift(0, 0);
      });
      graph.getEdges().forEach(function(edge){
        edge.config.arrowMinifyRate=0.5;
      });
      
      this.satelliteRectangle = {
        x: graphRange.min.x > 0 ? 0 : -graphRange.min.x*graphRateW,
        y: graphRange.min.y > 0 ? 0 : -graphRange.min.y*graphRateH,
        wRate:graphRateW,
        hRate:graphRateH,
        width: curr.width *view.width / graphRange.width,
        height: curr.height * view.height/ graphRange.height
      };
      graph.shift(this.satelliteRectangle.x,this.satelliteRectangle.y);
      this.graph = graph;
      this.draw();
      this.isDrawing=false;
    },
    start:function(){
      this.initEvent().listion();
      var that=this;
      that.trigger=1;
      //这个定时器需要在画图工具关闭时销毁
      var interval = setInterval(function(){
        that.trigger||(that.trigger=0);
        if(that.trigger&&!that.isDrawing){
          that.trigger=0;
          that.drawImmediately();
        }
      },500);
      this.intervals.push(interval);
    },
    listion: function() {
      var events = ["mouseout", "contextmenu", "focus", "click", "dblclick",
         "mousedown", "mousemove","mouseup", "wheel"
      ];
      var that = this;
      events.forEach(function(name) {
        that.canvas.addEventListener(name, (function(evname) {
          return function(e) {
            try {
              e.preventDefault();
               if (e && e.stopPropagation) {
                  e.stopPropagation();
                } else {
                  e.cancelBubble = true;
                }
            } catch (ex) {}
            var loc = ABC.windowTocanvas(that.canvas, e.clientX, e.clientY);
            that.pointer = loc;
            that.event.fire(name, e, loc);
          };
        })(name), false);
      });
      return this;
    },
    initEvent:function(){
      var that=this;
      this.event.on("mousedown", function(e, mousepoint) {
        that.mousePoint = mousepoint;
        that.mousedown = true;
        
      });
      this.event.on("mousemove", function(e, mousepoint) {
        var xx = mousepoint.x - (!!that.mousePoint ? that.mousePoint.x : 0);
        var yy = mousepoint.y - (!!that.mousePoint ? that.mousePoint.y : 0);
        that.mousePoint = mousepoint;
        if(that.mousedown&&that.graphView&&that.satelliteRectangle){
          that.graphView.graph.shift(-xx/that.satelliteRectangle.wRate,-yy/that.satelliteRectangle.hRate);
          that.graphView.draw(true);
          that.drawImmediately();
        }
      });
      this.event.on("mouseup", function(e, mousepoint) {
        that.mousePoint = mousepoint;
        that.mousedown = false;
        
      });
      this.event.on("mouseout", function(e, mousepoint) {
        that.mousedown = false;
        
      });
      return this;
    },
    draw: function() {
      var that = this;
      this.context.save();
      this.context.setTransform(1, 0, 0, 1, 0, 0);
      this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);
      if(this.config.fillStyle){
        this.context.fillStyle=this.config.fillStyle;
        this.context.fillRect(0, 0, this.canvas.width, this.canvas.height);
      }
      this.context.restore();
      this.graph.getVertexes().forEach(function(v) {
        v.draw(that.context);
      });
      this.graph.getEdges().forEach(function(e) {
        e.draw(that.context);
      });
      this.context.save();
      this.context.beginPath();
      this.context.strokeRect(this.satelliteRectangle.x, this.satelliteRectangle.y, this.satelliteRectangle.width, this.satelliteRectangle.height);
      this.context.closePath();
      this.context.restore();

    },
    //获取需要销毁的定时器
    getIntervals:function(){
    	return this.intervals;
    } 

  });
  
  global.ABC = ABC;
  this.ABC = ABC;
  if (typeof define === "function" && define.amd) {
    define(function() {
      return ABC;
    });
  }
  return ABC;
});