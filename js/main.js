(function(window, $, Modernizr, undefined) {
    $(function() {

        var $form = $('form'),
            $routeList = $('.routes'),
            router = new Lennon();

        $form.on('submit', function() {
            var $routeLink = $('<a />'),
                $routeListItem = $('<li />'),
                $routePath = $form.find('input[name=path]'),
                path = $routePath.val();

            if ( path.length ) {

                //-- Add the route to the list of links
                $routeLink.attr('href', path.replace(/:/g, '')).text(path).on('click', function() {
                    console.group('Routing');
                });
                $routeListItem.append($routeLink).appendTo($routeList);

                //-- Define the new route
                router.define(path, function(context) {
                    console.log('Running callback for', path, 'with context', context);
                    console.groupEnd();
                });

                //-- Clear the form value
                $routePath.val('');
            }

            return false;
        });

    });
}(window, jQuery, Modernizr));