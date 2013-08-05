define('route-config',
    ['config', 'router', 'vm'],
    function (config, router, vm) {
        var
            logger = config.logger,
            
            register = function() {

                var routeData = [


                    // Posts routes
                    {
                        view: config.viewIds.posts,
                        routes:
                            [{
                                route: config.hashes.posts,
                                title: 'Posts',
                                callback: vm.posts.activate,
                                group: '.route-top'
                            }]
                    },

                    // Post details routes
                    {
                        view: config.viewIds.posts,
                        route: config.hashes.posts + '/:id',
                        title: 'Post',
                        callback: vm.posts.activate,
                        group: '.route-left'
                    },

                    //// User and user details routes
                    //{
                    //    view: config.viewIds.users,
                    //    route: config.hashes.users,
                    //    title: 'Users',
                    //    callback: vm.users.activate,
                    //    group: '.route-top'
                    //},{
                    //    view: config.viewIds.user,
                    //    route: config.hashes.users + '/:id',
                    //    title: 'user',
                    //    callback: vm.user.activate
                    //},

                    // Invalid routes
                    {
                        view: '',
                        route: /.*/,
                        title: '',
                        callback: function() {
                            logger.error(config.toasts.invalidRoute);
                        }
                    }
                ];

                for (var i = 0; i < routeData.length; i++) {
                    router.register(routeData[i]);
                }

                // Crank up the router
                router.run();
            };
            

        return {
            register: register
        };
    });