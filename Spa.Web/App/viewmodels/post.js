define(function () {
    var Post = function () {
        var self = this;
        self.Id = ko.observable();
        self.Title = ko.observable().extend({ required: true });
        self.ContentText = ko.observable().extend({ required: true });
        self.Tags = ko.observableArray();
        self.BlogId = ko.observable();
    }

    return Post;

});