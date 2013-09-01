define(['durandal/app', 'services/dataservice', 'plugins/router', 'jquery', 'knockout', 'viewmodels/post', 'viewmodels/tag', 'services/ko.bindingHandlers', 'ko.validation', 'ko.command', 'ko.activity'],
    function (app, dataservice, router, $, ko, vmPost, vmTag) {
        //properties
        var post = ko.observable(new vmPost());
        var tag = ko.observable(new vmTag());

        var isDirty = ko.computed(function () {
                return post().dirtyFlag().isDirty();
        });

        //durandal methods
        var activate = function (id) {
            var deferredReady = $.Deferred();
            post(new vmPost());
            tag(new vmTag());
            ko.validation.group(tag());
            if (id) {
                dataservice.getPostById(id, post).then(resolve);
            } else {
                deferredReady.resolve();
            }
            
            ko.validation.group(post());
            return deferredReady.promise();

            function resolve() {
                deferredReady.resolve();
                post().dirtyFlag().reset();
            }
           
        };

        var canDeactivate = function () {
            
            // TODO if dirty warn before navigating away
            //if (post.isModified()) {
            //    var msg = 'Do you want to leave and cancel?';
            //    return app.showMessage(msg, 'Navigate Away', ['Yes', 'No'])
            //        .then(function (selectedOption) {
            //            return selectedOption;
            //        });
            //} else
            //    return true;
        };



        //local methods
        var cancel = function () {
            console.log(isDirty());
            console.log(post().isValid());
            console.log(post().errors());
            console.log(post().title());
            console.log(post().content());
            post().errors.showAllMessages();
        };


        //commands
        var saveCmd = ko.asyncCommand({
            execute: function(complete) {
                $.when(save())
                    .always(complete);
            },
            canExecute: function(isExecuting) {
                return !isExecuting && isDirty() && post().isValid();
            }
        });
        
        var deleteCmd = ko.asyncCommand({
                execute: function (complete) {
                    $.when(dlt())
                        .always(complete);
                },
                canExecute: function (isExecuting) {
                    return !isExecuting && post().id();
                }
            });

       //command helpers
        var save = function () {
            var deferredReady = $.Deferred();
            if (post().id()) {
                dataservice.updatePost(post().id(), post).then(resolve);
            } else {
                dataservice.savePost(post).then(resolve);
            }
 
            function resolve() {
                deferredReady.resolve();
                post().dirtyFlag().reset();
                //router.navigate('#/postedit/' + post.id(), { replace: true});
            }
            
            return deferredReady.promise();
        };
            
        var dlt = function () {
            var deferredReady = $.Deferred();
            var msg = 'Delete post "' + post().title() + '" ?';
            var title = 'Confirm Delete';
            return app.showMessage(msg, title, ['Yes', 'No'])
                .then(confirmDelete).then(function () { return deferredReady.promise(); });

            function confirmDelete(selectedOption) {
                if (selectedOption === 'Yes') {
                    dataservice.deletePost(post().id()).then(success).fail(failed).always(always);

                    function success() {
                        router.navigate('#/posts', { replace: true });
                    }

                    function failed(error) {
                        cancel();
                        //var errorMsg = 'Error: ' + error.message;
                        //logger.logError(
                        //    errorMsg, error, system.getModuleId(vm), true);
                    }

                    function always() {
                        deferredReady.resolve();
                    }
                } else {
                    deferredReady.resolve();   
                }
            }

        };
        

        var addTagCmd = ko.command({
            execute: function () {
                post().tags.push(tag().name());
                tag(new vmTag());
                ko.validation.group(tag());
            },
            canExecute: function () {
                return tag().dirtyFlag().isDirty() && tag().isValid();
            }
        });

        var removeTag = function () {
            post().tags.remove(this.toString());
        };

        var vm = {
            activate: activate,
            //canDeactivate: canDeactivate,
            cancel: cancel,
            saveCmd: saveCmd,
            deleteCmd: deleteCmd,
            post: post,
            tag: tag,
            addTagCmd: addTagCmd,
            removeTag: removeTag
    };


        return vm;
    });
