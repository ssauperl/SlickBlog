define(['durandal/app', 'services/dataservice', 'durandal/plugins/router', 'viewmodels/tagsedit'],
    function (app, dataservice, router, tagsedit) {
        //properties
        var Id = ko.observable(),
            Title = ko.observable().extend({ required: true }),
            ContentText = ko.observable().extend({ required: true }),
            Tags = ko.observableArray();

        //local properties
        var isModified = ko.computed(function () {
                if (Title.isModified() || ContentText.isModified())
                    return true
                else
                    return false
            });

        var isSaving = ko.observable(false);
        var canSave = ko.computed(function () {
                return !isSaving();
            });

        var editMode = ko.computed(function () {
            if (Id())
                return true;
            else
                return false;
        });

        var isDeleting = ko.observable(false);

        //post vm
        var post = {
                Id: Id,
                Title: Title,
                ContentText: ContentText,
                Tags: Tags,
                isModified: isModified
        };

        ko.validation.group(post, { deep: true });

        //durandal methods
        var activate = function (routeData) {
            var id = routeData.id;
            if (id) {
                dataservice.getPostById(id, post).then(function () {
                    tagsedit.tags(post.Tags());
                    resetModified();
                });
            }
            else {
                initPost();
            }

        };

        var canDeactivate = function () {
            if (post.isModified()) {
                var msg = 'Do you want to leave and cancel?';
                return app.showMessage(msg, 'Navigate Away', ['Yes', 'No'])
                    .then(function (selectedOption) {
                        return selectedOption;
                    });
            }
            else
                return true;
        };

        //local methods
        var resetModified = function () {
            Title.isModified(false);
            ContentText.isModified(false);
        };

        var initPost = function () {
            Id('');
            Title('');
            ContentText('');
            Tags([]);

            resetModified();
            tagsedit.initTags();
        };

        var cancel = function () {
            router.navigateBack();
        };


        save = function () {
            isSaving(true);
            if (post.isValid()) {
                post.Tags(tagsedit.tags());
                if (post.Id()) {
                    dataservice.updatePost(post.Id(), post).then(complete);
                }
                else {
                    dataservice.savePost(post).then(goToEditView).then(complete);
                }
            }
            else {
                post.errors.showAllMessages();
                complete();                  
            }
                    
            function goToEditView(result) {
                
                //router.replaceLocation('#/postedit/' + post.Id());
            }

            function complete() {
                resetModified();
                isSaving(false);
            }
        };


        var deletePost = function () {
            var msg = 'Delete post "' + post.Title() + '" ?';
            var title = 'Confirm Delete';
            isDeleting(true);
            return app.showMessage(msg, title, ['Yes', 'No'])
                .then(confirmDelete);

            function confirmDelete(selectedOption) {
                if (selectedOption === 'Yes') {
                    dataservice.deletePost(post.Id()).then(success).fail(failed);

                    function success() {
                        resetModified();
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
   


        var vm = {
            activate: activate,
            canDeactivate: canDeactivate,
            canSave: canSave,
            isDeleting: isDeleting,
            editMode: editMode,
            cancel: cancel,
            save: save,
            deletePost: deletePost,
            title: '',
            post: post,
            tagsedit: tagsedit
        };
            


        return vm;
    });