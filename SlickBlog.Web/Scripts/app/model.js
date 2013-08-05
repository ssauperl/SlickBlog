define('model',
    [
        'model.post',
        'model.user'
    ],
    function (post, user) {
        var
            model = {
                Post: post,
                User: user
            };

        model.setDataContext = function (dc) {
            // Model's that have navigation properties 
            // need a reference to the datacontext.
            model.Post.datacontext(dc);
            model.User.datacontext(dc);
        };

        return model;
    });