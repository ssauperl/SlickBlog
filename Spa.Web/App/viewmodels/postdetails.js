define(['services/dataservice', 'plugins/router', 'durandal/system', 'durandal/app', 'services/logger', 'viewmodels/comment', 'ko.validation', 'ko.command', 'ko.activity'],
    function (dataservice, router, system, app, logger, vmComment) {
        //properties
        var post = new Object();
        var comment = ko.observable(new vmComment());


        //durandal methods
        var activate = function (id) {
            comment(new vmComment());
            ko.validation.group(comment());
            return refresh(id);
        };
        
        //local methods
        var refresh = function(id) {
            return dataservice.getPostById(id, post);
        };

        //post methods
        var select = function () {
            if (post && post.id()) {
                var url = '#/postedit/' + post.id();
                router.navigate(url);
            }
        };
        
        //comments methods
        var editComment = function () {
            return dataservice.getComment(post.id(), this.id(), comment);
        };
        
        //commands
        var saveCmd = ko.asyncCommand({
            execute: function (complete) {
                $.when(save())
                    .always(complete);
            },
            canExecute: function (isExecuting) {
                return !isExecuting && comment().dirtyFlag().isDirty() && comment().isValid();
            }
        });
        
        var deleteCmd = ko.asyncCommand({
            execute: function (data, complete) {
                $.when(dlt(data))
                    .always(complete);
            },
            canExecute: function (isExecuting) {
                return !isExecuting;
            }
        });
        
        //command helpers
        var save = function() {
            var deferredReady = $.Deferred();
            if (comment().id())
                dataservice.updateComment(post.id(), comment).then(resetEditor).always(resolve);
            else
                dataservice.saveComment(post.id(), comment).then(resetEditor).always(resolve);

            return deferredReady.promise();

            function resetEditor() {
                
                comment(new vmComment());
                ko.validation.group(comment());
            }
            
            function resolve() {
                deferredReady.resolve();
            }

        };
        
        var dlt = function (data) {
            data.isDeleting(true);
            var deferredReady = $.Deferred();
            var msg = 'Delete comment "' + data.id() + '" ?';
            var title = 'Confirm Delete';
            return app.showMessage(msg, title, ['Yes', 'No'])
                .then(confirmDelete).then(function () { return deferredReady.promise(); });

            function confirmDelete(selectedOption) {
                if (selectedOption === 'Yes') {
                    dataservice.deleteComment(post.id(), data.id()).then(success).fail(failed).always(always);

                    function success() {
                        data.isDeleting(false);
                    }

                    function failed(error) {

                        data.isDeleting(false);
                        cancel();
                        //var errorMsg = 'Error: ' + error.message;
                        //logger.logError(
                        //    errorMsg, error, system.getModuleId(vm), true);
                    }

                    function always() {
                        
                        deferredReady.resolve();
                    }
                } else {

                    data.isDeleting(false);
                    deferredReady.resolve();
                }
            }

        };
        
        var saveComment = function () {
            if (comment().isValid()) {
                if (comment().id())
                    return dataservice.updateComment(post.id(), comment).then(complete);
                else 
                    return dataservice.saveComment(post.id(), comment).then(complete);
                
                function complete() {
                    refresh(post.id()).then(function () {
                        comment(new vmComment());
                        ko.validation.group(comment());
                    });
                }

            }
            else {
                comment().errors.showAllMessages();
            }
        };

        var deleteComment = function() {
            return dataservice.deleteComment(post.id(), this.id()).then(function() {
                refresh(post.id());
            });
        };

        var dismissComment = function() {
            comment(new vmComment());
        };

        var vm = {
            activate: activate,
            post: post,
            select: select,
            comment: comment,
            editComment: editComment,
            saveComment: saveComment,
            deleteComment: deleteComment,
            dismissComment: dismissComment,
            saveCmd: saveCmd,
            deleteCmd: deleteCmd
        };

        return vm;
    });