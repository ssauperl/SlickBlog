define(['durandal/app', 'services/dataservice', 'durandal/plugins/router'],
    function (app, dataservice, router) {
        var isSaving = ko.observable(false),

            post = ko.observable(),

            postItem = function () {
                return{
                    Id: ko.observable(),
                    Title: ko.observable(),
                    ContentText: ko.observable(),
                    Tags: ko.observableArray()
                }             
            },
            tagItem = function (name) {
                return { name: ko.observable(name) }
            }

            activate = function () {
                post(new postItem);
            };
            cancel = function (complete) {
                router.navigateBack();
            },
            canSave = ko.computed(function () {
                return !isSaving();
            }),
            save = function () {
                isSaving(true);
                dataservice.savePost(vm.post).then(complete);
                    //.then(goToEditView).fin(complete);

                function goToEditView(result) {
                    //router.replaceLocation('#/postdetail/' + post().id());
                }

                function complete() {
                    isSaving(false);
                }
            },
            canDeactivate = function () {
                var msg = 'Do you want to leave and cancel?';
                return app.showMessage(msg, 'Navigate Away', ['Yes', 'No'])
                    .then(function (selectedOption) {
                        if (selectedOption === 'Yes') {
                            //datacontext.cancelChanges();
                        }
                        return selectedOption;
                    });
            };

            var vm = {
                activate: activate,
                canDeactivate: canDeactivate,
                canSave: canSave,
                cancel: cancel,
                save: save,
                title: 'Add a New Post',
                post: post,
                postItem: postItem,
                tagItem: tagItem
        };

        return vm;
    });