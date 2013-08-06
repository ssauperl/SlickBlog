define(['services/dataservice'], function (dataservice) {
    var posts = ko.observableArray(),
        initalized = false,
        postToAdd = ko.observable(null),
        selectedPost = ko.observable(null),
        addPost =  function () {
            //this.tags.push({ Name: this.tagToAdd() });
            var newPost = {title: 'new', contentText: 'newContent'};
            //this.postToAdd(newPost);
            this.posts.push(newPost);

            //ajaxAdd("/tags", ko.toJSON(newTag), function (data) {
            //    viewModel.tags.push(new ko.protectedObservableItem(data));
            //});
        },
        removePost = function (post) {
            vm.posts.remove(post)
        },
        editPost = function () {

            //var postTemplate = [{ Title : ko.observable(post.Title)},
            //    {CoontentText : ko.observable(post.ContentText)}];
            //var postTemplate = [{ Title : 'asd'},
            //    {CoontentText : 'wefwef'}];
            //vm.selectedPost = this;
            vm.selectedPost(this);
            //this(vm.selectedPost);
        },
        postItem = function (title, contentText) {
            console.log('does it work');
            return {
                title: ko.observable(title),
                contentText: ko.observable(contentText)
            }
        },
        vm = {
            activate: activate,
            posts: posts,
            title: 'Posts',
            addPost: addPost,
            removePost: removePost,
            selectedPost: selectedPost,
            editPost: editPost
            //refresh: refresh
        };
    

    function activate() {
        //if (initialized) { return; }
        //initialized = true;
        return refresh();
    };

    function refresh() {
        return dataservice.getPostsPartials(posts);
    };



    return vm;
});