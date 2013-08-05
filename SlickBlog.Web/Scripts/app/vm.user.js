define('vm.user',
    ['ko', 'datacontext', 'config', 'router', 'messenger'],
    function (ko, datacontext, config, router, messenger) {

        var
            // Properties
            currentUserId = ko.observable(),
            logger = config.logger,
            user = ko.observable(),

            validationErrors = ko.computed(function () {
                // We don;t have a user early on. So we return an empty [].
                // Once we get a user, we want to point to its validation errors.
                var valArray = user() ? ko.validation.group(user())() : [];
                return valArray;
            })

            // Knockout Computeds
            canEdit = ko.computed(function () {
                return user() && config.currentUser() && config.currentUser().id() === user().id();
            }),

            isDirty = ko.computed(function () {
                return canEdit() ? user().dirtyFlag().isDirty() : false;
            }),

            isValid = ko.computed(function () {
                return canEdit() ? validationErrors().length === 0 : true;
            }),

            // Methods
            activate = function (routeData, callback) {
                messenger.publish.viewModelActivated({ canleaveCallback: canLeave });
                currentUserId(routeData.id);
                getUser(callback);
            },

            cancelCmd = ko.asyncCommand({
                execute: function(complete) {
                    var callback = function() {
                        complete();
                        logger.success(config.toasts.retreivedData);
                    };
                    getUser(callback, true);
                },
                canExecute: function(isExecuting) {
                    return !isExecuting && isDirty();
                }
            }),

            canLeave = function () {
                return canEdit() ? !isDirty() && isValid() : true;
            },

            getUser = function (completeCallback, forceRefresh) {
                var callback = function() {
                    if (completeCallback) { completeCallback(); }
                };
                datacontext.persons.getFullPersonById(
                    currentUserId(), {
                        success: function (s) {
                            user(s);
                            callback();
                        },
                        error: callback
                    },
                    forceRefresh
                );
            },

            goBackCmd = ko.asyncCommand({
                execute: function(complete) {
                    router.navigateBack();
                    complete();
                },
                canExecute: function(isExecuting) {
                    return !isExecuting && !isDirty();
                }
            }),

            saveCmd = ko.asyncCommand({
                execute: function(complete) {
                    if (canEdit()) {
                        $.when(datacontext.persons.updateData(user()))
                            .always(complete);
                    } else {
                        complete();
                    }
                },
                canExecute: function(isExecuting) {
                    return !isExecuting && isDirty() && isValid();
                }
            }),

            tmplName = function () {
                return canEdit() ? 'user.edit' : 'user.view';
            };

        return {
            activate: activate,
            cancelCmd: cancelCmd,
            canEdit: canEdit,
            canLeave: canLeave,
            goBackCmd: goBackCmd,
            isDirty: isDirty,
            isValid: isValid,
            saveCmd: saveCmd,
            user: user,
            tmplName: tmplName
        };
    });