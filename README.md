# uevents.js

Micro events library for javascript. It works in the browser and has support
for CommonJS and AMD loading built in. It can also be used on the server
through `node.js`, but for most applications usage of the native
`events` API should suffice.

This library has no external dependencies and weights less than 1kb when
minified and gziped.

Complete API documentation is available [here](http://acornejo.github.io/uevents.js/).

## Basic Usage

You can create a new uevents object on which you can register callbacks
for named events, and unregister callbacks for named events, and trigger
events.

```javascript
    // create new uevents object
    var obj = uevents.create();

    // register callback for signal receiving two parmeters
    obj.on('signal', function (a, b) {
        console.log("a: " + a + ", b: " + b);
    });

    // trigger signal with 'A' and 'B'
    // should print "a: A, b: B"
    obj.trigger('signal', 'A', 'B');

    // trigger signal with 5 and 6
    // should print "a: 5, b: 6"
    obj.trigger('signal', 5, 6);

    // remove all callbacks for 'signal'
    obj.off('signal');

    // trigger signal 'A' and 'B'
    // nothing happens, no callbacks registered
    obj.trigger('signal', 'A', 'B');
```

You can also extend an existing object to allow it to emit and receive
events using the same API.

```javascript

    var obj = new ComplicatedCustomObject();

    uevents.create(obj);

    // register callback for 'signal'
    obj.on('signal', function () {
        console.log('signal emitted');
    });

    // trigger callbacks for 'signal'
    obj.trigger('signal');
```

