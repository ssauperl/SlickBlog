define(['knockout', 'ko.validation', 'ko.dirtyFlag'],function (ko) {
    var Post = function() {
        var self = this;
        self.id = ko.observable();
        self.userId = ko.observable();
        self.title = ko.observable().extend({ required: true });
        self.content = ko.observable().extend({ required: true });
        self.tags = ko.observableArray([]);
        self.comments = ko.observableArray();
        self.blogId = ko.observable();
        self.dirtyFlag = new ko.DirtyFlag([self.title, self.content, self.tags]);
    };

    return Post;

});