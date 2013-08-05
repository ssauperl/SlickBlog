define(['durandal/system', 'services/logger', 'durandal/plugins/router', 'config'],
    function (system, logger, router, config) {
        var shell = {
            activate: activate,
            router: router
        };
        return shell;

        function activate() {
            logger.log('SlickBlog Loaded!',
                null,
                system.getModuleId(shell),
                true);
            router.map(config.routes);
            return router.activate(config.startModule);
        }

    }
);