define(['services/dataservice', 'durandal/plugins/router'],
    function (dataservice, router) {
        var posts = ko.observableArray(),
            initalized = false,
            selectedPost = ko.observable(null),

            selectPost = function () {
                //todo bind this with jquery on event
                vm.selectedPost(this);
                toastr.info('Post selected');
            },
             gotoDetails = function (post) {
                 //todo bind this with jquery on event
                 if (post && post.Id()) {
                    var url = '#/postdetail/' + post.Id();
                    router.navigateTo(url);
                }
            },
            vm = {
                activate: activate,
                posts: posts,
                title: 'Posts',
                selectedPost: selectedPost,
                selectPost: selectPost,
                gotoDetails: gotoDetails,
                refresh: refresh,
                //postadd: postadd
            };
    

        function activate() {
            return refresh();
        };

        function refresh() {
            return dataservice.getPosts(posts);
        };

        return vm;
    });