define('vm.post',
    ['ko', 'datacontext', 'config', 'router', 'messenger'],
    function (ko, datacontext, config, router, messenger) {

        var

            post = ko.observable(),
            logger = config.logger,
            
            validationErrors = ko.computed(function () {
                var valArray = post() ? ko.validation.group(post())() : [];
                return valArray;
            }),

            canEditPost = ko.computed(function () {
                return post() && config.currentUser() && config.currentUser().id() === post().userId();
            }),

            isDirty = ko.computed(function () {
                if (canEditPost()) {
                    return post().dirtyFlag().isDirty();
                }
                return false;
            }),

            isValid = ko.computed(function () {
                return (canEditPost()) ? validationErrors().length === 0 : true;
            }),

            activate = function (routeData, callback) {
                messenger.publish.viewModelActivated({ canleaveCallback: canLeave });
                currentPostId(routeData.id);
                getPost(callback);
            },

            cancelCmd = ko.asyncCommand({
                execute: function (complete) {
                    var callback = function () {
                        complete();
                        logger.success(config.toasts.retreivedData);
                    };
                    getPost(callback, true);
                },
                canExecute: function (isExecuting) {
                    return !isExecuting && isDirty();
                }
            }),

            goBackCmd = ko.asyncCommand({
                execute: function (complete) {
                    router.navigateBack();
                    complete();
                },
                canExecute: function (isExecuting) {
                    return !isExecuting && !isDirty();
                }
            }),

            canLeave = function () {
                return !isDirty() && isValid();
            },

            getPost = function (completeCallback, forceRefresh) {
                var callback = function () {
                    if (completeCallback) { completeCallback(); }
                };

                datacontext.posts.getFullPostById(
                    currentPostId(), {
                        success: function (s) {
                            post(s);
                            callback();
                        },
                        error: callback
                    },
                    forceRefresh
                );
            },


            saveCmd = ko.asyncCommand({
                execute: function (complete) {
                    if (canEditPost()) {
                        $.when(datacontext.posts.updateData(post()))
                            .always(complete);
                        return;
                    }
                },
                canExecute: function (isExecuting) {
                    return !isExecuting && isDirty() && isValid();
                }
            }),

            tmplName = function () {
                return canEditPost() ? 'post.edit' : 'post.view';
            };

        return {
            activate: activate,
            cancelCmd: cancelCmd,
            canEditPost: canEditPost,
            canLeave: canLeave,
            goBackCmd: goBackCmd,
            isDirty: isDirty,
            isValid: isValid,
            post: post,
            tmplName: tmplName
        };
    });