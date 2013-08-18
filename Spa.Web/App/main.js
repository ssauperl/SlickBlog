requirejs.config({
    paths: {
        'text': '../Scripts/text',
        'durandal': '../Scripts/durandal',
        'plugins': '../Scripts/durandal/plugins',
        'transitions': '../Scripts/durandal/transitions'
        //,
        //'knockout': '../Scripts/knockout-2.3.0',
        //'bootstrap': '../Scripts/bootstrap',
        //'jquery': '../Scripts/jquery-2.0.3',
        //'toastr': '../Scripts/toastr'
    }
    //,
    //shim: {
    //    'bootstrap': {
    //        deps: ['jquery'],
    //        exports: 'jQuery'
    //    },
    //}
});

define('jquery', function () { return jQuery; });
define('knockout', ko);

define(['durandal/system', 'durandal/app', 'durandal/viewLocator', 'plugins/router', 'config', 'services/appsecurity'],
    function (system, app, viewLocator, router, config, appsecurity) {

        //>>excludeStart("build", true);
        system.debug(true);
        //>>excludeEnd("build");
        
        app.title = 'SlickBlog';

        //specify which plugins to install and their configuration
        app.configurePlugins({
            router: true,
            dialog: true,
            widget: {
                kinds: ['expander']
            }
        });

        
        
        app.start().then(function () {
            //Replace 'viewmodels' in the moduleId with 'views' to locate the view.
            //Look for partial views in a 'views' folder in the root.
            viewLocator.useConvention();
            
            //setup router
            router.map(config.routes)
                .buildNavigationModel()
                .mapUnknownRoutes('viewmodels/posts', 'not-found');
            
            // Add antiforgery => Validate on server
            appsecurity.addAntiForgeryTokenToAjaxRequests();

            // If the route has the authorize flag and the user is not logged in => navigate to login view
            router.guardRoute = function (instance, instruction) {
                if (instruction.config.authorize) {
                    if (appsecurity.user().IsAuthenticated && appsecurity.isUserInRole(instruction.config.authorize)) {
                        return true;
                    } else {
                        return "/#/login?redirectto=" + instruction.config.hash;
                    }
                }
                return true;
            };

            
            

            //Show the app by setting the root view model for our application with a transition.
            app.setRoot('viewmodels/shell', 'entrance');
        });
    });