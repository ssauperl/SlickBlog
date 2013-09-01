define(['durandal/app', 'services/dataservice', 'plugins/router', 'knockout', 'viewmodels/tagsedit', 'services/ko.bindingHandlers'],
    function (app, dataservice, router, ko, tagsedit, bindingHandlers) {
        //properties
        var id = ko.observable(),
            title = ko.observable().extend({ required: true }),
            content = ko.observable().extend({ required: true }),
            tags = ko.observableArray();

        //local properties
        var isModified = ko.computed(function () {
            if (title.isModified() || content.isModified())
                return true;
            else
                return false;
        });

        var isSaving = ko.observable(false);
        var canSave = ko.computed(function () {
            return !isSaving();
        });

        var editMode = ko.computed(function () {
            if (id())
                return true;
            else
                return false;
        });

        var isDeleting = ko.observable(false);

        //post vm
        var post = {
            id: id,
            title: title,
            content: content,
            tags: tags,
            isModified: isModified
        };

        ko.validation.group(post, { deep: true });

        //durandal methods
        var activate = function (id) {
            if (id) {
                dataservice.getPostById(id, post).then(function () {
                    tagsedit.tags(post.tags());
                    resetModified();
                });
            } else {
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
            } else
                return true;
        };

        var bindingComplete = function (view) {
            //var editor = new wysihtml5.Editor("postContent", {
            //    // id of textarea element
            //    toolbar: "wysihtml5-toolbar", // id of toolbar element
            //    parserRules: wysihtml5ParserRules // defined in parser rules set 
            //});
        };

        //local methods
        var resetModified = function () {
            title.isModified(false);
            content.isModified(false);
        };

        var initPost = function () {
            id('');
            title('');
            content('');
            tags([]);

            resetModified();
            tagsedit.initTags();
        };

        var cancel = function () {
            router.navigateBack();
        };


        var save = function () {
            isSaving(true);
            if (post.isValid()) {
                post.tags(tagsedit.tags());
                if (post.id()) {
                    dataservice.updatePost(post.id(), post).then(complete);
                } else {
                    dataservice.savePost(post).then(goToEditView).then(complete);
                }
            } else {
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
            var msg = 'Delete post "' + post.title() + '" ?';
            var title = 'Confirm Delete';
            isDeleting(true);
            return app.showMessage(msg, title, ['Yes', 'No'])
                .then(confirmDelete);

            function confirmDelete(selectedOption) {
                if (selectedOption === 'Yes') {
                    dataservice.deletePost(post.id()).then(success).fail(failed);

                    function success() {
                        resetModified();
                        router.navigate('#/posts', { replace: true });
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
            bindingComplete: bindingComplete,
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
