# Lennon, A Javascript Router

Why another JS router you may ask?  Well, I was in need of an ***extremely*** lightweight router, that would take advantage of the History API and fallback to hash.  Most of the routers I came across, while wonderful projects in their own right, contained way more than I was looking for.  The project I was working on was already using [amplify.js](http://amplifyjs.com/), so I really just wanted to pass my router an event name to publish rather than a callback to run.

So, I wrote Lennon to do just that.  Define a few routes and tell it which event to publish (you can optionally pass a callback, as well) then run!

In a nutshell,
<pre>
var router = new Lennon();
router.define('/', 'myDefaultRoute');
router.define('/another/:route', 'anotherRoute');
router.process();
</pre>

When process is called, the passed event name would be dispatched on the matching route.  Granted, you have to pass a publish method to Lennon's constructor.  If you aren't using pub/sub, callbacks work all the same.
<pre>
var router = new Lennon();
router.define('/', function(context) {
    //-- Do default route stuff
});
router.define('/another/:route', function(context) {
    //-- Do stuff with context.route
});
router.process();
</pre>

### Dependencies
Modernizr, jQuery 1.8.6+

### Constructor Options
- **historyEnabled**: By default, uses the Modernizr.history property.  When true, Lennon uses the history pushState method when routing.  When false, Lennon will gracefully fallback to using the location hash instead.
- **linkSelector**: A jQuery selector that is used to determine which links will cause the router to process when clicked.  By default, it is append on internal links only, `'a[target!=_blank]:not([href^=http])'`.  Of course, this will not apply to internal links that use a FQDN (http://somehost.com).
- **logger**: An object that must consist of each of the following methods at the minimum: `error(params, …)`, `info(params, …)` and `warn(params, …)`.  By default, window.console is used.
- **publishEvent**: If you pass a string to Lennon's define method, you must also provide a publish method that accepts a String as the first argument and an Object as the second argument.  Lennon will eventually call `publishEvent(eventName, context)` when a route is matched.

### Creating the Lennon object
<pre>
var router = new Lennon({
    logger: myCustomLogger,
    publishEvent: somePubSubLibrary.publish
});
</pre>

### Defining routes
You can add dynamic route parameters by prefixing with a colon (/someModule/:id).  The context object will then parse the path value into a property called id.

#### With callbacks
<pre>
router.define('/', function(context) {
    //-- Do stuff
});

router.define('/some/:path', function(context) {
    /*
    This will match "/some/param" and context will be
    {Object} => {
        path: "param"
    }
    */
});
</pre>

#### With pubsub
<pre>
router.define('/', 'defaultPathEventName');
router.define('/some/:path', 'someOtherPathEventName');

somePubSubLibrary.subscribe('defaultPathEventName', function(context) {
    //-- Do stuff
});
somePubSubLibrary.subscribe('someOtherPathEventName', function(context) {
    /*
    This will match "/some/param" and context will be
    {Object} => {
        path: "param"
    }
    */
});
</pre>

### See it in action
Just a simple demo page to dynamically add routes and see how pushState or onhashchange responds to them.  [See it here](http://gabehayes.github.com/lennonjs/demo.html).

### Future stuff
- Make logging conditional.  Currently, the custom logger I am passing to it has a debug switch.
- Default the historyEnabled property to standalone feature sniffing which removes the dependency on Modernizr.