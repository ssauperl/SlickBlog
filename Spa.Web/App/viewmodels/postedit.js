define(['durandal/app', 'services/dataservice', 'durandal/plugins/router', 'viewmodels/tagsedit'],
    function (app, dataservice, router, tagsedit) {
        var
            Id = ko.observable(),
            Title = ko.observable().extend({ required: true }),
            ContentText = ko.observable().extend({ required: true }),
            Tags = ko.observableArray(),

            isModified = ko.computed(function () {
                if (Title.isModified() || ContentText.isModified())
                    return true
                else
                    return false
            });

        post = {
            Id: Id,
            Title: Title,
            ContentText: ContentText,
            Tags: Tags,
            isModified: isModified
        },

        resetPost = function () {
            Title.isModified(false);
            ContentText.isModified(false);
        },

        initPost = function () {
            Id('');
            Title('');
            ContentText('');
            Tags([]);

            resetPost();
            tagsedit.initTags();
        },

        activate = function (routeData) {
            if (routeData.id) {
                var id = parseInt(routeData.id);
                dataservice.getPostById(id, post).then(function () {
                    tagsedit.tags(post.Tags());
                    resetPost();
                });
            }
            else {
                initPost();
            }
            
        },

        cancel = function () {
            router.navigateBack();
        },

        isSaving = ko.observable(false),
        canSave = ko.computed(function () {
            return !isSaving();
        }),
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
                resetPost();
                isSaving(false);
            }
        };

        var editMode = ko.computed(function () {
            if (post.Id())
                return true;
            else
                return false;
        });
        var isDeleting = ko.observable(false);
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
                        resetPost();
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
   
        canDeactivate = function () {
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
            
        ko.validation.group(post, { deep: true });

        return vm;
    });