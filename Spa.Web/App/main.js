requirejs.config({
    paths: {
        'text': 'durandal/amd/text'
    }
});

define(['durandal/app', 'durandal/viewLocator', 'durandal/system', 'durandal/plugins/router', 'services/logger'],
    function(app, viewLocator, system, router, logger) {

        //>>excludeStart("build", true);
        system.debug(true);
        //>>excludeEnd("build");

        //app.title = 'test';
        app.start().then(function () {
            //configure routing
            router.useConvention();

            //Replace 'viewmodels' in the moduleId with 'views' to locate the view.
            //Look for partial views in a 'views' folder in the root.
            viewLocator.useConvention();

            

            //app.adaptToDevice();

            //Show the app by setting the root view model for our application with a transition.
            app.setRoot('viewmodels/shell', 'entrance');
            app.adaptToDevice();
            // override bad route behavior to write to 
            // console log and show error toast
            router.handleInvalidRoute = function (route, params) {
                logger.logError('No route found', route, 'main', true);
            };
        });
    });