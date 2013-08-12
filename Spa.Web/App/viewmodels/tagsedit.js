define(function () {
    //properties
    var tag = ko.observable().extend({ required: true }),
        tags = ko.observableArray();


    //durandal methods
    var activate = function () {
        initTags();
    };

    //local methods
    var addTag = function () {
        if (tag.isValid()) {
            tags.push(tag());
            resetTag();
        }
        else {
            vm.errors.showAllMessages();
        }
    };

    var resetTag = function () {
        tag('');
        tag.isModified(false);
    };

    var initTags = function () {
        resetTag();
        tags([]);
    };


    var vm = {
        tag: tag,
        tags: tags,
        addTag: addTag,
        initTags: initTags

    };

    ko.validation.group(vm);

    return vm;
});