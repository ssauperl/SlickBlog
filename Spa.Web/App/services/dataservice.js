define(['durandal/system', 'services/logger', 'knockout', 'ko.mapping'],
    function (system, logger, ko, komapping) {
        ko.mapping = komapping;
        
        //posts
        var getPosts = function (postsObservable) {
            postsObservable([]);
            var options = {
                url: '/api/posts',
                type: 'GET',
                dataType: 'json'
            };

            return $.ajax(options).then(querySucceeded).fail(queryFailed);

            function querySucceeded(data) {
                var mapping = {
                    'postedOn': {
                        update: function (options) {
                            return new Date(options.data).toLocaleString();
                        }
                    }
                };

                ko.mapping.fromJS(data, mapping, postsObservable);
                log('Retrieved Posts from remote data source', data, true);
            }
        };

        var getPostById = function (id, postVm) {
            var options = {
                url: '/api/posts/' + id,
                type: 'GET',
                dataType: 'json'
            };

            return $.ajax(options).then(querySucceeded).fail(queryFailed);

            function querySucceeded(data) {
                var mapping = {
                    'include': ["Comments"]
                };

                ko.mapping.fromJS(data, mapping, postVm);
                log('Retrieved Post from remote data source', data, true);
            }
        };
        
        var savePost = function (postVm) {
            var options = {
                url: '/api/posts/',
                type: 'POST',
                dataType: 'json',
                contentType: 'application/json',
                data: ko.toJSON(postVm)
            };

            return $.ajax(options).then(querySucceeded).fail(queryFailed);

            function querySucceeded(data) {
                //setting post.Id so we know where to redirect the user
                postVm().id(data);
                log('Post saved to remote data source', data, true);
            }
        };

        var updatePost = function (id, postVm) {
            //todo check
            var options = {
                url: '/api/posts/' + id,
                type: 'PUT',
                dataType: 'json',
                contentType: 'application/json',
                data: ko.toJSON(postVm)
            };

            return $.ajax(options).then(querySucceeded).fail(queryFailed);

            function querySucceeded(data) {
                log('Post updated on remote data source', data, true);
            }
        };

        var deletePost = function (id) {
            var options = {
                url: '/api/posts/' + id,
                type: 'DELETE',
                dataType: 'json'
            };

            return $.ajax(options).then(querySucceeded).fail(queryFailed);

            function querySucceeded(data) {
                log('Post deleted from remote data source', data, true);
            }
        };

        //comments
        var getComment = function(postId, commentId, commentVm) {
            var options = {
                url: '/api/comments/' + postId + '/' + commentId,
                type: 'GET',
                dataType: 'json'
            };
            
            return $.ajax(options).then(querySucceeded).fail(queryFailed);

            function querySucceeded(data) {
                ko.mapping.fromJS(data, {}, commentVm);
                log('Retrieved Comment from remote data source', data, true);
            }
        };
        
        var saveComment = function (postId, commentVm) {
            var options = {
                url: '/api/comments/' + postId,
                type: 'POST',
                dataType: 'json',
                contentType: 'application/json',
                data: ko.toJSON(commentVm)
            };

            return $.ajax(options).then(querySucceeded).fail(queryFailed);

            function querySucceeded(data) {
                log('Comment saved to remote data source', data, true);
            }
        };
        
        var updateComment = function (postId, commentVm) {
            var options = {
                url: '/api/comments/' + postId,
                type: 'PUT',
                dataType: 'json',
                contentType: 'application/json',
                data: ko.toJSON(commentVm)
            };

            return $.ajax(options).then(querySucceeded).fail(queryFailed);

            function querySucceeded(data) {
                log('Comment saved to remote data source', data, true);
            }
        };
        
        var deleteComment = function (postId, commentId) {
            var options = {
                url: '/api/comments/' + postId + "/" + commentId,
                type: 'DELETE',
                dataType: 'json'
            };

            return $.ajax(options).then(querySucceeded).fail(queryFailed);

            function querySucceeded(data) {
                log('Comment deleted from remote data source', data, true);
            }
        };

        var dataservice = {
            getPosts: getPosts,
            savePost: savePost,
            getPostById: getPostById,
            updatePost: updatePost,
            deletePost: deletePost,
            getComment: getComment,
            saveComment: saveComment,
            updateComment: updateComment,
            deleteComment: deleteComment
        };

        return dataservice;

        //#region Internal methods        
        function queryFailed(jqXHR, textStatus) {
            var msg = 'Error retreiving data. ' + textStatus;
            logger.logError(msg, jqXHR, system.getModuleId(dataservice), true);
        };


        function log(msg, data, showToast) {
            logger.log(msg, data, system.getModuleId(dataservice), showToast);
        };
        //#endregion
});