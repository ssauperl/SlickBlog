define(['services/dataservice', 'plugins/router'],
    function (dataservice, router) {
        //properties
        var posts = ko.observableArray();

        //local properties
        var selectedPost = ko.observable();

        //durandal methods
        function activate() {
            return refresh();
        };

        //local methods
        var selectPost = function () {
            //todo bind this with jquery on event
            vm.selectedPost(this);
            toastr.info('Post selected');
        };

        var gotoDetails = function (post) {
            //todo bind this with jquery on event
            if (post && post.Id()) {
                var url = '#/postdetail/' + post.Id();
                router.navigate(url);
            }
        };

        function refresh() {
            return dataservice.getPosts(posts);
        };

        var vm = {
            activate: activate,
            posts: posts,
            title: 'Posts',
            selectedPost: selectedPost,
            selectPost: selectPost,
            gotoDetails: gotoDetails,
            refresh: refresh
        };
           function refresh() {
            return dataservice.getPosts(posts);
        };
        return vm;
    });