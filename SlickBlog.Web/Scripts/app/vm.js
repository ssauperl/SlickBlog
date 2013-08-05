define('vm',
    [
        'vm.post',
        'vm.user'
    ],
    function (post, user) {
        return {
            post: post,
            user: user
    };
});