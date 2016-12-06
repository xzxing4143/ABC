/**
 * 事件代理工具类
 */
 var EventProxy  = function() {
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
  export  {EventProxy} ;