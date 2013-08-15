define(['durandal/system', 'services/logger', 'durandal/plugins/router', 'config', 'services/appsecurity', 'services/errorhandler'],
    function (system, logger, router, config, appsecurity, errorhandler) {
        var shell = {
            activate: activate,
            router: router,
            appsecurity: appsecurity,
            logout: function () {
                var self = this;
                appsecurity.logout().fail(self.handlevalidationerrors);
            },
        };
        return shell;

        function activate() {
            logger.log('SlickBlog Loaded!',
                null,
                system.getModuleId(shell),
                true);
            router.map(config.routes);
            //return router.activate(config.startModule);
            $.when(appsecurity.getAuthInfo())
                .then(function (authinfo, entitymanagerinfo) {
                    appsecurity.user(authinfo[0]);
                    return router.activate(config.startModule);
                })
                .fail(self.handlevalidationerrors);
        }
        errorhandler.includeIn(shell);

    }
);