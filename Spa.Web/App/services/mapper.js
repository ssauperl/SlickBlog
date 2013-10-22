define(['services/appsecurity'],
    function (appsecurity) {
        var comment = function(data) {
            var self = this;
            ko.mapping.fromJS(data, {}, self);

            self.canEdit = ko.computed(function() {
                return appsecurity.user().userId == data.user.id || appsecurity.isUserInRole(['admin']);
            }, self);
            
            self.isDeleting = ko.observable(false);
        };
        
        var post = function(data) {
            var self = this;
            ko.mapping.fromJS(data, {}, self);
            self.canEdit = ko.computed(function () {
                return appsecurity.user().userId == data.user.id || appsecurity.isUserInRole(['admin']);
            }, self);
            
            self.isDeleting = ko.observable(false);

        };
        return {
            comment: comment,
            post: post
        };
    });
        