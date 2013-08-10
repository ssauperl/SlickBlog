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

            activate = function () {
                initPost();
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
                    post.Tags.push(tagsedit.tags());
                    dataservice.savePost(post).then(goToEditView).then(complete);
                }
                else {
                    post.errors.showAllMessages();
                    complete();                  
                }
                    
                function goToEditView(result) {
                    resetPost();
                    router.replaceLocation('#/postdetail/' + post.Id());
                }

                function complete() {
                    isSaving(false);
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
                cancel: cancel,
                save: save,
                title: 'Add a New Post',
                post: post,
                tagsedit: tagsedit
            };
            
            ko.validation.group(post, { deep: true });

        return vm;
    });