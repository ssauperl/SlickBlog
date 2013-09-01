define(function() {
    var Comment = function() {
        self = this;
        self.id = null;
        self.userId = ko.observable('');
        self.postedOn = ko.observable('');
        self.content = ko.observable('').extend({ required: true });
        self.replies = ko.observableArray();
    };

    return Comment;
})