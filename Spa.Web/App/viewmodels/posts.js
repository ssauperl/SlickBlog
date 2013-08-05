define(['services/dataservice'], function (dataservice) {
    var posts = ko.observableArray([{ title: 'wef', contentText: 'asdasd' }, { title: 'wef', contentText: 'asdasd' }]),
        initalized = false,
        postToAdd = ko.observable(''),
        addPost =  function () {
            //this.tags.push({ Name: this.tagToAdd() });
            var newPost = {Title: 'new', ContentText: 'newContent'};
            //this.postToAdd(newPost);
            this.posts.push(newPost);

            //ajaxAdd("/tags", ko.toJSON(newTag), function (data) {
            //    viewModel.tags.push(new ko.protectedObservableItem(data));
            //});
        },
        vm = {
            activate: activate,
            posts: posts,
            title: 'Posts',
            addPost: addPost
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