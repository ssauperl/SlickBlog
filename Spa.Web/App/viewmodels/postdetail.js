define(['services/dataservice',
        'durandal/plugins/router',
        'durandal/system',
        'durandal/app',
        'services/logger',
        'viewmodels/postedit'],
    function (dataservice, router, system, app, logger, postedit) {
       var

        activate = function (routeData) {
            var id = parseInt(routeData.id);
           
            return dataservice.getPostById(id, post);
        },

        canSave = ko.computed(function () {
            return!isSaving();
        }),

        save = function () {
            isSaving(true);
            return dataservice.updatePost(ko.toJSON(vm.post().Id()) , post).then(complete);

            function complete() {
                isSaving(false);
            }
        },

        deletePost = function () {
            var msg = 'Delete post "' + vm.post().Title() + '" ?';
            var title = 'Confirm Delete';
            isDeleting(true);
            return app.showMessage(msg, title, ['Yes', 'No'])
                .then(confirmDelete);

            function confirmDelete(selectedOption) {
                if (selectedOption === 'Yes') {
                    dataservice.deletePost(vm.post().Id()).then(success).fail(failed);

                    function success() {
                        router.replaceLocation('#/posts');
                    }

                    function failed(error) {
                        cancel();
                        var errorMsg = 'Error: ' + error.message;
                        logger.logError(
                            errorMsg, error, system.getModuleId(vm), true);
                    }

                    function finish() {
                        return selectedOption;
                    }
                }
                isDeleting(false);
            }

        };

        //var canDeactivate = function () {
        //    //if (isDeleting()) { return false; }

        //    //if (hasChanges()) {
        //    //    var title = 'Do you want to leave "' +
        //    //        post().Title() + '" ?';
        //    //    var msg = 'Navigate away and cancel your changes?';
        //    //    var checkAnswer = function (selectedOption) {
        //    //        if (selectedOption === 'Yes') {
        //    //            cancel();
        //    //        }
        //    //        return selectedOption;
        //    //    };
        //    //    return app.showMessage(title, msg, ['Yes', 'No'])
        //    //        .then(checkAnswer);
        //    //}
        //    return true;
        //};

        var vm = {
            activate: activate,
            //cancel: cancel,
            //canDeactivate: canDeactivate,
            canSave: canSave,
            deletePost: deletePost,
            //goBack: goBack,
            save: save,
            post: post,
            title: 'Post Details',
            addTag: addTag,
            tag: tag
        };
        return vm;
    });