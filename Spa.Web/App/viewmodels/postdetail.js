define(['services/dataservice',
        'durandal/plugins/router',
        'durandal/system',
        'durandal/app',
        'services/logger'],
    function (dataservice, router, system, app, logger) {
        //properties
        var post = new Object();
        var deferred = $.Deferred();

        //durandal methods
        var activate = function (routeData) {
                var id = routeData.id;
                dataservice.getPostById(id, post).always(function () { deferred.resolve(); });;
                return deferred.promise();
        };

        //local methods
        var select = function () {
            if (post && post.Id()) {
                var url = '#/postedit/' + post.Id();
                router.navigateTo(url);
            }
        };

        var vm = {
            activate: activate,
            //goBack: goBack,
            post: post,
            select: select,
            title: 'Post Details'
        };

        return vm;
    });