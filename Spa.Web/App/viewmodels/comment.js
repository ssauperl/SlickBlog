define(['knockout', 'ko.validation', 'ko.dirtyFlag'], function (ko) {
    var Comment = function() {
        self = this;
        self.id = ko.observable();
        self.user = ko.observable();
        self.postedOn = ko.observable('');
        self.content = ko.observable('').extend({ required: true });
        self.replies = ko.observableArray();
        self.dirtyFlag = new ko.DirtyFlag([self.content]);
    };

    return Comment;
})