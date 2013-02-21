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

NNNNNNNNNDNNNNNNNNNNNNNDD+DDD?++=================D8===++============$7?8DDDDDDDDNDNDNNDNDDDNNNDDDNDD
NNNNNNNNNDNN7NNNNNNNNDN?$DO+Z===================O8===================$?++DDDDDDDDDDDNNNDDDDDNDDDNNDN
NNNNNNNDO$INNNNNNNNNNNDD+====+DO================?=====================8DDDDDDDDDNDDDNDDDNDNDDNDDDDDN
NNNNNND+ID?DNNNNNNND8D8I=+===+DZ=======================================8DDDDDDDDNDNDDDDDNDDDDDDDDDDN
NNNNNNNNDNNDZNNNNNNDD8?==?====DZ=====+==================================8DDDDDDDDDDDDNDDNDDNDDDDDDDD
NNNNNND$NN8N8NNNNNDDND=======O?=============+88=========================IDDDDDDDDDDDDDDDNDDNDDDDDDDD
NNNNNNNNNNNDNDNNNDDIDD+=====+8===?==========DD=========~======~~========+8DDDDDDDDDDDDDDDDDDDDDDNDDD
NNNNNNNNNNDNNDNNDNDODO=====?87=============?D8======~=======~=~~==========?DDDDDDDDDDDDDDDDDDDNDDDDD
NNNNNNNNNNNNNNNDDDNDDO=====================8D+=========~~=====~=~==~=~~==~=?8DDDDDDDDDDDDDDDDDDDDDDD
NNNNNNNNDNDDDDNDDZDDD8============~=======$DO===~========~~===============~~OD8DDDDDDDDDDDDDDDDDDDDD
NNNNNNNDNDNDNDDDD7?DDD==========~=========8D==========~=~====~~~~~~==~=~~=~==?D8D8DDDDDDDNDDDDDDDDDD
NNNNNNNDDDNNDNDDZ++8DDZ==================+88+=~======~===~===~~~~=~==~=~=~~~==8DDDD8DDDDDDDDDDDDDDDD
NDNNNNNNNNNNDDDD$==+D88==================+DD===~==~=~~~=~~~~~~===~~~~~=~~~~~=~=O8DDDDDDDDDDDDDDDDDDD
NNNDNNDDNNDDDDD++===8DDDI====~=====~======D8==~===~==~==~~~~~~~==~~~~~~~~~~=~~=~=ODDDDDDDDDDDDDDDDDD
NNNNNNNNNNDDDDDI$===ZDDD$=====~=~==========8~==~==~==~~~=~~~~~~~~~~=~~~~~~~~=~~~~+DDDDDDDDDDDDDDDDDD
NNNDDNNDDDNDDDO=====ID8===============~~=~=====~=~=~~~~~~~~~=~~~~~~=~~~~~~~~~=~~~~+8DDDDDDDDDDDDDDDD
NNNDNDDNDNNDDDO=====================~====~==~=~~~~~~==~~~~~~~~~~=~~~~~~~~~~~~~~~~~~=DD8DDDDDDDDDDDDD
NNDNDNNNDDDDDDD========~~~===~~====~=~=~=~=====~~~~====~~~~~~~~~~~~~~~~~~~~==~~~~~~=DD8DDDDDDDDDDDDD
=DDNDNDNNDDDDDD?======================~==~=~~===~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~78DDDDDDDDDDDDD
DNNDDNDNDDDDDDD?+=====?I============~~~=~==~~=~~~~~~~~~~=~~~~~~~~~~~~~~~~==~~~~~=~~=8=$DDDDDDDDDDDDD
NDDDDDDDDDDDDDDDDDDDDDDDDDDO7?$==~=~~~~~=~==~====~~~=~~~~~~~~~~~~?87$888D8888D8D8D8DD8DDDDDDDDDDDDDD
NNDDDDDDDDDDDDDDDDDDDDDDDDDDDD8DDDD=ZZI~~==~~~==~~~~~~=~~~=7+==$888D88D8DD8D888DDD88D8DDDDDDDDDDDDDD
DDDODDDDDDNDDDDDDDDDDD88DDDD8D8DDDD8D8DO=~~~~~=~=~~~~~~~~+88888888D8D8D8DDD888D8DDDDDDDDDDDDDDDDD8DD
DD8D8==7DDDDDDDDDO====~===?78DDDDDD88DDD8=~~~~~~=~~~~~~?888D88D88D88888O8+~+888D8DDDDDDDDDDDDDDDDDDD
DO======D8DDDD7====IDDDDD8D8DDDDDDDDDDDD88$=~~~~~~~~~~~8DD888DD8888I~~~~+=$88$??+8D8DDDDDDDDDDDDDDDD
DO======DDDDZ8==+====~DDDDDDDDDDDDDDD8DD8$==~~~~~~~~~~~O8DD888D8$~~+8D8DDD8D8DDDDD8DDD8DDDDDDDDDDDDD
D?========ZD8=ZI~=====+?8DDDDDDDD8DDDD888~~=~~~~~~~~~~=88DDD888=~8D888DD888+?+?888DD8DDDDDDDDDDDDDDD
D=========D?O==========?DDDDDDDDDDD8DD88I~~~~~~~~~ZI==8888D888~888888DD8=O8+888O8D88DDDDDDDDDDDDDDDD
DD=======D87===88DD8D8DDDDDDDDDDDDDD8I8D88~~~~~~~=~~~=8D8888$D8888DD88$$8Z7888DD8DDDDDDD8DDDDDDDDDDD
DDDD7===88O==DDD8DDDDDDDD8DDDDDDD888DDO88=~~~~~~~~~~+888D888Z888D8888D8D8D88888D88D8DD8DDDD8DDDDDDDD
88DDDDD=DI7=8DD8DDDDDD88D88DDDDN88888=~8O~~~~~~~~~~~~=88D88888D88888888D88DDD888888DD8DDD8D88DDDDDDD
====DDDDDI===88Z=8+I+888D888888888===~~88$7~~~~~~~~~~~=88888888888OZ~~88888D8DDDDD8888D8DDDD8D8D8DDD
======+D8========+888Z++===O=~=~=7=~~$8?88O~~~~~~~~~~~+8888O8D888~~~~~~=+O8OO88D888888DDDDODD88DD8DD
=======I88===~~==~===~=~~==~~~~~~OZ~~~~?88Z~~~~~~~~~~~~888888D888$~~~~~~~I=$888888888DD88$$88888DDDD
=========8==~~===~===~=~~~~~~~~~~~~~~~~=88~~~~~~~~~~~~~~8D8888888Z~~~~~~~~~~=8888888888Z7~878D88D8DD
=========8+~=~~~~===~=~~~~~~~~~~~~~=~~=D8~~~~~~~~~~~~~~~8888888D88$~~~~~~~~~=88888D8D87~~+Z~8D88D8D8
=====~====8=~=~~~~~~~~~~~~~~~~~~~~~~~=8ZI~~~~~~~~~~~~~~~Z888888O88$8$~~~~~~~=~8888888=~~=8~~88888DD8
========~==8=~~~~~~~~~~~~~~~~~=~~~~~~88$~~~~~~~~~~~~~~~~888888O7$88+~~~~~~~~888OO?O=~~~~8IZ+888D8D88
===========~$8=~~~~~~~~~~~~~~~~~~~~=Z$O~~~~~~~~~~~~~~~~~88888=88~$?Z~~~~~~~~~~~~~~~~~~=Z~8O88DD88888
=====~===~=~==78+=~~~~~~~~~~~~~~~=8=$8~~~~~~~~~~~~~~~~~~8888888888~~~~~~~~~~~~~~~~~~=O=~88D888888888
O==========~=~=~=88+=~~=~~~~~~=ZZ=~OO=~~~~~~~~~~~~~~~~~=888D8888888Z?~~~~~~~~~~~~=ZO=~~78D888D888D88
8=====~~=~~===~~~=~~~=IOOOOO+=~+~O88+~~~~~~~~~~~~~~~~~~888888888888OZ788OO~=ZIOOI~~~~=888888D8888888
D?========~~=~~~~~~~~~~~~=~~~~~=O8O~~~~~~~~~~~~~~~~~~~~~888888888$=IO888I+?O~~~~~?~$8D88D888D8888888
D8=======~===~=~~=~~~~~~~~~~=88OZ?~~~~~~~~~~~~~~~~~~=~~~O888888888~~~+888888888888O8888888D888888888
D8I====~==~=~=~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~88888888888~~~~~78888888888888D88DDD88888888
DD=====~~~=~~~~~=~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~I888888888888~~~~~~=+7888888888D8888888888D88
DD7==~===~~=~~~~~~=~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~=88888888D8888=~~~~~~~~~Z8888D888D88888888D888
DN8====~==~~=~~~~~~~~~~~~~~~~~=~~~~~~~~~~~~~~~~~~~~~~~~8888888888888+~~~~~~~~~~+888D8DD8D888D8DD8888
DDD===~~=~=~=~~~=~~=~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~O8888D888888888~~~~~~~~~~=888888888888888888D8
DDD?=~~====~~=~~=~~~~~~~~~~~~~~~~~~~~~~~~~~=~~~~~~~~~~O88888888888888~~~~~~~~~~O8888888888888D88D88D
DDD7=~====~=~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~Z88888888888888I~~~~~~~==8888888D888888D8D8888
DDD8===~~=~~~~~~~~~~~~~~~~~~~~~~~~~~~~~$OOZ~~~~~~~~~~O888888888888888~~~~~~~~~8888888888888D8D888888
D8D8======~=~~=~~~~~~~~~~~~~~~~~=~~~~~~O88888=~~~=?888888888888888888=~~~~~~~888888888D88DD888888888
DDD8===~~====~~~~~~~~~~~~~~~~=~~~~~=~~~~=88888888888888888888888888888~~~~~~=88888888888D888888888D8
DDDDO======~=~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~=88888888888O8888888888888~Z~~~~O88888888888888888888D88
DDDD8==~=~===~~~~~=~~~~~~~~~~~~~~~~~~~~~~~~~~~=OO888888888888888888888=~~~~~788888888888888888D8888D
DDD88======~~~~=~~~=~~~~~~~~~~~~~~~~~~~~~~~~~~~~8888888888888888888O888=+~~O8888888888D8888888888888
DDDD8Z==~===~=~~~~~=~~~~~~~~~~~~~~~~~~~~~~~~~~~=88888888888888888888888888888888888888888D8888888888
DD888O========~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~=I8888888888888O888888888888888888D8888888888888888888
DDDDD87~==~==~==~~=~=~~~=~~~~=~~~~~~=~~~~~~~~~~~8888888888888888888888888D88888888888888888D88888888
DDDDD88==~~=====~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~=7?I88D88888888888888D888888888888888O8888888888D8
DDDDDD8$==~=~~~~=~=~~~=~~~~~~~===IZ8O=~~~~~~~=~=~~~~~~=8888888888888D88D88888D888888OO88O88888888888
DDDDDD88====~==~~=~~=~~~~~=~~=88888888==O8O88888O=~==888888888888888888D888888888888888888888888D888
DDDDDDD88===~~~~=~=~=~~~~~=~=88888888888888888888888888D8D8D8888O8888888888888888O88888OD8D8888D88D8
DDDDDDDD88=~~==~~==~~=~~=~~~O8888888O88888888888888888888888D8888888D888D88888D888888888888888888D88
DDDDDDDDDD8==~==~~=~=~~~~~~=~~~=~==~~~~~~~~======~~=78OO88888888888D888888D8888888888888888D88888888
DDDDDDDDD888=====~~=~~=~~====~~==~~~~~~~==~~~===~~=====++88D8888888888888888888D8DD88888888888888DD8
DDDDDDDD8D8D8========~~~=~===~~~~~~~~=~~=~~=~==O+++==888888D8888888888888DD88D8D8888888888888D888888
DDDDDDDDDDDDD8=======~~==~~=~==~~~~=~==~=~===~Z88888888D8888888888DD888888888D88888D888888D8888888D8
DDDDDDDDDDDD8D88=========~=~~~=~=~~~~====~~~~=?88888888888888888888888888DD88D88D888888888888888D88D
DDDDDDDDDDDD8D88D?~===========~=====~~~~==~~=+O888O888D8D888888D888D888D88888888888888D88D888888888D
DDDDDDDDDDDDDDDDD8O==~==========~~~~~~~==~~~~=O8888888888888888888888DD888D888D888D888888DD88D88888D
8DDDDDD8DDDD8DDD888O+==~~~===~~==~==~~===~~=~~~~=~~==7OZ=ZO8O888888D8D8D88888888888888D888888D888D88
DDDDDDDD8D88I==8888D88+==~~~~=~~===~======~~==~===~==~=======~====I888888D8DDDD88D88888888DDDD888888
DDDDDDD8O=======O8?8888O==~====~==~=~===~==~~~~==========~=====~===88888D8D8888D8DD8888DNDD88D888D8D
DDD8================ID88DO==~=====~====~~==~=~==~==~===~===~==~==~==88888D8DD888D8D88D8DDDD8D8D888D8
D?====================888D8+=========~===~==~==~~=====~~=~=~~~===$O88888D8888DD888D8D8DD88888888D88D
=======================88D8D8O===================~~~====~=~==~==$8888888DDD8DD8888888DD8D888D8888D88
=========================88D888=============~===~======~=~=====O8888888888888D888888DD88D8DD88DD8D8D
===========================8DD88O===================~=======Z888D88D888DD8888D8DDDDD888D88D8D888DDDD
============================88DD8888O====================88888D8D88888DD88888D8DD888D8DDDDD88DDDD8DD
=============================O8D88DD8D8888Z?88OO88O788888888D8D8D8DD8D88888888DDD8DD88DD88DDDD888D88
++===========================+88D888DDDDD8D88888888D88DD8888D8DDD8D88D88888DD88DDDDDD8888DD8D88D8DDD
II???II.I????????????+??++++?++++?$$8NDDDDDDNDDDDDDDDDDDDDDDDDDDDD8DDDDDD8DDDDDDDDDDDDDDDD88D8D8DDDD
NDDNDDDO.ODDDDDD8DDDDDDD88DDDD8DD88888O888OOOOOOOZOZZZZZZ$ZZZZZ$$$$$$Z$$Z$$$$77$$$77$$$77$7$$$I??I77
                                                                                     GlassGiant.com