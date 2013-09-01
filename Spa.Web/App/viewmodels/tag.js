define(['knockout', 'ko.validation', 'ko.dirtyFlag'], function (ko) {
    var Tag = function () {
        var self = this;
        self.name = ko.observable().extend({ required: true });
        self.dirtyFlag = new ko.DirtyFlag([self.name]);
    };
    return Tag;
});