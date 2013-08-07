﻿define(['services/dataservice', 'durandal/plugins/router'],
    function (dataservice, router) {
        var posts = ko.observableArray(),
            initalized = false,
            selectedPost = ko.observable(null),
            postItem = function (title, contentText) {
                return {
                    title: ko.observable(title),
                    contentText: ko.observable(contentText)
                }
            },
            selectPost = function () {
                vm.selectedPost(this);
                toastr.info('Post selected');
            },
             gotoDetails = function(post) {
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
                refresh: refresh
            };
    

        function activate() {
            //if (vm.initialized) { return; }
            //vm.initialized = true;
            return refresh();
        };

        function refresh() {
            return dataservice.getPosts(posts);
        };

        return vm;
    });