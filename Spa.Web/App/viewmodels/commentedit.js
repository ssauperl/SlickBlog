define(function () {
    var
        Content = ko.observable().extend({ required: true }),
        UserId = ko.observable(),
        PostId = ko.observable(),

        tags = ko.observableArray(),


        addTag = function () {
            if (tag.isValid()) {
                tags.push(tag());
                resetTag();
            }
            else {
                vm.errors.showAllMessages();
            }
        },

        resetTag = function () {
            tag('');
            tag.isModified(false);
        },

        initTags = function () {
            resetTag();
            tags([]);
        },

        activate = function () {
            initTags();
        },

        vm = {
            tag: tag,
            tags: tags,
            addTag: addTag,
            initTags: initTags

        };

    ko.validation.group(vm);

    return vm;
});