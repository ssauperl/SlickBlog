define(function () {
    var Post = function() {
        var self = this;
        self.id = ko.observable();
        self.userId = ko.observable();
        self.title = ko.observable().extend({ required: true });
        self.contentText = ko.observable().extend({ required: true });
        self.tags = ko.observableArray();
        self.comments = ko.observableArray();
        self.blogId = ko.observable();
    };

    return Post;

});