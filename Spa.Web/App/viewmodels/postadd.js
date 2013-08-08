define(['durandal/app', 'services/dataservice', 'durandal/plugins/router'],
    function (app, dataservice, router) {
        var isSaving = ko.observable(false),
            //post props
            //Id = ko.observable(),
            //Title = ko.observable().extend({ required: true }),
            //ContentText = ko.observable().extend({ required: true }),
            //Tags = ko.observableArray(),

            post = ko.observable();
            //{
            //    Id: Id,
            //    Title: Title,
            //    ContentText: ContentText,
            //    Tags: Tags
            //},

            postItem = function () {
                return{
                    Id: ko.observable(),
                    Title: ko.observable().extend({ required: true }),
                    ContentText: ko.observable().extend({ required: true }),
                    Tags: ko.observableArray()
                }
            }

            //tag props
            validateTag = ko.observable();

            tagName = ko.observable().extend({
                required: {
                    message: "Tag name is required",
                    onlyIf: function () { return (validateTag() === true); }
                }
            }),

            tagItem = function (name) {
                return { Name: ko.observable(name) }
            },

            activate = function () {
                //reset values
                post(new postItem());
                validateTag(false);
                tagName('');
            },

            addTag = function () {
                validateTag(true);
                var result = ko.validation.group(tagName());

                if (result().length > 0)
                    result.showAllMessages();
                else {
                    post().Tags.push(new tagItem(tagName()));
                    validateTag(false);
                    tagName('');
                }
                    
            },

            cancel = function () {
                router.navigateBack();
            },

            canSave = ko.computed(function () {
                return !isSaving();
            }),

            save = function () {
                isSaving(true);

                var result = ko.validation.group(post);
                if (result().length > 0) {
                    result.showAllMessages();
                    complete();
                }
                else
                    dataservice.savePost(post).then(goToEditView).then(complete);
                    

                function goToEditView(result) {
                    router.replaceLocation('#/postdetail/' + post().Id());
                }

                function complete() {
                    isSaving(false);
                }
            };

            
            //canDeactivate = function () {
            //    var msg = 'Do you want to leave and cancel?';
            //    return app.showMessage(msg, 'Navigate Away', ['Yes', 'No'])
            //        .then(function (selectedOption) {
            //            if (selectedOption === 'Yes') {
            //                //datacontext.cancelChanges();
            //            }
            //            return selectedOption;
            //        });
            //};

            var vm = {
                activate: activate,
                //canDeactivate: canDeactivate,
                canSave: canSave,
                cancel: cancel,
                save: save,
                addTag: addTag,
                title: 'Add a New Post',
                post: post,
                tagName: tagName
            };

        return vm;
    });