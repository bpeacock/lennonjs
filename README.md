# Lennon, A Javascript Router

## Dependencies
Modernizr, jQuery 1.8.6+

## Constructor Options
- **historyEnabled**: By default, uses the Modernizr.history property.  When true, Lennon uses the history pushState method when routing.  When false, Lennon will gracefully fallback to using the location hash instead.
- **linkSelector**: A jQuery selector that is used to determine which links will cause the router to process when clicked.  By default, it is append on internal links only, `'a[target!=_blank]:not([href^=http])'`.  Of course, this will not apply to internal links that use a FQDN (http://somehost.com).
- **logger**: An object that must consist of each of the following methods at the minimum: `error(params, …)`, `info(params, …)` and `warn(params, …)`.  By default, window.console is used.
- **publishEvent**: If you pass a string to Lennon's define method, you must also provide a publish method that accepts a String as the first argument and an Object as the second argument.  Lennon will eventually call `publishEvent(eventName, context)` when a route is matched.

## Creating the Lennon object
<pre>
var router = new Lennon({
    logger: myCustomLogger,
    publishEvent: somePubSubLibrary.publish
});
</pre>

## Defining routes
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

## Processing a route
<pre>
router.process();
</pre>

That's it.  The process method will attach behavior to

# Notes
- index.html does not run properly unless setup as a site not served from the ***file:*** protocol.  It just serves as a demo that dynamically adds routes that you can click on and watch console logging.

# Future stuff
- Make logging conditional.  Currently, the custom logger I am passing to it has a debug switch.
- Default the historyEnabled property to standalone feature sniffing which removes the dependency on Modernizr.