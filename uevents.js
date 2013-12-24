(function () {

  function uevents() {
    if (!(this instanceof uevents))
      return new uevents();

    this._events = {};
  }

  uevents.prototype = {
    on: function (name, callback, context) {
      if (!this._events.hasOwnProperty(name))
        this._events[name] = [];
      this._events[name].push([callback, context]);

      return this;
    },

    once: function (name, callback, context) {
      var self = this, once = function () {
        self.off(name, once);
        callback.apply(context || this, arguments);
      };
      return this.on(name, once, context);
    },

    off: function (name, callback, context) {
      if (!name) {
        this._events = {};
      } else if (this._events.hasOwnProperty(name)) {
        if (!callback && !context) {
          delete this._events[name];
        } else {
          var event = this._events[name], filtered = [];
          for (var i = 0, len = event.length; i < len; i++) {
            if ((!callback || event[i][0] !== callback) && (!context || event[i][1] === context))
              filtered.push(event[i]);
          }
          if (!filtered.length)
            delete this._events[name];
          else
            this._events[name] = filtered;
        }
      }

      return this;
    },

    trigger: function (name) {
      if (this._events.hasOwnProperty(name)) {
        var args = Array.prototype.slice.call(arguments, 1),
            callbacks = this._events[name],
            len = callbacks.length;
        for (var i = 0; i < len; i++) {
          var callback = callbacks[i][0], context = callbacks[i][1];
          callback.apply(context || this, args);
        }
      }
    }
  };

  uevents.extend = function (obj) {
    obj._events = {};
    obj.on = uevents.prototype.on;
    obj.once = uevents.prototype.once;
    obj.off = uevents.prototype.off;
    obj.trigger = uevents.prototype.trigger;
  };

  if (typeof require === "function" && typeof exports === "object" && typeof module === "object") 
    module.exports = uevents;
  else if (typeof define === "function" && define.amd) 
    define(["uevents"], function () { return uevents; });
  else
    window.uevents = uevents;

})();
