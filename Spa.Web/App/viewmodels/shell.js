define(['durandal/system', 'services/logger', 'plugins/router', 'services/appsecurity', 'services/errorhandler', 'ko.validation'],
    function (system, logger, router, appsecurity, errorhandler) {
        var deferred = $.Deferred();

        var activate = function(){
            //logger.log('SlickBlog Loaded!',
            //    null,
            //    system.getModuleId(shell),
            //    true);
            
            //ko validation config
            ko.validation.configure({
                decorateElement: true,
                errorElementClass: 'has-error'
            });
            

            // Get current auth info
            $.when(appsecurity.getAuthInfo())
                .then(function (authinfo) {
                    appsecurity.user(authinfo);
                    deferred.resolve();

                    return router.activate();
                })
                .fail(self.handlevalidationerrors);


            return deferred.promise();
        };

        //var deferred = $.Deferred();
        
        var shell = {
            activate: activate,
            router: router,
            appsecurity: appsecurity,
            logout: function () {
                var self = this;
                appsecurity.logout().fail(self.handlevalidationerrors);
            },
        };
        
        errorhandler.includeIn(shell);
      

        return shell;
    }
);