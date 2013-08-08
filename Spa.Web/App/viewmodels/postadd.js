define(['durandal/app', 'services/dataservice', 'durandal/plugins/router'],
    function (app, dataservice, router) {
        var isSaving = ko.observable(false),

            post = ko.observable(),
            tag = ko.observable(),

            postItem = function () {
                return{
                    Id: ko.observable(),
                    Title: ko.observable(),
                    ContentText: ko.observable([]),
                    Tags: ko.observableArray()
                }             
            },
            tagItem = function (name) {
                return { Name: ko.observable(name) }
            }

            activate = function () {
                post(new postItem);
                tag(new tagItem(''));

            };
            cancel = function () {
                router.navigateBack();
            },
            canSave = ko.computed(function () {
                return !isSaving();
            }),
            save = function () {
                isSaving(true);
                dataservice.savePost(vm.post).then(goToEditView).then(complete);

                function goToEditView(result) {
                    router.replaceLocation('#/postdetail/' + vm.post().Id());
                }

                function complete() {
                    isSaving(false);
                }
            },
            addTag = function () {
                var newTag = new tagItem(vm.tag().Name());
                vm.post().Tags.push(newTag);
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
                addTag: addTag,
                title: 'Add a New Post',
                post: post,
                tag: tag,
                postItem: postItem,
                tagItem: tagItem
        };

        return vm;
    });