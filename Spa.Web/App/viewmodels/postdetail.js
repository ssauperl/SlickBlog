define(['services/dataservice',
        'durandal/plugins/router',
        'durandal/system',
        'durandal/app',
        'services/logger',
        'viewmodels/postedit'],
    function (dataservice, router, system, app, logger, postedit) {
        var
            post = postedit.post,
            activate = function (routeData) {
                var id = parseInt(routeData.id);
                return dataservice.getPostById(id, post);

            };

        var vm = {
            activate: activate,
            //goBack: goBack,
            post: post,
            title: 'Post Details'
        };
        return vm;
    });