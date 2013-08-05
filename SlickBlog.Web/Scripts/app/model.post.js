define('model.post',
	['ko'],
    function (ko) {
        var
            _dc = null,

            Post = function () {
                var self = this;
                self.id = ko.observable(),
                self.title = ko.observable(),
                self.contentText = ko.observable()
                userId = ko.observable();
                self.isNullo = false;

                return self;
            };

        Post.Nullo = new Post()
            .id(0)
            .title('')
            .contentText('');
        id = ko.observable(),
        title = ko.observable(),
        contentText = ko.observable(),
        userId = ko.observable(),

        Post.Nullo.isNullo = true;

        // static member
        Post.datacontext = function (dc) {
            if (dc) { _dc = dc; }
            return _dc;
        };

        return Post;
    });