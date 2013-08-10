define(['services/dataservice',
        'durandal/plugins/router',
        'durandal/system',
        'durandal/app',
        'services/logger'],
    function (dataservice, router, system, app, logger) {
        var
            post = ko.observableArray(),
            activate = function (routeData) {
                var id = parseInt(routeData.id);
                dataservice.getPostById(id, post);
            };      
        var select = function () {
            if (post() && post().Id()) {
                var url = '#/postedit/' + post().Id();
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