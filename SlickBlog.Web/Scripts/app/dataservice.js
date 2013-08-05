define('dataservice',
    [
        'dataservice.post',
        'dataservice.user'
    ],
    function (post, user) {
        return {
            post: post,
            user: user

        };
    });