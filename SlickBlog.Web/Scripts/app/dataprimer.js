define('dataprimer',
    ['ko', 'datacontext', 'config'],
    function (ko, datacontext, config) {

        var logger = config.logger,
            
            fetch = function () {
                
                return $.Deferred(function (def) {

                    var data = {
                        posts: ko.observableArray(),
                        users: ko.observableArray()
                        //todo list more properties when needed
                    };

                    $.when(
                        datacontext.posts.getData({ results: data.posts })//,
                        //datacontext.users.getData({ results: data.users }),
                         //todo: get more data when needed
                        //datacontext.user.getFullUserById(config.currentUserId,
                        //    {
                        //        success: function(user) {
                        //            config.currentUser(user);
                        //        }
                        //    }, true)
                    )

                    .pipe(function () {
                        // Need sessions and speakers in cache before
                        // speakerSessions models can be made (client model only)
                        // yet unknown what we could do here
                    })

                    .pipe(function() {
                        logger.success('Fetched data for: '
                            + '<div>' + data.posts().length + ' posts </div>'
                            //+ '<div>' + data.users().length + ' users </div>'
                            //+ '<div>' + (config.currentUser().isNullo ? 0 : 1) + ' user profile </div>'
                        );
                    })

                    .fail(function () { def.reject(); })

                    .done(function () { def.resolve(); });

                }).promise();
            };

        return {
            fetch: fetch
        };
    });