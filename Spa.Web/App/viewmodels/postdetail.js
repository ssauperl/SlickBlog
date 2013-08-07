define(['services/dataservice',
        'durandal/plugins/router',
        'durandal/system',
        'durandal/app',
        'services/logger'],
    function (dataservice, router, system, app, logger) {
        var post = ko.observable();
        var isSaving = ko.observable(false);
        var isDeleting = ko.observable(false);
        //var postItem = function () {
        //    return {
        //        Id: ko.observable(),
        //        Title: ko.observable(),
        //        ContentText: ko.observable(),
        //        Tags: ko.observableArray()
        //    }
        //};

        var activate = function (routeData) {
            //post(new postItem());
            var id = parseInt(routeData.id);
           
            return dataservice.getPostById(id, post);
            //return true;
        };

        //var goBack = function () {
        //    //router.navigateBack();
        //};


        var cancel = function () {

            toastr.info('Delete failed');
        };

        var canSave = ko.computed(function () {
            return!isSaving();
        });

        var save = function () {
            isSaving(true);
            return dataservice.updatePost(ko.toJSON(vm.post().Id()) , vm.post).then(complete);

            function complete() {
                isSaving(false);
            }
        };

        var deletePost = function () {
            var msg = 'Delete post "' + vm.post().Title() + '" ?';
            var title = 'Confirm Delete';
            isDeleting(true);
            return app.showMessage(msg, title, ['Yes', 'No'])
                .then(confirmDelete);

            function confirmDelete(selectedOption) {
                if (selectedOption === 'Yes') {
                    dataservice.deletePost(vm.post().Id()).then(success).fail(failed);

                    function success() {
                        router.navigateTo('#/posts');
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
            title: 'Post Details'
        };
        return vm;
    });