(function () {

  /**
   * Create new events object. 
   *
   * **Example:**
   * 
   *     var obj = new uevents();
   *
   * <br>
   * Using new is optional but recommended.
   *
   */

  function uevents() {
    if (!(this instanceof uevents))
      return new uevents();

    this._events = {};
  }

    /**
     * Registers a listener for a specified event.
     *
     * The callback provided will be called every time the event is
     * triggered. All parameters used to triggered the event will be
     * passed as arguments to the function.
     *
     * If you want to register a function to be called only the first
     * time an event is triggered use `once` instead.
     *
     * **Example:**
     *
     *     var obj = new uevents(), ctx = {};
     *     obj.on('signal', function (param) {
     *         console.log('signal called with parameter ' + param + ' and context ' + this);
     *     }, ctx);
     *
     * <br>
     * The calling context is optional, and when omitted the parent
     * uevents instance will be used instead.
     *
     * @param {String} name string to represent an event
     * @param {Function} callback function to call when event is triggered
     * @param {Object} context [optional] calling context
     */
  uevents.prototype.on = function (name, callback, context) {
    if (!this._events.hasOwnProperty(name))
      this._events[name] = [];
    this._events[name].push([callback, context]);

    return this;
  };

    /**
     * Register one-time listener for a specified event.
     *
     * The callback provided will be called only the first time the
     * event is triggered. All parameters used to trigger the event will
     * be passed as arguments to the function.
     *
     * If you want to register a function to be called every time the
     * event is triggered use `on` instead.
     *
     * ### Example:
     *
     *     var obj = new uevents();
     *     obj.once('signal', function() {
     *        console.log('signal called (this will only be printed once)');
     *     });
     *
     * @param {String} name string to represent an event
     * @param {Function} callback function to be called once when event is triggered.
     * @param {Object} context (optional) the calling context for the function (defaults to the instance of the uevents object used)
     */
  uevents.prototype.once = function (name, callback, context) {
    var self = this, once = function () {
      self.off(name, once);
      callback.apply(context || this, arguments);
    };
    return this.on(name, once, context);
  };


    /**
     * Removes listener(s) from an event.
     *
     * If no parameters are given, *all* listeners will be removed from
     * *all* events.
     *
     * If only the event name is specified, then all listeners from the
     * specified event will be removed.
     *
     * If the event name and the callback (and/or context) are
     * specified, then only the listeners for the corresponding event
     * that match the callback (and/or context) will be removed.
     *
     * **Example:**
     *
     *    // removes callback from the 'signal' event
     *    obj.off('signal', callback);
     *
     *
     *    // remove all listeners for the 'signal' event
     *    obj.off('signal');
     *
     * @param {String} name [optional] string to represent an event
     * @param {Function} callback [optional] function called when event is triggered
     * @param {Object} context [optional] calling context
     */
  uevents.prototype.off = function (name, callback, context) {
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
  };

    /**
     * Triggers an event.
     *
     * All parameters used to trigger the event are passed as arguments
     * to the registered listeners for that event.
     *
     * **Example:**
     *
     *    obj.trigger('signal', 'firstparam', 'secondparam');
     *
     * @param {String} name string to represent an event
     * @param {Object} param1 [optional] first parameter
     * @param {Object} param2 [optional] second parameter
     * @param {Object} paramN [optional] ...
     */
  uevents.prototype.trigger = function (name) {
    if (this._events.hasOwnProperty(name)) {
      var args = Array.prototype.slice.call(arguments, 1),
          callbacks = this._events[name],
          len = callbacks.length;
      for (var i = 0; i < len; i++) {
        var callback = callbacks[i][0], context = callbacks[i][1];
        callback.apply(context || this, args);
      }
    }
  };

  /**
   * Extends and object to handle events.
   *
   * **Example:**
   *
   *     var obj = {};
   *     uevents.extend(obj);
   *
   *     // register listener
   *     obj.on('signal', function () {
   *       console.log('signal called');
   *     });
   *
   *     // trigger signal
   *     obj.trigger('signal');
   *
   *     // remove listeners
   *     obj.off('signal');
   *
   *  <br>
   *  The same API is available on extend objects than on native uevents
   *  objects.
   *
   * @param {Object} obj Object to extend to support event handling.
   */
  uevents.extend = function (obj) {
    var data = {_events: {}};
    obj.on = uevents.prototype.on.bind(data);
    obj.once = uevents.prototype.once.bind(data);
    obj.off = uevents.prototype.off.bind(data);
    obj.trigger = uevents.prototype.trigger.bind(data);
  };

  if (typeof require === "function" && typeof exports === "object" && typeof module === "object") 
    module.exports = uevents;
  else if (typeof define === "function" && define.amd) 
    define(["uevents"], function () { return uevents; });
  else
    window.uevents = uevents;
})();
