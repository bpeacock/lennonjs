/*!
 * Lennon v0.1
 *
 * An extremely lightweight router that uses the History API and falls back to hash.
 *
 * @author Gabe Hayes <gabriel.hayes@gmail.com>
 * @copyright 2013, Gabe Hayes
 */
(function(window, $, Modernizr, undefined) {

    'use strict';

    return window.Lennon = function(opts) {

        var current_route,
            initialized = false,

            options = $.extend({

                //-- determines whether or not the history api is enabled
                historyEnabled: Modernizr.history,

                //-- a jQuery selector for links that will have routing behavior applied to them
                linkSelector: 'a[target!=_blank]:not([href^=http])',

                //-- the logger requires error, info and warn methods
                logger: window.console,

                //-- the publish event that will dispatch the registered event name
                publishEvent: null

            }, opts),

            routes = [],

            initialize = function(router) {

                var processRoute = function() {
                        router.process();
                    };

                if ( !initialized ) {

                    $(document).on('click', options.linkSelector, function() {
                        var $this = $(this),
                            href = $this.attr('href');

                        //-- Use pushstate on anchor clicks
                        if ( options.historyEnabled ) {
                            window.history.pushState(null, null, href);
                            processRoute();
                            return false;

                        //-- Hashify internal links if history is not available
                        } else {
                            if ( !$this.data('lennonized') ) {
                                $this.attr('href', '/#' + href).data('lennonized', true);
                            }
                        }
                    });

                    $(window).on(options.historyEnabled? 'popstate' : 'hashchange', processRoute);
                    initialized = true;
                }

            };

        return (function() {

            return {
                define: function(pathName, eventName, exitEventName) {

                    var occurence = pathName.match(/:/g) || [],
                        pattern = new RegExp('^' + pathName.replace(/\//g, "\\/").replace(/:(\w*)/g,"(\\w*)") + '$'),
                        route = {
                            eventName: eventName,
                            exitEventName: exitEventName,
                            paramCount: occurence.length,
                            path: pathName,
                            pattern: pattern
                        };

                    //-- If the eventName is a string, we require a publishEvent
                    if ( 'string' === typeof eventName && !options.publishEvent ) {
                        throw new Error('Cannot publish the event "' + eventName + '" for the route "' + pathName + '". No publishEvent has been provided.');
                    }

                    //-- Add the route
                    options.logger.info('Adding route', pathName, route);
                    routes.push(route);

                    //-- Make sure we have initialized
                    initialize(this);
                },

                dispatch: function(route, context) {
                    var e;

                    options.logger.info('Dispatching', route.path, 'with', context);

                    //-- Execute the callback
                    if ( 'function' === typeof route.eventName ) {
                        e = route.eventName(context || {});

                    //-- Run the publish event
                    } else {
                        e = options.publishEvent(route.eventName, context || {});
                    }

                    return e;
                },

                process: function() {
                    var context = {},
                        i, j,
                        paramKeys,
                        params,
                        path = options.historyEnabled? window.location.pathname : window.location.hash.replace('#', '') || '/';

                    //-- If we land on the page with a hash value and history is enabled, redirect to the non-hash page
                    if ( window.location.hash && options.historyEnabled ) {
                        window.location.href = window.location.hash.replace('#', '');

                    //-- If we land on the page with a path and history is disabled, redirect to the hash page
                    } else if ( '/' !== window.location.pathname && !options.historyEnabled ) {
                        window.location.href = '/#' + window.location.pathname;
                    }

                    //-- Process the route
                    options.logger.info('Processing path', path);
                    for ( i in routes ) {

                        //-- See if the currently evaluated route matches the current path
                        params = path.match(routes[i].pattern);

                        //-- If there is a match, extract the path values and match them to their variable names for context
                        if ( params ) {
                            paramKeys = routes[i].path.match(/:(\w*)/g,"(\\w*)");
                            for ( j = 1; j <= routes[i].paramCount; j++ ) {
                                context[paramKeys[j - 1].replace(/:/g, '')] = params[j];
                            }

                            if ( current_route ) {

                                //-- Don't dispatch the route we are already on
                                if ( current_route.path === routes[i].path ) {
                                    return false;
                                }

                                //-- Dispatch the exit event for the route we are leaving
                                if (  current_route.exitEventName ) {

                                    options.logger.info('Exiting', current_route.path, 'with', context || {});

                                    //-- Execute the callback
                                    if ( 'function' === typeof current_route.exitEventName ) {
                                        current_route.exitEventName(context || {});
                                    //-- Run the publish event
                                    } else {
                                        options.publishEvent(current_route.exitEventName, context || {});
                                    }
                                }
                            }

                            //-- Update the current route
                            current_route = routes[i];

                            //-- Dispatch
                            return this.dispatch(routes[i], context);
                        }

                    }

                    //-- No route has been found, hence, nothing dispatched
                    options.logger.warn('No route dispatched');
                }
            };
        }());
    };
}(this, jQuery, Modernizr));

if ( typeof define === "function" && define.amd ) {
    define( "Lennon", [], function () { return Lennon; } );
}